import React, { useEffect, useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle, DollarSign, TrendingUp, TrendingDown, History, Filter } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import { motion } from 'framer-motion';
import walletService, { Transaction } from '../../services/walletService';

const LichSuGiaoDich: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, [filter, page]);

  const fetchTransactions = async () => {
    try {
      const loaiGiaoDich = filter !== 'all' ? filter : undefined;
      const response = await walletService.getLichSuGiaoDich(page, 20, loaiGiaoDich);
      
      if (response.success) {
        if (page === 1) {
          setTransactions(response.data.transactions);
        } else {
          setTransactions((prev) => [...prev, ...response.data.transactions]);
        }
        setHasMore(response.data.pagination.page < response.data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  const getLoaiGiaoDichIcon = (loai: string) => {
    switch (loai) {
      case 'napTien':
        return <ArrowDownCircle className="w-6 h-6 text-green-600" />;
      case 'rutTien':
        return <ArrowUpCircle className="w-6 h-6 text-red-600" />;
      case 'datCoc':
        return <DollarSign className="w-6 h-6 text-orange-600" />;
      case 'hoanCoc':
        return <TrendingUp className="w-6 h-6 text-green-600" />;
      case 'tichThuCoc':
        return <TrendingDown className="w-6 h-6 text-red-600" />;
      case 'nhanTien':
        return <TrendingUp className="w-6 h-6 text-blue-600" />;
      default:
        return <History className="w-6 h-6 text-gray-600" />;
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

  const getTrangThaiText = (trangThai: string) => {
    const texts: Record<string, string> = {
      choXuLy: 'Đang xử lý',
      thanhCong: 'Thành công',
      thatBai: 'Thất bại',
      daHuy: 'Đã hủy',
    };
    return texts[trangThai] || trangThai;
  };

  const getTrangThaiBadge = (trangThai: string) => {
    switch (trangThai) {
      case 'thanhCong':
        return 'bg-green-100 text-green-800';
      case 'thatBai':
      case 'daHuy':
        return 'bg-red-100 text-red-800';
      case 'choXuLy':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && page === 1) {
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
        <div className="container-custom max-w-5xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Lịch sử giao dịch</h1>
            <p className="text-gray-600">Theo dõi tất cả giao dịch trong ví của bạn</p>
          </motion.div>

          {/* Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-4 mb-6"
          >
            <div className="flex items-center space-x-2 mb-3">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-800">Lọc theo loại:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'Tất cả' },
                { value: 'napTien', label: 'Nạp tiền' },
                { value: 'rutTien', label: 'Rút tiền' },
                { value: 'datCoc', label: 'Đặt cọc' },
                { value: 'hoanCoc', label: 'Hoàn cọc' },
                { value: 'tichThuCoc', label: 'Tịch thu' },
                { value: 'nhanTien', label: 'Nhận tiền' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setFilter(option.value);
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    filter === option.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Transactions List */}
          {transactions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card p-12 text-center"
            >
              <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Chưa có giao dịch nào</h3>
              <p className="text-gray-600">Các giao dịch của bạn sẽ hiển thị ở đây</p>
            </motion.div>
          ) : (
            <>
              <div className="space-y-4">
                {transactions.map((trans, index) => (
                  <motion.div
                    key={trans._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="card p-6 hover:shadow-lg transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="mt-1">{getLoaiGiaoDichIcon(trans.loaiGiaoDich)}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="font-bold text-lg text-gray-800">
                              {getLoaiGiaoDichText(trans.loaiGiaoDich)}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTrangThaiBadge(trans.trangThai)}`}>
                              {getTrangThaiText(trans.trangThai)}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{trans.moTa}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {new Date(trans.createdAt).toLocaleString('vi-VN')}
                            </span>
                            {trans.maGiaoDich && (
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                </svg>
                                {trans.maGiaoDich}
                              </span>
                            )}
                          </div>
                          {trans.phuongThucThanhToan && (
                            <p className="text-xs text-gray-500 mt-1">
                              Phương thức: {trans.phuongThucThanhToan}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className={`text-2xl font-bold ${getLoaiGiaoDichColor(trans.loaiGiaoDich)}`}>
                          {['napTien', 'hoanCoc', 'nhanTien'].includes(trans.loaiGiaoDich) ? '+' : '-'}
                          {formatPrice(trans.soTien)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Số dư: {formatPrice(trans.soDuSau)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="btn-secondary"
                    disabled={loading}
                  >
                    {loading ? 'Đang tải...' : 'Xem thêm'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default LichSuGiaoDich;

