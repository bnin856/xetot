import api from './api';
import { Xe } from '../types';

export interface XeFilters {
  page?: number;
  limit?: number;
  search?: string;
  hangXe?: string;
  giaTu?: number;
  giaDen?: number;
  namSanXuat?: number;
  soCho?: number;
  trangThai?: string;
}

export interface XeResponse {
  success: boolean;
  data: {
    xe: Xe[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export const xeService = {
  getAll: async (filters: XeFilters = {}): Promise<XeResponse> => {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.hangXe) params.append('hangXe', filters.hangXe);
    if (filters.giaTu) params.append('giaTu', filters.giaTu.toString());
    if (filters.giaDen) params.append('giaDen', filters.giaDen.toString());
    if (filters.namSanXuat) params.append('namSanXuat', filters.namSanXuat.toString());
    if (filters.soCho) params.append('soCho', filters.soCho.toString());
    if (filters.trangThai) params.append('trangThai', filters.trangThai);

    const response = await api.get(`/xe?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<{ success: boolean; data: { xe: Xe } }> => {
    const response = await api.get(`/xe/${id}`);
    return response.data;
  },

  create: async (data: FormData): Promise<{ success: boolean; data: { xe: Xe } }> => {
    const response = await api.post('/xe', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: string, data: FormData): Promise<{ success: boolean; data: { xe: Xe } }> => {
    const response = await api.put(`/xe/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/xe/${id}`);
    return response.data;
  },
};

