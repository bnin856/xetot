import mongoose, { Document, Schema } from 'mongoose';

export interface IDichVu extends Document {
  tenDichVu: string;
  loaiDichVu: 'suaChua' | 'baoTri' | 'chamSoc' | 'phuKien';
  moTa: string;
  giaThamKhao: number;
  thoiGianThucHien: string;
  hinhAnh: string[];
  trangThai: 'hoatDong' | 'tamNgung';
  danhGiaTrungBinh: number;
  soLuotDung: number;
  idNguoiCungCap?: mongoose.Types.ObjectId;
  diaChi?: string;
  soDienThoai?: string;
  createdAt: Date;
  updatedAt: Date;
}

const dichVuSchema = new Schema<IDichVu>(
  {
    tenDichVu: {
      type: String,
      required: [true, 'Vui lòng nhập tên dịch vụ'],
      trim: true,
    },
    loaiDichVu: {
      type: String,
      enum: ['suaChua', 'baoTri', 'chamSoc', 'phuKien'],
      required: [true, 'Vui lòng chọn loại dịch vụ'],
    },
    moTa: {
      type: String,
      required: [true, 'Vui lòng nhập mô tả dịch vụ'],
      trim: true,
    },
    giaThamKhao: {
      type: Number,
      required: [true, 'Vui lòng nhập giá tham khảo'],
      min: [0, 'Giá phải lớn hơn 0'],
    },
    thoiGianThucHien: {
      type: String,
      required: [true, 'Vui lòng nhập thời gian thực hiện'],
      default: '1-2 giờ',
    },
    hinhAnh: {
      type: [String],
      default: [],
    },
    trangThai: {
      type: String,
      enum: ['hoatDong', 'tamNgung'],
      default: 'hoatDong',
    },
    danhGiaTrungBinh: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    soLuotDung: {
      type: Number,
      default: 0,
      min: 0,
    },
    idNguoiCungCap: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    diaChi: {
      type: String,
      trim: true,
    },
    soDienThoai: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search
dichVuSchema.index({ tenDichVu: 'text', moTa: 'text' });

export default mongoose.model<IDichVu>('DichVu', dichVuSchema);

