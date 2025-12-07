import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Wallet, CreditCard, Building2, Shield, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import { motion } from 'framer-motion';

type PaymentMethod = 'tienMat' | 'chuyenKhoanOnline' | 'vayNganHang';

const ChonPhuongThucThanhToan: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { xe, fees } = location.state || {};
  
  const [selected, setSelected] = useState<PaymentMethod | null>(null);

  if (!xe || !fees) {
    navigate('/');
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  const tienCoc = Math.round(fees.total * 0.02); // 2% escrow

  const handleContinue = () => {
    if (!selected) return;
    navigate(`/dat-mua-xe/${xe._id}`, {
      state: { xe, fees, phuongThucThanhToan: selected, tienCoc },
    });
  };

  const paymentMethods = [
    {
      id: 'tienMat' as PaymentMethod,
      icon: Wallet,
      title: 'Thanh toán mặt / Gặp trực tiếp',
      description: 'Gặp người bán, kiểm tra xe và thanh toán trực tiếp',
      pros: [
        'Kiểm tra xe kỹ trước khi mua',
        'Thương lượng giá trực tiếp',
        'Không phí chuyển khoản',
      ],
      cons: [
        'Cần đặt cọc 2% để bảo đảm',
        'Mất thời gian di chuyển',
      ],
      escrow: true,
      color: 'blue',
    },
    {
      id: 'chuyenKhoanOnline' as PaymentMethod,
      icon: CreditCard,
      title: 'Thanh toán online',
      description: 'Chuyển khoản qua ngân hàng, giao xe tận nơi',
      pros: [
        'Không cần đặt cọc',
        'Nhanh chóng, tiện lợi',
        'Giao xe tận nơi',
      ],
      cons: [
        'Không xem xe trước',
        'Phụ thuộc vào mô tả',
      ],
      escrow: false,
      color: 'green',
    },
    {
      id: 'vayNganHang' as PaymentMethod,
      icon: Building2,
      title: 'Trả góp qua ngân hàng',
      description: 'Vay ngân hàng với lãi suất ưu đãi, trả góp linh hoạt',
      pros: [
        'Không cần đặt cọc',
        'Trả góp lên tới 7 năm',
        'Lãi suất từ 8.3%/năm',
        'Ngân hàng giải ngân trực tiếp',
      ],
      cons: [
        'Cần chứng minh thu nhập',
        'Phí hồ sơ ~1%',
        'Thời gian duyệt 1-3 ngày',
      ],
      escrow: false,
      color: 'purple',
    },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white py-12">
        <div className="container-custom max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              Chọn phương thức thanh toán
            </h1>
            <p className="text-gray-600">
              {xe.tenXe} - {formatPrice(fees.total)}
            </p>
          </motion.div>

          {/* Payment Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {paymentMethods.map((method, index) => {
              const Icon = method.icon;
              const isSelected = selected === method.id;
              
              return (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelected(method.id)}
                  className={`card cursor-pointer transition-all ${
                    isSelected
                      ? `ring-4 ring-${method.color}-500 bg-${method.color}-50`
                      : 'hover:shadow-xl hover:scale-105'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 bg-${method.color}-100 rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-8 h-8 text-${method.color}-600`} />
                    </div>
                    {isSelected && (
                      <div className={`w-8 h-8 bg-${method.color}-600 rounded-full flex items-center justify-center`}>
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 mb-2">{method.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{method.description}</p>

                  {/* Escrow Badge */}
                  {method.escrow && (
                    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-center space-x-2 text-amber-800 text-sm font-medium">
                        <Shield className="w-4 h-4" />
                        <span>Cần đặt cọc: {formatPrice(tienCoc)} (2%)</span>
                      </div>
                    </div>
                  )}

                  {/* Pros */}
                  <div className="space-y-2 mb-3">
                    {method.pros.map((pro, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{pro}</span>
                      </div>
                    ))}
                  </div>

                  {/* Cons */}
                  {method.cons.length > 0 && (
                    <div className="space-y-2 pt-3 border-t border-gray-200">
                      {method.cons.map((con, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-sm">
                          <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600">{con}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Escrow Flow Explanation */}
          {selected === 'tienMat' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="card p-6 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-600" />
                Quy trình đặt cọc & giao dịch an toàn
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                    1
                  </div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">Đặt cọc 2%</p>
                  <p className="text-xs text-gray-600">
                    Bạn chuyển {formatPrice(tienCoc)} vào tài khoản escrow của Xe Tốt
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                    2
                  </div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">Hẹn gặp & kiểm xe</p>
                  <p className="text-xs text-gray-600">
                    Hai bên gặp nhau, kiểm tra xe kỹ lưỡng
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                    3
                  </div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">Xác nhận kết quả</p>
                  <p className="text-xs text-gray-600">
                    Mua thành công / Xe sai mô tả / Hủy giao dịch
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                    4
                  </div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">Xử lý cọc</p>
                  <p className="text-xs text-gray-600">
                    Chia phí hoặc hoàn/tịch thu theo kết quả
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg border border-green-200">
                  <p className="font-semibold text-green-800 mb-2">✅ Giao dịch thành công</p>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• Người bán: +1% phí ({formatPrice(tienCoc / 2)})</li>
                    <li>• Xe Tốt: +1% phí ({formatPrice(tienCoc / 2)})</li>
                    <li>• Khách hàng hoàn tất thanh toán</li>
                  </ul>
                </div>
                <div className="p-4 bg-white rounded-lg border border-orange-200">
                  <p className="font-semibold text-orange-800 mb-2">⚠️ Xe sai mô tả</p>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• Hoàn 100% cọc cho khách ({formatPrice(tienCoc)})</li>
                    <li>• Người bán bị ban 7-14 ngày</li>
                    <li>• Admin xử lý tranh chấp</li>
                  </ul>
                </div>
                <div className="p-4 bg-white rounded-lg border border-red-200">
                  <p className="font-semibold text-red-800 mb-2">❌ Khách hủy vô lý do</p>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• Khách mất 100% cọc ({formatPrice(tienCoc)})</li>
                    <li>• Người bán: +1% ({formatPrice(tienCoc / 2)})</li>
                    <li>• Xe Tốt: +1% ({formatPrice(tienCoc / 2)})</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center"
          >
            <button
              onClick={handleContinue}
              disabled={!selected}
              className="btn-primary px-12 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <span>Tiếp tục</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ChonPhuongThucThanhToan;

