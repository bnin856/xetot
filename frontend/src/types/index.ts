export interface User {
  id: string;
  ten: string;
  email: string;
  sdt: string;
  diaChi?: string;
  vaiTro: 'admin' | 'customer';
  vaiTroPhu?: ('nguoiBan' | 'nguoiChoThue' | 'nhaProviderDichVu')[];
  xacThuc?: {
    daXacThuc: boolean;
    ngayXacThuc?: string;
    loaiXacThuc: ('cmnd' | 'cccd' | 'giayToXe')[];
  };
}

export interface Xe {
  id: string;
  tenXe: string;
  hangXe: string;
  mauSac: string;
  namSanXuat: number;
  gia: number;
  soKm: number;
  soCho: number;
  loaiXe: string; // Sedan, SUV, etc.
  tinhTrangXe: 'xeMoi' | 'xeCu'; // Xe mới hay xe cũ
  trangThai: 'dangBan' | 'daBan' | 'dangCho';
  moTa: string;
  hinhAnh: string[];
  ngayDang: string;
  idChuXe?: string | { _id: string; ten?: string; email?: string; sdt?: string };
  hoaHong?: number;
}

export interface DonHang {
  _id?: string;
  id: string;
  idKhachHang: string;
  idXe: string;
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
  
  // Escrow
  tienCoc?: number;
  trangThaiCoc?: 'chuaThanhToan' | 'daThanhToan' | 'daHoan' | 'daTichThu';
  lyDoHuy?: string;
  nguoiHuy?: 'khachHang' | 'nguoiBan' | 'admin';
  
  // Chuyển khoản online (Escrow)
  bienLaiChuyenKhoan?: string;
  nguoiBanXacNhanGiaoXe?: boolean;
  khachXacNhanNhanXe?: boolean;
  idGiaoDichEscrow?: string;
  
  // Bank loan
  vayNganHang?: {
    tenNganHang: string;
    soTienVay: number;
    kyHan: number;
    laiSuat: number;
    traHangThang: number;
    phuongThucTra: 'traDeu' | 'traGiamDan';
  };
  
  // Chi phí
  chiPhi?: {
    giaXe: number;
    phiSan: number;
    thueTruocBa: number;
    phiDangKy: number;
    phiRaBien: number;
    baoHiem: number;
    phiVanChuyen: number;
  };
  
  // Timestamps
  ngayDat?: string;
  createdAt: string;
  updatedAt?: string;
  ngayXacNhan?: string;
  ngayThanhToan?: string;
  ngayGiaoHang?: string;
  ngayHoanThanh?: string;
}

export interface ThanhToan {
  id: string;
  idDonHang: string;
  soTien: number;
  ngayThanhToan: string;
  trangThai: 'choThanhToan' | 'daThanhToan' | 'daHuy';
  phuongThuc: string;
}

export interface DanhGia {
  id: string;
  idKhachHang: string;
  idXe: string;
  diem: number;
  noiDung: string;
  ngayDanhGia: string;
}

export interface KhuyenMai {
  id: string;
  ten: string;
  moTa: string;
  giamGia: number;
  ngayBatDau: string;
  ngayKetThuc: string;
  trangThai: 'dangHoatDong' | 'daKetThuc' | 'chuaBatDau';
}

export interface YeuCauBanXe {
  id: string;
  idKhachHang: string;
  thongTinXe: Partial<Xe>;
  giaYeuCau: number;
  hoaHong: number;
  trangThai: 'choDuyet' | 'daDuyet' | 'tuChoi';
  ngayYeuCau: string;
}

export interface ThongBao {
  id: string;
  tieuDe: string;
  noiDung: string;
  ngayGui: string;
  daDoc: boolean;
}

export interface HoTro {
  id: string;
  idKhachHang: string;
  tieuDe: string;
  noiDung: string;
  trangThai: 'mo' | 'dangXuLy' | 'daXuLy';
  ngayTao: string;
}

