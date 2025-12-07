import api from './api';

export interface LichDatDichVu {
  _id: string;
  idDichVu: {
    _id: string;
    tenDichVu: string;
    loaiDichVu: string;
    giaThamKhao: number;
    hinhAnh: string[];
  };
  idKhachHang: {
    _id: string;
    ten: string;
    email: string;
    sdt: string;
  };
  idNguoiCungCap: {
    _id: string;
    ten: string;
    email: string;
    sdt: string;
  };
  ngayDat: string;
  gioDat: string;
  diaDiem: string;
  soDienThoai: string;
  ghiChu?: string;
  trangThai: 'choDuyet' | 'daDuyet' | 'daHuy' | 'daHoanThanh';
  lyDoHuy?: string;
  createdAt: string;
}

const lichDatDichVuService = {
  // Đặt lịch dịch vụ
  datLich: async (data: {
    idDichVu: string;
    ngayDat: string;
    gioDat: string;
    diaDiem: string;
    soDienThoai: string;
    ghiChu?: string;
  }): Promise<{ success: boolean; message: string; data: { lichDat: LichDatDichVu } }> => {
    const response = await api.post('/lich-dat-dich-vu', data);
    return response.data;
  },

  // Lấy lịch đặt của user
  getMySchedules: async (role: 'khachHang' | 'nguoiCungCap'): Promise<{
    success: boolean;
    data: { lichDat: LichDatDichVu[] };
  }> => {
    const response = await api.get('/lich-dat-dich-vu/my-schedules', {
      params: { role },
    });
    return response.data;
  },

  // Duyệt lịch (người cung cấp)
  approve: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch(`/lich-dat-dich-vu/${id}/approve`);
    return response.data;
  },

  // Hủy lịch
  cancel: async (id: string, lyDoHuy: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch(`/lich-dat-dich-vu/${id}/cancel`, { lyDoHuy });
    return response.data;
  },

  // Đánh dấu hoàn thành (người cung cấp)
  complete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch(`/lich-dat-dich-vu/${id}/complete`);
    return response.data;
  },
};

export default lichDatDichVuService;

