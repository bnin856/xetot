import React, { useEffect, useState } from 'react';
import { Car, DollarSign, Clock, Calendar, Plus, Eye } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import { motion } from 'framer-motion';
import xeChoThueService from '../../services/xeChoThueService';
import donThueXeService from '../../services/donThueXeService';
import walletService, { Wallet } from '../../services/walletService';
import { useAuth } from '../../contexts/AuthContext';
import { getImageUrl } from '../../utils/image';
import { Link } from 'react-router-dom';

const RentalDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    xeSanSang: 0,
    xeDangThue: 0,
    tongDoanhThu: 0,
    donThueThang: 0,
  });
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [xeTab, setXeTab] = useState<'sanSang' | 'dangThue'>('sanSang');
  const [myXe, setMyXe] = useState<any[]>([]);
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
      const xeList = await xeChoThueService.getAll({ idChuXe: user!.id, trangThai: xeTab, limit: 100 });
      setMyXe(xeList);
    } catch (error) {
      console.error('Error fetching my xe cho thue:', error);
    } finally {
      setMyXeLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const [walletRes, xeList, donThueRes] = await Promise.all([
        walletService.getMyWallet(),
        xeChoThueService.getAll({ limit: 1000, idChuXe: user!.id }),
        donThueXeService.getOrdersForOwner(),
      ]);

      if (walletRes.success) {
        setWallet(walletRes.data.wallet);
      }

      const xeSanSang = xeList.filter((x: any) => x.trangThai === 'sanSang').length;
      const xeDangThue = xeList.filter((x: any) => x.trangThai === 'dangThue').length;

      const now = new Date();
      const donThueList = donThueRes.success ? donThueRes.data : [];
      const donThueThang = donThueList.filter((d) => {
        const created = new Date(d.createdAt);
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
      }).length;
      const tongDoanhThu = donThueList
        .filter((d) => d.trangThai !== 'daHuy')
        .reduce((sum, d) => sum + d.tongTien, 0);

      setStats({ xeSanSang, xeDangThue, tongDoanhThu, donThueThang });
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
                <Link to="/dang-cho-thue-xe" className="w-full btn-primary flex items-center justify-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Đăng xe cho thuê</span>
                </Link>
                <Link to="/rental/don-thue" className="w-full btn-secondary flex items-center justify-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>Xem đơn thuê {stats.donThueThang > 0 && `(${stats.donThueThang} tháng này)`}</span>
                </Link>
                <Link to="/thue-xe" className="block w-full btn-secondary text-center">Xem tất cả xe</Link>
              </div>
            </motion.div>
          </div>

          {/* Xe của tôi */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="card p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Xe của tôi</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setXeTab('sanSang')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    xeTab === 'sanSang' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Sẵn sàng ({stats.xeSanSang})
                </button>
                <button
                  onClick={() => setXeTab('dangThue')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    xeTab === 'dangThue' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Đang cho thuê ({stats.xeDangThue})
                </button>
              </div>
            </div>

            {myXeLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : myXe.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                {xeTab === 'sanSang' ? 'Bạn chưa đăng xe cho thuê nào' : 'Không có xe nào đang cho thuê'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myXe.map((xe: any) => (
                  <div key={xe._id || xe.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                    <div className="w-full h-36 bg-gray-100">
                      {xe.hinhAnh && xe.hinhAnh.length > 0 ? (
                        <img src={getImageUrl(xe.hinhAnh[0])} alt={xe.tenXe} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
                      )}
                    </div>
                    <div className="p-3">
                      <h4 className="font-semibold text-gray-800 truncate">{xe.tenXe}</h4>
                      <p className="text-primary-600 font-bold">{formatPrice(xe.giaThueTheoNgay)}/ngày</p>
                      {xeTab === 'dangThue' ? (
                        <Link
                          to="/rental/don-thue"
                          className="mt-2 inline-flex items-center gap-1 text-xs text-gray-500 hover:text-green-600"
                        >
                          <Eye className="w-3 h-3" />
                          Xem đơn thuê
                        </Link>
                      ) : (
                        <Link
                          to={`/thue-xe/${xe._id || xe.id}`}
                          className="mt-2 inline-flex items-center gap-1 text-xs text-gray-500 hover:text-green-600"
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

