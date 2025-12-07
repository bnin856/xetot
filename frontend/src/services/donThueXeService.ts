import api from './api';

export interface DonThueXeData {
  idXeChoThue: string;
  ngayBatDau: string;
  ngayKetThuc: string;
  tongTien: number;
  diaChiGiaoNhan: string;
  ghiChu?: string;
}

export interface DonThueXe {
  _id: string;
  idKhachHang: {
    _id: string;
    ten: string;
    email: string;
    sdt: string;
  };
  idXeChoThue: {
    _id: string;
    tenXe: string;
    hangXe: string;
    hinhAnh: string[];
  };
  ngayBatDau: string;
  ngayKetThuc: string;
  tongTien: number;
  phiSan?: number;
  trangThai: string;
  diaChiGiaoNhan: string;
  ghiChu?: string;
  createdAt: string;
  updatedAt: string;
}

const donThueXeService = {
  // Tạo đơn thuê xe
  createDonThueXe: async (data: DonThueXeData): Promise<DonThueXe> => {
    const response = await api.post('/don-thue-xe', data);
    return response.data.data;
  },

  // Lấy đơn thuê xe theo ID người dùng
  getDonThueXeByUserId: async (): Promise<{ success: boolean; data: DonThueXe[] }> => {
    const response = await api.get('/don-thue-xe/user');
    return response.data;
  },

  // Lấy tất cả đơn thuê xe (Admin only)
  getAll: async (): Promise<{ success: boolean; data: DonThueXe[] }> => {
    const response = await api.get('/don-thue-xe');
    return response.data;
  },

  // Lấy đơn thuê xe theo ID
  getDonThueXeById: async (id: string): Promise<DonThueXe> => {
    const response = await api.get(`/don-thue-xe/${id}`);
    return response.data.data;
  },

  // Cập nhật trạng thái đơn thuê xe
  updateTrangThai: async (id: string, trangThai: string): Promise<DonThueXe> => {
    const response = await api.patch(`/don-thue-xe/${id}/trang-thai`, { trangThai });
    return response.data.data;
  },

  // Hủy đơn thuê xe
  huyDonThueXe: async (id: string): Promise<void> => {
    await api.patch(`/don-thue-xe/${id}/huy`);
  },
};

export default donThueXeService;

