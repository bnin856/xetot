import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Wrench, Clock, DollarSign, Star, Calendar, MapPin, Phone, Heart, Share2 } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import dichVuService from '../../services/dichVuService';
import DatLichDichVuModal from '../../components/LichDatDichVu/DatLichDichVuModal';

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
  idNguoiCungCap?: string | {
    _id: string;
    ten?: string;
    email?: string;
    sdt?: string;
  };
  diaChi?: string;
  soDienThoai?: string;
}

const loaiDichVuMap: { [key: string]: string } = {
  suaChua: 'Sửa chữa',
  baoTri: 'Bảo trì',
  chamSoc: 'Chăm sóc',
  phuKien: 'Phụ kiện',
};

const ChiTietDichVu: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dichVu, setDichVu] = useState<DichVu | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDatLichModal, setShowDatLichModal] = useState(false);
  const [yeuThich, setYeuThich] = useState(false);

  useEffect(() => {
    fetchDichVu();
    if (id && user) {
      const favorites = JSON.parse(localStorage.getItem(`favorites_dichvu_${user.id}`) || '[]');
      setYeuThich(favorites.includes(id));
    }
  }, [id, user]);

  const fetchDichVu = async () => {
    if (!id) return;
    try {
      const response = await dichVuService.getById(id);
      if (response.success) {
        setDichVu(response.data.dichVu);
      }
    } catch (error) {
      console.error('Error fetching dich vu:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  const handleToggleFavorite = () => {
    if (!user) {
      navigate('/dang-nhap');
      return;
    }

    if (!id) return;

    const favorites = JSON.parse(localStorage.getItem(`favorites_dichvu_${user.id}`) || '[]');
    let newFavorites;

    if (favorites.includes(id)) {
      newFavorites = favorites.filter((fav: string) => fav !== id);
      setYeuThich(false);
    } else {
      newFavorites = [...favorites, id];
      setYeuThich(true);
    }

    localStorage.setItem(`favorites_dichvu_${user.id}`, JSON.stringify(newFavorites));
  };

  const handleShare = () => {
    if (!user) {
      navigate('/dang-nhap');
      return;
    }

    navigator.clipboard.writeText(window.location.href);
    alert('Đã sao chép link vào clipboard!');
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="page-container py-8">
          <div className="container-custom">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!dichVu) {
    return (
      <MainLayout>
        <div className="page-container py-8">
          <div className="container-custom">
            <div className="text-center py-12 text-gray-600">
              <p>Không tìm thấy dịch vụ</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const idNguoiCungCap = typeof dichVu.idNguoiCungCap === 'string' 
    ? dichVu.idNguoiCungCap 
    : dichVu.idNguoiCungCap?._id || '';

  return (
    <MainLayout>
      <div className="page-container py-8">
        <div className="container-custom">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary-600">Trang chủ</Link>
            <span className="mx-2">/</span>
            <Link to="/dich-vu" className="hover:text-primary-600">Dịch vụ</Link>
            <span className="mx-2">/</span>
            <span>Chi tiết dịch vụ</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card p-6 mb-4"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{dichVu.tenDichVu}</h1>
                    <div className="flex items-center gap-2">
                      <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm font-medium">
                        {loaiDichVuMap[dichVu.loaiDichVu]}
                      </span>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-gray-700 font-medium">{dichVu.danhGiaTrungBinh.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleToggleFavorite}
                      className={`p-3 rounded-lg ${
                        yeuThich ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                      } hover:bg-red-100 hover:text-red-600 transition-colors`}
                      title={user ? (yeuThich ? 'Bỏ yêu thích' : 'Thêm vào yêu thích') : 'Đăng nhập để yêu thích'}
                    >
                      <Heart className={`w-5 h-5 ${yeuThich ? 'fill-current' : ''}`} />
                    </button>
                    <button 
                      onClick={handleShare}
                      className="p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      title={user ? 'Chia sẻ' : 'Đăng nhập để chia sẻ'}
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h2 className="text-xl font-semibold mb-4">Mô tả dịch vụ</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">{dichVu.moTa}</p>
                </div>

                <div className="border-t pt-6 mt-6">
                  <h2 className="text-xl font-semibold mb-4">Thông tin dịch vụ</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">Thời gian: {dichVu.thoiGianThucHien}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">Giá: {formatPrice(dichVu.giaThamKhao)}</span>
                    </div>
                    {dichVu.diaChi && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">{dichVu.diaChi}</span>
                      </div>
                    )}
                    {dichVu.soDienThoai && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">{dichVu.soDienThoai}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card p-6 sticky top-24"
              >
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <p className="text-3xl font-bold text-primary-600 mb-2">
                      {formatPrice(dichVu.giaThamKhao)}
                    </p>
                    <p className="text-sm text-gray-600">Giá tham khảo</p>
                  </div>

                  {/* Contact */}
                  {dichVu.soDienThoai && (
                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-600 mb-2">Liên hệ</p>
                      <button 
                        onClick={() => {
                          if (!user) {
                            navigate('/dang-nhap');
                          } else {
                            window.location.href = `tel:${dichVu.soDienThoai}`;
                          }
                        }}
                        className="w-full btn-primary mb-2 flex items-center justify-center space-x-2"
                      >
                        <Phone className="w-5 h-5" />
                        <span>{user ? dichVu.soDienThoai : 'Xem số điện thoại'}</span>
                      </button>
                    </div>
                  )}


                  {/* Đặt lịch ngay Button */}
                  {user ? (
                    <button
                      onClick={() => {
                        if (!idNguoiCungCap) {
                          alert('Dịch vụ này chưa có người cung cấp');
                          return;
                        }
                        setShowDatLichModal(true);
                      }}
                      className="block w-full btn-primary text-center"
                    >
                      Đặt lịch ngay
                    </button>
                  ) : (
                    <Link
                      to="/dang-nhap"
                      className="block w-full btn-primary text-center"
                    >
                      Đăng nhập để đặt dịch vụ
                    </Link>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Dat Lich Modal */}
      {showDatLichModal && dichVu && (
        <DatLichDichVuModal
          idDichVu={dichVu.id}
          tenDichVu={dichVu.tenDichVu}
          onClose={() => setShowDatLichModal(false)}
        />
      )}


    </MainLayout>
  );
};

export default ChiTietDichVu;

