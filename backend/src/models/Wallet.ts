import mongoose, { Document, Schema } from 'mongoose';

export interface IWallet extends Document {
  idNguoiDung: mongoose.Types.ObjectId;
  soDu: number;
  soDuKhaDung: number; // Số dư có thể rút (không bao gồm tiền đang giữ)
  soDuDangGiu: number; // Tiền đang bị giữ (escrow, pending)
  trangThai: 'hoatDong' | 'tạmKhoa' | 'daKhoa';
  loaiVi: 'nguoiMua' | 'nguoiBan' | 'nguoiChoThue' | 'nhaProviderDichVu';
  createdAt: Date;
  updatedAt: Date;
}

const walletSchema = new Schema<IWallet>(
  {
    idNguoiDung: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Vui lòng chọn người dùng'],
      unique: true,
    },
    soDu: {
      type: Number,
      default: 0,
      min: [0, 'Số dư không thể âm'],
    },
    soDuKhaDung: {
      type: Number,
      default: 0,
      min: [0, 'Số dư khả dụng không thể âm'],
    },
    soDuDangGiu: {
      type: Number,
      default: 0,
      min: [0, 'Số dư đang giữ không thể âm'],
    },
    trangThai: {
      type: String,
      enum: ['hoatDong', 'tamKhoa', 'daKhoa'],
      default: 'hoatDong',
    },
    loaiVi: {
      type: String,
      enum: ['nguoiMua', 'nguoiBan', 'nguoiChoThue', 'nhaProviderDichVu'],
      default: 'nguoiMua',
    },
  },
  {
    timestamps: true,
  }
);

// idNguoiDung đã có unique: true nên không cần index riêng

export default mongoose.model<IWallet>('Wallet', walletSchema);

