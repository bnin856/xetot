import DonThueXe from '../models/DonThueXe';
import XeChoThue from '../models/XeChoThue';

// Tự động cập nhật trạng thái đơn thuê xe
export const updateDonThueXeStatus = async (): Promise<void> => {
  try {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // Cập nhật đơn từ "daXacNhan" sang "dangThue" khi đến ngày bắt đầu
    const donCanBatDau = await DonThueXe.find({
      trangThai: 'daXacNhan',
      ngayBatDau: { $lte: now },
    });

    for (const don of donCanBatDau) {
      don.trangThai = 'dangThue';
      await don.save();

      // Cập nhật trạng thái xe
      const xe = await XeChoThue.findById(don.idXeChoThue);
      if (xe) {
        xe.trangThai = 'dangThue';
        await xe.save();
      }
    }

    // Cập nhật đơn từ "dangThue" sang "daHoanThanh" khi đến ngày kết thúc
    const donCanKetThuc = await DonThueXe.find({
      trangThai: 'dangThue',
      ngayKetThuc: { $lt: now },
    });

    for (const don of donCanKetThuc) {
      don.trangThai = 'daHoanThanh';
      await don.save();

      // Cập nhật trạng thái xe về "sanSang"
      const xe = await XeChoThue.findById(don.idXeChoThue);
      if (xe) {
        // Kiểm tra xem có đơn thuê nào khác đang active không
        const donKhacDangThue = await DonThueXe.findOne({
          idXeChoThue: xe._id,
          trangThai: { $in: ['daXacNhan', 'dangThue'] },
          _id: { $ne: don._id },
        });

        if (!donKhacDangThue) {
          xe.trangThai = 'sanSang';
          await xe.save();
        }
      }
    }
  } catch (error) {
    console.error('Error updating don thue xe status:', error);
  }
};



