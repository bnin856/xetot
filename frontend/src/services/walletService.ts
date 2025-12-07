import api from './api';

export interface Wallet {
  _id: string;
  idNguoiDung: string;
  soDu: number;
  soDuKhaDung: number;
  soDuDangGiu: number;
  trangThai: 'hoatDong' | 'tamKhoa' | 'daKhoa';
  loaiVi: 'nguoiMua' | 'nguoiBan' | 'nguoiChoThue' | 'nhaProviderDichVu';
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  _id: string;
  idNguoiDung: string;
  idVi: string;
  loaiGiaoDich: string;
  soTien: number;
  soDuTruoc: number;
  soDuSau: number;
  trangThai: string;
  moTa: string;
  idLienQuan?: string;
  phuongThucThanhToan?: string;
  maGiaoDich?: string;
  ghiChu?: string;
  createdAt: string;
  updatedAt: string;
}

export const walletService = {
  // Lấy ví của tôi
  getMyWallet: async () => {
    const response = await api.get('/wallet/my-wallet');
    return response.data;
  },

  // Nạp tiền
  napTien: async (soTien: number, phuongThucThanhToan: string, maGiaoDich?: string) => {
    const response = await api.post('/wallet/nap-tien', {
      soTien,
      phuongThucThanhToan,
      maGiaoDich,
    });
    return response.data;
  },

  // Rút tiền
  rutTien: async (soTien: number, nganHang: string, soTaiKhoan: string, tenTaiKhoan: string) => {
    const response = await api.post('/wallet/rut-tien', {
      soTien,
      nganHang,
      soTaiKhoan,
      tenTaiKhoan,
    });
    return response.data;
  },

  // Lịch sử giao dịch
  getLichSuGiaoDich: async (page = 1, limit = 20, loaiGiaoDich?: string) => {
    const params: any = { page, limit };
    if (loaiGiaoDich) params.loaiGiaoDich = loaiGiaoDich;
    const response = await api.get('/wallet/lich-su', { params });
    return response.data;
  },
};

export default walletService;

