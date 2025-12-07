import mongoose, { Document, Schema } from 'mongoose';

export interface IThanhToan extends Document {
  idDonHang: mongoose.Types.ObjectId;
  soTien: number;
  ngayThanhToan: Date;
  trangThai: 'choThanhToan' | 'daThanhToan' | 'daHuy';
  phuongThuc: string;
  maGiaoDich?: string;
  createdAt: Date;
  updatedAt: Date;
}

const thanhToanSchema = new Schema<IThanhToan>(
  {
    idDonHang: {
      type: Schema.Types.ObjectId,
      ref: 'DonHang',
      required: true,
    },
    soTien: {
      type: Number,
      required: true,
      min: [0, 'Số tiền phải lớn hơn 0'],
    },
    ngayThanhToan: {
      type: Date,
      default: Date.now,
    },
    trangThai: {
      type: String,
      enum: ['choThanhToan', 'daThanhToan', 'daHuy'],
      default: 'choThanhToan',
    },
    phuongThuc: {
      type: String,
      required: true,
      enum: ['tienMat', 'chuyenKhoan', 'vnpay', 'momo'],
    },
    maGiaoDich: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IThanhToan>('ThanhToan', thanhToanSchema);

