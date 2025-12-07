import api from './api';
import { YeuCauBanXe } from '../types';

export interface CreateYeuCauData {
  tenXe: string;
  hangXe: string;
  namSanXuat: number;
  soKm: number;
  mauSac: string;
  giaYeuCau: number;
  hoaHong: number;
  moTa?: string;
}

export const yeuCauBanXeService = {
  create: async (data: CreateYeuCauData): Promise<{ success: boolean; data: { yeuCau: YeuCauBanXe } }> => {
    const response = await api.post('/yeu-cau-ban-xe', data);
    return response.data;
  },

  getMyRequests: async (): Promise<{ success: boolean; data: { yeuCau: YeuCauBanXe[] } }> => {
    const response = await api.get('/yeu-cau-ban-xe/my-requests');
    return response.data;
  },

  getAll: async (): Promise<{ success: boolean; data: { yeuCau: YeuCauBanXe[] } }> => {
    const response = await api.get('/yeu-cau-ban-xe/all');
    return response.data;
  },

  duyet: async (id: string): Promise<{ success: boolean; data: { xe: any; yeuCau: YeuCauBanXe } }> => {
    const response = await api.put(`/yeu-cau-ban-xe/${id}/duyet`);
    return response.data;
  },
};

