import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import { motion } from 'framer-motion';
import donThueXeService, { DonThueXe } from '../../services/donThueXeService';
import { getImageUrl } from '../../utils/image';

const QuanLyDonThueXe: React.FC = () => {
  const [donThueXe, setDonThueXe] = useState<DonThueXe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await donThueXeService.getOrdersForOwner();
      if (response.success) {
        setDonThueXe(response.data);
      }
    } catch (error) {
      console.error('Error fetching rental orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrangThaiBadge = (trangThai: string) => {
    const badges: Record<string, { text: string; color: string }> = {
      choXacNhan: { text: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
      daXacNhan: { text: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
      dangThue: { text: 'Đang thuê', color: 'bg-purple-100 text-purple-800' },
      daHoanThanh: { text: 'Hoàn thành', color: 'bg-green-100 text-green-800' },
      daHuy: { text: 'Đã hủy', color: 'bg-red-100 text-red-800' },
    };
    return badges[trangThai] || { text: trangThai, color: 'bg-gray-100 text-gray-800' };
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN').format(price) + ' ₫';

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-12">
        <div className="container-custom max-w-6xl">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Đơn thuê xe của tôi</h1>
            <p className="text-gray-600">Danh sách khách đã đặt thuê xe của bạn</p>
          </motion.div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã đơn</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Xe</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời gian thuê</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                      </td>
                    </tr>
                  ) : donThueXe.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        Chưa có ai đặt thuê xe của bạn
                      </td>
                    </tr>
                  ) : (
                    donThueXe.map((don) => {
                      const badge = getTrangThaiBadge(don.trangThai);
                      return (
                        <motion.tr key={don._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">#{don._id.slice(-6).toUpperCase()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              {don.idXeChoThue?.hinhAnh && don.idXeChoThue.hinhAnh.length > 0 && (
                                <img
                                  src={getImageUrl(don.idXeChoThue.hinhAnh[0])}
                                  alt={don.idXeChoThue.tenXe}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              )}
                              <span className="text-sm">{don.idXeChoThue?.tenXe || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div>{don.idKhachHang?.ten || 'N/A'}</div>
                            {don.idKhachHang?.sdt && <div className="text-xs text-gray-500">{don.idKhachHang.sdt}</div>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(don.ngayBatDau).toLocaleDateString('vi-VN')} - {new Date(don.ngayKetThuc).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary-600">
                            {formatPrice(don.tongTien)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>{badge.text}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <Link
                              to={`/customer/don-thue-xe/${don._id}`}
                              className="inline-flex text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
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
      </div>
    </MainLayout>
  );
};

export default QuanLyDonThueXe;
