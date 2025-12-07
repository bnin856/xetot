import api from './api';
import { User } from '../types';

export const khachHangService = {
  getAll: async (filters: { page?: number; limit?: number; search?: string } = {}): Promise<{
    success: boolean;
    data: {
      khachHang: User[];
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
    if (filters.search) params.append('search', filters.search);

    const response = await api.get(`/khach-hang?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<{ success: boolean; data: { user: User } }> => {
    const response = await api.get(`/khach-hang/${id}`);
    return response.data;
  },
};

