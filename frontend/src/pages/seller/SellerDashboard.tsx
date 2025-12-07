import React, { useEffect, useState } from 'react';
import { Car, DollarSign, Eye, TrendingUp, Package, Plus } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import { motion } from 'framer-motion';
import { xeService } from '../../services/xeService';
import { donHangService } from '../../services/donHangService';
import walletService, { Wallet } from '../../services/walletService';
import { Link } from 'react-router-dom';

const SellerDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    xeDangBan: 0,
    xeDaBan: 0,
    tongDoanhThu: 0,
    donHangMoi: 0,
  });
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch wallet
      const walletRes = await walletService.getMyWallet();
      if (walletRes.success) {
        setWallet(walletRes.data.wallet);
      }

      // Fetch xe stats
      const xeRes = await xeService.getAll({ limit: 1000 });
      if (xeRes.success) {
        const xeDangBan = xeRes.data.xe.filter((x: any) => x.trangThai === 'dangBan').length;
        const xeDaBan = xeRes.data.xe.filter((x: any) => x.trangThai === 'daBan').length;
        
        setStats((prev) => ({
          ...prev,
          xeDangBan,
          xeDaBan,
        }));
      }

      // Fetch don hang stats
      const donHangRes = await donHangService.getAll({ limit: 1000 });
      if (donHangRes.success) {
        const tongDoanhThu = donHangRes.data.donHang
          .filter((d: any) => d.trangThai === 'daHoanThanh')
          .reduce((sum: number, d: any) => sum + (d.chiPhi?.giaXe || 0), 0);
        
        const donHangMoi = donHangRes.data.donHang.filter(
          (d: any) => d.trangThai === 'choNguoiBanXacNhan'
        ).length;

        setStats((prev) => ({
          ...prev,
          tongDoanhThu,
          donHangMoi,
        }));
      }
    } catch (error) {
      console.error('Error fetching seller data:', error);
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
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white py-12">
        <div className="container-custom max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Người Bán</h1>
            <p className="text-gray-600">Quản lý xe đăng bán và doanh thu</p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white"
            >
              <div className="flex items-center justify-between mb-4">
                <Car className="w-10 h-10" />
                <span className="text-3xl font-bold">{stats.xeDangBan}</span>
              </div>
              <p className="text-sm opacity-90">Xe đang bán</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-6 bg-gradient-to-br from-green-500 to-green-600 text-white"
            >
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-10 h-10" />
                <span className="text-3xl font-bold">{stats.xeDaBan}</span>
              </div>
              <p className="text-sm opacity-90">Xe đã bán</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white"
            >
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-10 h-10" />
                <span className="text-2xl font-bold">{formatPrice(stats.tongDoanhThu)}</span>
              </div>
              <p className="text-sm opacity-90">Tổng doanh thu</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white"
            >
              <div className="flex items-center justify-between mb-4">
                <Package className="w-10 h-10" />
                <span className="text-3xl font-bold">{stats.donHangMoi}</span>
              </div>
              <p className="text-sm opacity-90">Đơn hàng mới</p>
            </motion.div>
          </div>

          {/* Wallet & Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Wallet */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 card p-6 bg-gradient-to-br from-primary-600 to-primary-700 text-white"
            >
              <h3 className="text-xl font-bold mb-4">Ví của tôi</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm opacity-90 mb-1">Số dư khả dụng</p>
                  <p className="text-3xl font-bold">{wallet ? formatPrice(wallet.soDuKhaDung) : '0 ₫'}</p>
                </div>
                <div>
                  <p className="text-sm opacity-90 mb-1">Đang giữ</p>
                  <p className="text-2xl font-bold">{wallet ? formatPrice(wallet.soDuDangGiu) : '0 ₫'}</p>
                </div>
              </div>
              <Link
                to="/customer/vi"
                className="mt-4 inline-block bg-white text-primary-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Quản lý ví
              </Link>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card p-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Thao tác nhanh</h3>
              <div className="space-y-3">
                <Link
                  to="/admin/xe"
                  className="block w-full btn-primary text-center flex items-center justify-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Đăng xe mới</span>
                </Link>
                <Link
                  to="/admin/don-hang"
                  className="block w-full btn-secondary text-center flex items-center justify-center space-x-2"
                >
                  <Eye className="w-5 h-5" />
                  <span>Xem đơn hàng</span>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200"
          >
            <h3 className="text-lg font-bold text-amber-800 mb-2">💰 Chính sách phí sàn</h3>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Phí sàn <strong>1%</strong> được thu từ tiền cọc khi giao dịch thành công</li>
              <li>• Nếu khách hủy vô lý do, bạn nhận <strong>50%</strong> tiền cọc</li>
              <li>• Nếu xe sai mô tả, bạn sẽ <strong>không nhận tiền cọc</strong> và bị cảnh cáo</li>
              <li>• Tiền bán xe sẽ được chuyển vào ví sau khi giao dịch hoàn tất</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SellerDashboard;

