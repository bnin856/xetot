import mongoose, { Document, Schema } from 'mongoose';

export interface IDonHang extends Document {
  idKhachHang: mongoose.Types.ObjectId;
  idXe: mongoose.Types.ObjectId;
  tongTien: number;
  phuongThucThanhToan: 'tienMat' | 'chuyenKhoanOnline' | 'vayNganHang';
  trangThai: 
    | 'choNguoiBanXacNhan'
    | 'nguoiBanDaXacNhan'
    | 'choThanhToan'
    | 'choXacNhanThanhToan'
    | 'daThanhToan'
    | 'dangGiao' 
    | 'choKiemTra'
    | 'tranh_chap_xe_sai'
    | 'tranh_chap_khach_huy'
    | 'daHoanThanh' 
    | 'daHuy';
  diaChiGiao: string;
  ghiChu?: string;
  
  // Escrow & Payment details
  tienCoc?: number; // 2% cho gặp trực tiếp
  trangThaiCoc?: 'chuaThanhToan' | 'daThanhToan' | 'daHoan' | 'daTichThu';
  lyDoHuy?: string;
  nguoiHuy?: 'khachHang' | 'nguoiBan' | 'admin';
  hinhAnhChungMinh?: string[]; // Hình ảnh chứng minh khi báo cáo/hủy đơn
  
  // Chuyển khoản online (Escrow)
  bienLaiChuyenKhoan?: string; // Hình ảnh biên lai chuyển khoản
  nguoiBanXacNhanGiaoXe?: boolean; // Người bán xác nhận đã giao xe
  khachXacNhanNhanXe?: boolean; // Khách xác nhận đã nhận xe OK
  idGiaoDichEscrow?: string; // ID giao dịch trong ví escrow
  
  // Bank loan details
  vayNganHang?: {
    tenNganHang: string;
    soTienVay: number;
    kyHan: number; // tháng
    laiSuat: number;
    traHangThang: number;
    phuongThucTra: 'traDeu' | 'traGiamDan';
  };
  
  // Chi phí chi tiết
  chiPhi: {
    giaXe: number;
    phiSan: number; // 1%
    thueTruocBa: number; // 10%
    phiDangKy: number;
    phiRaBien: number;
    baoHiem: number;
    phiVanChuyen: number;
  };
  
  // Timestamps for tracking
  ngayDat: Date;
  ngayXacNhan?: Date;
  ngayThanhToan?: Date;
  ngayGiaoHang?: Date;
  ngayHoanThanh?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const donHangSchema = new Schema<IDonHang>(
  {
    idKhachHang: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Vui lòng chọn khách hàng'],
    },
    idXe: {
      type: Schema.Types.ObjectId,
      ref: 'Xe',
      required: [true, 'Vui lòng chọn xe'],
    },
    tongTien: {
      type: Number,
      required: [true, 'Vui lòng nhập tổng tiền'],
      min: [0, 'Tổng tiền phải lớn hơn 0'],
    },
    phuongThucThanhToan: {
      type: String,
      enum: ['tienMat', 'chuyenKhoanOnline', 'vayNganHang'],
      required: [true, 'Vui lòng chọn phương thức thanh toán'],
    },
    trangThai: {
      type: String,
      enum: [
        'choNguoiBanXacNhan',
        'nguoiBanDaXacNhan',
        'choThanhToan',
        'choXacNhanThanhToan',
        'daThanhToan',
        'dangGiao',
        'choKiemTra',
        'tranh_chap_xe_sai',
        'tranh_chap_khach_huy',
        'daHoanThanh',
        'daHuy',
      ],
      default: 'choNguoiBanXacNhan',
    },
    diaChiGiao: {
      type: String,
      required: [true, 'Vui lòng nhập địa chỉ giao hàng'],
      trim: true,
    },
    ghiChu: {
      type: String,
      trim: true,
    },
    
    // Escrow
    tienCoc: {
      type: Number,
      min: 0,
    },
    trangThaiCoc: {
      type: String,
      enum: ['chuaThanhToan', 'daThanhToan', 'daHoan', 'daTichThu'],
    },
    lyDoHuy: {
      type: String,
      trim: true,
    },
    nguoiHuy: {
      type: String,
      enum: ['khachHang', 'nguoiBan', 'admin'],
    },
    hinhAnhChungMinh: {
      type: [String],
      default: [],
    },
    bienLaiChuyenKhoan: {
      type: String,
    },
    nguoiBanXacNhanGiaoXe: {
      type: Boolean,
      default: false,
    },
    khachXacNhanNhanXe: {
      type: Boolean,
      default: false,
    },
    idGiaoDichEscrow: {
      type: String,
    },
    
    // Bank loan
    vayNganHang: {
      tenNganHang: String,
      soTienVay: Number,
      kyHan: Number,
      laiSuat: Number,
      traHangThang: Number,
      phuongThucTra: {
        type: String,
        enum: ['traDeu', 'traGiamDan'],
      },
    },
    
    // Chi phí
    chiPhi: {
      giaXe: { type: Number, required: true },
      phiSan: { type: Number, required: true },
      thueTruocBa: { type: Number, required: true },
      phiDangKy: { type: Number, required: true },
      phiRaBien: { type: Number, required: true },
      baoHiem: { type: Number, required: true },
      phiVanChuyen: { type: Number, required: true },
    },
    
    // Tracking dates
    ngayDat: {
      type: Date,
      default: Date.now,
    },
    ngayXacNhan: Date,
    ngayThanhToan: Date,
    ngayGiaoHang: Date,
    ngayHoanThanh: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IDonHang>('DonHang', donHangSchema);
