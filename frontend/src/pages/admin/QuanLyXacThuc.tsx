import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Eye, Clock, AlertCircle } from 'lucide-react';
import AdminLayout from '../../components/Layout/AdminLayout';
import { motion } from 'framer-motion';
import xacThucService, { XacThuc } from '../../services/xacThucService';

const QuanLyXacThuc: React.FC = () => {
  const [xacThucs, setXacThucs] = useState<XacThuc[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedXacThuc, setSelectedXacThuc] = useState<XacThuc | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [filterStatus, setFilterStatus] = useState<'choXuLy' | 'daDuyet' | 'tuChoi' | ''>('choXuLy');

  useEffect(() => {
    fetchXacThucs();
  }, [filterStatus]);

  const fetchXacThucs = async () => {
    try {
      setLoading(true);
      const response = await xacThucService.getPending(filterStatus || undefined);
      if (response.success) {
        setXacThucs(response.data.xacThucs);
      }
    } catch (error) {
      console.error('Error fetching xac thuc:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn duyệt yêu cầu xác thực này?')) {
      return;
    }

    try {
      const response = await xacThucService.approve(id);
      if (response.success) {
        alert('Đã duyệt xác thực thành công');
        fetchXacThucs();
        setShowModal(false);
      }
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Có lỗi xảy ra');
    }
  };

  const handleReject = async () => {
    if (!selectedXacThuc) return;

    if (!rejectReason.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }

    try {
      const response = await xacThucService.reject(selectedXacThuc._id, rejectReason);
      if (response.success) {
        alert('Đã từ chối xác thực');
        fetchXacThucs();
        setShowRejectModal(false);
        setShowModal(false);
        setRejectReason('');
      }
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Có lỗi xảy ra');
    }
  };

  const getTrangThaiBadge = (trangThai: string) => {
    const badges: Record<string, { text: string; color: string; icon: any }> = {
      choXuLy: {
        text: 'Chờ xử lý',
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock,
      },
      daDuyet: {
        text: 'Đã duyệt',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle,
      },
      tuChoi: {
        text: 'Từ chối',
        color: 'bg-red-100 text-red-800',
        icon: XCircle,
      },
    };
    return badges[trangThai] || { text: trangThai, color: 'bg-gray-100 text-gray-800', icon: AlertCircle };
  };

  const openModal = (xacThuc: XacThuc) => {
    setSelectedXacThuc(xacThuc);
    setShowModal(true);
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-8">Quản lý xác thực KYC</h1>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilterStatus('choXuLy')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              filterStatus === 'choXuLy'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Chờ xử lý
          </button>
          <button
            onClick={() => setFilterStatus('daDuyet')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              filterStatus === 'daDuyet'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Đã duyệt
          </button>
          <button
            onClick={() => setFilterStatus('tuChoi')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              filterStatus === 'tuChoi'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Từ chối
          </button>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Người dùng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại giấy tờ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày gửi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày xử lý</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    </td>
                  </tr>
                ) : xacThucs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Không có yêu cầu xác thực nào
                    </td>
                  </tr>
                ) : (
                  xacThucs.map((xacThuc) => {
                    const badge = getTrangThaiBadge(xacThuc.trangThai);
                    const BadgeIcon = badge.icon;
                    const user = typeof xacThuc.idNguoiDung === 'object' ? xacThuc.idNguoiDung : null;

                    return (
                      <motion.tr
                        key={xacThuc._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {user?.ten || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">{user?.email || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {xacThuc.loaiGiayTo === 'cmnd' ? 'CMND' : 'CCCD'}
                          {xacThuc.hinhAnhGiayToXe.length > 0 && ' + Giấy tờ xe'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                            <BadgeIcon className="w-3 h-3" />
                            {badge.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(xacThuc.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {xacThuc.ngayXuLy
                            ? new Date(xacThuc.ngayXuLy).toLocaleDateString('vi-VN')
                            : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => openModal(xacThuc)}
                              className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {xacThuc.trangThai === 'choXuLy' && (
                              <>
                                <button
                                  onClick={() => handleApprove(xacThuc._id)}
                                  className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded"
                                  title="Duyệt"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedXacThuc(xacThuc);
                                    setShowRejectModal(true);
                                  }}
                                  className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded"
                                  title="Từ chối"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Xem chi tiết */}
      {showModal && selectedXacThuc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-8 max-w-4xl w-full my-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Chi tiết xác thực</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedXacThuc(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Thông tin người dùng */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Thông tin người dùng</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {typeof selectedXacThuc.idNguoiDung === 'object' && selectedXacThuc.idNguoiDung ? (
                    <>
                      <p className="text-sm">
                        <span className="font-medium">Tên:</span> {selectedXacThuc.idNguoiDung.ten}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Email:</span> {selectedXacThuc.idNguoiDung.email}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">SĐT:</span> {selectedXacThuc.idNguoiDung.sdt || 'N/A'}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">Đang tải thông tin...</p>
                  )}
                </div>
              </div>

              {/* Hình ảnh giấy tờ */}
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  {selectedXacThuc.loaiGiayTo === 'cmnd' ? 'CMND' : 'CCCD'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Mặt trước</p>
                    <img
                      src={`http://localhost:5000/${selectedXacThuc.hinhAnhMatTruoc}`}
                      alt="Mặt trước"
                      className="w-full border rounded-lg"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Mặt sau</p>
                    <img
                      src={`http://localhost:5000/${selectedXacThuc.hinhAnhMatSau}`}
                      alt="Mặt sau"
                      className="w-full border rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Giấy tờ xe nếu có */}
              {selectedXacThuc.hinhAnhGiayToXe.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Giấy tờ xe</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedXacThuc.hinhAnhGiayToXe.map((img, index) => (
                      <div key={index}>
                        <p className="text-sm font-medium mb-2">Hình {index + 1}</p>
                        <img
                          src={`http://localhost:5000/${img}`}
                          alt={`Giấy tờ xe ${index + 1}`}
                          className="w-full border rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lý do từ chối nếu có */}
              {selectedXacThuc.trangThai === 'tuChoi' && selectedXacThuc.lyDoTuChoi && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Lý do từ chối</h3>
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <p className="text-sm text-red-800">{selectedXacThuc.lyDoTuChoi}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              {selectedXacThuc.trangThai === 'choXuLy' && (
                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    onClick={() => handleApprove(selectedXacThuc._id)}
                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Duyệt xác thực
                  </button>
                  <button
                    onClick={() => {
                      setShowRejectModal(true);
                    }}
                    className="flex-1 btn-secondary flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    Từ chối
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Từ chối */}
      {showRejectModal && selectedXacThuc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold mb-4">Từ chối xác thực</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do từ chối <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full input-field"
                rows={4}
                placeholder="Nhập lý do từ chối..."
                required
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="flex-1 btn-secondary"
              >
                Hủy
              </button>
              <button onClick={handleReject} className="flex-1 btn-primary">
                Xác nhận từ chối
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
};

export default QuanLyXacThuc;

