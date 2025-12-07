import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Eye, Shield, MessageSquare } from 'lucide-react';
import AdminLayout from '../../components/Layout/AdminLayout';
import { motion } from 'framer-motion';
import { donHangService } from '../../services/donHangService';
import escrowService from '../../services/escrowService';
import { DonHang } from '../../types';

const QuanLyTraanhChap: React.FC = () => {
  const [donHang, setDonHang] = useState<DonHang[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDon, setSelectedDon] = useState<DonHang | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [ketQua, setKetQua] = useState<'hoantien' | 'tichthu' | 'chia'>('hoantien');
  const [ghiChu, setGhiChu] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchTraanhChap();
  }, []);

  const fetchTraanhChap = async () => {
    try {
      const response = await donHangService.getAll({ limit: 100 });
      if (response.success) {
        // Lọc chỉ lấy đơn tranh chấp
        const tranhChap = response.data.donHang.filter(
          (don) => don.trangThai === 'tranh_chap_xe_sai' || don.trangThai === 'tranh_chap_khach_huy'
        );
        setDonHang(tranhChap);
      }
    } catch (error) {
      console.error('Error fetching tranh chap:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleXuLy = (don: DonHang) => {
    setSelectedDon(don);
    // Mặc định: Xe sai → hoàn tiền, Khách hủy → tịch thu
    setKetQua(don.trangThai === 'tranh_chap_xe_sai' ? 'hoantien' : 'tichthu');
    setGhiChu('');
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!selectedDon || !ghiChu.trim()) {
      alert('Vui lòng nhập ghi chú xử lý');
      return;
    }

    setProcessing(true);
    try {
      await escrowService.xuLyTranhChap(selectedDon._id || selectedDon.id, ketQua, ghiChu);
      alert('Đã xử lý tranh chấp thành công');
      setShowModal(false);
      setSelectedDon(null);
      setGhiChu('');
      fetchTraanhChap();
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Có lỗi xảy ra');
    } finally {
      setProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  const getTrangThaiInfo = (trangThai: string) => {
    if (trangThai === 'tranh_chap_xe_sai') {
      return {
        text: 'Xe sai mô tả',
        color: 'orange',
        icon: AlertTriangle,
      };
    }
    return {
      text: 'Khách hủy vô lý do',
      color: 'red',
      icon: XCircle,
    };
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý tranh chấp</h1>
          <p className="text-gray-600">Xử lý các đơn hàng có tranh chấp về escrow</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : donHang.length === 0 ? (
          <div className="card p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Không có tranh chấp nào</h3>
            <p className="text-gray-600">Tất cả đơn hàng đều diễn ra suôn sẻ!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {donHang.map((don, index) => {
              const xe = typeof don.idXe === 'object' && don.idXe !== null ? (don.idXe as any) : null;
              const khach = typeof don.idKhachHang === 'object' && don.idKhachHang !== null ? (don.idKhachHang as any) : null;
              const statusInfo = getTrangThaiInfo(don.trangThai);
              const StatusIcon = statusInfo.icon;

              return (
                <motion.div
                  key={don._id || don.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-${statusInfo.color}-100 rounded-lg flex items-center justify-center`}>
                        <StatusIcon className={`w-6 h-6 text-${statusInfo.color}-600`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">
                          Mã đơn: #{(don._id || don.id).slice(-8).toUpperCase()}
                        </h3>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-${statusInfo.color}-100 text-${statusInfo.color}-800`}>
                          {statusInfo.text}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleXuLy(don)}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Xử lý</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Xe Info */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-2">Thông tin xe</p>
                      {xe ? (
                        <>
                          <p className="font-semibold text-gray-800">{xe.tenXe}</p>
                          <p className="text-sm text-gray-600">{xe.hangXe} - {xe.namSanXuat}</p>
                          <p className="text-sm font-semibold text-primary-600 mt-1">
                            {formatPrice(don.chiPhi?.giaXe || don.tongTien)}
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-500">N/A</p>
                      )}
                    </div>

                    {/* Khách Info */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-2">Khách hàng</p>
                      {khach ? (
                        <>
                          <p className="font-semibold text-gray-800">{khach.ten}</p>
                          <p className="text-sm text-gray-600">{khach.email}</p>
                          <p className="text-sm text-gray-600">{khach.sdt}</p>
                        </>
                      ) : (
                        <p className="text-gray-500">N/A</p>
                      )}
                    </div>

                    {/* Escrow Info */}
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Shield className="w-4 h-4 text-amber-600" />
                        <p className="text-sm text-amber-700 font-semibold">Tiền cọc Escrow</p>
                      </div>
                      <p className="text-2xl font-bold text-amber-900">
                        {don.tienCoc ? formatPrice(don.tienCoc) : 'N/A'}
                      </p>
                      <p className="text-xs text-amber-700 mt-1">
                        Trạng thái: {don.trangThaiCoc || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Lý do */}
                  {don.lyDoHuy && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm font-semibold text-red-800 mb-1">Lý do báo cáo:</p>
                      <p className="text-sm text-red-700">{don.lyDoHuy}</p>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="mt-4 flex items-center space-x-4 text-xs text-gray-500">
                    <span>Đặt: {new Date(don.createdAt).toLocaleString('vi-VN')}</span>
                    {don.ngayThanhToan && (
                      <span>Cọc: {new Date(don.ngayThanhToan).toLocaleString('vi-VN')}</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal xử lý */}
      {showModal && selectedDon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Xử lý tranh chấp</h3>
            
            {/* Thông tin đơn */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                Mã đơn: <span className="font-semibold">#{(selectedDon._id || selectedDon.id).slice(-8).toUpperCase()}</span>
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Loại tranh chấp: <span className="font-semibold">{getTrangThaiInfo(selectedDon.trangThai).text}</span>
              </p>
              <p className="text-sm text-gray-600">
                Tiền cọc: <span className="font-semibold text-amber-700">{selectedDon.tienCoc ? formatPrice(selectedDon.tienCoc) : 'N/A'}</span>
              </p>
              {selectedDon.lyDoHuy && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm font-semibold text-red-800 mb-1">Lý do:</p>
                  <p className="text-sm text-red-700">{selectedDon.lyDoHuy}</p>
                </div>
              )}
            </div>

            {/* Chọn kết quả */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Quyết định xử lý:</label>
              <div className="space-y-3">
                <label className="flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-green-50 transition">
                  <input
                    type="radio"
                    name="ketQua"
                    value="hoantien"
                    checked={ketQua === 'hoantien'}
                    onChange={(e) => setKetQua(e.target.value as any)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-semibold text-green-800">Hoàn tiền 100% cho khách</p>
                    <p className="text-sm text-gray-600">Áp dụng khi xe thực sự sai mô tả</p>
                  </div>
                </label>

                <label className="flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-red-50 transition">
                  <input
                    type="radio"
                    name="ketQua"
                    value="tichthu"
                    checked={ketQua === 'tichthu'}
                    onChange={(e) => setKetQua(e.target.value as any)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-semibold text-red-800">Tịch thu cọc (1% bán, 1% sàn)</p>
                    <p className="text-sm text-gray-600">Áp dụng khi khách hủy vô lý do hoặc báo sai</p>
                  </div>
                </label>

                <label className="flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-blue-50 transition">
                  <input
                    type="radio"
                    name="ketQua"
                    value="chia"
                    checked={ketQua === 'chia'}
                    onChange={(e) => setKetQua(e.target.value as any)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-semibold text-blue-800">Chia đôi cọc (mỗi bên 50%)</p>
                    <p className="text-sm text-gray-600">Áp dụng khi cả 2 bên đều có lỗi</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Ghi chú */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ghi chú xử lý <span className="text-red-500">*</span>
              </label>
              <textarea
                value={ghiChu}
                onChange={(e) => setGhiChu(e.target.value)}
                placeholder="Mô tả chi tiết quyết định xử lý..."
                className="input-field w-full h-32"
                required
              />
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedDon(null);
                  setGhiChu('');
                }}
                className="flex-1 btn-secondary"
                disabled={processing}
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                disabled={processing || !ghiChu.trim()}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {processing ? 'Đang xử lý...' : 'Xác nhận xử lý'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
};

export default QuanLyTraanhChap;

