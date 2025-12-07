import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, CreditCard, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import xeChoThueService from '../../services/xeChoThueService';
import donThueXeService from '../../services/donThueXeService';

interface XeChoThue {
  _id: string;
  tenXe: string;
  hangXe: string;
  giaThueTheoNgay: number;
  giaThueTheoThang: number;
  hinhAnh: string[];
  trangThai: string;
}

const DatThueXe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [xe, setXe] = useState<XeChoThue | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoice, setInvoice] = useState<any>(null);

  const [formData, setFormData] = useState({
    ngayBatDau: '',
    ngayKetThuc: '',
    loaiThue: 'ngay' as 'ngay' | 'thang',
    diaChiGiaoNhan: '',
    ghiChu: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/dang-nhap');
      return;
    }
    fetchXeDetail();
  }, [id, user]);

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

  const calculateTongTien = (): number => {
    if (!formData.ngayBatDau || !formData.ngayKetThuc || !xe) return 0;

    const batDau = new Date(formData.ngayBatDau);
    const ketThuc = new Date(formData.ngayKetThuc);
    const soNgay = Math.ceil((ketThuc.getTime() - batDau.getTime()) / (1000 * 60 * 60 * 24));

    if (soNgay <= 0) return 0;

    if (formData.loaiThue === 'thang') {
      const soThang = Math.ceil(soNgay / 30);
      return soThang * xe.giaThueTheoThang;
    } else {
      return soNgay * xe.giaThueTheoNgay;
    }
  };

  const calculatePhiSan = (): number => {
    const tongTien = calculateTongTien();
    return tongTien * 0.05; // 5% phí sàn
  };

  const calculateTongTienThanhToan = (): number => {
    return calculateTongTien() + calculatePhiSan();
  };

  const calculateSoNgay = (): number => {
    if (!formData.ngayBatDau || !formData.ngayKetThuc) return 0;
    const batDau = new Date(formData.ngayBatDau);
    const ketThuc = new Date(formData.ngayKetThuc);
    return Math.ceil((ketThuc.getTime() - batDau.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!xe || !user) return;

    const soNgay = calculateSoNgay();
    if (soNgay <= 0) {
      alert('Ngày kết thúc phải sau ngày bắt đầu');
      return;
    }

    setSubmitting(true);

    try {
      const donThueXe = await donThueXeService.createDonThueXe({
        idXeChoThue: xe._id,
        ngayBatDau: formData.ngayBatDau,
        ngayKetThuc: formData.ngayKetThuc,
        tongTien: calculateTongTien(),
        diaChiGiaoNhan: formData.diaChiGiaoNhan,
        ghiChu: formData.ghiChu,
      });
      
      // Tạo hóa đơn
      setInvoice({
        ...donThueXe,
        xe,
        tongTien: calculateTongTien(),
        phiSan: calculatePhiSan(),
        tongTienThanhToan: calculateTongTienThanhToan(),
        soNgay: calculateSoNgay(),
      });
      setShowInvoice(true);
      
      // Tự động điều hướng đến lịch sử đơn hàng sau 3 giây
      setTimeout(() => {
        navigate('/customer/don-hang?tab=thue');
      }, 3000);
    } catch (error: any) {
      console.error('Error submitting rental:', error);
      alert(error.response?.data?.error?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  const tongTien = calculateTongTien();
  const soNgay = calculateSoNgay();

  return (
    <MainLayout>
      <div className="bg-gradient-to-br from-primary-50 to-white min-h-screen">
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
            <Link to={`/thue-xe/${xe._id}`} className="text-gray-600 hover:text-primary-600">
              {xe.tenXe}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-primary-600 font-medium">Đặt thuê</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Thông tin đặt thuê xe</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Loại thuê */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Loại thuê
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label
                        className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.loaiThue === 'ngay'
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-primary-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="loaiThue"
                          value="ngay"
                          checked={formData.loaiThue === 'ngay'}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <span className="font-medium">Theo ngày</span>
                      </label>
                      <label
                        className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.loaiThue === 'thang'
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-primary-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="loaiThue"
                          value="thang"
                          checked={formData.loaiThue === 'thang'}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <span className="font-medium">Theo tháng</span>
                      </label>
                    </div>
                  </div>

                  {/* Thời gian thuê */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Ngày bắt đầu
                      </label>
                      <input
                        type="date"
                        name="ngayBatDau"
                        value={formData.ngayBatDau}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Ngày kết thúc
                      </label>
                      <input
                        type="date"
                        name="ngayKetThuc"
                        value={formData.ngayKetThuc}
                        onChange={handleChange}
                        min={formData.ngayBatDau || new Date().toISOString().split('T')[0]}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>

                  {soNgay > 0 && (
                    <div className="bg-primary-50 p-4 rounded-lg">
                      <p className="text-sm text-primary-800">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Thời gian thuê: <strong>{soNgay} ngày</strong>
                        {formData.loaiThue === 'thang' && ` (≈ ${Math.ceil(soNgay / 30)} tháng)`}
                      </p>
                    </div>
                  )}

                  {/* Địa chỉ giao nhận */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Địa chỉ giao xe
                    </label>
                    <input
                      type="text"
                      name="diaChiGiaoNhan"
                      value={formData.diaChiGiaoNhan}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Nhập địa chỉ nhận xe"
                      required
                    />
                  </div>

                  {/* Ghi chú */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ghi chú (tùy chọn)
                    </label>
                    <textarea
                      name="ghiChu"
                      value={formData.ghiChu}
                      onChange={handleChange}
                      rows={4}
                      className="input-field"
                      placeholder="Yêu cầu đặc biệt, thời gian giao xe mong muốn..."
                    />
                  </div>

                  {/* Terms */}
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5 mr-3" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium mb-1">Lưu ý khi thuê xe:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Đặt cọc trước 30% giá trị hợp đồng</li>
                          <li>Xuất trình CMND/CCCD và GPLX hợp lệ khi nhận xe</li>
                          <li>Hoàn trả xe đúng giờ để tránh phí phạt</li>
                          <li>Kiểm tra xe kỹ trước khi nhận và trả</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="btn-secondary flex-1"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2 inline" />
                      Quay lại
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || tongTien === 0}
                      className="btn-primary flex-1 disabled:opacity-50"
                    >
                      {submitting ? 'Đang thanh toán...' : `Thanh toán ${calculateTongTienThanhToan().toLocaleString('vi-VN')} ₫`}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>

            {/* Right: Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="card sticky top-24">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Thông tin xe</h3>

                {/* Car Info */}
                <div className="flex space-x-4 mb-6 pb-6 border-b border-gray-200">
                  <img
                    src={xe.hinhAnh?.[0] || '/placeholder-car.jpg'}
                    alt={xe.tenXe}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">{xe.tenXe}</h4>
                    <p className="text-sm text-gray-600">{xe.hangXe}</p>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Đơn giá:</span>
                    <span className="font-semibold text-gray-800">
                      {formData.loaiThue === 'ngay'
                        ? `${xe.giaThueTheoNgay.toLocaleString('vi-VN')} ₫/ngày`
                        : `${xe.giaThueTheoThang.toLocaleString('vi-VN')} ₫/tháng`}
                    </span>
                  </div>
                  {soNgay > 0 && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Thời gian:</span>
                        <span className="font-semibold text-gray-800">
                          {formData.loaiThue === 'ngay'
                            ? `${soNgay} ngày`
                            : `${Math.ceil(soNgay / 30)} tháng`}
                        </span>
                      </div>
                      <div className="border-t border-gray-200 pt-3 space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Phí thuê xe:</span>
                          <span className="font-medium text-gray-800">
                            {tongTien.toLocaleString('vi-VN')} ₫
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Phí sàn (5%):</span>
                          <span className="font-medium text-gray-800">
                            {calculatePhiSan().toLocaleString('vi-VN')} ₫
                          </span>
                        </div>
                        <div className="border-t border-gray-200 pt-2">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-800">Tổng thanh toán:</span>
                            <span className="text-2xl font-bold text-accent-600">
                              {calculateTongTienThanhToan().toLocaleString('vi-VN')} ₫
                            </span>
                          </div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg mt-2">
                          <p className="text-xs text-blue-800">
                            <CreditCard className="w-3 h-3 inline mr-1" />
                            Thanh toán qua ví. Vui lòng đảm bảo số dư đủ.
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Payment Methods */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <CreditCard className="w-4 h-4" />
                    <span className="font-medium">Phương thức thanh toán:</span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1 ml-6">
                    <li>• Tiền mặt khi nhận xe</li>
                    <li>• Chuyển khoản ngân hàng</li>
                    <li>• Ví điện tử (MoMo, ZaloPay)</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modal Hóa Đơn */}
      {showInvoice && invoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-8 max-w-2xl w-full my-8"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Đặt thuê xe thành công!</h2>
              <p className="text-gray-600">Mã đơn thuê: #{invoice._id?.slice(-8).toUpperCase()}</p>
            </div>

            {/* Thông báo thanh toán */}
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-bold text-green-800 mb-1">✅ Đã thanh toán thành công</p>
                  <p className="text-sm text-green-700">
                    Đơn thuê xe đã được thanh toán qua ví. Tiền đã được chuyển cho người cho thuê (trừ 5% phí sàn).
                  </p>
                </div>
              </div>
            </div>

            {/* Chi tiết xe */}
            <div className="mb-6">
              <h3 className="font-bold text-lg text-gray-800 mb-3">Thông tin xe</h3>
              <div className="flex space-x-4 p-4 bg-gray-50 rounded-lg">
                {invoice.idXeChoThue?.hinhAnh && invoice.idXeChoThue.hinhAnh.length > 0 ? (
                  <img
                    src={`http://localhost:5000/${invoice.idXeChoThue.hinhAnh[0]}`}
                    alt={invoice.idXeChoThue.tenXe}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                    No image
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-gray-800">{invoice.idXeChoThue?.tenXe || invoice.xe?.tenXe}</h4>
                  <p className="text-sm text-gray-600">{invoice.idXeChoThue?.hangXe || invoice.xe?.hangXe}</p>
                </div>
              </div>
            </div>

            {/* Thông tin thuê */}
            <div className="mb-6">
              <h3 className="font-bold text-lg text-gray-800 mb-3">Thông tin thuê</h3>
              <div className="space-y-2 text-sm p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày bắt đầu:</span>
                  <span className="font-semibold">{new Date(invoice.ngayBatDau).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày kết thúc:</span>
                  <span className="font-semibold">{new Date(invoice.ngayKetThuc).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số ngày thuê:</span>
                  <span className="font-semibold">
                    {invoice.soNgay || 
                      (invoice.ngayBatDau && invoice.ngayKetThuc 
                        ? Math.ceil((new Date(invoice.ngayKetThuc).getTime() - new Date(invoice.ngayBatDau).getTime()) / (1000 * 60 * 60 * 24))
                        : 0)} ngày
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Địa chỉ giao nhận:</span>
                  <span className="font-semibold text-right max-w-xs">{invoice.diaChiGiaoNhan}</span>
                </div>
              </div>
            </div>

            {/* Chi phí */}
            <div className="mb-6">
              <h3 className="font-bold text-lg text-gray-800 mb-3">Chi tiết thanh toán</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí thuê xe:</span>
                  <span className="font-semibold">{formatPrice(invoice.tongTien)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí sàn (5%):</span>
                  <span className="font-semibold">{formatPrice(invoice.phiSan || 0)}</span>
                </div>
                <div className="border-t-2 border-gray-200 pt-2 flex justify-between">
                  <span className="font-bold text-gray-800">Tổng thanh toán:</span>
                  <span className="font-bold text-xl text-primary-600">
                    {formatPrice(invoice.tongTienThanhToan || (invoice.tongTien + (invoice.phiSan || 0)))}
                  </span>
                </div>
              </div>
            </div>

            {/* Ghi chú nếu có */}
            {invoice.ghiChu && (
              <div className="mb-6">
                <h3 className="font-bold text-lg text-gray-800 mb-2">Ghi chú</h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{invoice.ghiChu}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3">
              <Link
                to="/customer/don-hang?tab=thue"
                className="flex-1 btn-primary text-center"
              >
                Xem đơn hàng
              </Link>
              <Link
                to="/"
                className="flex-1 btn-secondary text-center"
              >
                Về trang chủ
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </MainLayout>
  );
};

export default DatThueXe;

