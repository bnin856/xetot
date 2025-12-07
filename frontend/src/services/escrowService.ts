import api from './api';

export const escrowService = {
  // Xác nhận giao dịch thành công
  xacNhanThanhCong: async (orderId: string) => {
    const response = await api.post(`/escrow/${orderId}/xac-nhan-thanh-cong`);
    return response.data;
  },

  // Báo cáo xe sai mô tả
  baoCaoXeSai: async (orderId: string, lyDo: string, hinhAnhChungMinh?: File[]) => {
    let formData = new FormData();
    formData.append('lyDo', lyDo);
    
    if (hinhAnhChungMinh && hinhAnhChungMinh.length > 0) {
      hinhAnhChungMinh.forEach(file => {
        formData.append('hinhAnh', file);
      });
    }

    const response = await api.post(`/escrow/${orderId}/bao-cao-xe-sai`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Hủy vô lý do
  huyVoLyDo: async (orderId: string, lyDo: string, hinhAnhChungMinh?: File[]) => {
    let formData = new FormData();
    formData.append('lyDo', lyDo);
    
    if (hinhAnhChungMinh && hinhAnhChungMinh.length > 0) {
      hinhAnhChungMinh.forEach(file => {
        formData.append('hinhAnh', file);
      });
    }

    const response = await api.post(`/escrow/${orderId}/huy-vo-ly-do`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Admin: Xác nhận thanh toán cọc
  xacNhanCoc: async (orderId: string) => {
    const response = await api.post(`/escrow/${orderId}/xac-nhan-coc`);
    return response.data;
  },

  // Admin: Xử lý tranh chấp
  xuLyTranhChap: async (orderId: string, ketQua: 'hoantien' | 'tichthu' | 'chia', ghiChu: string) => {
    const response = await api.post(`/escrow/${orderId}/xu-ly-tranh-chap`, { ketQua, ghiChu });
    return response.data;
  },
};

export default escrowService;

