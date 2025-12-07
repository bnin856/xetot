import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Package, Eye, Calendar } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import { motion } from 'framer-motion';
import { donHangService } from '../../services/donHangService';
import donThueXeService, { DonThueXe } from '../../services/donThueXeService';
import { DonHang } from '../../types';

const LichSuDonHang: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [donHang, setDonHang] = useState<DonHang[]>([]);
  const [donThueXe, setDonThueXe] = useState<DonThueXe[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'mua' | 'thue'>(
    (searchParams.get('tab') as 'mua' | 'thue') || 'mua'
  );

  // Đọc tab từ URL khi component mount
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'thue' || tabParam === 'mua') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'mua') {
        const response = await donHangService.getMyOrders();
        if (response.success) {
          setDonHang(response.data.donHang);
        }
      } else {
        const response = await donThueXeService.getDonThueXeByUserId();
        if (response.success) {
          setDonThueXe(response.data);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrangThaiColor = (trangThai: string) => {
    const colors: Record<string, string> = {
      choNguoiBanXacNhan: 'bg-yellow-100 text-yellow-800',
      nguoiBanDaXacNhan: 'bg-blue-100 text-blue-800',
      choXacNhanThanhToan: 'bg-orange-100 text-orange-800',
      daThanhToan: 'bg-green-100 text-green-800',
      choThanhToan: 'bg-orange-100 text-orange-800',
      daThanhToanCoc: 'bg-cyan-100 text-cyan-800',
      dangGiao: 'bg-purple-100 text-purple-800',
      choKiemTra: 'bg-indigo-100 text-indigo-800',
      tranh_chap_xe_sai: 'bg-red-100 text-red-800',
      tranh_chap_khach_huy: 'bg-red-100 text-red-800',
      daHoanThanh: 'bg-green-100 text-green-800',
      daHuy: 'bg-gray-100 text-gray-800',
    };
    return colors[trangThai] || 'bg-gray-100 text-gray-800';
  };

  const getTrangThaiText = (trangThai: string) => {
    const texts: Record<string, string> = {
      choNguoiBanXacNhan: 'Chờ người bán xác nhận',
      nguoiBanDaXacNhan: 'Người bán đã xác nhận',
      choXacNhanThanhToan: 'Chờ xác nhận thanh toán',
      daThanhToan: 'Đã thanh toán',
      choThanhToan: 'Chờ thanh toán',
      daThanhToanCoc: 'Đã thanh toán cọc',
      dangGiao: 'Đang giao',
      choKiemTra: 'Chờ kiểm tra',
      tranh_chap_xe_sai: 'Tranh chấp: Xe sai',
      tranh_chap_khach_huy: 'Tranh chấp: Khách hủy',
      daHuy: 'Đã hủy',
      // Trạng thái đơn thuê xe
      choXacNhan: 'Chờ xác nhận',
      daXacNhan: 'Đã xác nhận',
      dangThue: 'Đang trong quá trình thuê',
      daHoanThanh: 'Hoàn thành',
    };
    return texts[trangThai] || trangThai;
  };

  const getTrangThaiColorThueXe = (trangThai: string) => {
    const colors: Record<string, string> = {
      choXacNhan: 'bg-yellow-100 text-yellow-800',
      daXacNhan: 'bg-green-100 text-green-800',
      dangThue: 'bg-blue-100 text-blue-800',
      daHoanThanh: 'bg-green-100 text-green-800',
      daHuy: 'bg-gray-100 text-gray-800',
    };
    return colors[trangThai] || 'bg-gray-100 text-gray-800';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  return (
    <MainLayout>
      <div className="page-container py-8">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-8">Lịch sử đơn hàng</h1>

          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('mua')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === 'mua'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Đơn mua xe
            </button>
            <button
              onClick={() => setActiveTab('thue')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === 'thue'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Đơn thuê xe
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : activeTab === 'mua' ? (
            donHang.length === 0 ? (
              <div className="card p-12 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Bạn chưa có đơn mua xe nào</p>
                <Link to="/tim-kiem" className="btn-primary inline-block mt-4">
                  Tìm kiếm xe ngay
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {donHang.map((don, index) => {
                const xe = typeof don.idXe === 'object' && don.idXe !== null ? don.idXe as any : null;
                return (
                  <motion.div
                    key={don.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                          {xe && xe.hinhAnh && xe.hinhAnh.length > 0 ? (
                            <img
                              src={`http://localhost:5000/${xe.hinhAnh[0]}`}
                              alt={xe.tenXe}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              No image
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">
                            {xe ? xe.tenXe : 'Đang tải...'}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{don.ngayDat ? new Date(don.ngayDat).toLocaleDateString('vi-VN') : new Date(don.createdAt).toLocaleDateString('vi-VN')}</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTrangThaiColor(don.trangThai)}`}>
                              {getTrangThaiText(don.trangThai)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Tổng tiền</p>
                          <p className="text-xl font-bold text-primary-600">{formatPrice(don.tongTien)}</p>
                        </div>
                        <Link
                          to={`/customer/don-hang/${don.id}`}
                          className="btn-secondary flex items-center space-x-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Xem chi tiết</span>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              </div>
            )
          ) : (
            donThueXe.length === 0 ? (
              <div className="card p-12 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Bạn chưa có đơn thuê xe nào</p>
                <Link to="/thue-xe" className="btn-primary inline-block mt-4">
                  Tìm xe cho thuê ngay
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {donThueXe.map((don, index) => (
                  <motion.div
                    key={don._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                          {don.idXeChoThue.hinhAnh && don.idXeChoThue.hinhAnh.length > 0 ? (
                            <img
                              src={`http://localhost:5000/${don.idXeChoThue.hinhAnh[0]}`}
                              alt={don.idXeChoThue.tenXe}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              No image
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">
                            {don.idXeChoThue.tenXe}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(don.ngayBatDau).toLocaleDateString('vi-VN')} - {new Date(don.ngayKetThuc).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTrangThaiColorThueXe(don.trangThai)}`}>
                              {getTrangThaiText(don.trangThai)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Tổng tiền</p>
                          <p className="text-xl font-bold text-primary-600">{formatPrice(don.tongTien)}</p>
                        </div>
                        <Link
                          to={`/customer/don-thue-xe/${don._id}`}
                          className="btn-secondary flex items-center space-x-2 whitespace-nowrap"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Xem chi tiết</span>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default LichSuDonHang;

