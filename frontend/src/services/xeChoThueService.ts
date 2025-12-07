import api from './api';

export interface XeChoThueFilters {
  page?: number;
  limit?: number;
  search?: string;
  hangXe?: string;
  loaiXe?: string;
  soCho?: number;
  trangThai?: string;
}

const xeChoThueService = {
  getAll: async (filters: XeChoThueFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.hangXe) params.append('hangXe', filters.hangXe);
    if (filters.loaiXe) params.append('loaiXe', filters.loaiXe);
    if (filters.soCho) params.append('soCho', filters.soCho.toString());
    if (filters.trangThai) params.append('trangThai', filters.trangThai);

    const response = await api.get(`/xe-cho-thue?${params.toString()}`);
    return response.data.data.xe || [];
  },

  getById: async (id: string) => {
    const response = await api.get(`/xe-cho-thue/${id}`);
    return response.data.data.xe;
  },

  create: async (data: FormData) => {
    const response = await api.post('/xe-cho-thue', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: string, data: FormData) => {
    const response = await api.put(`/xe-cho-thue/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/xe-cho-thue/${id}`);
    return response.data;
  },
};

export default xeChoThueService;

