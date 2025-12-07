import { Request, Response, NextFunction } from 'express';
import DonHang from '../models/DonHang';
import User from '../models/User';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { giuTienCoc, hoanTienCoc, tichThuCoc } from './walletController';

// Xác nhận đã thanh toán cọc
export const xacNhanThanhToanCoc = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const donHang = await DonHang.findById(id);

    if (!donHang) {
      next(createError('Không tìm thấy đơn hàng', 404));
      return;
    }

    if (donHang.phuongThucThanhToan !== 'tienMat') {
      next(createError('Chỉ áp dụng cho thanh toán tiền mặt', 400));
      return;
    }

    // Giữ tiền cọc từ ví
    const result = await giuTienCoc(
      donHang.idKhachHang.toString(),
      donHang.tienCoc || 0,
      donHang._id.toString()
    );

    if (!result.success) {
      next(createError(result.message || 'Không thể giữ tiền cọc', 400));
      return;
    }

    donHang.trangThaiCoc = 'daThanhToan';
    donHang.trangThai = 'daThanhToan'; // Đã thanh toán cọc, chờ giao hàng
    donHang.ngayThanhToan = new Date();
    await donHang.save();

    res.json({
      success: true,
      message: 'Xác nhận thanh toán cọc thành công',
      data: donHang,
    });
  } catch (error) {
    next(error);
  }
};

// Xác nhận giao dịch thành công (sau khi kiểm xe)
export const xacNhanGiaoDichThanhCong = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const donHang = await DonHang.findById(id).populate('idKhachHang idXe');

    if (!donHang) {
      next(createError('Không tìm thấy đơn hàng', 404));
      return;
    }

    // Chỉ khách hàng mới có thể xác nhận
    if (donHang.idKhachHang.toString() !== userId) {
      next(createError('Bạn không có quyền xác nhận đơn này', 403));
      return;
    }

    if (donHang.phuongThucThanhToan === 'tienMat' && donHang.tienCoc) {
      // Chia cọc: 50% cho người bán, 50% cho sàn
      const xe = await donHang.populate('idXe');
      const idNguoiBan = (xe.idXe as any).idChuXe;
      
      await tichThuCoc(
        donHang.idKhachHang.toString(),
        donHang.tienCoc,
        donHang._id.toString(),
        idNguoiBan?.toString()
      );
      
      donHang.trangThaiCoc = 'daTichThu';
    }

    donHang.trangThai = 'daHoanThanh';
    donHang.ngayHoanThanh = new Date();
    await donHang.save();

    res.json({
      success: true,
      message: 'Giao dịch hoàn tất thành công',
      data: donHang,
    });
  } catch (error) {
    next(error);
  }
};

// Báo cáo xe sai mô tả
export const baoCaoXeSaiMoTa = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { lyDo } = req.body;
    const userId = req.user?.id;

    const donHang = await DonHang.findById(id);

    if (!donHang) {
      next(createError('Không tìm thấy đơn hàng', 404));
      return;
    }

    if (donHang.idKhachHang.toString() !== userId) {
      next(createError('Bạn không có quyền báo cáo đơn này', 403));
      return;
    }

    if (!lyDo || lyDo.trim() === '') {
      next(createError('Vui lòng nhập lý do báo cáo', 400));
      return;
    }

    // Lưu hình ảnh chứng minh nếu có
    const hinhAnhChungMinh = req.files
      ? (req.files as Express.Multer.File[]).map((file) => file.path)
      : [];

    if (hinhAnhChungMinh.length === 0) {
      next(createError('Vui lòng upload ít nhất 1 hình ảnh chứng minh', 400));
      return;
    }

    donHang.trangThai = 'tranh_chap_xe_sai';
    donHang.lyDoHuy = lyDo;
    donHang.nguoiHuy = 'khachHang';
    donHang.hinhAnhChungMinh = hinhAnhChungMinh;
    
    // Chưa hoàn cọc ngay, chờ admin xác minh
    // Hoàn 100% cọc cho khách sau khi admin xác nhận
    // if (donHang.phuongThucThanhToan === 'tienMat' && donHang.tienCoc) {
    //   await hoanTienCoc(
    //     donHang.idKhachHang.toString(),
    //     donHang.tienCoc,
    //     donHang._id.toString()
    //   );
    //   donHang.trangThaiCoc = 'daHoan';
    // }

    await donHang.save();

    // TODO: Ban người bán 7-14 ngày (cần thêm logic)
    // TODO: Gửi thông báo cho admin xử lý

    res.json({
      success: true,
      message: 'Đã ghi nhận báo cáo. Admin sẽ xử lý trong 24h và xác minh bằng chứng.',
      data: donHang,
    });
  } catch (error) {
    next(error);
  }
};

// Khách hàng hủy vô lý do
export const khachHangHuyVoLyDo = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { lyDo } = req.body;
    const userId = req.user?.id;

    const donHang = await DonHang.findById(id);

    if (!donHang) {
      next(createError('Không tìm thấy đơn hàng', 404));
      return;
    }

    if (donHang.idKhachHang.toString() !== userId) {
      next(createError('Bạn không có quyền hủy đơn này', 403));
      return;
    }

    if (!lyDo || lyDo.trim() === '') {
      next(createError('Vui lòng nhập lý do hủy đơn', 400));
      return;
    }

    // Lưu hình ảnh chứng minh nếu có (không bắt buộc cho hủy đơn)
    const hinhAnhChungMinh = req.files
      ? (req.files as Express.Multer.File[]).map((file) => file.path)
      : [];

    donHang.trangThai = 'tranh_chap_khach_huy';
    donHang.lyDoHuy = lyDo;
    donHang.nguoiHuy = 'khachHang';
    donHang.hinhAnhChungMinh = hinhAnhChungMinh;
    
    // Nếu có hình ảnh chứng minh (VD: bệnh, tai nạn), chờ admin xem xét
    // Nếu không có, tịch thu cọc ngay
    if (hinhAnhChungMinh.length === 0) {
      // Khách mất 100% cọc: 50% cho người bán, 50% cho sàn
      if (donHang.phuongThucThanhToan === 'tienMat' && donHang.tienCoc) {
        const xe = await donHang.populate('idXe');
        const idNguoiBan = (xe.idXe as any).idChuXe;
        
        await tichThuCoc(
          donHang.idKhachHang.toString(),
          donHang.tienCoc,
          donHang._id.toString(),
          idNguoiBan?.toString()
        );
        donHang.trangThaiCoc = 'daTichThu';
      }
    }
    // Nếu có hình ảnh, chờ admin xác minh

    await donHang.save();

    const message = hinhAnhChungMinh.length > 0
      ? 'Đã gửi yêu cầu hủy đơn. Admin sẽ xem xét bằng chứng và phản hồi trong 24h.'
      : 'Đã hủy đơn hàng. Tiền cọc sẽ không được hoàn lại.';

    res.json({
      success: true,
      message,
      data: donHang,
    });
  } catch (error) {
    next(error);
  }
};

// Admin xử lý tranh chấp
export const xuLyTranhChap = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { ketQua, ghiChu } = req.body; // ketQua: 'hoantien' | 'tichthu' | 'chia'

    const donHang = await DonHang.findById(id);

    if (!donHang) {
      next(createError('Không tìm thấy đơn hàng', 404));
      return;
    }

    if (!['tranh_chap_xe_sai', 'tranh_chap_khach_huy'].includes(donHang.trangThai)) {
      next(createError('Đơn hàng không ở trạng thái tranh chấp', 400));
      return;
    }

    if (donHang.tienCoc) {
      switch (ketQua) {
        case 'hoantien':
          await hoanTienCoc(
            donHang.idKhachHang.toString(),
            donHang.tienCoc,
            donHang._id.toString()
          );
          donHang.trangThaiCoc = 'daHoan';
          break;
        case 'tichthu':
          const xe = await donHang.populate('idXe');
          const idNguoiBan = (xe.idXe as any).idChuXe;
          await tichThuCoc(
            donHang.idKhachHang.toString(),
            donHang.tienCoc,
            donHang._id.toString(),
            idNguoiBan?.toString()
          );
          donHang.trangThaiCoc = 'daTichThu';
          break;
        case 'chia':
          // Chia đôi: hoàn 50% cho khách, 50% cho người bán & sàn
          const xe2 = await donHang.populate('idXe');
          const idNguoiBan2 = (xe2.idXe as any).idChuXe;
          const half = donHang.tienCoc / 2;
          await hoanTienCoc(
            donHang.idKhachHang.toString(),
            half,
            donHang._id.toString()
          );
          await tichThuCoc(
            donHang.idKhachHang.toString(),
            half,
            donHang._id.toString(),
            idNguoiBan2?.toString()
          );
          donHang.trangThaiCoc = 'daTichThu';
          break;
      }
    }

    donHang.trangThai = 'daHuy';
    donHang.ghiChu = (donHang.ghiChu || '') + '\n[Admin]: ' + ghiChu;
    await donHang.save();

    res.json({
      success: true,
      message: 'Đã xử lý tranh chấp thành công',
      data: donHang,
    });
  } catch (error) {
    next(error);
  }
};

