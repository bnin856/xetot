import api from './api';

export interface LichXemXe {
  _id: string;
  idXe: any;
  idNguoiDat: any;
  idNguoiBan: any;
  ngayXem: string;
  gioXem: string;
  diaDiem: string;
  ghiChu?: string;
  soDienThoai: string;
  trangThai: 'choDuyet' | 'daDuyet' | 'daHuy' | 'daHoanThanh';
  lyDoHuy?: string;
  createdAt: string;
}

const lichXemXeService = {
  datLich: async (data: {
    idXe: string;
    ngayXem: string;
    gioXem: string;
    diaDiem: string;
    soDienThoai: string;
    ghiChu?: string;
  }): Promise<{ success: boolean; message: string; data: { lichXemXe: LichXemXe } }> => {
    const response = await api.post('/lich-xem-xe', data);
    return response.data;
  },

  getMySchedules: async (role?: 'nguoiDat' | 'nguoiBan'): Promise<{ success: boolean; data: { lichXemXe: LichXemXe[] } }> => {
    const response = await api.get('/lich-xem-xe/my-schedules', {
      params: { role },
    });
    return response.data;
  },

  approve: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.put(`/lich-xem-xe/${id}/approve`);
    return response.data;
  },

  cancel: async (id: string, lyDoHuy: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.put(`/lich-xem-xe/${id}/cancel`, { lyDoHuy });
    return response.data;
  },

  complete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.put(`/lich-xem-xe/${id}/complete`);
    return response.data;
  },
};

export default lichXemXeService;

