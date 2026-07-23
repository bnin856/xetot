import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Car, Calendar, DollarSign, Users, Search, SlidersHorizontal } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import xeChoThueService from '../../services/xeChoThueService';
import HotSearchDropdown from '../../components/HotSearchDropdown';
import { getImageUrl } from '../../utils/image';

interface XeChoThue {
  _id: string;
  tenXe: string;
  hangXe: string;
  namSanXuat: number;
  mauSac: string;
  soCho: number;
  soKm: number;
  loaiXe: string;
  giaThueTheoNgay: number;
  giaThueTheoThang: number;
  trangThai: string;
  moTa: string;
  hinhAnh: string[];
}

const ThueXe: React.FC = () => {
  const [danhSachXe, setDanhSachXe] = useState<XeChoThue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showHotSearch, setShowHotSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sapXep, setSapXep] = useState('macDinh');
  const [filters, setFilters] = useState({
    hangXe: '',
    loaiXe: '',
    soCho: '',
  });

  useEffect(() => {
    const fetchXe = async () => {
      try {
        const data = await xeChoThueService.getAll({
          limit: 100,
          trangThai: 'sanSang',
          search: searchTerm || undefined,
          hangXe: filters.hangXe || undefined,
          loaiXe: filters.loaiXe || undefined,
          soCho: filters.soCho ? parseInt(filters.soCho) : undefined,
        });
        setDanhSachXe(data || []);
      } catch (error) {
        console.error('Error fetching xe cho thue:', error);
        setDanhSachXe([]);
      } finally {
        setLoading(false);
      }
    };

    fetchXe();
  }, [filters, searchTerm]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  const FilterContent = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Hãng xe</label>
        <select
          value={filters.hangXe}
          onChange={(e) => setFilters({ ...filters, hangXe: e.target.value })}
          className="input-field"
        >
          <option value="">Tất cả</option>
          <option value="Toyota">Toyota</option>
          <option value="Honda">Honda</option>
          <option value="Ford">Ford</option>
          <option value="Mazda">Mazda</option>
          <option value="Mercedes-Benz">Mercedes-Benz</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Loại xe</label>
        <select
          value={filters.loaiXe}
          onChange={(e) => setFilters({ ...filters, loaiXe: e.target.value })}
          className="input-field"
        >
          <option value="">Tất cả</option>
          <option value="Sedan">Sedan</option>
          <option value="SUV">SUV</option>
          <option value="MPV">MPV</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Số chỗ</label>
        <select
          value={filters.soCho}
          onChange={(e) => setFilters({ ...filters, soCho: e.target.value })}
          className="input-field"
        >
          <option value="">Tất cả</option>
          <option value="4">4 chỗ</option>
          <option value="5">5 chỗ</option>
          <option value="7">7 chỗ</option>
        </select>
      </div>

      <button className="w-full btn-primary">Áp dụng bộ lọc</button>
      <button
        onClick={() => setFilters({ hangXe: '', loaiXe: '', soCho: '' })}
        className="w-full btn-secondary"
      >
        Xóa bộ lọc
      </button>
    </div>
  );

  return (
    <MainLayout>
      <div className="page-container py-8">
        {/* Hero Section */}
        <section className="container-custom mb-12">
          <div className="card p-12 text-center bg-gradient-to-r from-primary-600 to-primary-700 text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl font-bold mb-4">Thuê Xe Tự Lái</h1>
              <p className="text-xl text-primary-100 mb-6">
                Trải nghiệm lái xe sang trọng với giá tốt nhất
              </p>

              {/* Search Box */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setShowHotSearch(true)}
                    placeholder="Tìm kiếm xe cho thuê..."
                    className="w-full px-6 py-3 pl-12 pr-4 rounded-lg text-gray-800 focus:ring-4 focus:ring-white/30 outline-none"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  
                  <HotSearchDropdown 
                    isOpen={showHotSearch}
                    onClose={() => setShowHotSearch(false)}
                    type="xeChoThue"
                  />
                </div>
              </div>

              <div className="flex justify-center items-center space-x-6 text-primary-100">
                <div className="flex items-center space-x-2">
                  <Car className="w-5 h-5" />
                  <span>Xe chất lượng cao</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Giá cả hợp lý</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Đặt xe linh hoạt</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="container-custom">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary-600">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span>Thuê xe</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Filters */}
            <motion.aside
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="lg:w-64 flex-shrink-0"
            >
              <div className="card p-6 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Bộ lọc</h3>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden"
                  >
                    <SlidersHorizontal className="w-5 h-5" />
                  </button>
                </div>

                <div className="hidden lg:block">
                  <FilterContent />
                </div>

                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="lg:hidden"
                    >
                      <FilterContent />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.aside>

            {/* Cars List */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  Tìm thấy {danhSachXe.length} xe cho thuê phù hợp
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Sắp xếp:</span>
                  <select
                    value={sapXep}
                    onChange={(e) => setSapXep(e.target.value)}
                    className="input-field w-auto"
                  >
                    <option value="macDinh">Mặc định</option>
                    <option value="giaTang">Giá tăng dần</option>
                    <option value="giaGiam">Giá giảm dần</option>
                    <option value="moiNhat">Mới nhất</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                </div>
              ) : danhSachXe.length === 0 ? (
                <div className="text-center py-12">
                  <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Chưa có xe cho thuê</p>
                  <p className="text-sm text-gray-500">Vui lòng quay lại sau</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {danhSachXe.map((xe, index) => (
                    <motion.div
                      key={xe._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
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
                            <Car className="w-16 h-16" />
                          </div>
                        )}
                        <div className="absolute top-2 left-2 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {xe.trangThai === 'sanSang' ? 'Sẵn sàng' : 'Đang thuê'}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{xe.tenXe}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{xe.soCho} chỗ</span>
                          </div>
                          <span>•</span>
                          <span>{xe.loaiXe}</span>
                        </div>
                        <div className="border-t pt-3 mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Theo ngày:</span>
                            <span className="font-semibold text-primary-600">{formatPrice(xe.giaThueTheoNgay)}/ngày</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Theo tháng:</span>
                            <span className="font-semibold text-accent-600">{formatPrice(xe.giaThueTheoThang)}/tháng</span>
                          </div>
                        </div>
                        <Link
                          to={`/thue-xe/${xe._id}`}
                          className="block w-full text-center btn-primary"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ThueXe;

