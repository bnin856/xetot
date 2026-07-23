import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Xe } from '../../types';
import { xeService } from '../../services/xeService';
import { getImageUrl } from '../../utils/image';

const TimKiemXe: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    hangXe: '',
    giaTu: '',
    giaDen: '',
    namSanXuat: '',
    soCho: '',
    loaiXe: '',
    tinhTrangXe: '',
  });
  const [danhSachXe, setDanhSachXe] = useState<Xe[]>([]);
  const [sapXep, setSapXep] = useState('macDinh');
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  useEffect(() => {
    const fetchXe = async () => {
      setLoading(true);
      try {
        const searchQuery = searchParams.get('q') || '';
        const filterParams: any = {
          page: 1,
          limit: 12,
          trangThai: 'dangBan',
        };

        if (searchQuery) filterParams.search = searchQuery;
        if (filters.hangXe) filterParams.hangXe = filters.hangXe;
        if (filters.giaTu) filterParams.giaTu = parseInt(filters.giaTu);
        if (filters.giaDen) filterParams.giaDen = parseInt(filters.giaDen);
        if (filters.namSanXuat) filterParams.namSanXuat = parseInt(filters.namSanXuat);
        if (filters.soCho) filterParams.soCho = parseInt(filters.soCho);
        if (filters.tinhTrangXe) filterParams.tinhTrangXe = filters.tinhTrangXe;

        const response = await xeService.getAll(filterParams);
        if (response.success) {
          setDanhSachXe(response.data.xe);
          setTotal(response.data.pagination.total);
        }
      } catch (error) {
        console.error('Error fetching xe:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchXe();
  }, [searchParams, filters]);

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
          <option value="toyota">Toyota</option>
          <option value="honda">Honda</option>
          <option value="mazda">Mazda</option>
          <option value="hyundai">Hyundai</option>
          <option value="kia">Kia</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Khoảng giá</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Từ"
            value={filters.giaTu}
            onChange={(e) => setFilters({ ...filters, giaTu: e.target.value })}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Đến"
            value={filters.giaDen}
            onChange={(e) => setFilters({ ...filters, giaDen: e.target.value })}
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Năm sản xuất</label>
        <select
          value={filters.namSanXuat}
          onChange={(e) => setFilters({ ...filters, namSanXuat: e.target.value })}
          className="input-field"
        >
          <option value="">Tất cả</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
          <option value="2020">2020</option>
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
          <option value="16">16 chỗ</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Tình trạng xe</label>
        <select
          value={filters.tinhTrangXe}
          onChange={(e) => setFilters({ ...filters, tinhTrangXe: e.target.value })}
          className="input-field"
        >
          <option value="">Tất cả</option>
          <option value="xeCu">Xe cũ</option>
          <option value="xeMoi">Xe mới</option>
        </select>
      </div>

      <button className="w-full btn-primary">Áp dụng bộ lọc</button>
      <button
        onClick={() => setFilters({
          hangXe: '',
          giaTu: '',
          giaDen: '',
          namSanXuat: '',
          soCho: '',
          loaiXe: '',
          tinhTrangXe: '',
        })}
        className="w-full btn-secondary"
      >
        Xóa bộ lọc
      </button>
    </div>
  );

  return (
    <MainLayout>
      <div className="page-container py-8">
        <div className="container-custom">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary-600">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span>Tìm kiếm xe</span>
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

            {/* Main Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  Tìm thấy {total} kết quả phù hợp
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
                <div className="text-center py-12 text-gray-600">
                  <p>Không tìm thấy xe nào phù hợp</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {danhSachXe.map((xe, index) => (
                    <motion.div
                      key={xe.id}
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
                        <div className="text-sm text-gray-600 space-y-1 mb-4">
                          <p>Năm: {xe.namSanXuat} | Km: {new Intl.NumberFormat('vi-VN').format(xe.soKm)} km</p>
                          <p>{xe.hangXe}</p>
                        </div>
                        <Link
                          to={`/xe/${xe.id}`}
                          className="block text-center btn-primary text-sm"
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

export default TimKiemXe;
