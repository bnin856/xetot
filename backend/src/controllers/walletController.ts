import { Response, NextFunction } from 'express';
import Wallet from '../models/Wallet';
import Transaction from '../models/Transaction';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// Lấy thông tin ví của user
export const getMyWallet = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;

    let wallet = await Wallet.findOne({ idNguoiDung: userId });

    // Nếu chưa có ví, tự động tạo
    if (!wallet) {
      wallet = await Wallet.create({
        idNguoiDung: userId,
        soDu: 0,
        soDuKhaDung: 0,
        soDuDangGiu: 0,
        trangThai: 'hoatDong',
        loaiVi: 'nguoiMua',
      });
    }

    res.json({
      success: true,
      data: { wallet },
    });
  } catch (error) {
    next(error);
  }
};

// Nạp tiền vào ví
export const napTien = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { soTien, phuongThucThanhToan, maGiaoDich } = req.body;

    if (!soTien || soTien <= 0) {
      next(createError('Số tiền phải lớn hơn 0', 400));
      return;
    }

    // Tìm hoặc tạo ví
    let wallet = await Wallet.findOne({ idNguoiDung: userId });
    if (!wallet) {
      wallet = await Wallet.create({
        idNguoiDung: userId,
        soDu: 0,
        soDuKhaDung: 0,
        soDuDangGiu: 0,
        trangThai: 'hoatDong',
        loaiVi: 'nguoiMua',
      });
    }

    if (wallet.trangThai !== 'hoatDong') {
      next(createError('Ví đang bị khóa, không thể nạp tiền', 403));
      return;
    }

    const soDuTruoc = wallet.soDu;
    wallet.soDu += soTien;
    wallet.soDuKhaDung += soTien;
    await wallet.save();

    // Tạo transaction
    const transaction = await Transaction.create({
      idNguoiDung: userId,
      idVi: wallet._id,
      loaiGiaoDich: 'napTien',
      soTien,
      soDuTruoc,
      soDuSau: wallet.soDu,
      trangThai: 'thanhCong',
      moTa: `Nạp tiền vào ví qua ${phuongThucThanhToan || 'Chuyển khoản'}`,
      phuongThucThanhToan,
      maGiaoDich: maGiaoDich || `NAP${Date.now()}`,
    });

    res.json({
      success: true,
      message: 'Nạp tiền thành công',
      data: { wallet, transaction },
    });
  } catch (error) {
    next(error);
  }
};

// Rút tiền từ ví
export const rutTien = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { soTien, nganHang, soTaiKhoan, tenTaiKhoan } = req.body;

    if (!soTien || soTien <= 0) {
      next(createError('Số tiền phải lớn hơn 0', 400));
      return;
    }

    const wallet = await Wallet.findOne({ idNguoiDung: userId });
    if (!wallet) {
      next(createError('Không tìm thấy ví', 404));
      return;
    }

    if (wallet.trangThai !== 'hoatDong') {
      next(createError('Ví đang bị khóa', 403));
      return;
    }

    if (wallet.soDuKhaDung < soTien) {
      next(createError(`Số dư khả dụng không đủ. Bạn có: ${wallet.soDuKhaDung.toLocaleString()} ₫`, 400));
      return;
    }

    const soDuTruoc = wallet.soDu;
    wallet.soDu -= soTien;
    wallet.soDuKhaDung -= soTien;
    await wallet.save();

    // Tạo transaction
    const transaction = await Transaction.create({
      idNguoiDung: userId,
      idVi: wallet._id,
      loaiGiaoDich: 'rutTien',
      soTien,
      soDuTruoc,
      soDuSau: wallet.soDu,
      trangThai: 'choXuLy',
      moTa: `Rút tiền về ${nganHang} - ${soTaiKhoan} - ${tenTaiKhoan}`,
      phuongThucThanhToan: 'Bank Transfer',
      ghiChu: `Ngân hàng: ${nganHang}, STK: ${soTaiKhoan}, Tên: ${tenTaiKhoan}`,
    });

    res.json({
      success: true,
      message: 'Yêu cầu rút tiền đã được gửi. Chúng tôi sẽ xử lý trong 1-2 ngày làm việc.',
      data: { wallet, transaction },
    });
  } catch (error) {
    next(error);
  }
};

// Giữ tiền cọc (khi đặt mua)
export const giuTienCoc = async (
  userId: string,
  soTien: number,
  idDonHang: string
): Promise<{ success: boolean; wallet?: any; transaction?: any; message?: string }> => {
  try {
    const wallet = await Wallet.findOne({ idNguoiDung: userId });
    if (!wallet) {
      return { success: false, message: 'Không tìm thấy ví' };
    }

    if (wallet.soDuKhaDung < soTien) {
      return { success: false, message: 'Số dư khả dụng không đủ để đặt cọc' };
    }

    const soDuTruoc = wallet.soDu;
    wallet.soDuKhaDung -= soTien;
    wallet.soDuDangGiu += soTien;
    await wallet.save();

    const transaction = await Transaction.create({
      idNguoiDung: userId,
      idVi: wallet._id,
      loaiGiaoDich: 'datCoc',
      soTien,
      soDuTruoc,
      soDuSau: wallet.soDu,
      trangThai: 'thanhCong',
      moTa: `Đặt cọc cho đơn hàng #${idDonHang.slice(-8)}`,
      idLienQuan: idDonHang as any,
    });

    return { success: true, wallet, transaction };
  } catch (error) {
    return { success: false, message: 'Có lỗi xảy ra khi giữ tiền cọc' };
  }
};

// Hoàn tiền cọc
export const hoanTienCoc = async (
  userId: string,
  soTien: number,
  idDonHang: string
): Promise<{ success: boolean; wallet?: any; transaction?: any; message?: string }> => {
  try {
    const wallet = await Wallet.findOne({ idNguoiDung: userId });
    if (!wallet) {
      return { success: false, message: 'Không tìm thấy ví' };
    }

    const soDuTruoc = wallet.soDu;
    wallet.soDuKhaDung += soTien;
    wallet.soDuDangGiu -= soTien;
    await wallet.save();

    const transaction = await Transaction.create({
      idNguoiDung: userId,
      idVi: wallet._id,
      loaiGiaoDich: 'hoanCoc',
      soTien,
      soDuTruoc,
      soDuSau: wallet.soDu,
      trangThai: 'thanhCong',
      moTa: `Hoàn tiền cọc từ đơn hàng #${idDonHang.slice(-8)}`,
      idLienQuan: idDonHang as any,
    });

    return { success: true, wallet, transaction };
  } catch (error) {
    return { success: false, message: 'Có lỗi xảy ra khi hoàn tiền cọc' };
  }
};

// Tịch thu cọc (chia cho người bán và sàn)
export const tichThuCoc = async (
  userId: string,
  soTien: number,
  idDonHang: string,
  idNguoiBan?: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const wallet = await Wallet.findOne({ idNguoiDung: userId });
    if (!wallet) {
      return { success: false, message: 'Không tìm thấy ví' };
    }

    const soDuTruoc = wallet.soDu;
    wallet.soDu -= soTien;
    wallet.soDuDangGiu -= soTien;
    await wallet.save();

    // Ghi nhận giao dịch tịch thu
    await Transaction.create({
      idNguoiDung: userId,
      idVi: wallet._id,
      loaiGiaoDich: 'tichThuCoc',
      soTien,
      soDuTruoc,
      soDuSau: wallet.soDu,
      trangThai: 'thanhCong',
      moTa: `Tịch thu tiền cọc từ đơn hàng #${idDonHang.slice(-8)}`,
      idLienQuan: idDonHang as any,
    });

    // Chia tiền: 50% cho người bán, 50% cho sàn
    const tienNguoiBan = soTien / 2;
    const tienSan = soTien / 2;

    // Chuyển cho người bán
    if (idNguoiBan) {
      let walletNguoiBan = await Wallet.findOne({ idNguoiDung: idNguoiBan });
      if (!walletNguoiBan) {
        walletNguoiBan = await Wallet.create({
          idNguoiDung: idNguoiBan,
          soDu: 0,
          soDuKhaDung: 0,
          soDuDangGiu: 0,
          trangThai: 'hoatDong',
          loaiVi: 'nguoiBan',
        });
      }

      const soDuTruocNguoiBan = walletNguoiBan.soDu;
      walletNguoiBan.soDu += tienNguoiBan;
      walletNguoiBan.soDuKhaDung += tienNguoiBan;
      await walletNguoiBan.save();

      await Transaction.create({
        idNguoiDung: idNguoiBan as any,
        idVi: walletNguoiBan._id,
        loaiGiaoDich: 'nhanTien',
        soTien: tienNguoiBan,
        soDuTruoc: soDuTruocNguoiBan,
        soDuSau: walletNguoiBan.soDu,
        trangThai: 'thanhCong',
        moTa: `Nhận 50% tiền cọc từ đơn hàng #${idDonHang.slice(-8)}`,
        idLienQuan: idDonHang as any,
      });
    }

    // TODO: Ghi nhận 50% cho sàn vào ví admin

    return { success: true };
  } catch (error) {
    return { success: false, message: 'Có lỗi xảy ra khi tịch thu cọc' };
  }
};

// Giữ tiền escrow (cho chuyển khoản online)
export const giuTienEscrow = async (
  userId: string,
  soTien: number,
  idDonHang: string
): Promise<{ success: boolean; idGiaoDich?: string; message?: string }> => {
  try {
    // Tạo ví escrow của sàn nếu chưa có (ID đặc biệt)
    const ESCROW_USER_ID = 'ESCROW_SYSTEM';
    let escrowWallet = await Wallet.findOne({ idNguoiDung: ESCROW_USER_ID });
    if (!escrowWallet) {
      escrowWallet = await Wallet.create({
        idNguoiDung: ESCROW_USER_ID,
        soDu: 0,
        soDuKhaDung: 0,
        soDuDangGiu: 0,
        trangThai: 'hoatDong',
        loaiVi: 'escrow',
      });
    }

    // Ghi nhận tiền vào ví escrow
    const soDuTruoc = escrowWallet.soDu;
    escrowWallet.soDu += soTien;
    escrowWallet.soDuDangGiu += soTien; // Đang giữ
    await escrowWallet.save();

    // Tạo giao dịch
    const transaction = await Transaction.create({
      idNguoiDung: userId as any,
      idVi: escrowWallet._id,
      loaiGiaoDich: 'napTien',
      soTien,
      soDuTruoc,
      soDuSau: escrowWallet.soDu,
      trangThai: 'thanhCong',
      moTa: `Giữ tiền escrow cho đơn hàng #${idDonHang.slice(-8)}`,
      idLienQuan: idDonHang as any,
    });

    return { success: true, idGiaoDich: transaction._id.toString() };
  } catch (error) {
    return { success: false, message: 'Có lỗi xảy ra khi giữ tiền escrow' };
  }
};

// Trả tiền cho người bán (99% cho người bán, 1% phí sàn)
export const traTienNguoiBan = async (
  idNguoiBan: string,
  soTienGoc: number,
  idDonHang: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const PHI_SAN = 0.01; // 1%
    const tienNguoiBan = soTienGoc * (1 - PHI_SAN); // 99%
    const tienPhiSan = soTienGoc * PHI_SAN; // 1%

    // Lấy ví escrow
    const ESCROW_USER_ID = 'ESCROW_SYSTEM';
    const escrowWallet = await Wallet.findOne({ idNguoiDung: ESCROW_USER_ID });
    if (!escrowWallet) {
      return { success: false, message: 'Không tìm thấy ví escrow' };
    }

    // Trừ tiền từ ví escrow
    escrowWallet.soDu -= soTienGoc;
    escrowWallet.soDuDangGiu -= soTienGoc;
    await escrowWallet.save();

    // Ghi nhận giao dịch trừ tiền escrow
    await Transaction.create({
      idNguoiDung: ESCROW_USER_ID as any,
      idVi: escrowWallet._id,
      loaiGiaoDich: 'chuyenTien',
      soTien: soTienGoc,
      soDuTruoc: escrowWallet.soDu + soTienGoc,
      soDuSau: escrowWallet.soDu,
      trangThai: 'thanhCong',
      moTa: `Trả tiền cho người bán - Đơn hàng #${idDonHang.slice(-8)}`,
      idLienQuan: idDonHang as any,
    });

    // Tìm hoặc tạo ví người bán
    let walletNguoiBan = await Wallet.findOne({ idNguoiDung: idNguoiBan });
    if (!walletNguoiBan) {
      walletNguoiBan = await Wallet.create({
        idNguoiDung: idNguoiBan,
        soDu: 0,
        soDuKhaDung: 0,
        soDuDangGiu: 0,
        trangThai: 'hoatDong',
        loaiVi: 'nguoiBan',
      });
    }

    // Cộng tiền cho người bán (99%)
    const soDuTruocNguoiBan = walletNguoiBan.soDu;
    walletNguoiBan.soDu += tienNguoiBan;
    walletNguoiBan.soDuKhaDung += tienNguoiBan;
    await walletNguoiBan.save();

    // Ghi nhận giao dịch cho người bán
    await Transaction.create({
      idNguoiDung: idNguoiBan as any,
      idVi: walletNguoiBan._id,
      loaiGiaoDich: 'nhanTien',
      soTien: tienNguoiBan,
      soDuTruoc: soDuTruocNguoiBan,
      soDuSau: walletNguoiBan.soDu,
      trangThai: 'thanhCong',
      moTa: `Nhận tiền bán xe (99%) - Đơn hàng #${idDonHang.slice(-8)}`,
      idLienQuan: idDonHang as any,
    });

    // TODO: Ghi nhận 1% phí sàn vào ví admin

    return { success: true, message: `Đã trả ${tienNguoiBan.toLocaleString()}₫ cho người bán, phí sàn ${tienPhiSan.toLocaleString()}₫` };
  } catch (error) {
    return { success: false, message: 'Có lỗi xảy ra khi trả tiền cho người bán' };
  }
};

// Trả tiền cho người cho thuê (95% cho người cho thuê, 5% phí sàn)
export const traTienNguoiChoThue = async (
  idNguoiChoThue: string,
  soTienGoc: number,
  idDonThueXe: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const PHI_SAN = 0.05; // 5% phí sàn cho thuê xe
    const tienNguoiChoThue = soTienGoc * (1 - PHI_SAN); // 95%
    const tienPhiSan = soTienGoc * PHI_SAN; // 5%

    // Tìm hoặc tạo ví người cho thuê
    let walletNguoiChoThue = await Wallet.findOne({ idNguoiDung: idNguoiChoThue });
    if (!walletNguoiChoThue) {
      walletNguoiChoThue = await Wallet.create({
        idNguoiDung: idNguoiChoThue,
        soDu: 0,
        soDuKhaDung: 0,
        soDuDangGiu: 0,
        trangThai: 'hoatDong',
        loaiVi: 'nguoiChoThue',
      });
    }

    // Cộng tiền cho người cho thuê (95%)
    const soDuTruocNguoiChoThue = walletNguoiChoThue.soDu;
    walletNguoiChoThue.soDu += tienNguoiChoThue;
    walletNguoiChoThue.soDuKhaDung += tienNguoiChoThue;
    await walletNguoiChoThue.save();

    // Ghi nhận giao dịch cho người cho thuê
    await Transaction.create({
      idNguoiDung: idNguoiChoThue as any,
      idVi: walletNguoiChoThue._id,
      loaiGiaoDich: 'nhanTien',
      soTien: tienNguoiChoThue,
      soDuTruoc: soDuTruocNguoiChoThue,
      soDuSau: walletNguoiChoThue.soDu,
      trangThai: 'thanhCong',
      moTa: `Nhận tiền cho thuê xe (95%) - Đơn thuê #${idDonThueXe.slice(-8)}`,
      idLienQuan: idDonThueXe as any,
    });

    // TODO: Ghi nhận 5% phí sàn vào ví admin

    return { success: true, message: `Đã trả ${tienNguoiChoThue.toLocaleString()}₫ cho người cho thuê, phí sàn ${tienPhiSan.toLocaleString()}₫` };
  } catch (error) {
    return { success: false, message: 'Có lỗi xảy ra khi trả tiền cho người cho thuê' };
  }
};

// Lấy lịch sử giao dịch
export const getLichSuGiaoDich = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 20, loaiGiaoDich } = req.query;

    const filter: any = { idNguoiDung: userId };
    if (loaiGiaoDich) {
      filter.loaiGiaoDich = loaiGiaoDich;
    }

    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('idLienQuan');

    const total = await Transaction.countDocuments(filter);

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Xử lý yêu cầu rút tiền
export const xuLyRutTien = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { trangThai, ghiChu } = req.body; // 'thanhCong' | 'thatBai'

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      next(createError('Không tìm thấy giao dịch', 404));
      return;
    }

    if (transaction.loaiGiaoDich !== 'rutTien') {
      next(createError('Giao dịch này không phải yêu cầu rút tiền', 400));
      return;
    }

    if (transaction.trangThai !== 'choXuLy') {
      next(createError('Giao dịch đã được xử lý', 400));
      return;
    }

    transaction.trangThai = trangThai;
    transaction.ghiChu = (transaction.ghiChu || '') + `\n[Admin]: ${ghiChu}`;
    await transaction.save();

    // Nếu thất bại, hoàn tiền
    if (trangThai === 'thatBai') {
      const wallet = await Wallet.findById(transaction.idVi);
      if (wallet) {
        wallet.soDu += transaction.soTien;
        wallet.soDuKhaDung += transaction.soTien;
        await wallet.save();
      }
    }

    res.json({
      success: true,
      message: `Đã ${trangThai === 'thanhCong' ? 'xác nhận' : 'từ chối'} yêu cầu rút tiền`,
      data: { transaction },
    });
  } catch (error) {
    next(error);
  }
};

