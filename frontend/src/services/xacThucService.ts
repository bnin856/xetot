import api from './api';

export interface XacThuc {
  _id: string;
  idNguoiDung: any;
  loaiGiayTo: 'cmnd' | 'cccd';
  hinhAnhMatTruoc: string;
  hinhAnhMatSau: string;
  hinhAnhGiayToXe: string[];
  trangThai: 'choXuLy' | 'daDuyet' | 'tuChoi';
  lyDoTuChoi?: string;
  ngayXuLy?: string;
  nguoiXuLy?: any;
  createdAt: string;
}

const xacThucService = {
  upload: async (formData: FormData): Promise<{ success: boolean; message: string; data: { xacThuc: XacThuc } }> => {
    const response = await api.post('/xac-thuc', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getMyStatus: async (): Promise<{ success: boolean; data: { xacThuc: XacThuc | null } }> => {
    const response = await api.get('/xac-thuc/my-status');
    return response.data;
  },

  // Admin endpoints
  getPending: async (trangThai?: string): Promise<{ success: boolean; data: { xacThucs: XacThuc[] } }> => {
    const response = await api.get('/xac-thuc/pending', {
      params: { trangThai },
    });
    return response.data;
  },

  approve: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.put(`/xac-thuc/${id}/approve`);
    return response.data;
  },

  reject: async (id: string, lyDoTuChoi: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.put(`/xac-thuc/${id}/reject`, { lyDoTuChoi });
    return response.data;
  },
};

export default xacThucService;

