import React, { useEffect, useState } from 'react';
import { Car, ShoppingCart, Users, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import AdminLayout from '../../components/Layout/AdminLayout';
import { motion } from 'framer-motion';
import { baoCaoService } from '../../services/baoCaoService';

const TongQuan: React.FC = () => {
  const [stats, setStats] = useState({
    tongXe: 0,
    tongDonHang: 0,
    tongKhachHang: 0,
    tongDoanhThu: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await baoCaoService.getTongQuan();
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Error fetching bao cao:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatPrice = (price: number) => {
    if (price >= 1000000000) {
      return (price / 1000000000).toFixed(1) + ' tỷ';
    }
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  const statsData = [
    { label: 'Tổng số xe', value: stats.tongXe.toString(), icon: Car, color: 'bg-blue-500', change: '+12%', trend: 'up' },
    { label: 'Đơn hàng', value: stats.tongDonHang.toString(), icon: ShoppingCart, color: 'bg-green-500', change: '+8%', trend: 'up' },
    { label: 'Khách hàng', value: stats.tongKhachHang.toString(), icon: Users, color: 'bg-purple-500', change: '+15%', trend: 'up' },
    { label: 'Doanh thu', value: formatPrice(stats.tongDoanhThu), icon: DollarSign, color: 'bg-orange-500', change: '+23%', trend: 'up' },
  ];

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-8">Tổng quan</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center space-x-1 ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">{stat.change}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Đơn hàng gần đây</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center justify-between pb-4 border-b last:border-0">
                  <div>
                    <p className="font-medium">Đơn hàng #{item}</p>
                    <p className="text-sm text-gray-600">Toyota Vios 2023</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary-600">450,000,000 ₫</p>
                    <p className="text-xs text-gray-500">15/11/2025</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Xe mới đăng</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center space-x-4 pb-4 border-b last:border-0">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <p className="font-medium">Toyota Vios 2023</p>
                    <p className="text-sm text-gray-600">450,000,000 ₫</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Đang bán
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default TongQuan;

