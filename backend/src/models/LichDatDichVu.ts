import mongoose, { Document, Schema } from 'mongoose';

export interface ILichDatDichVu extends Document {
  idDichVu: mongoose.Types.ObjectId;
  idKhachHang: mongoose.Types.ObjectId;
  idNguoiCungCap: mongoose.Types.ObjectId;
  ngayDat: Date;
  gioDat: string; // Format: "HH:mm"
  diaDiem: string;
  soDienThoai: string;
  ghiChu?: string;
  trangThai: 'choDuyet' | 'daDuyet' | 'daHuy' | 'daHoanThanh';
  lyDoHuy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const lichDatDichVuSchema = new Schema<ILichDatDichVu>(
  {
    idDichVu: {
      type: Schema.Types.ObjectId,
      ref: 'DichVu',
      required: [true, 'Vui lòng chọn dịch vụ'],
    },
    idKhachHang: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Vui lòng đăng nhập'],
    },
    idNguoiCungCap: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Dịch vụ phải có người cung cấp'],
    },
    ngayDat: {
      type: Date,
      required: [true, 'Vui lòng chọn ngày đặt lịch'],
    },
    gioDat: {
      type: String,
      required: [true, 'Vui lòng chọn giờ đặt lịch'],
      match: [/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Giờ không hợp lệ'],
    },
    diaDiem: {
      type: String,
      required: [true, 'Vui lòng nhập địa điểm'],
      trim: true,
    },
    soDienThoai: {
      type: String,
      required: [true, 'Vui lòng nhập số điện thoại'],
      trim: true,
    },
    ghiChu: {
      type: String,
      trim: true,
    },
    trangThai: {
      type: String,
      enum: ['choDuyet', 'daDuyet', 'daHuy', 'daHoanThanh'],
      default: 'choDuyet',
    },
    lyDoHuy: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
lichDatDichVuSchema.index({ idKhachHang: 1, createdAt: -1 });
lichDatDichVuSchema.index({ idNguoiCungCap: 1, createdAt: -1 });
lichDatDichVuSchema.index({ idDichVu: 1 });

export default mongoose.model<ILichDatDichVu>('LichDatDichVu', lichDatDichVuSchema);

