import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Share2, Phone, MessageCircle, Calendar, MapPin, ShoppingCart, X, Car, Users, Gauge, Palette, Sparkles, ArrowLeft } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import MainLayout from '../../components/Layout/MainLayout';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { xeService } from '../../services/xeService';
import { Xe } from '../../types';
import ChatModal from '../../components/Chat/ChatModal';
import DatLichModal from '../../components/LichXemXe/DatLichModal';
import { getImageUrl } from '../../utils/image';

const ChiTietXe: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hinhAnhChon, setHinhAnhChon] = useState(0);
  const [yeuThich, setYeuThich] = useState(false);
  const [xe, setXe] = useState<Xe | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDatLichModal, setShowDatLichModal] = useState(false);
  const [showDatMuaModal, setShowDatMuaModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  // Check if xe is in favorites
  useEffect(() => {
    if (id && user) {
      const favorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]');
      setYeuThich(favorites.includes(id));
    }
  }, [id, user]);

  useEffect(() => {
    const fetchXe = async () => {
      if (!id) return;
      try {
        const response = await xeService.getById(id);
        if (response.success) {
          setXe(response.data.xe);
        }
      } catch (error) {
        console.error('Error fetching xe:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchXe();
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  const handleToggleFavorite = () => {
    if (!user) {
      navigate('/dang-nhap');
      return;
    }

    if (!id) return;

    const favorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]');
    let newFavorites;

    if (favorites.includes(id)) {
      newFavorites = favorites.filter((fav: string) => fav !== id);
      setYeuThich(false);
    } else {
      newFavorites = [...favorites, id];
      setYeuThich(true);
    }

    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
  };

  const handleShare = () => {
    if (!user) {
      navigate('/dang-nhap');
      return;
    }

    // Copy link to clipboard
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

  if (!xe) {
    return (
      <MainLayout>
        <div className="container-custom py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy xe</h2>
            <Link to="/tim-kiem" className="btn-primary inline-flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const idChuXeStr = typeof xe.idChuXe === 'string' ? xe.idChuXe : xe.idChuXe?._id;
  const tenChuXe = typeof xe.idChuXe === 'string' ? undefined : xe.idChuXe?.ten;
  const laChuXe = !!user && !!idChuXeStr && idChuXeStr === user.id;

  const trangThaiText: Record<Xe['trangThai'], { text: string; color: string }> = {
    dangBan: { text: 'Đang bán', color: 'text-green-600 bg-green-100' },
    daBan: { text: 'Đã bán', color: 'text-gray-600 bg-gray-100' },
    dangCho: { text: 'Chờ duyệt', color: 'text-yellow-600 bg-yellow-100' },
  };

  return (
    <MainLayout>
      <div className="page-container py-8">
        <div className="container-custom">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm mb-6">
            <Link to="/" className="text-gray-600 hover:text-primary-600">
              Trang chủ
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/tim-kiem" className="text-gray-600 hover:text-primary-600">
              Tìm kiếm
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-primary-600 font-medium">{xe.tenXe}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Image */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card overflow-hidden mb-4"
              >
                <div className="relative aspect-video bg-gray-100">
                  {xe.hinhAnh && xe.hinhAnh.length > 0 ? (
                    <img
                      src={getImageUrl(xe.hinhAnh[hinhAnhChon])}
                      alt={xe.tenXe}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Chưa có ảnh
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${trangThaiText[xe.trangThai].color}`}>
                      {trangThaiText[xe.trangThai].text}
                    </span>
                  </div>
                  <button
                    onClick={handleToggleFavorite}
                    className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-all shadow-lg"
                    title={user ? (yeuThich ? 'Bỏ yêu thích' : 'Thêm vào yêu thích') : 'Đăng nhập để yêu thích'}
                  >
                    <Heart className={`w-5 h-5 ${yeuThich ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </button>
                </div>
                {xe.hinhAnh && xe.hinhAnh.length > 1 && (
                  <div className="flex space-x-2 p-4 overflow-x-auto">
                    {xe.hinhAnh.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setHinhAnhChon(idx)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          hinhAnhChon === idx ? 'border-primary-600' : 'border-gray-200 hover:border-primary-300'
                        }`}
                      >
                        <img
                          src={getImageUrl(img)}
                          alt={`Hình ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Car Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6"
              >
                <h1 className="text-3xl font-bold mb-4">{xe.tenXe}</h1>
                <p className="text-3xl font-bold text-primary-600 mb-6">{formatPrice(xe.gia)}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Năm: {xe.namSanXuat}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">{xe.hangXe}</span>
                  </div>
                </div>

              </motion.div>

              {/* Thông số kỹ thuật */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card p-6 mt-6"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Thông số kỹ thuật</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Car className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-xs text-gray-600">Hãng xe</p>
                      <p className="font-semibold text-gray-800">{xe.hangXe}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-xs text-gray-600">Năm SX</p>
                      <p className="font-semibold text-gray-800">{xe.namSanXuat}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Users className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-xs text-gray-600">Số chỗ</p>
                      <p className="font-semibold text-gray-800">{xe.soCho} chỗ</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Gauge className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-xs text-gray-600">Số km</p>
                      <p className="font-semibold text-gray-800">{new Intl.NumberFormat('vi-VN').format(xe.soKm)} km</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Palette className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-xs text-gray-600">Màu sắc</p>
                      <p className="font-semibold text-gray-800">{xe.mauSac}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Car className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-xs text-gray-600">Loại xe</p>
                      <p className="font-semibold text-gray-800">{xe.loaiXe}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Sparkles className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-xs text-gray-600">Tình trạng</p>
                      <p className={`font-semibold ${xe.tinhTrangXe === 'xeMoi' ? 'text-green-600' : 'text-gray-800'}`}>
                        {xe.tinhTrangXe === 'xeMoi' ? 'Xe mới' : 'Xe cũ'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Mô tả */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-6 mt-6"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Mô tả</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{xe.moTa}</p>
              </motion.div>

              {/* Thông tin người bán */}
              {tenChuXe && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="card p-6 mt-6"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Thông tin người bán</h2>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary-600">
                        {tenChuXe.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-lg">{tenChuXe}</p>
                      <p className="text-sm text-gray-600">Đã đăng từ: {new Date(xe.ngayDang).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card p-6 sticky top-24"
              >
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <button
                      onClick={handleShare}
                      className="flex items-center space-x-1 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                      title={user ? 'Chia sẻ' : 'Đăng nhập để chia sẻ'}
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Chia sẻ</span>
                    </button>
                  </div>

                  {laChuXe ? (
                    <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg text-center">
                      <p className="text-sm font-semibold text-blue-800">Đây là xe của bạn</p>
                      <p className="text-xs text-blue-600 mt-1">Bạn không thể mua hoặc đặt lịch xem xe do chính mình đăng bán</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {user ? (
                        <button
                          onClick={() => setShowDatMuaModal(true)}
                          className="block w-full btn-primary text-center"
                        >
                          Đặt mua ngay
                        </button>
                      ) : (
                        <Link
                          to="/dang-nhap"
                          className="block w-full btn-primary text-center"
                        >
                          Đăng nhập để đặt mua
                        </Link>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => {
                            if (!user) {
                              navigate('/dang-nhap');
                            } else {
                              alert('Số điện thoại: 093 355 1234');
                            }
                          }}
                          className="flex items-center justify-center space-x-2 px-4 py-3 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-all font-medium"
                        >
                          <Phone className="w-4 h-4" />
                          <span>Gọi điện</span>
                        </button>
                        {xe.idChuXe && (
                          <button
                            onClick={() => {
                              if (!user) {
                                alert('Vui lòng đăng nhập để chat với người bán');
                                navigate('/dang-nhap');
                                return;
                              }
                              setShowChatModal(true);
                            }}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                          >
                            <MessageCircle className="w-5 h-5" />
                            Chat
                          </button>
                        )}
                      </div>

                      {/* Đặt lịch Button */}
                      {xe.idChuXe && (
                        <div>
                          <button
                            onClick={() => {
                              if (!user) {
                                alert('Vui lòng đăng nhập để đặt lịch xem xe');
                                navigate('/dang-nhap');
                                return;
                              }
                              // Mở modal đặt lịch ngay tại trang này
                              setShowDatLichModal(true);
                            }}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                          >
                            <Calendar className="w-5 h-5" />
                            Đặt lịch xem xe
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="border-t pt-4 text-sm text-gray-600">
                    <p>Ngày đăng: {new Date(xe.ngayDang).toLocaleDateString('vi-VN')}</p>
                    <p>Mã tin: #{id}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Dat Lich Modal */}
      {showDatLichModal && xe && (
        <DatLichModal
          idXe={xe.id}
          tenXe={xe.tenXe}
          onClose={() => setShowDatLichModal(false)}
        />
      )}

      {/* Dat Mua Modal - Chọn cách liên hệ */}
      <AnimatePresence>
        {showDatMuaModal && xe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDatMuaModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6 rounded-t-2xl flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Bạn muốn làm gì?</h2>
                  <p className="text-primary-100 text-sm">{xe.tenXe}</p>
                </div>
                <button
                  onClick={() => setShowDatMuaModal(false)}
                  className="p-2 hover:bg-primary-700 rounded-lg transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Options */}
              <div className="p-6 space-y-3">
                {/* Nhắn tin */}
                <button
                  onClick={() => {
                    if (!xe.idChuXe) {
                      alert('Không tìm thấy thông tin người bán');
                      return;
                    }
                    setShowDatMuaModal(false);
                    setShowChatModal(true);
                  }}
                  className="w-full flex items-center gap-4 p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 hover:border-green-400 transition-all group"
                >
                  <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-800">Nhắn tin với người bán</h3>
                    <p className="text-sm text-gray-600">Trao đổi trực tiếp về xe</p>
                  </div>
                </button>

                {/* Đặt lịch xem xe */}
                <button
                  onClick={() => {
                    if (!xe.idChuXe) {
                      alert('Không tìm thấy thông tin người bán');
                      return;
                    }
                    setShowDatMuaModal(false);
                    setShowDatLichModal(true);
                  }}
                  className="w-full flex items-center gap-4 p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-all group"
                >
                  <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-800">Đặt lịch xem xe</h3>
                    <p className="text-sm text-gray-600">Hẹn gặp để xem xe trực tiếp</p>
                  </div>
                </button>

                {/* Đặt mua ngay */}
                <button
                  onClick={() => {
                    setShowDatMuaModal(false);
                    navigate(`/dat-mua/${id}`);
                  }}
                  className="w-full flex items-center gap-4 p-4 border-2 border-primary-200 rounded-lg hover:bg-primary-50 hover:border-primary-400 transition-all group"
                >
                  <div className="p-3 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition">
                    <ShoppingCart className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-800">Đặt mua ngay</h3>
                    <p className="text-sm text-gray-600">Tiến hành đặt mua xe</p>
                  </div>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Modal - Trigger từ modal đặt mua */}
      {showChatModal && xe && xe.idChuXe && (
        <ChatModal
          idXe={xe.id}
          tenXe={xe.tenXe}
          loaiXe="xe"
          onClose={() => setShowChatModal(false)}
        />
      )}
    </MainLayout>
  );
};

export default ChiTietXe;

