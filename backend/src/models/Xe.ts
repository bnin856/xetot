import mongoose, { Document, Schema } from 'mongoose';

export interface IXe extends Document {
  tenXe: string;
  hangXe: string;
  mauSac: string;
  namSanXuat: number;
  gia: number;
  soKm: number;
  soCho: number;
  loaiXe: string; // Sedan, SUV, Hatchback, etc.
  tinhTrangXe: 'xeMoi' | 'xeCu'; // Xe mới hay xe cũ
  trangThai: 'dangBan' | 'daBan' | 'dangCho';
  moTa: string;
  hinhAnh: string[];
  ngayDang: Date;
  idChuXe?: mongoose.Types.ObjectId;
  hoaHong?: number;
  createdAt: Date;
  updatedAt: Date;
}

const xeSchema = new Schema<IXe>(
  {
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
    mauSac: {
      type: String,
      required: [true, 'Vui lòng nhập màu sắc'],
      trim: true,
    },
    namSanXuat: {
      type: Number,
      required: [true, 'Vui lòng nhập năm sản xuất'],
    },
    gia: {
      type: Number,
      required: [true, 'Vui lòng nhập giá'],
      min: [0, 'Giá phải lớn hơn 0'],
    },
    soKm: {
      type: Number,
      required: [true, 'Vui lòng nhập số km'],
      min: [0, 'Số km phải lớn hơn 0'],
    },
    soCho: {
      type: Number,
      required: [true, 'Vui lòng nhập số chỗ'],
      enum: [4, 5, 7, 16],
    },
    loaiXe: {
      type: String,
      required: [true, 'Vui lòng nhập loại xe'],
      trim: true,
    },
    tinhTrangXe: {
      type: String,
      enum: ['xeMoi', 'xeCu'],
      required: [true, 'Vui lòng chọn tình trạng xe'],
      default: 'xeCu',
    },
    trangThai: {
      type: String,
      enum: ['dangBan', 'daBan', 'dangCho'],
      default: 'dangBan',
    },
    moTa: {
      type: String,
      required: [true, 'Vui lòng nhập mô tả'],
      trim: true,
    },
    hinhAnh: {
      type: [String],
      default: [],
    },
    ngayDang: {
      type: Date,
      default: Date.now,
    },
    idChuXe: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    hoaHong: {
      type: Number,
      min: [0, 'Hoa hồng phải lớn hơn 0'],
      max: [100, 'Hoa hồng không được vượt quá 100%'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for search
xeSchema.index({ tenXe: 'text', hangXe: 'text', moTa: 'text' });

export default mongoose.model<IXe>('Xe', xeSchema);

