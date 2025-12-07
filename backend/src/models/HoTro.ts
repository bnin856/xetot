import mongoose, { Document, Schema } from 'mongoose';

export interface IHoTro extends Document {
  idKhachHang: mongoose.Types.ObjectId;
  tieuDe: string;
  noiDung: string;
  trangThai: 'mo' | 'dangXuLy' | 'daXuLy';
  phanHoi?: string;
  ngayTao: Date;
  createdAt: Date;
  updatedAt: Date;
}

const hoTroSchema = new Schema<IHoTro>(
  {
    idKhachHang: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
    trangThai: {
      type: String,
      enum: ['mo', 'dangXuLy', 'daXuLy'],
      default: 'mo',
    },
    phanHoi: {
      type: String,
      trim: true,
    },
    ngayTao: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IHoTro>('HoTro', hoTroSchema);

