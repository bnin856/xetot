import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Phone, CheckCircle, XCircle, AlertCircle, Wrench } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import { motion } from 'framer-motion';
import lichDatDichVuService, { LichDatDichVu } from '../../services/lichDatDichVuService';
import { useAuth } from '../../contexts/AuthContext';

const LichDatDichVuPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [lichDat, setLichDat] = useState<LichDatDichVu[]>([]);
  const [tab, setTab] = useState<'khachHang' | 'nguoiCungCap'>('khachHang');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedLich, setSelectedLich] = useState<LichDatDichVu | null>(null);
  const [lyDoHuy, setLyDoHuy] = useState('');

  useEffect(() => {
    fetchLichDat();
  }, [tab]);

  const fetchLichDat = async () => {
    try {
      setLoading(true);
      const response = await lichDatDichVuService.getMySchedules(tab);
      setLichDat(response.data.lichDat);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!window.confirm('Xác nhận duyệt lịch đặt dịch vụ này?')) return;

    try {
      await lichDatDichVuService.approve(id);
      alert('Đã duyệt lịch đặt dịch vụ');
      fetchLichDat();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleCancel = async () => {
    if (!selectedLich || !lyDoHuy.trim()) {
      alert('Vui lòng nhập lý do hủy');
      return;
    }

    try {
      await lichDatDichVuService.cancel(selectedLich._id, lyDoHuy);
      alert('Đã hủy lịch đặt dịch vụ');
      setShowCancelModal(false);
      setSelectedLich(null);
      setLyDoHuy('');
      fetchLichDat();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleComplete = async (id: string) => {
    if (!window.confirm('Xác nhận đã hoàn thành lịch đặt dịch vụ này?')) return;

    try {
      await lichDatDichVuService.complete(id);
      alert('Đã đánh dấu hoàn thành');
      fetchLichDat();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

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
              Lịch đặt dịch vụ
            </h1>
            <p className="text-gray-600">Quản lý các lịch hẹn dịch vụ của bạn</p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-4 mb-6"
          >
            <button
              onClick={() => setTab('khachHang')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                tab === 'khachHang'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Lịch tôi đặt
            </button>
            <button
              onClick={() => setTab('nguoiCungCap')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                tab === 'nguoiCungCap'
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
            {lichDat.length === 0 ? (
              <div className="card p-12 text-center">
                <Wrench className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Chưa có lịch đặt dịch vụ nào
                </h3>
                <p className="text-gray-500">
                  {tab === 'khachHang'
                    ? 'Hãy đặt lịch dịch vụ khi tìm thấy dịch vụ bạn cần'
                    : 'Chưa có ai đặt lịch dịch vụ của bạn'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {lichDat.map((lich) => (
                  <motion.div
                    key={lich._id}
                    whileHover={{ scale: 1.01 }}
                    className="card p-6"
                  >
                    <div className="flex gap-6">
                      {/* Service Info */}
                      <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center">
                        {lich.idDichVu.hinhAnh && lich.idDichVu.hinhAnh.length > 0 ? (
                          <img
                            src={`http://localhost:5000/${lich.idDichVu.hinhAnh[0]}`}
                            alt={lich.idDichVu.tenDichVu}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Wrench className="w-12 h-12 text-gray-400" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold mb-1">{lich.idDichVu.tenDichVu}</h3>
                            <p className="text-primary-600 font-semibold">
                              {new Intl.NumberFormat('vi-VN').format(lich.idDichVu.giaThamKhao)} ₫
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
                            <span>{new Date(lich.ngayDat).toLocaleDateString('vi-VN')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Clock className="w-4 h-4 text-primary-600" />
                            <span>{lich.gioDat}</span>
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

                        {tab === 'khachHang' && (
                          <div className="text-sm text-gray-600 mb-3">
                            <strong>Người cung cấp:</strong> {lich.idNguoiCungCap.ten}
                          </div>
                        )}

                        {tab === 'nguoiCungCap' && (
                          <div className="text-sm text-gray-600 mb-3">
                            <strong>Khách hàng:</strong> {lich.idKhachHang.ten}
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
                          {tab === 'nguoiCungCap' && lich.trangThai === 'choDuyet' && (
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

                          {tab === 'nguoiCungCap' && lich.trangThai === 'daDuyet' && (
                            <button
                              onClick={() => handleComplete(lich._id)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                              Đánh dấu hoàn thành
                            </button>
                          )}

                          {tab === 'khachHang' && ['choDuyet', 'daDuyet'].includes(lich.trangThai) && (
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
            <h3 className="text-xl font-bold mb-4">Hủy lịch đặt dịch vụ</h3>
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
    </MainLayout>
  );
};

export default LichDatDichVuPage;

