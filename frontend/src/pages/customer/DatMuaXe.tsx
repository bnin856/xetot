import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { CreditCard, MapPin, FileText, Calculator, TrendingUp, Info } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { xeService } from '../../services/xeService';
import { donHangService } from '../../services/donHangService';
import { Xe } from '../../types';
import { 
  topBanks, 
  calculateMonthlyPayment, 
  calculateTotalInterest,
  calculateAnnuitySchedule,
  calculateDecliningSchedule,
  calculateFloatingSchedule,
  Bank,
  PaymentSchedule
} from '../../data/banks';

const DatMuaXe: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Nhận state từ trang chọn phương thức thanh toán
  const { xe: xeFromState, fees: feesFromState, phuongThucThanhToan, tienCoc } = location.state || {};
  
  const [xe, setXe] = useState<Xe | null>(xeFromState || null);
  const [loading, setLoading] = useState(!xeFromState);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    diaChiGiao: '',
    phuongThucThanhToan: phuongThucThanhToan || ('tienMat' as 'tienMat' | 'chuyenKhoanOnline' | 'vayNganHang'),
    ghiChu: '',
  });
  const [showLoanCalculator, setShowLoanCalculator] = useState(false);
  const [loanAmount, setLoanAmount] = useState(0);
  const [loanTerm, setLoanTerm] = useState(60); // 5 năm mặc định
  const [downPayment, setDownPayment] = useState(20); // 20% trả trước
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'annuity' | 'declining'>('annuity');
  const bankDetailRef = useRef<HTMLDivElement>(null);

  const handleSelectBank = (bank: Bank) => {
    setSelectedBank(bank);
    // Scroll xuống phần chi tiết ngân hàng sau 100ms
    setTimeout(() => {
      bankDetailRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  };

  useEffect(() => {
    // Nếu không có state từ trang trước, fetch xe
    if (!xeFromState) {
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
    }
  }, [id, xeFromState]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  const calculateFees = () => {
    // Nếu có fees từ state, dùng luôn
    if (feesFromState) return feesFromState;
    
    if (!xe) return {
      giaXe: 0,
      thueTruocBa: 0,
      phiDangKy: 0,
      phiRaBien: 0,
      baoHiem: 0,
      phiVanChuyen: 0,
      total: 0,
    };

    const giaXe = xe.gia;
    // PHÍ SÀN KHÔNG tính vào tổng chi phí, sẽ thu từ cọc 2%
    const thueTruocBa = giaXe * 0.10; // 10% thuế trước bạ
    const phiDangKy = 2000000; // 2 triệu
    const phiRaBien = 1000000; // 1 triệu
    const baoHiem = 600000; // 600k/năm
    const phiVanChuyen = 500000; // 500k

    const total = giaXe + thueTruocBa + phiDangKy + phiRaBien + baoHiem + phiVanChuyen;

    return {
      giaXe,
      thueTruocBa,
      phiDangKy,
      phiRaBien,
      baoHiem,
      phiVanChuyen,
      total,
    };
  };

  const fees = calculateFees();

  useEffect(() => {
    if (xe) {
      const totalAmount = fees.total;
      const downPaymentAmount = totalAmount * (downPayment / 100);
      setLoanAmount(totalAmount - downPaymentAmount);
    }
  }, [xe, downPayment, fees.total]);

  const [showInvoice, setShowInvoice] = useState(false);
  const [invoice, setInvoice] = useState<any>(null);
  const [showNapTienModal, setShowNapTienModal] = useState(false);
  const [wallet, setWallet] = useState<any>(null);

  // Fetch wallet info
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const { default: walletService } = await import('../../services/walletService');
        const response = await walletService.getMyWallet();
        if (response.success) {
          setWallet(response.data.wallet);
        }
      } catch (error) {
        console.error('Error fetching wallet:', error);
      }
    };
    if (user) {
      fetchWallet();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !xe) return;

    // Kiểm tra ví nếu là tiền mặt
    if (formData.phuongThucThanhToan === 'tienMat' && tienCoc) {
      if (!wallet || wallet.soDuKhaDung < tienCoc) {
        setShowNapTienModal(true);
        return;
      }
    }

    setSubmitting(true);
    try {
      const phiSan = fees.giaXe * 0.01; // 1% phí sàn (thu từ cọc, không tính vào tổng)
      
      const orderData: any = {
        idXe: id,
        tongTien: fees.total,
        phuongThucThanhToan: formData.phuongThucThanhToan,
        diaChiGiao: formData.diaChiGiao,
        ghiChu: formData.ghiChu,
        chiPhi: {
          giaXe: fees.giaXe,
          phiSan: phiSan,
          thueTruocBa: fees.thueTruocBa,
          phiDangKy: fees.phiDangKy,
          phiRaBien: fees.phiRaBien,
          baoHiem: fees.baoHiem,
          phiVanChuyen: fees.phiVanChuyen,
        },
      };

      // Nếu là tiền mặt, thêm thông tin cọc
      if (formData.phuongThucThanhToan === 'tienMat' && tienCoc) {
        orderData.tienCoc = tienCoc;
        orderData.trangThaiCoc = 'chuaThanhToan';
      }

      // Nếu là vay ngân hàng, thêm thông tin vay
      if (formData.phuongThucThanhToan === 'vayNganHang' && selectedBank) {
        orderData.vayNganHang = {
          tenNganHang: selectedBank.name,
          soTienVay: loanAmount,
          kyHan: loanTerm,
          laiSuat: selectedBank.loanRate,
          traHangThang: calculateMonthlyPayment(loanAmount, selectedBank.loanRate, loanTerm),
          phuongThucTra: paymentMethod === 'annuity' ? 'traDeu' : 'traGiamDan',
        };
      }

      const response = await donHangService.create(orderData);
      
      // Tạo hóa đơn
      setInvoice({
        ...response.data.donHang,
        xe,
        fees,
        tienCoc,
      });
      setShowInvoice(true);
      
      // Tự động điều hướng đến lịch sử đơn hàng sau 3 giây
      setTimeout(() => {
        navigate('/customer/don-hang');
      }, 3000);
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <MainLayout>
        <div className="page-container py-8">
          <div className="container-custom max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Đặt mua xe</h1>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : xe ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Car Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card p-6"
                >
                  <h2 className="text-xl font-semibold mb-4">Thông tin xe</h2>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 h-24 bg-gray-200 rounded-lg overflow-hidden">
                      {xe.hinhAnh && xe.hinhAnh.length > 0 ? (
                        <img
                          src={`http://localhost:5000/${xe.hinhAnh[0]}`}
                          alt={xe.tenXe}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          Chưa có ảnh
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{xe.tenXe}</h3>
                      <p className="text-primary-600 font-bold text-xl">{formatPrice(xe.gia)}</p>
                    </div>
                  </div>
                </motion.div>

            {/* Delivery Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-semibold">Địa chỉ giao xe</h2>
              </div>
              <textarea
                value={formData.diaChiGiao}
                onChange={(e) => setFormData({ ...formData, diaChiGiao: e.target.value })}
                className="input-field"
                rows={3}
                placeholder="Nhập địa chỉ giao xe"
                required
              />
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6"
            >
              <div className="flex items-center space-x-2 mb-4">
                <CreditCard className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-semibold">Phương thức thanh toán</h2>
              </div>
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                  <input
                    type="radio"
                    name="phuongThucThanhToan"
                    value="tienMat"
                    checked={formData.phuongThucThanhToan === 'tienMat'}
                    onChange={(e) => setFormData({ ...formData, phuongThucThanhToan: e.target.value })}
                    className="mr-3"
                  />
                  <span>Tiền mặt khi nhận xe</span>
                </label>
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                  <input
                    type="radio"
                    name="phuongThucThanhToan"
                    value="chuyenKhoanOnline"
                    checked={formData.phuongThucThanhToan === 'chuyenKhoanOnline'}
                    onChange={(e) => setFormData({ ...formData, phuongThucThanhToan: e.target.value as any })}
                    className="mr-3"
                  />
                  <span>Chuyển khoản ngân hàng</span>
                </label>
              </div>
            </motion.div>

            {/* Notes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-6"
            >
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-semibold">Ghi chú</h2>
              </div>
              <textarea
                value={formData.ghiChu}
                onChange={(e) => setFormData({ ...formData, ghiChu: e.target.value })}
                className="input-field"
                rows={4}
                placeholder="Ghi chú thêm (nếu có)"
              />
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card p-6 bg-gray-50"
            >
              <h2 className="text-xl font-semibold mb-4">Chi tiết chi phí</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Giá xe:</span>
                  <span className="font-medium">{formatPrice(fees.giaXe)}</span>
                </div>
                {/* Phí sàn được thu từ cọc 2%, không tính vào tổng */}
                <div className="flex justify-between text-sm text-gray-600">
                  <span className="flex items-center">
                    <Info className="w-3 h-3 mr-1" />
                    Thuế trước bạ (10%):
                  </span>
                  <span>{formatPrice(fees.thueTruocBa)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span className="flex items-center">
                    <Info className="w-3 h-3 mr-1" />
                    Phí đăng ký xe:
                  </span>
                  <span>{formatPrice(fees.phiDangKy)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span className="flex items-center">
                    <Info className="w-3 h-3 mr-1" />
                    Phí ra biển:
                  </span>
                  <span>{formatPrice(fees.phiRaBien)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span className="flex items-center">
                    <Info className="w-3 h-3 mr-1" />
                    Bảo hiểm bắt buộc (1 năm):
                  </span>
                  <span>{formatPrice(fees.baoHiem)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span className="flex items-center">
                    <Info className="w-3 h-3 mr-1" />
                    Phí vận chuyển:
                  </span>
                  <span>{formatPrice(fees.phiVanChuyen)}</span>
                </div>
                <div className="border-t-2 border-primary-200 pt-3 mt-3 flex justify-between text-lg font-bold">
                  <span className="text-primary-800">Tổng chi phí:</span>
                  <span className="text-primary-600">{formatPrice(fees.total)}</span>
                </div>
              </div>
              
              {/* Loan Calculator Toggle */}
              <button
                type="button"
                onClick={() => setShowLoanCalculator(!showLoanCalculator)}
                className="w-full mb-4 flex items-center justify-center space-x-2 py-3 border-2 border-accent-500 text-accent-600 rounded-lg hover:bg-accent-50 transition-all font-medium"
              >
                <Calculator className="w-5 h-5" />
                <span>{showLoanCalculator ? 'Ẩn' : 'Xem'} gói vay ngân hàng</span>
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Đang xử lý...' : 'Xác nhận đặt mua'}
              </button>
            </motion.div>

            {/* Loan Calculator Section */}
            {showLoanCalculator && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="card p-6 mt-6"
              >
                <div className="flex items-center space-x-2 mb-6">
                  <TrendingUp className="w-6 h-6 text-accent-600" />
                  <h2 className="text-2xl font-bold text-gray-800">Gói vay ngân hàng</h2>
                </div>

                {/* Loan Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trả trước (%)
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="50"
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>{downPayment}%</span>
                      <span className="font-semibold text-primary-600">
                        {formatPrice(fees.total * (downPayment / 100))}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thời hạn vay (tháng)
                    </label>
                    <select
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(Number(e.target.value))}
                      className="w-full input-field"
                    >
                      <option value={12}>12 tháng (1 năm)</option>
                      <option value={24}>24 tháng (2 năm)</option>
                      <option value={36}>36 tháng (3 năm)</option>
                      <option value={48}>48 tháng (4 năm)</option>
                      <option value={60}>60 tháng (5 năm)</option>
                      <option value={72}>72 tháng (6 năm)</option>
                      <option value={84}>84 tháng (7 năm)</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4 p-4 bg-primary-50 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Số tiền vay:</span>
                    <span className="font-bold text-primary-600 text-lg">
                      {formatPrice(loanAmount)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    = Tổng chi phí ({formatPrice(fees.total)}) - Trả trước ({downPayment}%)
                  </div>
                </div>

                {/* Bank Comparison Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-primary-700 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left">Ngân hàng</th>
                        <th className="px-4 py-3 text-center">Lãi suất</th>
                        <th className="px-4 py-3 text-center">Uy tín</th>
                        <th className="px-4 py-3 text-right">Trả/tháng</th>
                        <th className="px-4 py-3 text-right">Tổng lãi</th>
                        <th className="px-4 py-3 text-right">Tổng trả</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {topBanks
                        .filter(bank => loanTerm >= bank.minTerm && loanTerm <= bank.maxTerm)
                        .sort((a, b) => {
                          // Sort by: rating (desc), then rate (asc)
                          if (b.rating !== a.rating) return b.rating - a.rating;
                          return a.loanRate - b.loanRate;
                        })
                        .map((bank) => {
                          const maxLoan = fees.total * (bank.maxLoanPercent / 100);
                          const actualLoanAmount = Math.min(loanAmount, maxLoan);
                          const monthlyPayment = calculateMonthlyPayment(
                            actualLoanAmount,
                            bank.loanRate,
                            loanTerm
                          );
                          const totalInterest = calculateTotalInterest(
                            actualLoanAmount,
                            bank.loanRate,
                            loanTerm
                          );
                          const totalPayment = monthlyPayment * loanTerm;

                          return (
                            <tr 
                              key={bank.id} 
                              className={`cursor-pointer transition-all ${
                                selectedBank?.id === bank.id 
                                  ? 'bg-primary-100 border-l-4 border-primary-600 shadow-md' 
                                  : 'hover:bg-gray-50 hover:shadow-sm'
                              }`}
                              onClick={() => handleSelectBank(bank)}
                            >
                              <td className="px-4 py-3">
                                <div className="flex items-center space-x-3">
                                  <div 
                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md"
                                    style={{ backgroundColor: bank.color }}
                                  >
                                    {bank.name.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-gray-800">{bank.name}</div>
                                    <div className="text-xs text-gray-500">{bank.fullName}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded font-medium">
                                  {bank.loanRate}%/năm
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <div className="flex items-center justify-center">
                                  {'⭐'.repeat(Math.floor(bank.rating))}
                                  {bank.rating % 1 !== 0 && '½'}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right font-semibold text-accent-600">
                                {formatPrice(monthlyPayment)}
                              </td>
                              <td className="px-4 py-3 text-right text-gray-600">
                                {formatPrice(totalInterest)}
                              </td>
                              <td className="px-4 py-3 text-right font-bold text-primary-600">
                                {formatPrice(totalPayment)}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>

                {/* Bank Details */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topBanks.slice(0, 6).map((bank) => (
                    <div key={bank.id} className="p-4 border border-gray-200 rounded-lg hover:border-primary-400 transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">{bank.name}</h4>
                        <span className="text-xs bg-accent-100 text-accent-700 px-2 py-1 rounded">
                          {bank.loanRate}%
                        </span>
                      </div>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {bank.advantages.map((adv, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-green-600 mr-1">✓</span>
                            {adv}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-sm text-gray-700">
                  <p className="font-semibold mb-2">📌 Lưu ý quan trọng:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Lãi suất có thể thay đổi theo chính sách ngân hàng</li>
                    <li>Cần có chứng minh thu nhập ổn định</li>
                    <li>Phí hồ sơ: {topBanks[0].processingFee}% - {topBanks[topBanks.length-1].processingFee}% giá trị khoản vay</li>
                    <li>Thời gian duyệt hồ sơ: 1-3 ngày làm việc</li>
                    <li>👆 <strong>Click chọn ngân hàng</strong> để xem chi tiết lịch trả từng tháng</li>
                  </ul>
                </div>
              </motion.div>
            )}

            {/* Detailed Payment Schedule */}
            {selectedBank && showLoanCalculator && (
              <motion.div
                ref={bankDetailRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6 mt-6 scroll-mt-24"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-3xl shadow-lg"
                      style={{ backgroundColor: selectedBank.color }}
                    >
                      {selectedBank.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{selectedBank.name}</h3>
                      <p className="text-sm text-gray-600">Lãi suất: {selectedBank.loanRate}%/năm</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedBank(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                {/* Payment Method Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Phương thức trả nợ
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setPaymentMethod('annuity');
                      }}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        paymentMethod === 'annuity'
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <div className="font-semibold text-gray-800 mb-1">Trả đều hàng tháng</div>
                      <div className="text-xs text-gray-600">
                        Số tiền cố định mỗi kỳ. Dễ quản lý tài chính.
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setPaymentMethod('declining');
                      }}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        paymentMethod === 'declining'
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <div className="font-semibold text-gray-800 mb-1">Trả giảm dần</div>
                      <div className="text-xs text-gray-600">
                        Gốc cố định, lãi giảm theo thời gian. Tiết kiệm hơn.
                      </div>
                    </button>
                  </div>
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-800">
                      <strong>⚠️ Lưu ý:</strong> Cả 2 phương thức đều áp dụng lãi thả nổi: 
                      <strong className="text-amber-900"> 2 năm đầu lãi ưu đãi {selectedBank.loanRate}%, từ năm 3 tăng lên {selectedBank.loanRate + 2}%</strong>
                    </p>
                  </div>
                </div>

                {/* Payment Schedule Table */}
                {(() => {
                  const maxLoan = fees.total * (selectedBank.maxLoanPercent / 100);
                  const actualLoanAmount = Math.min(loanAmount, maxLoan);
                  
                  let schedule: PaymentSchedule[] = [];
                  if (paymentMethod === 'annuity') {
                    schedule = calculateAnnuitySchedule(actualLoanAmount, selectedBank.loanRate, loanTerm);
                  } else {
                    schedule = calculateDecliningSchedule(actualLoanAmount, selectedBank.loanRate, loanTerm);
                  }

                  const totalPayment = schedule.reduce((sum, s) => sum + s.payment, 0);
                  const totalInterest = schedule.reduce((sum, s) => sum + s.interest, 0);

                  return (
                    <>
                      {/* Summary */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">Số tiền vay</div>
                          <div className="text-lg font-bold text-blue-600">
                            {formatPrice(actualLoanAmount)}
                          </div>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">Tháng đầu</div>
                          <div className="text-lg font-bold text-green-600">
                            {formatPrice(schedule[0]?.payment || 0)}
                          </div>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">Tổng lãi</div>
                          <div className="text-lg font-bold text-orange-600">
                            {formatPrice(totalInterest)}
                          </div>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">Tổng trả</div>
                          <div className="text-lg font-bold text-red-600">
                            {formatPrice(totalPayment)}
                          </div>
                        </div>
                      </div>

                      {/* Detailed Schedule */}
                      <div className="max-h-96 overflow-y-auto border rounded-lg">
                        <table className="w-full text-sm">
                          <thead className="bg-primary-700 text-white sticky top-0">
                            <tr>
                              <th className="px-4 py-3 text-center w-24">Tháng</th>
                              <th className="px-4 py-3 text-right">Trả hàng tháng (₫)</th>
                              <th className="px-4 py-3 text-right">Gốc (₫)</th>
                              <th className="px-4 py-3 text-right">Lãi (₫)</th>
                              <th className="px-4 py-3 text-right">Còn lại (₫)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {schedule.map((item) => (
                              <tr key={item.month} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 text-center font-medium text-gray-700">
                                  {item.month}
                                </td>
                                <td className="px-4 py-3 text-right font-semibold text-primary-600 tabular-nums">
                                  {item.payment.toLocaleString('vi-VN')}
                                </td>
                                <td className="px-4 py-3 text-right text-green-600 tabular-nums">
                                  {item.principal.toLocaleString('vi-VN')}
                                </td>
                                <td className="px-4 py-3 text-right text-orange-600 tabular-nums">
                                  {item.interest.toLocaleString('vi-VN')}
                                </td>
                                <td className="px-4 py-3 text-right text-gray-600 tabular-nums">
                                  {item.remainingBalance.toLocaleString('vi-VN')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-gray-100 font-bold sticky bottom-0 border-t-2 border-primary-200">
                            <tr>
                              <td className="px-4 py-3 text-center">TỔNG</td>
                              <td className="px-4 py-3 text-right text-primary-600 tabular-nums">
                                {totalPayment.toLocaleString('vi-VN')}
                              </td>
                              <td className="px-4 py-3 text-right text-green-600 tabular-nums">
                                {actualLoanAmount.toLocaleString('vi-VN')}
                              </td>
                              <td className="px-4 py-3 text-right text-orange-600 tabular-nums">
                                {totalInterest.toLocaleString('vi-VN')}
                              </td>
                              <td className="px-4 py-3 text-right text-gray-400">-</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>

                      {/* Comparison */}
                      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-3">So sánh 2 phương thức:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          {['annuity', 'declining'].map((method) => {
                            const methodSchedule = 
                              method === 'annuity' 
                                ? calculateAnnuitySchedule(actualLoanAmount, selectedBank.loanRate, loanTerm)
                                : calculateDecliningSchedule(actualLoanAmount, selectedBank.loanRate, loanTerm);
                            
                            const methodTotal = methodSchedule.reduce((sum, s) => sum + s.interest, 0);
                            const methodName = method === 'annuity' ? 'Trả đều' : 'Trả giảm dần';
                            const firstMonth = methodSchedule[0]?.payment || 0;
                            const lastMonth = methodSchedule[methodSchedule.length - 1]?.payment || 0;
                            
                            return (
                              <div key={method} className={`p-4 rounded-lg ${paymentMethod === method ? 'bg-white border-2 border-primary-500 shadow-md' : 'bg-white/70'}`}>
                                <div className="font-semibold text-gray-800 mb-2">{methodName}</div>
                                <div className="space-y-1 text-xs text-gray-600">
                                  <div>Tháng đầu: <span className="font-semibold text-blue-600">{formatPrice(firstMonth)}</span></div>
                                  <div>Tháng cuối: <span className="font-semibold text-blue-600">{formatPrice(lastMonth)}</span></div>
                                  <div>Tổng lãi: <span className="font-semibold text-orange-600">{formatPrice(methodTotal)}</span></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Floating Rate Note */}
                      <div className="mt-4 p-4 bg-amber-50 border-l-4 border-amber-400">
                        <p className="text-sm font-semibold text-amber-800 mb-2">📊 Lãi suất thả nổi - Áp dụng cho tất cả:</p>
                        <ul className="text-xs text-amber-700 space-y-1">
                          <li>• <strong>Tháng 1-24 (2 năm đầu)</strong>: Lãi ưu đãi <span className="font-bold">{selectedBank.loanRate}%/năm</span> (cố định)</li>
                          <li>• <strong>Từ tháng 25 trở đi</strong>: Lãi thả nổi <span className="font-bold">{selectedBank.loanRate + 2}%/năm</span> (tăng 2%)</li>
                          <li>• Bảng trên đã tính sẵn cả 2 giai đoạn</li>
                          <li>• <strong className="text-amber-900">Lưu ý:</strong> Từ tháng 25, số tiền trả/tháng sẽ tăng do lãi suất cao hơn</li>
                        </ul>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            )}
            </form>
          ) : (
            <div className="text-center py-12 text-gray-600">
              <p>Không tìm thấy xe</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>

    {/* Modal Nạp Tiền */}
    {showNapTienModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl p-6 max-w-md w-full"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Số dư không đủ!</h3>
            <p className="text-gray-600 mb-4">
              Bạn cần nạp thêm tiền vào ví để đặt cọc
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Số dư hiện tại:</span>
              <span className="font-semibold text-gray-800">{wallet ? formatPrice(wallet.soDuKhaDung) : '0 ₫'}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Tiền cọc cần:</span>
              <span className="font-semibold text-orange-600">{formatPrice(tienCoc || 0)}</span>
            </div>
            <div className="border-t border-amber-300 my-2"></div>
            <div className="flex justify-between">
              <span className="text-sm font-semibold text-gray-700">Cần nạp thêm:</span>
              <span className="font-bold text-red-600">{formatPrice((tienCoc || 0) - (wallet?.soDuKhaDung || 0))}</span>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowNapTienModal(false)}
              className="flex-1 btn-secondary"
            >
              Hủy
            </button>
            <Link
              to="/customer/vi"
              className="flex-1 btn-primary text-center"
            >
              Nạp tiền ngay
            </Link>
          </div>
        </motion.div>
      </div>
    )}

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
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Đặt hàng thành công!</h2>
            <p className="text-gray-600">Mã đơn hàng: #{invoice._id?.slice(-8).toUpperCase()}</p>
          </div>

          {/* Thông báo cọc */}
          {invoice.phuongThucThanhToan === 'tienMat' && invoice.tienCoc && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-bold text-green-800 mb-1">✅ Đã trừ tiền cọc tự động</p>
                  <p className="text-sm text-green-700">
                    Đã trừ <strong>{formatPrice(invoice.tienCoc)}</strong> từ ví của bạn làm tiền đặt cọc.
                    Số dư còn lại: <strong>{wallet ? formatPrice(wallet.soDuKhaDung - invoice.tienCoc) : '0 ₫'}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Chi tiết xe */}
          <div className="mb-6">
            <h3 className="font-bold text-lg text-gray-800 mb-3">Thông tin xe</h3>
            <div className="flex space-x-4 p-4 bg-gray-50 rounded-lg">
              {invoice.xe?.hinhAnh && invoice.xe.hinhAnh.length > 0 && (
                <img
                  src={`http://localhost:5000/${invoice.xe.hinhAnh[0]}`}
                  alt={invoice.xe.tenXe}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}
              <div>
                <h4 className="font-bold text-gray-800">{invoice.xe?.tenXe}</h4>
                <p className="text-sm text-gray-600">{invoice.xe?.hangXe} - {invoice.xe?.namSanXuat}</p>
                <p className="text-sm text-gray-600">Số km: {invoice.xe?.soKm?.toLocaleString()} km</p>
              </div>
            </div>
          </div>

          {/* Chi phí */}
          <div className="mb-6">
            <h3 className="font-bold text-lg text-gray-800 mb-3">Chi tiết chi phí</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Giá xe:</span>
                <span className="font-semibold">{formatPrice(fees.giaXe)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Thuế trước bạ (10%):</span>
                <span className="font-semibold">{formatPrice(fees.thueTruocBa)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phí đăng ký:</span>
                <span className="font-semibold">{formatPrice(fees.phiDangKy)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phí ra biển:</span>
                <span className="font-semibold">{formatPrice(fees.phiRaBien)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bảo hiểm:</span>
                <span className="font-semibold">{formatPrice(fees.baoHiem)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển:</span>
                <span className="font-semibold">{formatPrice(fees.phiVanChuyen)}</span>
              </div>
              <div className="border-t-2 border-gray-200 pt-2 flex justify-between">
                <span className="font-bold text-gray-800">Tổng cộng:</span>
                <span className="font-bold text-xl text-primary-600">{formatPrice(fees.total)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <Link
              to="/customer/don-hang"
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
    </>
  );
};

export default DatMuaXe;

