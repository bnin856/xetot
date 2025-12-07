import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  idNguoiDung: mongoose.Types.ObjectId;
  idVi: mongoose.Types.ObjectId;
  loaiGiaoDich: 
    | 'napTien' 
    | 'rutTien' 
    | 'datCoc' 
    | 'hoanCoc' 
    | 'tichThuCoc'
    | 'nhanTien'
    | 'chuyenTien'
    | 'phiSan'
    | 'thanhToanThueXe';
  soTien: number;
  soDuTruoc: number;
  soDuSau: number;
  trangThai: 'choXuLy' | 'thanhCong' | 'thatBai' | 'daHuy';
  moTa: string;
  idLienQuan?: mongoose.Types.ObjectId; // ID đơn hàng hoặc giao dịch liên quan
  phuongThucThanhToan?: string; // VNPay, Momo, Bank Transfer, etc.
  maGiaoDich?: string; // Mã giao dịch từ payment gateway
  ghiChu?: string;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    idNguoiDung: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Vui lòng chọn người dùng'],
    },
    idVi: {
      type: Schema.Types.ObjectId,
      ref: 'Wallet',
      required: [true, 'Vui lòng chọn ví'],
    },
    loaiGiaoDich: {
      type: String,
      enum: ['napTien', 'rutTien', 'datCoc', 'hoanCoc', 'tichThuCoc', 'nhanTien', 'chuyenTien', 'phiSan', 'thanhToanThueXe'],
      required: [true, 'Vui lòng chọn loại giao dịch'],
    },
    soTien: {
      type: Number,
      required: [true, 'Vui lòng nhập số tiền'],
      min: [0, 'Số tiền phải lớn hơn 0'],
    },
    soDuTruoc: {
      type: Number,
      required: true,
    },
    soDuSau: {
      type: Number,
      required: true,
    },
    trangThai: {
      type: String,
      enum: ['choXuLy', 'thanhCong', 'thatBai', 'daHuy'],
      default: 'choXuLy',
    },
    moTa: {
      type: String,
      required: [true, 'Vui lòng nhập mô tả'],
      trim: true,
    },
    idLienQuan: {
      type: Schema.Types.ObjectId,
    },
    phuongThucThanhToan: {
      type: String,
      trim: true,
    },
    maGiaoDich: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
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

// Indexes
transactionSchema.index({ idNguoiDung: 1, createdAt: -1 });
transactionSchema.index({ idVi: 1, createdAt: -1 });
transactionSchema.index({ maGiaoDich: 1 });

export default mongoose.model<ITransaction>('Transaction', transactionSchema);

