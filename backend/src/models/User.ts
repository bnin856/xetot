import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  ten: string;
  email: string;
  password: string;
  sdt: string;
  diaChi?: string;
  vaiTro: 'admin' | 'customer';
  vaiTroPhu?: ('nguoiBan' | 'nguoiChoThue' | 'nhaProviderDichVu')[];
  xacThuc?: {
    daXacThuc: boolean;
    ngayXacThuc?: Date;
    loaiXacThuc: ('cmnd' | 'cccd' | 'giayToXe')[];
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    ten: {
      type: String,
      required: [true, 'Vui lòng nhập tên'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Vui lòng nhập email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ'],
    },
    password: {
      type: String,
      required: [true, 'Vui lòng nhập mật khẩu'],
      minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
      select: false,
    },
    sdt: {
      type: String,
      required: [true, 'Vui lòng nhập số điện thoại'],
      trim: true,
    },
    diaChi: {
      type: String,
      trim: true,
    },
    vaiTro: {
      type: String,
      enum: ['admin', 'customer'],
      default: 'customer',
    },
    vaiTroPhu: {
      type: [String],
      enum: ['nguoiBan', 'nguoiChoThue', 'nhaProviderDichVu'],
      default: [],
    },
    xacThuc: {
      daXacThuc: {
        type: Boolean,
        default: false,
      },
      ngayXacThuc: Date,
      loaiXacThuc: {
        type: [String],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);

