import React, { useEffect, useState } from 'react';
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import AdminLayout from '../../components/Layout/AdminLayout';
import { motion } from 'framer-motion';
import { donHangService } from '../../services/donHangService';
import { DonHang } from '../../types';

const QuanLyDonHang: React.FC = () => {
  const [donHang, setDonHang] = useState<DonHang[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonHang = async () => {
      try {
        const response = await donHangService.getAll({ limit: 100 });
        if (response.success) {
          setDonHang(response.data.donHang);
        }
      } catch (error) {
        console.error('Error fetching don hang:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonHang();
  }, []);

  const getTrangThaiBadge = (trangThai: string) => {
    const badges: Record<string, { text: string; color: string }> = {
      choXacNhan: { text: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
      daXacNhan: { text: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
      dangGiao: { text: 'Đang giao', color: 'bg-purple-100 text-purple-800' },
      daGiao: { text: 'Đã giao', color: 'bg-green-100 text-green-800' },
      daHuy: { text: 'Đã hủy', color: 'bg-red-100 text-red-800' },
    };
    return badges[trangThai] || { text: trangThai, color: 'bg-gray-100 text-gray-800' };
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-8">Quản lý đơn hàng</h1>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã đơn</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Xe</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày đặt</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    </td>
                  </tr>
                ) : donHang.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      Chưa có đơn hàng nào
                    </td>
                  </tr>
                ) : (
                  donHang.map((don) => {
                    const badge = getTrangThaiBadge(don.trangThai);
                    const khachHang = typeof don.idKhachHang === 'object' && don.idKhachHang !== null ? don.idKhachHang as any : null;
                    const xe = typeof don.idXe === 'object' && don.idXe !== null ? don.idXe as any : null;
                    return (
                      <motion.tr
                        key={don.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">#{don.id.slice(-6)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{khachHang ? khachHang.ten : 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{xe ? xe.tenXe : 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {don.ngayDat ? new Date(don.ngayDat).toLocaleDateString('vi-VN') : new Date(don.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary-600">
                        {formatPrice(don.tongTien)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                          {badge.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                          {don.trangThai === 'choNguoiBanXacNhan' && (
                            <>
                              <button className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default QuanLyDonHang;

