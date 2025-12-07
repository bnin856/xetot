import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, Calendar, MapPin, CreditCard, AlertCircle, CheckCircle, XCircle, Shield, FileText, Upload, X, Image as ImageIcon } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import { motion } from 'framer-motion';
import { donHangService } from '../../services/donHangService';
import escrowService from '../../services/escrowService';
import { DonHang } from '../../types';

const ChiTietDonHang: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donHang, setDonHang] = useState<DonHang | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [lyDo, setLyDo] = useState('');
  const [hinhAnhChungMinh, setHinhAnhChungMinh] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    fetchDonHang();
  }, [id]);

  const fetchDonHang = async () => {
    if (!id) return;
    console.log('Fetching don hang with ID:', id);
    try {
      const response = await donHangService.getById(id);
      console.log('Response:', response);
      if (response.success) {
        setDonHang(response.data.donHang);
      }
    } catch (error: any) {
      console.error('Error fetching don hang:', error);
      console.error('Error response:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleXacNhanThanhCong = async () => {
    if (!id || !donHang) return;
    if (!window.confirm('Xác nhận xe đúng như mô tả và hoàn tất giao dịch?')) return;

    setActionLoading(true);
    try {
      await escrowService.xacNhanThanhCong(id);
      alert('Giao dịch hoàn tất thành công!');
      fetchDonHang();
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Có lỗi xảy ra');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBaoCaoXeSai = async () => {
    if (!id || !lyDo.trim()) {
      alert('Vui lòng nhập lý do');
      return;
    }

    if (hinhAnhChungMinh.length === 0) {
      alert('Vui lòng upload ít nhất 1 hình ảnh chứng minh');
      return;
    }

    setActionLoading(true);
    try {
      await escrowService.baoCaoXeSai(id, lyDo, hinhAnhChungMinh);
      alert('Đã gửi báo cáo. Admin sẽ xử lý trong 24h.');
      setShowReportModal(false);
      setLyDo('');
      setHinhAnhChungMinh([]);
      setPreviewUrls([]);
      fetchDonHang();
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Có lỗi xảy ra');
    } finally {
      setActionLoading(false);
    }
  };

  const handleHuyVoLyDo = async () => {
    if (!id || !lyDo.trim()) {
      alert('Vui lòng nhập lý do hủy');
      return;
    }

    // Nếu đơn hàng chưa thanh toán cọc, hủy trực tiếp không cần qua escrow
    if (donHang && ['choNguoiBanXacNhan', 'nguoiBanDaXacNhan'].includes(donHang.trangThai)) {
      if (!window.confirm('Xác nhận hủy đơn hàng này?')) return;
      
      setActionLoading(true);
      try {
        await donHangService.updateTrangThai(id, 'daHuy');
        alert('Đã hủy đơn hàng thành công.');
        navigate('/customer/don-hang');
      } catch (error: any) {
        alert(error.response?.data?.error?.message || 'Có lỗi xảy ra');
      } finally {
        setActionLoading(false);
      }
      return;
    }

    // Nếu đã thanh toán cọc, xử lý qua escrow
    setActionLoading(true);
    try {
      await escrowService.huyVoLyDo(id, lyDo, hinhAnhChungMinh);
      
      const message = hinhAnhChungMinh.length > 0
        ? 'Đã gửi yêu cầu hủy đơn. Admin sẽ xem xét bằng chứng và phản hồi trong 24h.'
        : 'Đã hủy đơn hàng. Tiền cọc sẽ không được hoàn lại.';
      
      alert(message);
      setShowCancelModal(false);
      setLyDo('');
      setHinhAnhChungMinh([]);
      setPreviewUrls([]);
      fetchDonHang();
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Có lỗi xảy ra');
    } finally {
      setActionLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      let newFiles = Array.from(e.target.files);
      
      if (hinhAnhChungMinh.length + newFiles.length > 5) {
        alert('Bạn chỉ có thể tải lên tối đa 5 ảnh chứng minh');
        newFiles = newFiles.slice(0, 5 - hinhAnhChungMinh.length);
      }

      setHinhAnhChungMinh(prev => [...prev, ...newFiles]);

      newFiles.forEach(file => {
        let reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrls(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setHinhAnhChungMinh(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const getTrangThaiInfo = (trangThai: string) => {
    const info: Record<string, { color: string; text: string; icon: any }> = {
      choXacNhan: { color: 'yellow', text: 'Chờ xác nhận', icon: AlertCircle },
      daXacNhan: { color: 'blue', text: 'Đã xác nhận', icon: CheckCircle },
      choThanhToan: { color: 'orange', text: 'Chờ thanh toán', icon: CreditCard },
      daThanhToanCoc: { color: 'cyan', text: 'Đã thanh toán cọc', icon: Shield },
      dangGiao: { color: 'purple', text: 'Đang giao', icon: Package },
      choKiemTra: { color: 'indigo', text: 'Chờ kiểm tra', icon: AlertCircle },
      tranh_chap_xe_sai: { color: 'red', text: 'Tranh chấp: Xe sai mô tả', icon: XCircle },
      tranh_chap_khach_huy: { color: 'red', text: 'Tranh chấp: Khách hủy', icon: XCircle },
      daHoanThanh: { color: 'green', text: 'Hoàn tất', icon: CheckCircle },
      daHuy: { color: 'gray', text: 'Đã hủy', icon: XCircle },
    };
    return info[trangThai] || { color: 'gray', text: trangThai, icon: AlertCircle };
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  const getPhuongThucText = (method: string) => {
    const texts: Record<string, string> = {
      tienMat: 'Tiền mặt / Gặp trực tiếp',
      chuyenKhoanOnline: 'Chuyển khoản online',
      vayNganHang: 'Vay ngân hàng',
    };
    return texts[method] || method;
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

  if (!donHang) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Không tìm thấy đơn hàng</p>
        </div>
      </MainLayout>
    );
  }

  const xe = typeof donHang.idXe === 'object' && donHang.idXe !== null ? (donHang.idXe as any) : null;
  const statusInfo = getTrangThaiInfo(donHang.trangThai);
  const StatusIcon = statusInfo.icon;

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white py-12">
        <div className="container-custom max-w-5xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Chi tiết đơn hàng</h1>
            <p className="text-gray-600">Mã đơn: #{donHang._id?.slice(-8).toUpperCase()}</p>
          </motion.div>

          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`card p-6 mb-6 bg-${statusInfo.color}-50 border-2 border-${statusInfo.color}-200`}
          >
            <div className="flex items-center space-x-3">
              <StatusIcon className={`w-8 h-8 text-${statusInfo.color}-600`} />
              <div>
                <h3 className={`text-xl font-bold text-${statusInfo.color}-800`}>{statusInfo.text}</h3>
                <p className="text-sm text-gray-600">
                  Ngày đặt: {new Date(donHang.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Xe Info */}
              {xe && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="card p-6"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Thông tin xe</h3>
                  <div className="flex space-x-4">
                    <div className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {xe.hinhAnh && xe.hinhAnh.length > 0 ? (
                        <img
                          src={`http://localhost:5000/${xe.hinhAnh[0]}`}
                          alt={xe.tenXe}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No image
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-800">{xe.tenXe}</h4>
                      <p className="text-gray-600">{xe.hangXe}</p>
                      <p className="text-sm text-gray-500">Năm: {xe.namSanXuat}</p>
                      <p className="text-sm text-gray-500">Số km: {xe.soKm?.toLocaleString()} km</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Chi phí chi tiết */}
              {donHang.chiPhi && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="card p-6"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Chi phí chi tiết</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Giá xe</span>
                      <span className="font-semibold">{formatPrice(donHang.chiPhi.giaXe)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phí sàn (1%)</span>
                      <span className="font-semibold">{formatPrice(donHang.chiPhi.phiSan)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thuế trước bạ (10%)</span>
                      <span className="font-semibold">{formatPrice(donHang.chiPhi.thueTruocBa)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phí đăng ký</span>
                      <span className="font-semibold">{formatPrice(donHang.chiPhi.phiDangKy)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phí ra biển</span>
                      <span className="font-semibold">{formatPrice(donHang.chiPhi.phiRaBien)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bảo hiểm bắt buộc</span>
                      <span className="font-semibold">{formatPrice(donHang.chiPhi.baoHiem)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phí vận chuyển</span>
                      <span className="font-semibold">{formatPrice(donHang.chiPhi.phiVanChuyen)}</span>
                    </div>
                    <div className="border-t-2 border-gray-200 pt-3 flex justify-between">
                      <span className="font-bold text-lg text-gray-800">Tổng cộng</span>
                      <span className="font-bold text-xl text-primary-600">{formatPrice(donHang.tongTien)}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Delivery Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card p-6"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">Thông tin giao hàng</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Địa chỉ giao</p>
                      <p className="font-semibold text-gray-800">{donHang.diaChiGiao}</p>
                    </div>
                  </div>
                  {donHang.ghiChu && (
                    <div className="flex items-start space-x-3">
                      <FileText className="w-5 h-5 text-gray-500 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Ghi chú</p>
                        <p className="text-gray-700">{donHang.ghiChu}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card p-6"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-4">Phương thức thanh toán</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <CreditCard className="w-6 h-6 text-primary-600" />
                  <span className="font-semibold">{getPhuongThucText(donHang.phuongThucThanhToan)}</span>
                </div>

                {/* Escrow Info */}
                {donHang.phuongThucThanhToan === 'tienMat' && donHang.tienCoc && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="w-5 h-5 text-amber-600" />
                      <span className="font-semibold text-amber-800">Tiền cọc Escrow</span>
                    </div>
                    <p className="text-2xl font-bold text-amber-900 mb-2">{formatPrice(donHang.tienCoc)}</p>
                    <p className="text-sm text-amber-700">
                      Trạng thái: {donHang.trangThaiCoc === 'chuaThanhToan' && 'Chưa thanh toán'}
                      {donHang.trangThaiCoc === 'daThanhToan' && 'Đã thanh toán'}
                      {donHang.trangThaiCoc === 'daHoan' && 'Đã hoàn'}
                      {donHang.trangThaiCoc === 'daTichThu' && 'Đã tịch thu'}
                    </p>
                  </div>
                )}

                {/* Bank Loan Info */}
                {donHang.vayNganHang && (
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg mt-4">
                    <h4 className="font-semibold text-purple-800 mb-2">Thông tin vay</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-600">Ngân hàng:</span> <span className="font-semibold">{donHang.vayNganHang.tenNganHang}</span></p>
                      <p><span className="text-gray-600">Số tiền vay:</span> <span className="font-semibold">{formatPrice(donHang.vayNganHang.soTienVay)}</span></p>
                      <p><span className="text-gray-600">Kỳ hạn:</span> <span className="font-semibold">{donHang.vayNganHang.kyHan} tháng</span></p>
                      <p><span className="text-gray-600">Lãi suất:</span> <span className="font-semibold">{donHang.vayNganHang.laiSuat}%/năm</span></p>
                      <p><span className="text-gray-600">Trả hàng tháng:</span> <span className="font-semibold text-purple-900">{formatPrice(donHang.vayNganHang.traHangThang)}</span></p>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Actions */}
              {/* Chờ xác nhận - Có thể hủy đơn */}
              {['choNguoiBanXacNhan', 'nguoiBanDaXacNhan', 'choXacNhanThanhToan'].includes(donHang.trangThai) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="card p-6"
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Thao tác</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {donHang.trangThai === 'choNguoiBanXacNhan' && 'Đơn hàng đang chờ người bán xác nhận.'}
                    {donHang.trangThai === 'nguoiBanDaXacNhan' && 'Người bán đã xác nhận. Vui lòng chuyển khoản và upload biên lai.'}
                    {donHang.trangThai === 'choXacNhanThanhToan' && 'Đang chờ người bán xác nhận đã nhận tiền.'}
                  </p>
                  
                  <button
                    onClick={() => setShowCancelModal(true)}
                    disabled={actionLoading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-semibold transition flex items-center justify-center space-x-2"
                  >
                    <XCircle className="w-5 h-5" />
                    <span>Hủy đơn hàng</span>
                  </button>
                </motion.div>
              )}

              {/* Chờ kiểm tra - Xác nhận sau khi nhận xe */}
              {donHang.phuongThucThanhToan === 'tienMat' && donHang.trangThai === 'choKiemTra' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="card p-6"
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Xác nhận kết quả</h3>
                  <p className="text-sm text-gray-600 mb-4">Bạn đã kiểm tra xe? Vui lòng xác nhận kết quả:</p>
                  
                  <button
                    onClick={handleXacNhanThanhCong}
                    disabled={actionLoading}
                    className="w-full btn-primary mb-3 flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Xe đúng mô tả - Hoàn tất</span>
                  </button>

                  <button
                    onClick={() => setShowReportModal(true)}
                    disabled={actionLoading}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg font-semibold transition mb-3 flex items-center justify-center space-x-2"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <span>Xe sai mô tả</span>
                  </button>

                  <button
                    onClick={() => setShowCancelModal(true)}
                    disabled={actionLoading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-semibold transition flex items-center justify-center space-x-2"
                  >
                    <XCircle className="w-5 h-5" />
                    <span>Tôi muốn hủy</span>
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-2">Báo cáo xe sai mô tả</h3>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
              <p className="text-sm text-blue-800">
                ✓ Admin sẽ xử lý trong 24h<br/>
                ✓ Hoàn lại 100% tiền cọc nếu xác nhận đúng<br/>
                ✓ Vui lòng cung cấp hình ảnh chứng minh
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả vấn đề <span className="text-red-500">*</span>
              </label>
              <textarea
                value={lyDo}
                onChange={(e) => setLyDo(e.target.value)}
                placeholder="VD: Xe bị trầy xước nhiều, nội thất cũ kỹ không giống hình ảnh..."
                className="input-field w-full h-32"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình ảnh chứng minh <span className="text-red-500">*</span>
                <span className="text-gray-500 text-xs ml-2">(Tối đa 5 ảnh)</span>
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-500 transition-colors">
                <input
                  type="file"
                  id="hinhAnhChungMinh"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="hinhAnhChungMinh"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-10 h-10 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Nhấn để tải ảnh lên
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    (Ảnh xe thực tế, vị trí lỗi, vết trầy xước...)
                  </span>
                </label>
              </div>

              {previewUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-28 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {hinhAnhChungMinh.length === 0 && (
                <p className="text-sm text-amber-600 mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Cần ít nhất 1 hình ảnh để gửi báo cáo
                </p>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setLyDo('');
                  setHinhAnhChungMinh([]);
                  setPreviewUrls([]);
                }}
                className="flex-1 btn-secondary"
              >
                Hủy
              </button>
              <button
                onClick={handleBaoCaoXeSai}
                disabled={actionLoading || !lyDo.trim() || hinhAnhChungMinh.length === 0}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'Đang gửi...' : 'Gửi báo cáo'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl font-bold text-red-800 mb-4">⚠️ Cảnh báo: Hủy đơn hàng</h3>
            
            {/* Cảnh báo khác nhau tùy trạng thái */}
            {['choNguoiBanXacNhan', 'nguoiBanDaXacNhan'].includes(donHang.trangThai) ? (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                <p className="text-sm text-blue-800">
                  Đơn hàng chưa thanh toán cọc nên bạn có thể hủy miễn phí.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                <p className="text-sm text-red-800 font-semibold mb-2">Bạn sẽ mất 100% tiền cọc:</p>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Người bán nhận: {donHang.tienCoc && formatPrice(donHang.tienCoc / 2)}</li>
                  <li>• Xe Tốt nhận: {donHang.tienCoc && formatPrice(donHang.tienCoc / 2)}</li>
                </ul>
                <p className="text-xs text-red-600 mt-2 italic">
                  Chỉ hủy khi thực sự cần thiết. Tiền cọc sẽ không được hoàn lại.
                </p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do hủy <span className="text-red-500">*</span>
              </label>
              <textarea
                value={lyDo}
                onChange={(e) => setLyDo(e.target.value)}
                placeholder="VD: Đổi ý mua xe khác, không có nhu cầu nữa..."
                className="input-field w-full h-24"
              />
            </div>

            {/* Chỉ cần upload ảnh nếu đã thanh toán cọc */}
            {!['choNguoiBanXacNhan', 'nguoiBanDaXacNhan'].includes(donHang.trangThai) && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hình ảnh chứng minh (Không bắt buộc)
                  <span className="text-gray-500 text-xs ml-2">(Tối đa 5 ảnh)</span>
                </label>
                <p className="text-xs text-gray-600 mb-2">
                  Nếu bạn có lý do chính đáng (VD: bệnh, tai nạn...), upload chứng từ để được xem xét hoàn cọc
                </p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-500 transition-colors">
                <input
                  type="file"
                  id="hinhAnhHuy"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="hinhAnhHuy"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Nhấn để tải ảnh lên (nếu có)
                  </span>
                </label>
              </div>

                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-28 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setLyDo('');
                  setHinhAnhChungMinh([]);
                  setPreviewUrls([]);
                }}
                className="flex-1 btn-secondary"
              >
                Quay lại
              </button>
              <button
                onClick={handleHuyVoLyDo}
                disabled={actionLoading || !lyDo.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'Đang xử lý...' : 'Xác nhận hủy'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </MainLayout>
  );
};

export default ChiTietDonHang;

