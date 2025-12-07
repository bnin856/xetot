import api from './api';
import { DonHang } from '../types';

export interface CreateDonHangData {
  idXe: string;
  phuongThucThanhToan: string;
  diaChiGiao: string;
  ghiChu?: string;
}

export const donHangService = {
  create: async (data: CreateDonHangData): Promise<{ success: boolean; data: { donHang: DonHang } }> => {
    const response = await api.post('/don-hang', data);
    return response.data;
  },

  getMyOrders: async (): Promise<{ success: boolean; data: { donHang: DonHang[] } }> => {
    const response = await api.get('/don-hang/my-orders');
    return response.data;
  },

  getAll: async (filters: { page?: number; limit?: number; trangThai?: string } = {}): Promise<{
    success: boolean;
    data: {
      donHang: DonHang[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    };
  }> => {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.trangThai) params.append('trangThai', filters.trangThai);

    const response = await api.get(`/don-hang/all?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<{ success: boolean; data: { donHang: DonHang } }> => {
    const response = await api.get(`/don-hang/${id}`);
    return response.data;
  },

  updateTrangThai: async (
    id: string,
    trangThai: string
  ): Promise<{ success: boolean; data: { donHang: DonHang } }> => {
    const response = await api.put(`/don-hang/${id}/trang-thai`, { trangThai });
    return response.data;
  },

  uploadBienLai: async (
    id: string,
    formData: FormData
  ): Promise<{ success: boolean; data: { donHang: DonHang } }> => {
    const response = await api.post(`/don-hang/${id}/upload-bien-lai`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  nguoiBanXacNhan: async (
    id: string
  ): Promise<{ success: boolean; data: { donHang: DonHang } }> => {
    const response = await api.post(`/don-hang/${id}/nguoi-ban-xac-nhan`);
    return response.data;
  },

  khachXacNhan: async (
    id: string
  ): Promise<{ success: boolean; data: { donHang: DonHang } }> => {
    const response = await api.post(`/don-hang/${id}/khach-xac-nhan`);
    return response.data;
  },
};

