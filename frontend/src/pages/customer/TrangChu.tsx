import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Car, DollarSign, Key, Wrench, ChevronRight, PlusCircle, FileText } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import { motion } from 'framer-motion';
import { Xe } from '../../types';
import { xeService } from '../../services/xeService';
import { useAuth } from '../../contexts/AuthContext';
import HotSearchDropdown from '../../components/HotSearchDropdown';
import { getImageUrl } from '../../utils/image';

const TrangChu: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [danhSachXe, setDanhSachXe] = useState<Xe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHotSearch, setShowHotSearch] = useState(false);

  useEffect(() => {
    const fetchXe = async () => {
      try {
        const response = await xeService.getAll({ limit: 4, trangThai: 'dangBan' });
        if (response.success) {
          setDanhSachXe(response.data.xe);
        }
      } catch (error) {
        console.error('Error fetching xe:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchXe();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  return (
    <MainLayout>
      <div className="page-container">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Mua bán, cho thuê Oto cũ, mới giá rẻ, chính chủ
              </h1>
              <p className="text-xl mb-8 text-primary-100">
                Tìm kiếm xe ô tô phù hợp với nhu cầu của bạn
              </p>
              
              <div className="max-w-3xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setShowHotSearch(true)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        navigate(`/tim-kiem?q=${searchTerm}`);
                        setShowHotSearch(false);
                      }
                    }}
                    placeholder="Tìm kiếm xe theo tên, hãng, loại..."
                    className="w-full px-6 py-4 pl-14 pr-32 rounded-lg text-gray-800 text-lg focus:ring-4 focus:ring-primary-300 outline-none"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <button
                    onClick={() => {
                      navigate(`/tim-kiem?q=${searchTerm}`);
                      setShowHotSearch(false);
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary"
                  >
                    Tìm kiếm
                  </button>
                  
                  <HotSearchDropdown 
                    isOpen={showHotSearch}
                    onClose={() => setShowHotSearch(false)}
                    type="xe"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="container-custom py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/tim-kiem">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="card p-6 text-center cursor-pointer"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Mua Xe</h3>
                <p className="text-gray-600">Tìm xe mơ ước của bạn</p>
              </motion.div>
            </Link>

            <Link to="/thue-xe">
              <motion.div
                whileHover={{ scale:1.05 }}
                className="card p-6 text-center cursor-pointer"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Key className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Thuê Xe</h3>
                <p className="text-gray-600">Thuê xe tự lái với giá tốt nhất</p>
              </motion.div>
            </Link>

            <Link to="/dich-vu">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="card p-6 text-center cursor-pointer"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wrench className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Dịch Vụ</h3>
                <p className="text-gray-600">Sửa chữa & chăm sóc xe chuyên nghiệp</p>
              </motion.div>
            </Link>
          </div>
        </section>

        {/* Seller/Provider Registration Section */}
        {user && (
          <section className="container-custom py-12 border-t">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Bạn muốn kinh doanh?</h2>
              <p className="text-gray-600">Đăng ký để bán xe, cho thuê xe hoặc cung cấp dịch vụ</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link to="/dang-ban-xe">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="card p-6 text-center cursor-pointer border-2 border-transparent hover:border-primary-500"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PlusCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Đăng bán xe</h3>
                  <p className="text-gray-600 text-sm">Đăng tin bán xe của bạn để tiếp cận nhiều khách hàng hơn</p>
                </motion.div>
              </Link>

              <Link to="/dang-cho-thue-xe">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="card p-6 text-center cursor-pointer border-2 border-transparent hover:border-primary-500"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Car className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Đăng cho thuê xe</h3>
                  <p className="text-gray-600 text-sm">Cho thuê xe của bạn và tạo thu nhập thụ động</p>
                </motion.div>
              </Link>

              <Link to="/dang-ky-dich-vu">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="card p-6 text-center cursor-pointer border-2 border-transparent hover:border-primary-500"
                >
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Đăng ký dịch vụ</h3>
                  <p className="text-gray-600 text-sm">Cung cấp dịch vụ bảo dưỡng, sửa chữa xe chuyên nghiệp</p>
                </motion.div>
              </Link>
            </div>
          </section>
        )}

        {/* Featured Cars */}
        <section className="container-custom py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Xe nổi bật</h2>
            <Link
              to="/tim-kiem"
              className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              Xem tất cả
              <ChevronRight className="w-5 h-5 ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : danhSachXe.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              <p>Chưa có xe nào được đăng bán</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {danhSachXe.map((xe, index) => (
                <motion.div
                  key={xe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="card overflow-hidden"
                >
                  <div className="h-48 bg-gray-200 relative">
                    {xe.hinhAnh && xe.hinhAnh.length > 0 ? (
                      <img
                        src={getImageUrl(xe.hinhAnh[0])}
                        alt={xe.tenXe}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Chưa có ảnh
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {xe.trangThai === 'dangBan' ? 'Đang bán' : 'Đã bán'}
                    </div>
                    <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-medium ${
                      xe.tinhTrangXe === 'xeMoi' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-700 text-white'
                    }`}>
                      {xe.tinhTrangXe === 'xeMoi' ? '🆕 Xe mới' : 'Xe cũ'}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{xe.tenXe}</h3>
                    <p className="text-primary-600 font-bold text-xl mb-2">{formatPrice(xe.gia)}</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Năm: {xe.namSanXuat}</p>
                      <p>Km: {new Intl.NumberFormat('vi-VN').format(xe.soKm)} km</p>
                      <p>{xe.hangXe}</p>
                    </div>
                    <Link
                      to={`/xe/${xe.id}`}
                      className="block mt-4 text-center btn-primary text-sm"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
};

export default TrangChu;

