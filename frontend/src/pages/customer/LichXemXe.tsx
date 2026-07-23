import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Phone, CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import lichXemXeService, { LichXemXe } from '../../services/lichXemXeService';
import { useAuth } from '../../contexts/AuthContext';
import { xeService } from '../../services/xeService';
import { getImageUrl } from '../../utils/image';
import xeChoThueService from '../../services/xeChoThueService';

const LichXemXePage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [lichXemXe, setLichXemXe] = useState<LichXemXe[]>([]);
  const [tab, setTab] = useState<'nguoiDat' | 'nguoiBan'>('nguoiDat');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedLich, setSelectedLich] = useState<LichXemXe | null>(null);
  const [lyDoHuy, setLyDoHuy] = useState('');
  const [showDatLichModal, setShowDatLichModal] = useState(false);
  const [xeInfo, setXeInfo] = useState<{ id: string; tenXe: string } | null>(null);
  const [formData, setFormData] = useState({
    ngayXem: '',
    gioXem: '09:00',
    diaDiem: '',
    soDienThoai: user?.sdt || '',
    ghiChu: '',
  });

  useEffect(() => {
    fetchLichXemXe();
  }, [tab]);

  // Tự động mở form đặt lịch nếu có query params
  useEffect(() => {
    const xeId = searchParams.get('xeId');
    if (xeId && !showDatLichModal) {
      loadXeInfo(xeId);
      setShowDatLichModal(true);
      // Xóa query params
      setSearchParams({});
    }
  }, [searchParams]);

  const loadXeInfo = async (xeId: string) => {
    try {
      // Thử load từ Xe trước
      try {
        const response = await xeService.getById(xeId);
        if (response.data && response.data.xe) {
          setXeInfo({ id: xeId, tenXe: response.data.xe.tenXe });
          return;
        }
      } catch (e) {
        // Nếu không tìm thấy, thử XeChoThue
        const response = await xeChoThueService.getById(xeId);
        if (response && response.tenXe) {
          setXeInfo({ id: xeId, tenXe: response.tenXe });
        }
      }
    } catch (error) {
      console.error('Error loading xe info:', error);
    }
  };

  const fetchLichXemXe = async () => {
    try {
      setLoading(true);
      const response = await lichXemXeService.getMySchedules(tab);
      setLichXemXe(response.data.lichXemXe);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!window.confirm('Xác nhận duyệt lịch xem xe này?')) return;

    try {
      await lichXemXeService.approve(id);
      alert('Đã duyệt lịch xem xe');
      fetchLichXemXe();
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Có lỗi xảy ra');
    }
  };

  const handleCancel = async () => {
    if (!selectedLich || !lyDoHuy.trim()) {
      alert('Vui lòng nhập lý do hủy');
      return;
    }

    try {
      await lichXemXeService.cancel(selectedLich._id, lyDoHuy);
      alert('Đã hủy lịch xem xe');
      setShowCancelModal(false);
      setSelectedLich(null);
      setLyDoHuy('');
      fetchLichXemXe();
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Có lỗi xảy ra');
    }
  };

  const handleComplete = async (id: string) => {
    if (!window.confirm('Xác nhận đã hoàn thành lịch xem xe này?')) return;

    try {
      await lichXemXeService.complete(id);
      alert('Đã đánh dấu hoàn thành');
      fetchLichXemXe();
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Có lỗi xảy ra');
    }
  };

  const handleSubmitDatLich = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!xeInfo) return;

    if (!formData.ngayXem || !formData.gioXem || !formData.diaDiem || !formData.soDienThoai) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Kiểm tra ngày phải trong tương lai
    const selectedDate = new Date(formData.ngayXem);
    if (selectedDate < new Date()) {
      alert('Ngày xem xe phải trong tương lai');
      return;
    }

    setLoading(true);
    try {
      const response = await lichXemXeService.datLich({
        idXe: xeInfo.id,
        ...formData,
      });

      alert(response.message || 'Đặt lịch xem xe thành công! Chờ người bán xác nhận.');
      setShowDatLichModal(false);
      setXeInfo(null);
      setFormData({
        ngayXem: '',
        gioXem: '09:00',
        diaDiem: '',
        soDienThoai: user?.sdt || '',
        ghiChu: '',
      });
      fetchLichXemXe();
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.response?.data?.error?.message || 'Có lỗi xảy ra khi đặt lịch');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Generate time slots
  const timeSlots = [];
  for (let hour = 8; hour <= 20; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 20) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }

  // Min date = tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const getTrangThaiColor = (trangThai: string) => {
    switch (trangThai) {
      case 'choDuyet': return 'bg-yellow-100 text-yellow-800';
      case 'daDuyet': return 'bg-green-100 text-green-800';
      case 'daHuy': return 'bg-red-100 text-red-800';
      case 'daHoanThanh': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrangThaiIcon = (trangThai: string) => {
    switch (trangThai) {
      case 'choDuyet': return <Clock className="w-5 h-5" />;
      case 'daDuyet': return <CheckCircle className="w-5 h-5" />;
      case 'daHuy': return <XCircle className="w-5 h-5" />;
      case 'daHoanThanh': return <CheckCircle className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getTrangThaiText = (trangThai: string) => {
    switch (trangThai) {
      case 'choDuyet': return 'Chờ duyệt';
      case 'daDuyet': return 'Đã duyệt';
      case 'daHuy': return 'Đã hủy';
      case 'daHoanThanh': return 'Hoàn thành';
      default: return trangThai;
    }
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
      <div className="page-container py-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary-600" />
              Lịch xem xe
            </h1>
            <p className="text-gray-600">Quản lý các lịch hẹn xem xe của bạn</p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-4 mb-6"
          >
            <button
              onClick={() => setTab('nguoiDat')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                tab === 'nguoiDat'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Lịch tôi đặt
            </button>
            <button
              onClick={() => setTab('nguoiBan')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                tab === 'nguoiBan'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Lịch người khác đặt
            </button>
          </motion.div>

          {/* List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {lichXemXe.length === 0 ? (
              <div className="card p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Chưa có lịch xem xe nào
                </h3>
                <p className="text-gray-500">
                  {tab === 'nguoiDat'
                    ? 'Hãy đặt lịch xem xe khi tìm thấy xe bạn quan tâm'
                    : 'Chưa có ai đặt lịch xem xe của bạn'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {lichXemXe.map((lich) => (
                  <motion.div
                    key={lich._id}
                    whileHover={{ scale: 1.01 }}
                    className="card p-6"
                  >
                    <div className="flex gap-6">
                      {/* Xe Image */}
                      <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                        {lich.idXe.hinhAnh && lich.idXe.hinhAnh.length > 0 ? (
                          <img
                            src={getImageUrl(lich.idXe.hinhAnh[0])}
                            alt={lich.idXe.tenXe}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No image
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold mb-1">{lich.idXe.tenXe}</h3>
                            <p className="text-primary-600 font-semibold">
                              {new Intl.NumberFormat('vi-VN').format(lich.idXe.gia)} ₫
                            </p>
                          </div>
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getTrangThaiColor(lich.trangThai)}`}>
                            {getTrangThaiIcon(lich.trangThai)}
                            <span className="font-semibold">{getTrangThaiText(lich.trangThai)}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Calendar className="w-4 h-4 text-primary-600" />
                            <span>{new Date(lich.ngayXem).toLocaleDateString('vi-VN')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Clock className="w-4 h-4 text-primary-600" />
                            <span>{lich.gioXem}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <MapPin className="w-4 h-4 text-primary-600" />
                            <span className="truncate">{lich.diaDiem}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Phone className="w-4 h-4 text-primary-600" />
                            <span>{lich.soDienThoai}</span>
                          </div>
                        </div>

                        {tab === 'nguoiDat' && (
                          <div className="text-sm text-gray-600 mb-3">
                            <strong>Người bán:</strong> {lich.idNguoiBan.ten}
                          </div>
                        )}

                        {tab === 'nguoiBan' && (
                          <div className="text-sm text-gray-600 mb-3">
                            <strong>Người đặt:</strong> {lich.idNguoiDat.ten}
                          </div>
                        )}

                        {lich.ghiChu && (
                          <div className="text-sm text-gray-600 mb-3">
                            <strong>Ghi chú:</strong> {lich.ghiChu}
                          </div>
                        )}

                        {lich.lyDoHuy && (
                          <div className="text-sm text-red-600 mb-3">
                            <strong>Lý do hủy:</strong> {lich.lyDoHuy}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                          {tab === 'nguoiBan' && lich.trangThai === 'choDuyet' && (
                            <>
                              <button
                                onClick={() => handleApprove(lich._id)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                              >
                                Duyệt lịch
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedLich(lich);
                                  setShowCancelModal(true);
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                              >
                                Từ chối
                              </button>
                            </>
                          )}

                          {tab === 'nguoiBan' && lich.trangThai === 'daDuyet' && (
                            <button
                              onClick={() => handleComplete(lich._id)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                              Đánh dấu hoàn thành
                            </button>
                          )}

                          {tab === 'nguoiDat' && ['choDuyet', 'daDuyet'].includes(lich.trangThai) && (
                            <button
                              onClick={() => {
                                setSelectedLich(lich);
                                setShowCancelModal(true);
                              }}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                              Hủy lịch
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Hủy lịch xem xe</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do hủy <span className="text-red-500">*</span>
              </label>
              <textarea
                value={lyDoHuy}
                onChange={(e) => setLyDoHuy(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Nhập lý do hủy..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedLich(null);
                  setLyDoHuy('');
                }}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Đóng
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dat Lich Modal */}
      <AnimatePresence>
        {showDatLichModal && xeInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowDatLichModal(false);
              setXeInfo(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Đặt lịch xem xe</h2>
                  <p className="text-blue-100 text-sm">{xeInfo.tenXe}</p>
                </div>
                <button
                  onClick={() => {
                    setShowDatLichModal(false);
                    setXeInfo(null);
                  }}
                  className="p-2 hover:bg-blue-700 rounded-lg transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmitDatLich} className="p-6 space-y-5">
                {/* Ngày xem */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Ngày xem xe <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="ngayXem"
                    value={formData.ngayXem}
                    onChange={handleChange}
                    min={minDate}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Giờ xem */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    Giờ xem xe <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gioXem"
                    value={formData.gioXem}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Địa điểm */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    Địa điểm xem xe <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="diaDiem"
                    value={formData.diaDiem}
                    onChange={handleChange}
                    placeholder="VD: 123 Đường ABC, Quận 1, TP.HCM"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Người bán sẽ xác nhận địa điểm hoặc đề xuất địa điểm khác
                  </p>
                </div>

                {/* Số điện thoại */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    Số điện thoại liên hệ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="soDienThoai"
                    value={formData.soDienThoai}
                    onChange={handleChange}
                    placeholder="0912345678"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Ghi chú */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú (không bắt buộc)
                  </label>
                  <textarea
                    name="ghiChu"
                    value={formData.ghiChu}
                    onChange={handleChange}
                    rows={3}
                    placeholder="VD: Tôi muốn kiểm tra kỹ động cơ và hộp số..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Info box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">📌 Lưu ý:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Lịch xem xe cần được người bán xác nhận</li>
                    <li>• Bạn sẽ nhận thông báo khi lịch được duyệt</li>
                    <li>• Vui lòng đến đúng giờ đã hẹn</li>
                    <li>• Có thể hủy lịch trước 24h nếu có việc đột xuất</li>
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDatLichModal(false);
                      setXeInfo(null);
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition"
                    disabled={loading}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Đang đặt lịch...' : 'Xác nhận đặt lịch'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
};

export default LichXemXePage;

