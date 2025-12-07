import React, { useEffect, useState } from 'react';
import { Car, DollarSign, Clock, Calendar, TrendingUp, Plus } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import { motion } from 'framer-motion';
import xeChoThueService from '../../services/xeChoThueService';
import walletService, { Wallet } from '../../services/walletService';
import { Link } from 'react-router-dom';

const RentalDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    xeSanSang: 0,
    xeDangThue: 0,
    tongDoanhThu: 0,
    donThueThang: 0,
  });
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [walletRes, xeRes] = await Promise.all([
        walletService.getMyWallet(),
        xeChoThueService.getAll({ limit: 1000 }),
      ]);

      if (walletRes.success) {
        setWallet(walletRes.data.wallet);
      }

      if (xeRes.success) {
        const xeSanSang = xeRes.data.data.xe.filter((x: any) => x.trangThai === 'sanSang').length;
        const xeDangThue = xeRes.data.data.xe.filter((x: any) => x.trangThai === 'dangThue').length;
        
        setStats({
          xeSanSang,
          xeDangThue,
          tongDoanhThu: 0, // TODO: Fetch from don thue xe
          donThueThang: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching rental data:', error);
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-12">
        <div className="container-custom max-w-7xl">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Người Cho Thuê</h1>
            <p className="text-gray-600">Quản lý xe cho thuê và doanh thu</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between mb-4">
                <Car className="w-10 h-10" />
                <span className="text-3xl font-bold">{stats.xeSanSang}</span>
              </div>
              <p className="text-sm opacity-90">Xe sẵn sàng</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-10 h-10" />
                <span className="text-3xl font-bold">{stats.xeDangThue}</span>
              </div>
              <p className="text-sm opacity-90">Xe đang thuê</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-10 h-10" />
                <span className="text-2xl font-bold">{formatPrice(stats.tongDoanhThu)}</span>
              </div>
              <p className="text-sm opacity-90">Tổng doanh thu</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="w-10 h-10" />
                <span className="text-3xl font-bold">{stats.donThueThang}</span>
              </div>
              <p className="text-sm opacity-90">Đơn thuê tháng này</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2 card p-6 bg-gradient-to-br from-green-600 to-green-700 text-white">
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
              <Link to="/customer/vi" className="mt-4 inline-block bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
                Quản lý ví
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Thao tác nhanh</h3>
              <div className="space-y-3">
                <button className="w-full btn-primary flex items-center justify-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Đăng xe cho thuê</span>
                </button>
                <Link to="/thue-xe" className="block w-full btn-secondary text-center">Xem tất cả xe</Link>
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
            <h3 className="text-lg font-bold text-green-800 mb-2">🚗 Chính sách cho thuê</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Phí sàn <strong>5%</strong> trên mỗi đơn thuê</li>
              <li>• Tiền cọc <strong>20%</strong> giá trị đơn hàng</li>
              <li>• Thanh toán sau mỗi chuyến thuê hoàn tất</li>
              <li>• Bảo hiểm xe được Xe Tốt hỗ trợ</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RentalDashboard;

