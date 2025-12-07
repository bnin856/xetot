import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Search, Eye, X, Shield, CheckCircle, XCircle } from 'lucide-react';
import AdminLayout from '../../components/Layout/AdminLayout';
import { motion } from 'framer-motion';
import { khachHangService } from '../../services/khachHangService';
import { User } from '../../types';

const QuanLyKhachHang: React.FC = () => {
  const [khachHang, setKhachHang] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKhachHang, setSelectedKhachHang] = useState<User | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const fetchKhachHang = async () => {
      try {
        setLoading(true);
        const response = await khachHangService.getAll({ limit: 100, search: searchTerm || undefined });
        if (response.success) {
          setKhachHang(response.data.khachHang);
        }
      } catch (error) {
        console.error('Error fetching khach hang:', error);
        alert('Có lỗi xảy ra khi tải danh sách khách hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchKhachHang();
  }, [searchTerm]);

  const handleViewDetail = async (id: string) => {
    try {
      const response = await khachHangService.getById(id);
      if (response.success) {
        setSelectedKhachHang(response.data.user);
        setShowDetailModal(true);
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi tải thông tin khách hàng');
    }
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-8">Quản lý khách hàng</h1>

        <div className="card p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm khách hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SĐT</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Địa chỉ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số đơn hàng</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    </td>
                  </tr>
                ) : khachHang.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Không tìm thấy khách hàng nào
                    </td>
                  </tr>
                ) : (
                  khachHang.map((kh) => (
                    <motion.tr
                      key={kh.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{kh.ten}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{kh.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{kh.sdt}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{kh.diaChi || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">-</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleViewDetail(kh.id)}
                          className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedKhachHang && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Chi tiết khách hàng</h2>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedKhachHang(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Thông tin cơ bản */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Thông tin cơ bản</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Họ và tên</p>
                        <p className="font-medium">{selectedKhachHang.ten}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{selectedKhachHang.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Số điện thoại</p>
                        <p className="font-medium">{selectedKhachHang.sdt || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Địa chỉ</p>
                        <p className="font-medium">{selectedKhachHang.diaChi || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trạng thái xác thực */}
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Trạng thái xác thực
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {selectedKhachHang.xacThuc?.daXacThuc ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Đã xác thực</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-yellow-600">
                        <XCircle className="w-5 h-5" />
                        <span className="font-medium">Chưa xác thực</span>
                      </div>
                    )}
                    {selectedKhachHang.xacThuc?.ngayXacThuc && (
                      <p className="text-sm text-gray-500 mt-2">
                        Ngày xác thực: {new Date(selectedKhachHang.xacThuc.ngayXacThuc).toLocaleDateString('vi-VN')}
                      </p>
                    )}
                    {selectedKhachHang.xacThuc?.loaiXacThuc && selectedKhachHang.xacThuc.loaiXacThuc.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 mb-1">Loại xác thực:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedKhachHang.xacThuc.loaiXacThuc.map((loai, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                              {loai === 'cmnd' ? 'CMND' : loai === 'cccd' ? 'CCCD' : 'Giấy tờ xe'}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Vai trò */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Vai trò</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                        {selectedKhachHang.vaiTro === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                      </span>
                      {selectedKhachHang.vaiTroPhu && selectedKhachHang.vaiTroPhu.length > 0 && (
                        <>
                          {selectedKhachHang.vaiTroPhu.includes('nguoiBan') && (
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                              Người bán
                            </span>
                          )}
                          {selectedKhachHang.vaiTroPhu.includes('nguoiChoThue') && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                              Người cho thuê
                            </span>
                          )}
                          {selectedKhachHang.vaiTroPhu.includes('nhaProviderDichVu') && (
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                              Nhà cung cấp dịch vụ
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default QuanLyKhachHang;

