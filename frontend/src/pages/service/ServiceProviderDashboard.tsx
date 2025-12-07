import React, { useEffect, useState } from 'react';
import { Wrench, DollarSign, Users, TrendingUp, Package, Plus } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import { motion } from 'framer-motion';
import walletService, { Wallet } from '../../services/walletService';
import { Link } from 'react-router-dom';

const ServiceProviderDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    dichVuHoatDong: 5,
    donDichVuMoi: 12,
    tongDoanhThu: 45000000,
    khachHangThanThiet: 23,
  });
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const walletRes = await walletService.getMyWallet();
      if (walletRes.success) {
        setWallet(walletRes.data.wallet);
      }
      // TODO: Fetch service stats
    } catch (error) {
      console.error('Error fetching service data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12">
        <div className="container-custom max-w-7xl">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Nhà Cung Cấp Dịch Vụ</h1>
            <p className="text-gray-600">Quản lý dịch vụ sửa chữa, bảo dưỡng xe</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <div className="flex items-center justify-between mb-4">
                <Wrench className="w-10 h-10" />
                <span className="text-3xl font-bold">{stats.dichVuHoatDong}</span>
              </div>
              <p className="text-sm opacity-90">Dịch vụ hoạt động</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between mb-4">
                <Package className="w-10 h-10" />
                <span className="text-3xl font-bold">{stats.donDichVuMoi}</span>
              </div>
              <p className="text-sm opacity-90">Đơn mới tháng này</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-10 h-10" />
                <span className="text-2xl font-bold">{formatPrice(stats.tongDoanhThu)}</span>
              </div>
              <p className="text-sm opacity-90">Doanh thu tháng này</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-10 h-10" />
                <span className="text-3xl font-bold">{stats.khachHangThanThiet}</span>
              </div>
              <p className="text-sm opacity-90">Khách hàng thân thiết</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2 card p-6 bg-gradient-to-br from-orange-600 to-orange-700 text-white">
              <h3 className="text-xl font-bold mb-4">Ví của tôi</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm opacity-90 mb-1">Số dư khả dụng</p>
                  <p className="text-3xl font-bold">{wallet ? formatPrice(wallet.soDuKhaDung) : '0 ₫'}</p>
                </div>
                <div>
                  <p className="text-sm opacity-90 mb-1">Tổng số dư</p>
                  <p className="text-2xl font-bold">{wallet ? formatPrice(wallet.soDu) : '0 ₫'}</p>
                </div>
              </div>
              <Link to="/customer/vi" className="mt-4 inline-block bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
                Quản lý ví
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Thao tác nhanh</h3>
              <div className="space-y-3">
                <button className="w-full btn-primary flex items-center justify-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Tạo dịch vụ mới</span>
                </button>
                <Link to="/dich-vu" className="block w-full btn-secondary text-center">Xem tất cả dịch vụ</Link>
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card p-6 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200">
            <h3 className="text-lg font-bold text-orange-800 mb-2">🔧 Chính sách dịch vụ</h3>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• Phí sàn <strong>3%</strong> trên mỗi đơn dịch vụ</li>
              <li>• Thanh toán sau khi dịch vụ hoàn tất</li>
              <li>• Hỗ trợ marketing miễn phí trên Xe Tốt</li>
              <li>• Bảo hành dịch vụ theo quy định</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ServiceProviderDashboard;

