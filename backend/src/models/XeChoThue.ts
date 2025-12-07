import mongoose, { Document, Schema } from 'mongoose';

export interface IXeChoThue extends Document {
  tenXe: string;
  hangXe: string;
  dongXe: string;
  namSanXuat: number;
  bienSoXe: string;
  mauSac: string;
  soKm: number;
  soCho: number;
  loaiXe: string;
  giaThueTheoNgay: number;
  giaThueTheoThang: number;
  trangThai: 'sanSang' | 'dangThue' | 'baoTri';
  moTa: string;
  hinhAnh: string[];
  danhGiaTrungBinh: number;
  soLuotThue: number;
  tienNghi: string[];
  dieuKhoanThue: string;
  idChuXe?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const xeChoThueSchema = new Schema<IXeChoThue>(
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
    dongXe: {
      type: String,
      required: [true, 'Vui lòng nhập dòng xe'],
      trim: true,
    },
    namSanXuat: {
      type: Number,
      required: [true, 'Vui lòng nhập năm sản xuất'],
    },
    bienSoXe: {
      type: String,
      required: [true, 'Vui lòng nhập biển số xe'],
      trim: true,
      unique: true,
    },
    mauSac: {
      type: String,
      required: [true, 'Vui lòng nhập màu sắc'],
      trim: true,
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
    giaThueTheoNgay: {
      type: Number,
      required: [true, 'Vui lòng nhập giá thuê theo ngày'],
      min: [0, 'Giá thuê phải lớn hơn 0'],
    },
    giaThueTheoThang: {
      type: Number,
      required: [true, 'Vui lòng nhập giá thuê theo tháng'],
      min: [0, 'Giá thuê phải lớn hơn 0'],
    },
    trangThai: {
      type: String,
      enum: ['sanSang', 'dangThue', 'baoTri'],
      default: 'sanSang',
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
    danhGiaTrungBinh: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    soLuotThue: {
      type: Number,
      default: 0,
      min: 0,
    },
    tienNghi: {
      type: [String],
      default: [],
    },
    dieuKhoanThue: {
      type: String,
      default: 'Khách hàng cần có GPLX hợp lệ. Đặt cọc 30% tổng giá trị thuê.',
    },
    idChuXe: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Index for search
xeChoThueSchema.index({ tenXe: 'text', hangXe: 'text', moTa: 'text' });

export default mongoose.model<IXeChoThue>('XeChoThue', xeChoThueSchema);

