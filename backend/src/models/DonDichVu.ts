import mongoose, { Document, Schema } from 'mongoose';

export interface IDonDichVu extends Document {
  idKhachHang: mongoose.Types.ObjectId;
  idDichVu: mongoose.Types.ObjectId;
  ngayDat: Date;
  ngayThucHien?: Date;
  bienSoXe: string;
  moTaVanDe: string;
  tongTien: number;
  trangThai: 'choDuyet' | 'daDuyet' | 'dangThucHien' | 'daHoanThanh' | 'daHuy';
  ghiChu?: string;
  createdAt: Date;
  updatedAt: Date;
}

const donDichVuSchema = new Schema<IDonDichVu>(
  {
    idKhachHang: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Vui lòng chọn khách hàng'],
    },
    idDichVu: {
      type: Schema.Types.ObjectId,
      ref: 'DichVu',
      required: [true, 'Vui lòng chọn dịch vụ'],
    },
    ngayDat: {
      type: Date,
      default: Date.now,
    },
    ngayThucHien: {
      type: Date,
    },
    bienSoXe: {
      type: String,
      required: [true, 'Vui lòng nhập biển số xe'],
      trim: true,
    },
    moTaVanDe: {
      type: String,
      required: [true, 'Vui lòng mô tả vấn đề'],
      trim: true,
    },
    tongTien: {
      type: Number,
      required: [true, 'Vui lòng nhập tổng tiền'],
      min: [0, 'Tổng tiền phải lớn hơn 0'],
    },
    trangThai: {
      type: String,
      enum: ['choDuyet', 'daDuyet', 'dangThucHien', 'daHoanThanh', 'daHuy'],
      default: 'choDuyet',
    },
    ghiChu: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IDonDichVu>('DonDichVu', donDichVuSchema);

