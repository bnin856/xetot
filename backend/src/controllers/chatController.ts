import { Response, NextFunction } from 'express';
import Conversation from '../models/Conversation';
import Message from '../models/Message';
import Xe from '../models/Xe';
import XeChoThue from '../models/XeChoThue';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// Tạo hoặc lấy conversation
export const getOrCreateConversation = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { idXe, loaiXe = 'xe' } = req.body;
    const idNguoiMua = req.user?.id;

    // Lấy thông tin xe để biết người bán (hỗ trợ cả Xe và XeChoThue)
    let xe: any;
    if (loaiXe === 'xeChoThue') {
      xe = await XeChoThue.findById(idXe);
    } else {
      xe = await Xe.findById(idXe);
    }

    if (!xe) {
      next(createError('Không tìm thấy xe', 404));
      return;
    }

    if (!xe.idChuXe) {
      next(createError('Xe chưa có chủ sở hữu', 400));
      return;
    }

    const idNguoiBan = xe.idChuXe.toString();

    // Không thể chat với chính mình
    if (idNguoiMua === idNguoiBan) {
      next(createError('Không thể chat với chính mình', 400));
      return;
    }

    // Tìm conversation đã tồn tại
    let conversation = await Conversation.findOne({
      idXe,
      loaiXe: loaiXe as 'xe' | 'xeChoThue',
      idNguoiMua,
      idNguoiBan,
    })
      .populate('idNguoiMua', 'ten avatar')
      .populate('idNguoiBan', 'ten avatar');

    // Nếu chưa có thì tạo mới
    if (!conversation) {
      conversation = await Conversation.create({
        idXe,
        loaiXe: loaiXe as 'xe' | 'xeChoThue',
        idNguoiMua,
        idNguoiBan,
        trangThai: 'active',
      });

      // Populate lại
      conversation = await Conversation.findById(conversation._id)
        .populate('idNguoiMua', 'ten avatar')
        .populate('idNguoiBan', 'ten avatar');
    }

    // Kiểm tra conversation không null
    if (!conversation) {
      next(createError('Không thể tạo hoặc tìm thấy hội thoại', 500));
      return;
    }

    // Populate xe thủ công vì có thể là Xe hoặc XeChoThue (cho cả conversation cũ và mới)
    if (conversation.loaiXe === 'xeChoThue') {
      const xeChoThue = await XeChoThue.findById(conversation.idXe).select('tenXe hinhAnh giaThueTheoNgay');
      if (xeChoThue) {
        conversation.idXe = xeChoThue as any;
        // Map giaThueTheoNgay thành gia để frontend dùng chung
        (conversation.idXe as any).gia = (xeChoThue as any).giaThueTheoNgay;
      }
    } else {
      const xe = await Xe.findById(conversation.idXe).select('tenXe hinhAnh gia');
      if (xe) {
        conversation.idXe = xe as any;
      }
    }

    res.json({
      success: true,
      data: { conversation },
    });
  } catch (error) {
    next(error);
  }
};

// Lấy danh sách conversations của user
export const getMyConversations = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;

    const conversations = await Conversation.find({
      $or: [{ idNguoiMua: userId }, { idNguoiBan: userId }],
    })
      .populate('idNguoiMua', 'ten avatar')
      .populate('idNguoiBan', 'ten avatar')
      .sort({ lastMessageAt: -1 });

    // Populate xe thủ công vì có thể là Xe hoặc XeChoThue
    for (let conv of conversations) {
      if (!conv.idXe) continue; // Skip if no idXe
      
      const loaiXe = conv.loaiXe || 'xe'; // Default to 'xe' if not set
      if (loaiXe === 'xeChoThue') {
        const xeChoThue = await XeChoThue.findById(conv.idXe).select('tenXe hinhAnh giaThueTheoNgay');
        if (xeChoThue) {
          conv.idXe = xeChoThue as any;
          // Map giaThueTheoNgay thành gia để frontend dùng chung
          (conv.idXe as any).gia = (xeChoThue as any).giaThueTheoNgay;
        }
      } else {
        const xe = await Xe.findById(conv.idXe).select('tenXe hinhAnh gia');
        if (xe) {
          conv.idXe = xe as any;
        }
      }
    }

    res.json({
      success: true,
      data: { conversations },
    });
  } catch (error) {
    next(error);
  }
};

// Lấy messages của một conversation
export const getMessages = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params; // ID của conversation
    const userId = req.user?.id;
    const { page = '1', limit = '50' } = req.query;

    // Kiểm tra quyền truy cập
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      next(createError('Không tìm thấy hội thoại', 404));
      return;
    }

    if (
      conversation.idNguoiMua.toString() !== userId &&
      conversation.idNguoiBan.toString() !== userId
    ) {
      next(createError('Bạn không có quyền xem hội thoại này', 403));
      return;
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [messages, total] = await Promise.all([
      Message.find({ idConversation: id })
        .populate('idNguoiGui', 'ten avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Message.countDocuments({ idConversation: id }),
    ]);

    // Đánh dấu đã đọc
    const isNguoiMua = conversation.idNguoiMua.toString() === userId;
    if (isNguoiMua) {
      conversation.unreadCountMua = 0;
    } else {
      conversation.unreadCountBan = 0;
    }
    await conversation.save();

    // Đánh dấu tất cả tin nhắn là đã đọc
    await Message.updateMany(
      {
        idConversation: id,
        idNguoiGui: { $ne: userId },
        daDoc: false,
      },
      { daDoc: true }
    );

    res.json({
      success: true,
      data: {
        messages: messages.reverse(), // Reverse để hiển thị từ cũ đến mới
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Gửi message (sẽ được gọi từ Socket.io)
export const sendMessage = async (
  idConversation: string,
  idNguoiGui: string,
  noiDung: string,
  loaiTinNhan: 'text' | 'image' | 'file' = 'text',
  hinhAnh?: string[]
) => {
  try {
    // Tạo message
    const message = await Message.create({
      idConversation,
      idNguoiGui,
      noiDung,
      loaiTinNhan,
      hinhAnh: hinhAnh || [],
      daDoc: false,
    });

    // Populate thông tin người gửi
    await message.populate('idNguoiGui', 'ten avatar');

    // Cập nhật conversation
    const conversation = await Conversation.findById(idConversation);
    if (conversation) {
      conversation.lastMessage = noiDung;
      conversation.lastMessageAt = new Date();

      // Tăng unread count cho người nhận
      if (conversation.idNguoiMua.toString() === idNguoiGui) {
        conversation.unreadCountBan += 1;
      } else {
        conversation.unreadCountMua += 1;
      }

      await conversation.save();
    }

    return { success: true, message };
  } catch (error) {
    console.error('Error sending message:', error);
    return { success: false, error };
  }
};

