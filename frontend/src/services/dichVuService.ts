import api from './api';

export interface DichVuFilters {
  page?: number;
  limit?: number;
  search?: string;
  loaiDichVu?: string;
  trangThai?: string;
}

const dichVuService = {
  getAll: async (filters: DichVuFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.loaiDichVu) params.append('loaiDichVu', filters.loaiDichVu);
    if (filters.trangThai) params.append('trangThai', filters.trangThai);

    const response = await api.get(`/dich-vu?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/dich-vu/${id}`);
    return response.data;
  },

  create: async (data: FormData) => {
    const response = await api.post('/dich-vu', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: string, data: FormData) => {
    const response = await api.put(`/dich-vu/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/dich-vu/${id}`);
    return response.data;
  },
};

export default dichVuService;

