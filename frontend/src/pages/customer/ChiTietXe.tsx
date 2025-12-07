import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Share2, Phone, MessageCircle, Calendar, MapPin, ShoppingCart, X } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import MainLayout from '../../components/Layout/MainLayout';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { xeService } from '../../services/xeService';
import { Xe } from '../../types';
import ChatButton from '../../components/Chat/ChatButton';
import ChatModal from '../../components/Chat/ChatModal';
import DatLichModal from '../../components/LichXemXe/DatLichModal';

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
        <div className="page-container py-8">
          <div className="container-custom">
            <div className="text-center py-12 text-gray-600">
              <p>Không tìm thấy xe</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="page-container py-8">
        <div className="container-custom">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary-600">Trang chủ</Link>
            <span className="mx-2">/</span>
            <Link to="/tim-kiem" className="hover:text-primary-600">Tìm kiếm</Link>
            <span className="mx-2">/</span>
            <span>Chi tiết xe</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Image */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card p-4 mb-4"
              >
                <div className="h-96 bg-gray-200 rounded-lg mb-4 relative">
                  {xe.hinhAnh && xe.hinhAnh.length > 0 ? (
                    <img
                      src={`http://localhost:5000/${xe.hinhAnh[hinhAnhChon]}`}
                      alt={xe.tenXe}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 rounded-lg">
                      Chưa có ảnh
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-primary-600 text-white px-4 py-2 rounded-full font-medium">
                    {xe.trangThai === 'dangBan' ? 'Đang bán' : 'Đã bán'}
                  </div>
                </div>
                {xe.hinhAnh && xe.hinhAnh.length > 1 && (
                  <div className="grid grid-cols-5 gap-2">
                    {xe.hinhAnh.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setHinhAnhChon(idx)}
                        className={`h-20 bg-gray-200 rounded-lg overflow-hidden ${
                          hinhAnhChon === idx ? 'ring-2 ring-primary-600' : ''
                        }`}
                      >
                        <img
                          src={`http://localhost:5000/${img}`}
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

                <div className="border-t pt-6">
                  <h2 className="text-xl font-semibold mb-4">Mô tả</h2>
                  <p className="text-gray-600 leading-relaxed">{xe.moTa}</p>
                </div>

                <div className="border-t pt-6 mt-6">
                  <h2 className="text-xl font-semibold mb-4">Thông số kỹ thuật</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600">Hãng:</span>
                      <span className="ml-2 font-medium">{xe.hangXe}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Số chỗ:</span>
                      <span className="ml-2 font-medium">{xe.soCho} chỗ</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Màu sắc:</span>
                      <span className="ml-2 font-medium">{xe.mauSac}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Số km:</span>
                      <span className="ml-2 font-medium">{new Intl.NumberFormat('vi-VN').format(xe.soKm)} km</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Loại xe:</span>
                      <span className="ml-2 font-medium">{xe.loaiXe}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Tình trạng:</span>
                      <span className={`ml-2 font-bold ${xe.tinhTrangXe === 'xeMoi' ? 'text-green-600' : 'text-gray-700'}`}>
                        {xe.tinhTrangXe === 'xeMoi' ? '🆕 Xe mới' : 'Xe cũ'}
                      </span>
                    </div>
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
                  <div className="flex items-center justify-between">
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

                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-2">Liên hệ người bán</p>
                    <button 
                      onClick={() => {
                        if (!user) {
                          navigate('/dang-nhap');
                        } else {
                          alert('Số điện thoại: 093 355 1234');
                        }
                      }}
                      className="w-full btn-primary mb-2 flex items-center justify-center space-x-2"
                    >
                      <Phone className="w-5 h-5" />
                      <span>{user ? '093 355 1234' : 'Xem số điện thoại'}</span>
                    </button>
                  </div>

                  {/* Chat Button */}
                  {xe.idChuXe && (
                    <div className="mb-3">
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
                        Chat với người bán
                      </button>
                    </div>
                  )}

                  {/* Đặt lịch Button */}
                  {xe.idChuXe && (
                    <div className="mb-3">
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

