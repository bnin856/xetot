import mongoose, { Document, Schema } from 'mongoose';

export interface IDonThueXe extends Document {
  idKhachHang: mongoose.Types.ObjectId;
  idXeChoThue: mongoose.Types.ObjectId;
  ngayBatDau: Date;
  ngayKetThuc: Date;
  tongTien: number;
  phiSan: number; // 5% phí sàn
  idViKhachHang?: mongoose.Types.ObjectId; // Ví khách hàng đã thanh toán
  trangThai: 'choXacNhan' | 'daXacNhan' | 'dangThue' | 'daHoanThanh' | 'daHuy';
  diaChiGiaoNhan: string;
  ghiChu?: string;
  createdAt: Date;
  updatedAt: Date;
}

const donThueXeSchema = new Schema<IDonThueXe>(
  {
    idKhachHang: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Vui lòng chọn khách hàng'],
    },
    idXeChoThue: {
      type: Schema.Types.ObjectId,
      ref: 'XeChoThue',
      required: [true, 'Vui lòng chọn xe'],
    },
    ngayBatDau: {
      type: Date,
      required: [true, 'Vui lòng chọn ngày bắt đầu'],
    },
    ngayKetThuc: {
      type: Date,
      required: [true, 'Vui lòng chọn ngày kết thúc'],
    },
    tongTien: {
      type: Number,
      required: [true, 'Vui lòng nhập tổng tiền'],
      min: [0, 'Tổng tiền phải lớn hơn 0'],
    },
    phiSan: {
      type: Number,
      default: 0,
      min: [0, 'Phí sàn không thể âm'],
    },
    idViKhachHang: {
      type: Schema.Types.ObjectId,
      ref: 'Wallet',
    },
    diaChiGiaoNhan: {
      type: String,
      required: [true, 'Vui lòng nhập địa chỉ giao nhận xe'],
      trim: true,
    },
    trangThai: {
      type: String,
      enum: ['choXacNhan', 'daXacNhan', 'dangThue', 'daHoanThanh', 'daHuy'],
      default: 'choXacNhan',
    },
    ghiChu: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IDonThueXe>('DonThueXe', donThueXeSchema);

