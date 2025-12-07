import mongoose, { Document, Schema } from 'mongoose';

export interface ILichXemXe extends Document {
  idXe: mongoose.Types.ObjectId;
  idNguoiDat: mongoose.Types.ObjectId;
  idNguoiBan: mongoose.Types.ObjectId;
  ngayXem: Date;
  gioXem: string; // "09:00", "14:30"
  diaDiem: string;
  ghiChu?: string;
  soDienThoai: string;
  trangThai: 'choDuyet' | 'daDuyet' | 'daHuy' | 'daHoanThanh';
  lyDoHuy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const lichXemXeSchema = new Schema<ILichXemXe>(
  {
    idXe: {
      type: Schema.Types.ObjectId,
      ref: 'Xe',
      required: [true, 'Vui lòng chọn xe'],
    },
    idNguoiDat: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Vui lòng chọn người đặt'],
    },
    idNguoiBan: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Vui lòng chọn người bán'],
    },
    ngayXem: {
      type: Date,
      required: [true, 'Vui lòng chọn ngày xem'],
    },
    gioXem: {
      type: String,
      required: [true, 'Vui lòng chọn giờ xem'],
    },
    diaDiem: {
      type: String,
      required: [true, 'Vui lòng nhập địa điểm'],
      trim: true,
    },
    ghiChu: {
      type: String,
      trim: true,
    },
    soDienThoai: {
      type: String,
      required: [true, 'Vui lòng nhập số điện thoại'],
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

// Index
lichXemXeSchema.index({ idNguoiDat: 1, ngayXem: -1 });
lichXemXeSchema.index({ idNguoiBan: 1, ngayXem: -1 });
lichXemXeSchema.index({ idXe: 1 });

export default mongoose.model<ILichXemXe>('LichXemXe', lichXemXeSchema);

