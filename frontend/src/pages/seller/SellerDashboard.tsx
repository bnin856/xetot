import React, { useEffect, useState } from 'react';
import { Car, DollarSign, Eye, TrendingUp, Package, Plus, History } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import { motion } from 'framer-motion';
import { xeService } from '../../services/xeService';
import { donHangService } from '../../services/donHangService';
import walletService, { Wallet } from '../../services/walletService';
import { useAuth } from '../../contexts/AuthContext';
import { Xe } from '../../types';
import { getImageUrl } from '../../utils/image';
import { Link } from 'react-router-dom';

const SellerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    xeDangBan: 0,
    xeDaBan: 0,
    tongDoanhThu: 0,
    donHangMoi: 0,
  });
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [xeTab, setXeTab] = useState<'dangBan' | 'daBan'>('dangBan');
  const [myXe, setMyXe] = useState<Xe[]>([]);
  const [myXeLoading, setMyXeLoading] = useState(true);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  useEffect(() => {
    if (user) fetchMyXe();
  }, [user, xeTab]);

  const fetchMyXe = async () => {
    setMyXeLoading(true);
    try {
      const res = await xeService.getAll({ idChuXe: user!.id, trangThai: xeTab, limit: 100 });
      if (res.success) setMyXe(res.data.xe);
    } catch (error) {
      console.error('Error fetching my xe:', error);
    } finally {
      setMyXeLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      // Fetch wallet
      const walletRes = await walletService.getMyWallet();
      if (walletRes.success) {
        setWallet(walletRes.data.wallet);
      }

      // Fetch xe stats (chỉ xe của tôi)
      const xeRes = await xeService.getAll({ limit: 1000, idChuXe: user!.id });
      if (xeRes.success) {
        const xeDangBan = xeRes.data.xe.filter((x: any) => x.trangThai === 'dangBan').length;
        const xeDaBan = xeRes.data.xe.filter((x: any) => x.trangThai === 'daBan').length;
        
        setStats((prev) => ({
          ...prev,
          xeDangBan,
          xeDaBan,
        }));
      }

      // Fetch don hang stats (đơn hàng của các xe tôi đăng bán)
      const donHangRes = await donHangService.getOrdersForSeller();
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
                  to="/dang-ban-xe"
                  className="block w-full btn-primary text-center flex items-center justify-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Đăng xe mới</span>
                </Link>
                <Link
                  to="/seller/don-hang"
                  className="block w-full btn-secondary text-center flex items-center justify-center space-x-2"
                >
                  <Eye className="w-5 h-5" />
                  <span>Xem đơn hàng {stats.donHangMoi > 0 && `(${stats.donHangMoi} mới)`}</span>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Xe của tôi */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="card p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Xe của tôi</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setXeTab('dangBan')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    xeTab === 'dangBan' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Đang bán ({stats.xeDangBan})
                </button>
                <button
                  onClick={() => setXeTab('daBan')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    xeTab === 'daBan' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Đã bán ({stats.xeDaBan})
                </button>
              </div>
            </div>

            {myXeLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : myXe.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                {xeTab === 'dangBan' ? 'Bạn chưa đăng bán xe nào' : 'Chưa có xe nào đã bán'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myXe.map((xe) => (
                  <div key={xe.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                    <div className="w-full h-36 bg-gray-100">
                      {xe.hinhAnh && xe.hinhAnh.length > 0 ? (
                        <img src={getImageUrl(xe.hinhAnh[0])} alt={xe.tenXe} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
                      )}
                    </div>
                    <div className="p-3">
                      <h4 className="font-semibold text-gray-800 truncate">{xe.tenXe}</h4>
                      <p className="text-primary-600 font-bold">{formatPrice(xe.gia)}</p>
                      {xeTab === 'daBan' ? (
                        <Link
                          to="/customer/lich-su-giao-dich"
                          className="mt-2 inline-flex items-center gap-1 text-xs text-gray-500 hover:text-primary-600"
                        >
                          <History className="w-3 h-3" />
                          Xem giao dịch
                        </Link>
                      ) : (
                        <Link
                          to={`/xe/${xe.id}`}
                          className="mt-2 inline-flex items-center gap-1 text-xs text-gray-500 hover:text-primary-600"
                        >
                          <Eye className="w-3 h-3" />
                          Xem tin đăng
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

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

