import api from './api';

export const baoCaoService = {
  getTongQuan: async (): Promise<{
    success: boolean;
    data: {
      tongXe: number;
      tongDonHang: number;
      tongKhachHang: number;
      tongDoanhThu: number;
    };
  }> => {
    const response = await api.get('/bao-cao/tong-quan');
    return response.data;
  },
};

