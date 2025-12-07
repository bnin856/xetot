import mongoose, { Document, Schema } from 'mongoose';

export interface IThongBao extends Document {
  idNguoiNhan?: mongoose.Types.ObjectId;
  tieuDe: string;
  noiDung: string;
  loai: 'heThong' | 'donHang' | 'khuyenMai';
  daDoc: boolean;
  ngayGui: Date;
  createdAt: Date;
  updatedAt: Date;
}

const thongBaoSchema = new Schema<IThongBao>(
  {
    idNguoiNhan: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    tieuDe: {
      type: String,
      required: [true, 'Vui lòng nhập tiêu đề'],
      trim: true,
    },
    noiDung: {
      type: String,
      required: [true, 'Vui lòng nhập nội dung'],
      trim: true,
    },
    loai: {
      type: String,
      enum: ['heThong', 'donHang', 'khuyenMai'],
      default: 'heThong',
    },
    daDoc: {
      type: Boolean,
      default: false,
    },
    ngayGui: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IThongBao>('ThongBao', thongBaoSchema);

