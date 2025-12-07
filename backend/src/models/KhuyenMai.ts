import mongoose, { Document, Schema } from 'mongoose';

export interface IKhuyenMai extends Document {
  ten: string;
  moTa: string;
  giamGia: number;
  ngayBatDau: Date;
  ngayKetThuc: Date;
  trangThai: 'dangHoatDong' | 'daKetThuc' | 'chuaBatDau';
  createdAt: Date;
  updatedAt: Date;
}

const khuyenMaiSchema = new Schema<IKhuyenMai>(
  {
    ten: {
      type: String,
      required: [true, 'Vui lòng nhập tên khuyến mãi'],
      trim: true,
    },
    moTa: {
      type: String,
      required: [true, 'Vui lòng nhập mô tả'],
      trim: true,
    },
    giamGia: {
      type: Number,
      required: true,
      min: [0, 'Giảm giá phải lớn hơn 0'],
      max: [100, 'Giảm giá không được vượt quá 100%'],
    },
    ngayBatDau: {
      type: Date,
      required: true,
    },
    ngayKetThuc: {
      type: Date,
      required: true,
    },
    trangThai: {
      type: String,
      enum: ['dangHoatDong', 'daKetThuc', 'chuaBatDau'],
      default: 'chuaBatDau',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IKhuyenMai>('KhuyenMai', khuyenMaiSchema);

