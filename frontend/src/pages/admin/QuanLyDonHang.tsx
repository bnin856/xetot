import React, { useEffect, useState } from 'react';
import { Eye, CheckCircle, XCircle, ShoppingCart, Car, Calendar } from 'lucide-react';
import AdminLayout from '../../components/Layout/AdminLayout';
import { motion } from 'framer-motion';
import { donHangService } from '../../services/donHangService';
import { xeService } from '../../services/xeService';
import xeChoThueService from '../../services/xeChoThueService';
import donThueXeService from '../../services/donThueXeService';
import { DonHang, Xe } from '../../types';
import { DonThueXe } from '../../services/donThueXeService';

const QuanLyDonHang: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mua' | 'thue' | 'xeBan' | 'xeThue'>('mua');
  const [donHang, setDonHang] = useState<DonHang[]>([]);
  const [donThueXe, setDonThueXe] = useState<DonThueXe[]>([]);
  const [xeBan, setXeBan] = useState<Xe[]>([]);
  const [xeChoThue, setXeChoThue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      switch (activeTab) {
        case 'mua':
          const response = await donHangService.getAll({ limit: 100 });
          if (response.success) {
            setDonHang(response.data.donHang);
          }
          break;
        case 'thue':
          const responseThue = await donThueXeService.getAll();
          if (responseThue.success) {
            setDonThueXe(responseThue.data);
          }
          break;
        case 'xeBan':
          const responseXe = await xeService.getAll({ limit: 100, trangThai: 'dangBan' });
          if (responseXe.success) {
            setXeBan(responseXe.data.xe);
          }
          break;
        case 'xeThue':
          const responseXeThue = await xeChoThueService.getAll({ limit: 100 });
          if (Array.isArray(responseXeThue)) {
            setXeChoThue(responseXeThue);
          } else if (responseXeThue?.data?.xe) {
            setXeChoThue(responseXeThue.data.xe);
          } else {
            setXeChoThue([]);
          }
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrangThaiBadge = (trangThai: string) => {
    const badges: Record<string, { text: string; color: string }> = {
      choXacNhan: { text: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
      daXacNhan: { text: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
      dangGiao: { text: 'Đang giao', color: 'bg-purple-100 text-purple-800' },
      daGiao: { text: 'Đã giao', color: 'bg-green-100 text-green-800' },
      daHuy: { text: 'Đã hủy', color: 'bg-red-100 text-red-800' },
    };
    return badges[trangThai] || { text: trangThai, color: 'bg-gray-100 text-gray-800' };
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  const getTrangThaiThueXeBadge = (trangThai: string) => {
    const badges: Record<string, { text: string; color: string }> = {
      choXacNhan: { text: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
      daXacNhan: { text: 'Đã xác nhận', color: 'bg-green-100 text-green-800' },
      dangThue: { text: 'Đang thuê', color: 'bg-blue-100 text-blue-800' },
      daHoanThanh: { text: 'Hoàn thành', color: 'bg-green-100 text-green-800' },
      daHuy: { text: 'Đã hủy', color: 'bg-red-100 text-red-800' },
    };
    return badges[trangThai] || { text: trangThai, color: 'bg-gray-100 text-gray-800' };
  };

  const getTrangThaiXeBadge = (trangThai: string) => {
    const badges: Record<string, { text: string; color: string }> = {
      dangBan: { text: 'Đang bán', color: 'bg-green-100 text-green-800' },
      daBan: { text: 'Đã bán', color: 'bg-gray-100 text-gray-800' },
      dangCho: { text: 'Đang chờ', color: 'bg-yellow-100 text-yellow-800' },
      sanSang: { text: 'Sẵn sàng', color: 'bg-green-100 text-green-800' },
      dangThue: { text: 'Đang thuê', color: 'bg-blue-100 text-blue-800' },
    };
    return badges[trangThai] || { text: trangThai, color: 'bg-gray-100 text-gray-800' };
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-8">Quản lý đơn hàng</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('mua')}
            className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
              activeTab === 'mua'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            Đơn mua xe
          </button>
          <button
            onClick={() => setActiveTab('thue')}
            className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
              activeTab === 'thue'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Đơn thuê xe
          </button>
          <button
            onClick={() => setActiveTab('xeBan')}
            className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
              activeTab === 'xeBan'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Car className="w-4 h-4" />
            Xe đang bán
          </button>
          <button
            onClick={() => setActiveTab('xeThue')}
            className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
              activeTab === 'xeThue'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Car className="w-4 h-4" />
            Xe đang cho thuê
          </button>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {activeTab === 'mua' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã đơn</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Xe</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày đặt</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                    </>
                  )}
                  {activeTab === 'thue' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã đơn</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Xe</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày thuê</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                    </>
                  )}
                  {activeTab === 'xeBan' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Xe</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chủ xe</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày đăng</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                    </>
                  )}
                  {activeTab === 'xeThue' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Xe</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chủ xe</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá thuê/ngày</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày đăng</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={activeTab === 'xeBan' || activeTab === 'xeThue' ? 6 : 7} className="px-6 py-4 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    </td>
                  </tr>
                ) : activeTab === 'mua' && donHang.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      Chưa có đơn hàng nào
                    </td>
                  </tr>
                ) : activeTab === 'mua' ? (
                  donHang.map((don) => {
                    const badge = getTrangThaiBadge(don.trangThai);
                    const khachHang = typeof don.idKhachHang === 'object' && don.idKhachHang !== null ? don.idKhachHang as any : null;
                    const xe = typeof don.idXe === 'object' && don.idXe !== null ? don.idXe as any : null;
                    return (
                      <motion.tr
                        key={don.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">#{don.id.slice(-6)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{khachHang ? khachHang.ten : 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{xe ? xe.tenXe : 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {don.ngayDat ? new Date(don.ngayDat).toLocaleDateString('vi-VN') : new Date(don.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary-600">
                        {formatPrice(don.tongTien)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                          {badge.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                          {don.trangThai === 'choNguoiBanXacNhan' && (
                            <>
                              <button className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                  })
                ) : activeTab === 'thue' && donThueXe.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      Chưa có đơn thuê xe nào
                    </td>
                  </tr>
                ) : activeTab === 'thue' ? (
                  donThueXe.map((don) => {
                    const badge = getTrangThaiThueXeBadge(don.trangThai);
                    const khachHang = typeof don.idKhachHang === 'object' ? don.idKhachHang : null;
                    const xe = typeof don.idXeChoThue === 'object' ? don.idXeChoThue : null;
                    return (
                      <motion.tr
                        key={don._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">#{don._id.slice(-6)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{khachHang?.ten || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{xe?.tenXe || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(don.ngayBatDau).toLocaleDateString('vi-VN')} - {new Date(don.ngayKetThuc).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary-600">
                          {formatPrice(don.tongTien)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                            {badge.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : activeTab === 'xeBan' && xeBan.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Chưa có xe nào đang bán
                    </td>
                  </tr>
                ) : activeTab === 'xeBan' ? (
                  xeBan.map((xe) => {
                    const badge = getTrangThaiXeBadge(xe.trangThai);
                    return (
                      <motion.tr
                        key={xe.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {xe.hinhAnh && xe.hinhAnh.length > 0 && (
                              <img
                                src={`http://localhost:5000/${xe.hinhAnh[0]}`}
                                alt={xe.tenXe}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium">{xe.tenXe}</div>
                              <div className="text-xs text-gray-500">{xe.hangXe}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {typeof xe.idChuXe === 'object' && xe.idChuXe ? (xe.idChuXe as any).ten : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary-600">
                          {formatPrice(xe.gia)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {xe.createdAt ? new Date(xe.createdAt).toLocaleDateString('vi-VN') : (xe.ngayDang ? new Date(xe.ngayDang).toLocaleDateString('vi-VN') : '-')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                            {badge.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : activeTab === 'xeThue' && xeChoThue.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Chưa có xe nào đang cho thuê
                    </td>
                  </tr>
                ) : activeTab === 'xeThue' ? (
                  xeChoThue.map((xe: any) => {
                    const badge = getTrangThaiXeBadge(xe.trangThai);
                    return (
                      <motion.tr
                        key={xe._id || xe.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {xe.hinhAnh && xe.hinhAnh.length > 0 && (
                              <img
                                src={`http://localhost:5000/${xe.hinhAnh[0]}`}
                                alt={xe.tenXe}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium">{xe.tenXe}</div>
                              <div className="text-xs text-gray-500">{xe.hangXe}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {typeof xe.idChuXe === 'object' && xe.idChuXe ? (xe.idChuXe as any).ten : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="text-sm font-semibold text-primary-600">
                            {formatPrice(xe.giaThueTheoNgay || 0)}/ngày
                          </div>
                          {xe.giaThueTheoThang && (
                            <div className="text-xs text-gray-500">
                              {formatPrice(xe.giaThueTheoThang)}/tháng
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {xe.createdAt ? new Date(xe.createdAt).toLocaleDateString('vi-VN') : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                            {badge.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default QuanLyDonHang;

