import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, CreditCard, AlertCircle, CheckCircle, XCircle, Clock, Package } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import { motion } from 'framer-motion';
import donThueXeService, { DonThueXe } from '../../services/donThueXeService';

const ChiTietDonThueXe: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donThueXe, setDonThueXe] = useState<DonThueXe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonThueXe();
  }, [id]);

  const fetchDonThueXe = async () => {
    if (!id) return;
    try {
      const data = await donThueXeService.getDonThueXeById(id);
      setDonThueXe(data);
    } catch (error) {
      console.error('Error fetching don thue xe:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  const getTrangThaiColor = (trangThai: string) => {
    const colors: Record<string, string> = {
      choXacNhan: 'bg-yellow-100 text-yellow-800',
      daXacNhan: 'bg-green-100 text-green-800',
      dangThue: 'bg-blue-100 text-blue-800',
      daHoanThanh: 'bg-green-100 text-green-800',
      daHuy: 'bg-gray-100 text-gray-800',
    };
    return colors[trangThai] || 'bg-gray-100 text-gray-800';
  };

  const getTrangThaiText = (trangThai: string) => {
    const texts: Record<string, string> = {
      choXacNhan: 'Chờ xác nhận',
      daXacNhan: 'Đã xác nhận',
      dangThue: 'Đang trong quá trình thuê',
      daHoanThanh: 'Hoàn thành',
      daHuy: 'Đã hủy',
    };
    return texts[trangThai] || trangThai;
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

  if (!donThueXe) {
    return (
      <MainLayout>
        <div className="page-container py-8">
          <div className="container-custom">
            <div className="text-center py-12 text-gray-600">
              <p>Không tìm thấy đơn thuê xe</p>
              <Link to="/customer/don-hang" className="btn-primary inline-block mt-4">
                Quay lại danh sách
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="page-container py-8">
        <div className="container-custom max-w-4xl">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-600">
            <Link to="/customer/don-hang" className="hover:text-primary-600">Lịch sử đơn hàng</Link>
            <span className="mx-2">/</span>
            <span>Chi tiết đơn thuê xe</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Chi tiết đơn thuê xe</h1>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getTrangThaiColor(donThueXe.trangThai)}`}>
                {getTrangThaiText(donThueXe.trangThai)}
              </span>
            </div>

            {/* Thông tin xe */}
            <div className="border-b pb-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Thông tin xe</h2>
              <div className="flex gap-4">
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-200">
                  {donThueXe.idXeChoThue.hinhAnh && donThueXe.idXeChoThue.hinhAnh.length > 0 ? (
                    <img
                      src={`http://localhost:5000/${donThueXe.idXeChoThue.hinhAnh[0]}`}
                      alt={donThueXe.idXeChoThue.tenXe}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{donThueXe.idXeChoThue.tenXe}</h3>
                  <p className="text-gray-600">{donThueXe.idXeChoThue.hangXe}</p>
                </div>
              </div>
            </div>

            {/* Thông tin thuê */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-600">Ngày bắt đầu</p>
                  <p className="font-semibold">{new Date(donThueXe.ngayBatDau).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-600">Ngày kết thúc</p>
                  <p className="font-semibold">{new Date(donThueXe.ngayKetThuc).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-600">Địa chỉ giao nhận</p>
                  <p className="font-semibold">{donThueXe.diaChiGiaoNhan}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-600">Phí thuê xe</p>
                  <p className="font-semibold text-accent-600">{formatPrice(donThueXe.tongTien)}</p>
                </div>
              </div>
            </div>

            {/* Chi tiết thanh toán */}
            <div className="border-t pt-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Chi tiết thanh toán</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí thuê xe:</span>
                  <span className="font-medium">{formatPrice(donThueXe.tongTien)}</span>
                </div>
                {donThueXe.phiSan && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí sàn (5%):</span>
                    <span className="font-medium">{formatPrice(donThueXe.phiSan)}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-semibold text-gray-800">Tổng thanh toán:</span>
                  <span className="text-xl font-bold text-accent-600">
                    {formatPrice(donThueXe.tongTien + (donThueXe.phiSan || 0))}
                  </span>
                </div>
              </div>
            </div>

            {donThueXe.ghiChu && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Ghi chú</h3>
                <p className="text-gray-600">{donThueXe.ghiChu}</p>
              </div>
            )}

            {/* Thông tin thanh toán */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-900">Đã thanh toán</h3>
              </div>
              <p className="text-sm text-green-800">
                Đơn thuê xe đã được thanh toán thành công qua ví. Tiền đã được chuyển cho người cho thuê (trừ 5% phí sàn).
              </p>
            </div>

            {/* Actions */}
            {donThueXe.trangThai === 'daXacNhan' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Chờ nhận xe</h3>
                </div>
                <p className="text-sm text-blue-800">
                  Đơn hàng đã được xác nhận. Vui lòng đến địa chỉ giao nhận vào ngày bắt đầu để nhận xe.
                </p>
              </div>
            )}

            {donThueXe.trangThai === 'dangThue' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Đang trong quá trình thuê</h3>
                </div>
                <p className="text-sm text-blue-800">
                  Bạn đang thuê xe này. Vui lòng hoàn trả xe đúng hạn vào ngày kết thúc.
                </p>
              </div>
            )}

            {donThueXe.trangThai === 'daHoanThanh' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-green-900">Hoàn thành</h3>
                </div>
                <p className="text-sm text-green-800">
                  Đơn thuê xe đã hoàn thành. Cảm ơn bạn đã sử dụng dịch vụ!
                </p>
              </div>
            )}

            <div className="mt-6">
              <Link
                to="/customer/don-hang"
                className="btn-secondary inline-flex items-center"
              >
                Quay lại danh sách
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ChiTietDonThueXe;

