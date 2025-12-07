import mongoose, { Document, Schema } from 'mongoose';

export interface IXacThuc extends Document {
  idNguoiDung: mongoose.Types.ObjectId;
  loaiGiayTo: 'cmnd' | 'cccd';
  hinhAnhMatTruoc: string;
  hinhAnhMatSau: string;
  hinhAnhGiayToXe: string[]; // Cavet, đăng ký xe
  trangThai: 'choXuLy' | 'daDuyet' | 'tuChoi';
  lyDoTuChoi?: string;
  ngayXuLy?: Date;
  nguoiXuLy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const xacThucSchema = new Schema<IXacThuc>(
  {
    idNguoiDung: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Vui lòng chọn người dùng'],
    },
    loaiGiayTo: {
      type: String,
      enum: ['cmnd', 'cccd'],
      required: [true, 'Vui lòng chọn loại giấy tờ'],
    },
    hinhAnhMatTruoc: {
      type: String,
      required: [true, 'Vui lòng upload mặt trước'],
    },
    hinhAnhMatSau: {
      type: String,
      required: [true, 'Vui lòng upload mặt sau'],
    },
    hinhAnhGiayToXe: {
      type: [String],
      default: [],
    },
    trangThai: {
      type: String,
      enum: ['choXuLy', 'daDuyet', 'tuChoi'],
      default: 'choXuLy',
    },
    lyDoTuChoi: String,
    ngayXuLy: Date,
    nguoiXuLy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Index
xacThucSchema.index({ idNguoiDung: 1 });
xacThucSchema.index({ trangThai: 1, createdAt: -1 });

export default mongoose.model<IXacThuc>('XacThuc', xacThucSchema);

