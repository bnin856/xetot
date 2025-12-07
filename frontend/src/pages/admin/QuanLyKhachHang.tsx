import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Search } from 'lucide-react';
import AdminLayout from '../../components/Layout/AdminLayout';
import { motion } from 'framer-motion';
import { khachHangService } from '../../services/khachHangService';
import { User } from '../../types';

const QuanLyKhachHang: React.FC = () => {
  const [khachHang, setKhachHang] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchKhachHang = async () => {
      try {
        const response = await khachHangService.getAll({ limit: 100, search: searchTerm });
        if (response.success) {
          setKhachHang(response.data.khachHang);
        }
      } catch (error) {
        console.error('Error fetching khach hang:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKhachHang();
  }, [searchTerm]);

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
                        <button className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4" />
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
      </div>
    </AdminLayout>
  );
};

export default QuanLyKhachHang;

