import mongoose, { Document, Schema } from 'mongoose';

export interface IYeuCauBanXe extends Document {
  idKhachHang: mongoose.Types.ObjectId;
  tenXe: string;
  hangXe: string;
  namSanXuat: number;
  soKm: number;
  mauSac: string;
  giaYeuCau: number;
  hoaHong: number;
  moTa?: string;
  trangThai: 'choDuyet' | 'daDuyet' | 'tuChoi';
  ngayYeuCau: Date;
  createdAt: Date;
  updatedAt: Date;
}

const yeuCauBanXeSchema = new Schema<IYeuCauBanXe>(
  {
    idKhachHang: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tenXe: {
      type: String,
      required: [true, 'Vui lòng nhập tên xe'],
      trim: true,
    },
    hangXe: {
      type: String,
      required: [true, 'Vui lòng nhập hãng xe'],
      trim: true,
    },
    namSanXuat: {
      type: Number,
      required: true,
    },
    soKm: {
      type: Number,
      required: true,
      min: [0, 'Số km phải lớn hơn 0'],
    },
    mauSac: {
      type: String,
      required: [true, 'Vui lòng nhập màu sắc'],
      trim: true,
    },
    giaYeuCau: {
      type: Number,
      required: true,
      min: [0, 'Giá yêu cầu phải lớn hơn 0'],
    },
    hoaHong: {
      type: Number,
      required: true,
      min: [0, 'Hoa hồng phải lớn hơn 0'],
      max: [100, 'Hoa hồng không được vượt quá 100%'],
    },
    moTa: {
      type: String,
      trim: true,
    },
    trangThai: {
      type: String,
      enum: ['choDuyet', 'daDuyet', 'tuChoi'],
      default: 'choDuyet',
    },
    ngayYeuCau: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IYeuCauBanXe>('YeuCauBanXe', yeuCauBanXeSchema);

