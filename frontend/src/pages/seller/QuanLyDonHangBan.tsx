import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, CheckCircle, XCircle, Eye, X } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import { motion } from 'framer-motion';
import { donHangService } from '../../services/donHangService';
import { DonHang } from '../../types';
import { getImageUrl } from '../../utils/image';

const QuanLyDonHangBan: React.FC = () => {
  const [donHang, setDonHang] = useState<DonHang[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<DonHang | null>(null);
  const [lyDo, setLyDo] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await donHangService.getOrdersForSeller();
      if (response.success) {
        setDonHang(response.data.donHang);
      }
    } catch (error) {
      console.error('Error fetching seller orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleXacNhan = async (id: string) => {
    if (!window.confirm('Xác nhận đồng ý bán xe cho đơn hàng này?')) return;
    setActionLoadingId(id);
    try {
      await donHangService.xacNhanDonHang(id);
      await fetchData();
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Có lỗi xảy ra');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleTuChoi = async () => {
    if (!rejectTarget) return;
    setActionLoadingId(rejectTarget.id);
    try {
      await donHangService.tuChoiDonHang(rejectTarget.id, lyDo);
      setRejectTarget(null);
      setLyDo('');
      await fetchData();
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Có lỗi xảy ra');
    } finally {
      setActionLoadingId(null);
    }
  };

  const getTrangThaiBadge = (trangThai: string) => {
    const badges: Record<string, { text: string; color: string }> = {
      choNguoiBanXacNhan: { text: 'Chờ bạn xác nhận', color: 'bg-yellow-100 text-yellow-800' },
      nguoiBanDaXacNhan: { text: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
      choThanhToan: { text: 'Chờ thanh toán', color: 'bg-orange-100 text-orange-800' },
      choXacNhanThanhToan: { text: 'Chờ xác nhận thanh toán', color: 'bg-cyan-100 text-cyan-800' },
      daThanhToan: { text: 'Đã thanh toán', color: 'bg-blue-100 text-blue-800' },
      dangGiao: { text: 'Đang giao', color: 'bg-purple-100 text-purple-800' },
      choKiemTra: { text: 'Chờ khách kiểm tra', color: 'bg-indigo-100 text-indigo-800' },
      tranh_chap_xe_sai: { text: 'Tranh chấp: Xe sai mô tả', color: 'bg-red-100 text-red-800' },
      tranh_chap_khach_huy: { text: 'Tranh chấp: Khách hủy', color: 'bg-red-100 text-red-800' },
      daHoanThanh: { text: 'Hoàn tất', color: 'bg-green-100 text-green-800' },
      daHuy: { text: 'Đã hủy', color: 'bg-gray-100 text-gray-800' },
    };
    return badges[trangThai] || { text: trangThai, color: 'bg-gray-100 text-gray-800' };
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN').format(price) + ' ₫';

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white py-12">
        <div className="container-custom max-w-6xl">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Đơn hàng của tôi (Người bán)</h1>
            <p className="text-gray-600">Quản lý các đơn hàng khách đặt mua xe của bạn</p>
          </motion.div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã đơn</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Xe</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày đặt</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                      </td>
                    </tr>
                  ) : donHang.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        Chưa có đơn hàng nào cho xe bạn đăng bán
                      </td>
                    </tr>
                  ) : (
                    donHang.map((don) => {
                      const badge = getTrangThaiBadge(don.trangThai);
                      const khachHang = typeof don.idKhachHang === 'object' && don.idKhachHang !== null ? (don.idKhachHang as any) : null;
                      const xe = typeof don.idXe === 'object' && don.idXe !== null ? (don.idXe as any) : null;
                      const dangXuLy = actionLoadingId === don.id;
                      return (
                        <motion.tr key={don.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">#{don.id.slice(-6).toUpperCase()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              {xe?.hinhAnh && xe.hinhAnh.length > 0 && (
                                <img
                                  src={getImageUrl(xe.hinhAnh[0])}
                                  alt={xe.tenXe}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              )}
                              <span className="text-sm">{xe ? xe.tenXe : 'N/A'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div>{khachHang ? khachHang.ten : 'N/A'}</div>
                            {khachHang?.sdt && <div className="text-xs text-gray-500">{khachHang.sdt}</div>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(don.createdAt).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary-600">
                            {formatPrice(don.tongTien)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>{badge.text}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/customer/don-hang/${don.id}`}
                                className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded"
                                title="Xem chi tiết"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                              {don.trangThai === 'choNguoiBanXacNhan' && (
                                <>
                                  <button
                                    onClick={() => handleXacNhan(don.id)}
                                    disabled={dangXuLy}
                                    className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded disabled:opacity-50"
                                    title="Xác nhận đơn hàng"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setRejectTarget(don)}
                                    disabled={dangXuLy}
                                    className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded disabled:opacity-50"
                                    title="Từ chối đơn hàng"
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
      </div>

      {rejectTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Package className="w-5 h-5 text-red-600" />
                Từ chối đơn hàng
              </h3>
              <button onClick={() => setRejectTarget(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Đơn hàng sẽ bị hủy và xe sẽ được mở lại để khách khác đặt mua.
            </p>
            <textarea
              value={lyDo}
              onChange={(e) => setLyDo(e.target.value)}
              placeholder="Lý do từ chối (VD: xe đã bán cho người khác, không còn hàng...)"
              className="input-field w-full h-24 mb-4"
            />
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setRejectTarget(null);
                  setLyDo('');
                }}
                className="flex-1 btn-secondary"
              >
                Quay lại
              </button>
              <button
                onClick={handleTuChoi}
                disabled={actionLoadingId === rejectTarget.id}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-semibold transition disabled:opacity-50"
              >
                {actionLoadingId === rejectTarget.id ? 'Đang xử lý...' : 'Xác nhận từ chối'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </MainLayout>
  );
};

export default QuanLyDonHangBan;
