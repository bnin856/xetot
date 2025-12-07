import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Clock, DollarSign, Star } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import { motion } from 'framer-motion';
import dichVuService from '../../services/dichVuService';

interface DichVu {
  id: string;
  tenDichVu: string;
  loaiDichVu: string;
  moTa: string;
  giaThamKhao: number;
  thoiGianThucHien: string;
  hinhAnh: string[];
  trangThai: string;
  danhGiaTrungBinh: number;
  soLuotDung: number;
}

const loaiDichVuMap: { [key: string]: string } = {
  suaChua: 'Sửa chữa',
  baoTri: 'Bảo trì',
  chamSoc: 'Chăm sóc',
  phuKien: 'Phụ kiện',
};

const DichVuPage: React.FC = () => {
  const [danhSachDichVu, setDanhSachDichVu] = useState<DichVu[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchDichVu = async () => {
      try {
        const response = await dichVuService.getAll({
          limit: 100,
          trangThai: 'hoatDong',
          loaiDichVu: filter || undefined,
        });
        if (response.success) {
          setDanhSachDichVu(response.data.dichVu);
        }
      } catch (error) {
        console.error('Error fetching dich vu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDichVu();
  }, [filter]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  const dichVuFiltered = filter
    ? danhSachDichVu.filter((dv) => dv.loaiDichVu === filter)
    : danhSachDichVu;

  return (
    <MainLayout>
      <div className="page-container py-8">
        {/* Hero Section */}
        <section className="container-custom mb-12">
          <div className="card p-12 text-center bg-gradient-to-r from-accent-600 to-accent-700 text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl font-bold mb-4">Dịch Vụ Xe Hơi</h1>
              <p className="text-xl text-accent-100 mb-6">
                Sửa chữa, bảo trì và chăm sóc xe chuyên nghiệp
              </p>
              <div className="flex justify-center items-center space-x-6 text-accent-100">
                <div className="flex items-center space-x-2">
                  <Wrench className="w-5 h-5" />
                  <span>Kỹ thuật viên giàu kinh nghiệm</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Giá cả minh bạch</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Nhanh chóng</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="container-custom">
          {/* Categories */}
          <div className="flex items-center space-x-4 mb-8 overflow-x-auto pb-4">
            <button
              onClick={() => setFilter('')}
              className={`px-6 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
                filter === ''
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-600'
              }`}
            >
              Tất cả
            </button>
            {Object.entries(loaiDichVuMap).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-6 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
                  filter === key
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-600'
                }`}
              >
                {value}
              </button>
            ))}
          </div>

          {/* Services List */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Danh sách dịch vụ</h2>
            <span className="text-gray-600">{dichVuFiltered.length} dịch vụ</span>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : dichVuFiltered.length === 0 ? (
            <div className="text-center py-12">
              <Wrench className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Chưa có dịch vụ</p>
              <p className="text-sm text-gray-500">Vui lòng quay lại sau</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dichVuFiltered.map((dichVu, index) => (
                <motion.div
                  key={dichVu.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card overflow-hidden"
                >
                  <div className="h-48 bg-gradient-to-br from-primary-100 to-accent-100 relative flex items-center justify-center">
                    <Wrench className="w-20 h-20 text-primary-600/20" />
                    <div className="absolute top-2 left-2 bg-white text-primary-600 px-3 py-1 rounded-full text-sm font-medium">
                      {loaiDichVuMap[dichVu.loaiDichVu]}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{dichVu.tenDichVu}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{dichVu.moTa}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{dichVu.thoiGianThucHien}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>{dichVu.danhGiaTrungBinh.toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="border-t pt-3 mb-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Giá tham khảo:</span>
                        <span className="font-bold text-accent-600">{formatPrice(dichVu.giaThamKhao)}</span>
                      </div>
                    </div>

                    <Link
                      to={`/dich-vu/${dichVu.id}`}
                      className="block w-full text-center btn-accent"
                    >
                      Đặt lịch
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default DichVuPage;

