import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Car,
  Calendar,
  Users,
  Gauge,
  Palette,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  Heart,
  Shield,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import xeChoThueService from '../../services/xeChoThueService';
import ChatButton from '../../components/Chat/ChatButton';
import DatLichModal from '../../components/LichXemXe/DatLichModal';

interface XeChoThue {
  _id: string;
  tenXe: string;
  hangXe: string;
  dongXe?: string;
  mauSac: string;
  namSanXuat: number;
  giaThueTheoNgay: number;
  giaThueTheoThang: number;
  soKm: number;
  soCho: number;
  loaiXe: string;
  trangThai: 'sanSang' | 'dangThue' | 'baoTri';
  moTa: string;
  hinhAnh: string[];
  ngayDang?: string;
  idChuXe?: {
    _id: string;
    ten: string;
    sdt: string;
    email: string;
  };
}

const ChiTietXeChoThue: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [xe, setXe] = useState<XeChoThue | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDatLichModal, setShowDatLichModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [yeuthich, setYeuThich] = useState(false);

  useEffect(() => {
    fetchXeDetail();
    checkYeuThich();
  }, [id]);

  const fetchXeDetail = async () => {
    try {
      setLoading(true);
      const data = await xeChoThueService.getById(id!);
      setXe(data);
    } catch (error) {
      console.error('Error fetching car details:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkYeuThich = () => {
    const yeuthichList = JSON.parse(localStorage.getItem('xeChoThueYeuThich') || '[]');
    setYeuThich(yeuthichList.includes(id));
  };

  const toggleYeuThich = () => {
    const yeuthichList = JSON.parse(localStorage.getItem('xeChoThueYeuThich') || '[]');
    
    if (yeuthich) {
      const updated = yeuthichList.filter((xeId: string) => xeId !== id);
      localStorage.setItem('xeChoThueYeuThich', JSON.stringify(updated));
      setYeuThich(false);
    } else {
      yeuthichList.push(id);
      localStorage.setItem('xeChoThueYeuThich', JSON.stringify(yeuthichList));
      setYeuThich(true);
    }
  };

  const handleContact = (action: 'call' | 'message') => {
    if (!user) {
      navigate('/dang-nhap');
      return;
    }

    if (action === 'call' && xe?.idChuXe?.sdt) {
      window.location.href = `tel:${xe.idChuXe.sdt}`;
    }
  };

  const handleThueXe = () => {
    if (!user) {
      navigate('/dang-nhap');
      return;
    }
    navigate(`/dat-thue-xe/${id}`);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
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
            <Link to="/thue-xe" className="btn-primary inline-flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const trangThaiText = {
    sanSang: { text: 'Sẵn sàng', color: 'text-green-600 bg-green-100' },
    dangThue: { text: 'Đang thuê', color: 'text-yellow-600 bg-yellow-100' },
    baoTri: { text: 'Bảo trì', color: 'text-red-600 bg-red-100' },
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-br from-primary-50 to-white">
        <div className="container-custom py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm mb-6">
            <Link to="/" className="text-gray-600 hover:text-primary-600">
              Trang chủ
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/thue-xe" className="text-gray-600 hover:text-primary-600">
              Thuê xe
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-primary-600 font-medium">{xe.tenXe}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="card overflow-hidden">
                {/* Main Image */}
                <div className="relative aspect-video bg-gray-100">
                  <img
                    src={xe.hinhAnh?.[selectedImage] || '/placeholder-car.jpg'}
                    alt={xe.tenXe}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        trangThaiText[xe.trangThai].color
                      }`}
                    >
                      {trangThaiText[xe.trangThai].text}
                    </span>
                  </div>
                  <button
                    onClick={toggleYeuThich}
                    className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-all shadow-lg"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        yeuthich ? 'fill-red-500 text-red-500' : 'text-gray-600'
                      }`}
                    />
                  </button>
                </div>

                {/* Thumbnail Gallery */}
                {xe.hinhAnh && xe.hinhAnh.length > 1 && (
                  <div className="flex space-x-2 p-4 overflow-x-auto">
                    {xe.hinhAnh.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === index
                            ? 'border-primary-600'
                            : 'border-gray-200 hover:border-primary-300'
                        }`}
                      >
                        <img
                          src={img || '/placeholder-car.jpg'}
                          alt={`${xe.tenXe} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Car Details */}
              <div className="card mt-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Thông số xe</h2>
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
                      <p className="font-semibold text-gray-800">
                        {xe.soKm.toLocaleString('vi-VN')} km
                      </p>
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
                </div>
              </div>

              {/* Description */}
              <div className="card mt-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Mô tả chi tiết</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{xe.moTa}</p>
              </div>

              {/* Owner Info */}
              <div className="card mt-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Thông tin chủ xe</h2>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-600">
                      {xe.idChuXe?.ten?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-lg">{xe.idChuXe?.ten || 'Chủ xe'}</p>
                    {xe.ngayDang && (
                      <p className="text-sm text-gray-600">Đã đăng từ: {new Date(xe.ngayDang).toLocaleDateString('vi-VN')}</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Booking Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="card sticky top-24">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">{xe.tenXe}</h3>

                {/* Price */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-baseline justify-between">
                    <span className="text-gray-600">Theo ngày:</span>
                    <span className="text-2xl font-bold text-accent-600">
                      {xe.giaThueTheoNgay.toLocaleString('vi-VN')} ₫
                      <span className="text-sm font-normal text-gray-600">/ngày</span>
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-gray-600">Theo tháng:</span>
                    <span className="text-xl font-bold text-primary-600">
                      {xe.giaThueTheoThang.toLocaleString('vi-VN')} ₫
                      <span className="text-sm font-normal text-gray-600">/tháng</span>
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleThueXe}
                    disabled={xe.trangThai !== 'sanSang'}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {xe.trangThai === 'sanSang' ? 'Đặt thuê xe' : 'Xe không khả dụng'}
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleContact('call')}
                      className="flex items-center justify-center space-x-2 px-4 py-3 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-all font-medium"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Gọi điện</span>
                    </button>
                    {xe?.idChuXe && (
                      <ChatButton
                        idXe={xe._id}
                        tenXe={xe.tenXe}
                        idNguoiBan={typeof xe.idChuXe === 'string' ? xe.idChuXe : xe.idChuXe._id}
                        loaiXe="xeChoThue"
                      />
                    )}
                    {xe?.idChuXe && (
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
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3">Ưu đãi khi thuê</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Miễn phí giao xe tận nơi</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Bảo hiểm xe chu đáo</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Hỗ trợ 24/7 trong quá trình thuê</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Đổi xe miễn phí nếu có sự cố</span>
                    </div>
                  </div>
                </div>

                {/* Safety Note */}
                <div className="mt-6 p-4 bg-primary-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-600">
                      <p className="font-medium text-gray-800 mb-1">An toàn & Bảo mật</p>
                      <p>
                        Chúng tôi cam kết bảo vệ thông tin cá nhân và đảm bảo an toàn trong suốt
                        quá trình thuê xe.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Dat Lich Modal */}
      {showDatLichModal && xe && (
        <DatLichModal
          idXe={xe._id}
          tenXe={xe.tenXe}
          onClose={() => setShowDatLichModal(false)}
        />
      )}
    </MainLayout>
  );
};

export default ChiTietXeChoThue;

