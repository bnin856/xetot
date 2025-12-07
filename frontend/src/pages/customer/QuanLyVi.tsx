import React, { useEffect, useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, DollarSign, History, CreditCard, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import { motion } from 'framer-motion';
import walletService, { Wallet as WalletType, Transaction } from '../../services/walletService';

const QuanLyVi: React.FC = () => {
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNapTien, setShowNapTien] = useState(false);
  const [showRutTien, setShowRutTien] = useState(false);
  const [soTienNap, setSoTienNap] = useState('');
  const [soTienRut, setSoTienRut] = useState('');
  const [nganHang, setNganHang] = useState('');
  const [soTaiKhoan, setSoTaiKhoan] = useState('');
  const [tenTaiKhoan, setTenTaiKhoan] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const walletRes = await walletService.getMyWallet();
      if (walletRes.success) {
        setWallet(walletRes.data.wallet);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNapTien = async () => {
    const soTien = parseFloat(soTienNap);
    if (!soTien || soTien <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    setProcessing(true);
    try {
      // Giả lập thanh toán VNPay/Momo (trong thực tế sẽ redirect)
      const maGiaoDich = `VNP${Date.now()}`;
      await walletService.napTien(soTien, 'VNPay', maGiaoDich);
      alert('Nạp tiền thành công!');
      setShowNapTien(false);
      setSoTienNap('');
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Có lỗi xảy ra');
    } finally {
      setProcessing(false);
    }
  };

  const handleRutTien = async () => {
    const soTien = parseFloat(soTienRut);
    if (!soTien || soTien <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    if (!nganHang || !soTaiKhoan || !tenTaiKhoan) {
      alert('Vui lòng điền đầy đủ thông tin ngân hàng');
      return;
    }

    setProcessing(true);
    try {
      await walletService.rutTien(soTien, nganHang, soTaiKhoan, tenTaiKhoan);
      alert('Yêu cầu rút tiền đã được gửi. Chúng tôi sẽ xử lý trong 1-2 ngày làm việc.');
      setShowRutTien(false);
      setSoTienRut('');
      setNganHang('');
      setSoTaiKhoan('');
      setTenTaiKhoan('');
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Có lỗi xảy ra');
    } finally {
      setProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  const getLoaiGiaoDichIcon = (loai: string) => {
    switch (loai) {
      case 'napTien':
        return <ArrowDownCircle className="w-5 h-5 text-green-600" />;
      case 'rutTien':
        return <ArrowUpCircle className="w-5 h-5 text-red-600" />;
      case 'datCoc':
        return <DollarSign className="w-5 h-5 text-orange-600" />;
      case 'hoanCoc':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'tichThuCoc':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      case 'nhanTien':
        return <TrendingUp className="w-5 h-5 text-blue-600" />;
      default:
        return <History className="w-5 h-5 text-gray-600" />;
    }
  };

  const getLoaiGiaoDichText = (loai: string) => {
    const texts: Record<string, string> = {
      napTien: 'Nạp tiền',
      rutTien: 'Rút tiền',
      datCoc: 'Đặt cọc',
      hoanCoc: 'Hoàn cọc',
      tichThuCoc: 'Tịch thu cọc',
      nhanTien: 'Nhận tiền',
      chuyenTien: 'Chuyển tiền',
      phiSan: 'Phí sàn',
    };
    return texts[loai] || loai;
  };

  const getLoaiGiaoDichColor = (loai: string) => {
    switch (loai) {
      case 'napTien':
      case 'hoanCoc':
      case 'nhanTien':
        return 'text-green-600';
      case 'rutTien':
      case 'datCoc':
      case 'tichThuCoc':
        return 'text-red-600';
      default:
        return 'text-gray-600';
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
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white py-12">
        <div className="container-custom max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý ví</h1>
            <p className="text-gray-600">Nạp, rút tiền và theo dõi giao dịch</p>
          </motion.div>

          {/* Wallet Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-8 mb-8 bg-gradient-to-br from-primary-600 to-primary-700 text-white"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Wallet className="w-10 h-10" />
                <div>
                  <p className="text-sm opacity-90">Số dư ví</p>
                  <h2 className="text-4xl font-bold">{wallet ? formatPrice(wallet.soDu) : '0 ₫'}</h2>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Khả dụng</p>
                <p className="text-2xl font-bold">{wallet ? formatPrice(wallet.soDuKhaDung) : '0 ₫'}</p>
              </div>
            </div>

            {wallet && wallet.soDuDangGiu > 0 && (
              <div className="p-4 bg-white bg-opacity-20 rounded-lg mb-6">
                <p className="text-sm opacity-90 mb-1">Đang giữ (Escrow)</p>
                <p className="text-xl font-bold">{formatPrice(wallet.soDuDangGiu)}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowNapTien(true)}
                className="bg-white text-primary-600 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center justify-center space-x-2"
              >
                <ArrowDownCircle className="w-5 h-5" />
                <span>Nạp tiền</span>
              </button>
              <button
                onClick={() => setShowRutTien(true)}
                className="bg-white bg-opacity-20 border-2 border-white text-white py-3 px-6 rounded-lg font-semibold hover:bg-opacity-30 transition flex items-center justify-center space-x-2"
              >
                <ArrowUpCircle className="w-5 h-5" />
                <span>Rút tiền</span>
              </button>
            </div>
          </motion.div>

          {/* Quick Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200"
          >
            <h3 className="text-lg font-bold text-blue-800 mb-3">💡 Hướng dẫn sử dụng ví</h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span><strong>Nạp tiền</strong> để có số dư trong ví, dùng cho đặt cọc khi mua xe</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span><strong>Rút tiền</strong> về ngân hàng khi có số dư khả dụng</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span><strong>Đang giữ</strong> là tiền cọc đang bị giữ trong giao dịch</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Xem chi tiết tất cả giao dịch tại <strong>"Lịch sử giao dịch"</strong></span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Modal Nạp tiền */}
      {showNapTien && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Nạp tiền vào ví</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Số tiền (VNĐ)</label>
              <input
                type="number"
                value={soTienNap}
                onChange={(e) => setSoTienNap(e.target.value)}
                placeholder="Nhập số tiền"
                className="input-field w-full"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {[100000, 500000, 1000000, 5000000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setSoTienNap(amount.toString())}
                    className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg text-sm font-semibold hover:bg-primary-200 transition"
                  >
                    {formatPrice(amount)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Lưu ý:</strong> Sau khi bấm "Xác nhận", bạn sẽ được chuyển đến cổng thanh toán VNPay để hoàn tất giao dịch.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowNapTien(false);
                  setSoTienNap('');
                }}
                className="flex-1 btn-secondary"
                disabled={processing}
              >
                Hủy
              </button>
              <button
                onClick={handleNapTien}
                disabled={processing || !soTienNap}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {processing ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Rút tiền */}
      {showRutTien && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Rút tiền về ngân hàng</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Số tiền (VNĐ)</label>
              <input
                type="number"
                value={soTienRut}
                onChange={(e) => setSoTienRut(e.target.value)}
                placeholder="Nhập số tiền"
                className="input-field w-full"
              />
              <p className="text-sm text-gray-500 mt-1">
                Số dư khả dụng: {wallet ? formatPrice(wallet.soDuKhaDung) : '0 ₫'}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ngân hàng</label>
              <select
                value={nganHang}
                onChange={(e) => setNganHang(e.target.value)}
                className="input-field w-full"
              >
                <option value="">Chọn ngân hàng</option>
                <option value="Vietcombank">Vietcombank</option>
                <option value="BIDV">BIDV</option>
                <option value="VietinBank">VietinBank</option>
                <option value="Techcombank">Techcombank</option>
                <option value="ACB">ACB</option>
                <option value="MB">MB Bank</option>
                <option value="VPBank">VPBank</option>
                <option value="TPBank">TPBank</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Số tài khoản</label>
              <input
                type="text"
                value={soTaiKhoan}
                onChange={(e) => setSoTaiKhoan(e.target.value)}
                placeholder="Nhập số tài khoản"
                className="input-field w-full"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tên chủ tài khoản</label>
              <input
                type="text"
                value={tenTaiKhoan}
                onChange={(e) => setTenTaiKhoan(e.target.value)}
                placeholder="Nhập tên chủ tài khoản"
                className="input-field w-full"
              />
            </div>

            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Lưu ý:</strong> Yêu cầu rút tiền sẽ được xử lý trong 1-2 ngày làm việc.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowRutTien(false);
                  setSoTienRut('');
                  setNganHang('');
                  setSoTaiKhoan('');
                  setTenTaiKhoan('');
                }}
                className="flex-1 btn-secondary"
                disabled={processing}
              >
                Hủy
              </button>
              <button
                onClick={handleRutTien}
                disabled={processing || !soTienRut || !nganHang || !soTaiKhoan || !tenTaiKhoan}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {processing ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </MainLayout>
  );
};

export default QuanLyVi;

