import mongoose, { Document, Schema } from 'mongoose';

export interface IDanhGia extends Document {
  idKhachHang: mongoose.Types.ObjectId;
  idXe: mongoose.Types.ObjectId;
  diem: number;
  noiDung: string;
  ngayDanhGia: Date;
  createdAt: Date;
  updatedAt: Date;
}

const danhGiaSchema = new Schema<IDanhGia>(
  {
    idKhachHang: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    idXe: {
      type: Schema.Types.ObjectId,
      ref: 'Xe',
      required: true,
    },
    diem: {
      type: Number,
      required: true,
      min: [1, 'Điểm tối thiểu là 1'],
      max: [5, 'Điểm tối đa là 5'],
    },
    noiDung: {
      type: String,
      required: [true, 'Vui lòng nhập nội dung đánh giá'],
      trim: true,
    },
    ngayDanhGia: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IDanhGia>('DanhGia', danhGiaSchema);

