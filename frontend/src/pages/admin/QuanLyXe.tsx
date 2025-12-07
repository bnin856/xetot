import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Eye, X } from 'lucide-react';
import AdminLayout from '../../components/Layout/AdminLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { xeService } from '../../services/xeService';
import { Xe } from '../../types';

const QuanLyXe: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedXe, setSelectedXe] = useState<Xe | null>(null);
  const [danhSachXe, setDanhSachXe] = useState<Xe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTrangThai, setFilterTrangThai] = useState('');
  const [editingXe, setEditingXe] = useState<Xe | null>(null);
  const [formData, setFormData] = useState({
    tenXe: '',
    hangXe: '',
    mauSac: '',
    namSanXuat: new Date().getFullYear(),
    gia: '',
    soKm: '',
    soCho: '',
    loaiXe: '',
    tinhTrangXe: 'xeCu' as 'xeMoi' | 'xeCu',
    trangThai: 'dangBan' as 'dangBan' | 'daBan' | 'dangCho',
    moTa: '',
  });
  const [hinhAnhFiles, setHinhAnhFiles] = useState<File[]>([]);
  const [hinhAnhPreview, setHinhAnhPreview] = useState<string[]>([]);

  useEffect(() => {
    fetchXe();
  }, [searchTerm, filterTrangThai]);

  const fetchXe = async () => {
    try {
      setLoading(true);
      const response = await xeService.getAll({ 
        limit: 100, 
        search: searchTerm || undefined,
        trangThai: filterTrangThai || undefined
      });
      if (response.success) {
        setDanhSachXe(response.data.xe);
      }
    } catch (error) {
      console.error('Error fetching xe:', error);
      alert('Có lỗi xảy ra khi tải danh sách xe');
    } finally {
      setLoading(false);
    }
  };

  const getTrangThaiBadge = (trangThai: string) => {
    const badges: Record<string, { text: string; color: string }> = {
      dangBan: { text: 'Đang bán', color: 'bg-green-100 text-green-800' },
      daBan: { text: 'Đã bán', color: 'bg-gray-100 text-gray-800' },
      dangCho: { text: 'Đang chờ', color: 'bg-yellow-100 text-yellow-800' },
    };
    return badges[trangThai] || { text: trangThai, color: 'bg-gray-100 text-gray-800' };
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  const handleEdit = (xe: Xe) => {
    setEditingXe(xe);
    setFormData({
      tenXe: xe.tenXe,
      hangXe: xe.hangXe,
      mauSac: xe.mauSac,
      namSanXuat: xe.namSanXuat,
      gia: xe.gia.toString(),
      soKm: xe.soKm.toString(),
      soCho: xe.soCho.toString(),
      loaiXe: xe.loaiXe,
      tinhTrangXe: xe.tinhTrangXe,
      trangThai: xe.trangThai,
      moTa: xe.moTa,
    });
    setHinhAnhPreview(xe.hinhAnh || []);
    setHinhAnhFiles([]);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa xe này?')) {
      return;
    }

    try {
      const response = await xeService.delete(id);
      if (response.success) {
        alert('Xóa xe thành công');
        fetchXe();
      }
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Có lỗi xảy ra khi xóa xe');
    }
  };

  const handleViewDetail = async (id: string) => {
    try {
      const response = await xeService.getById(id);
      if (response.success) {
        setSelectedXe(response.data.xe);
        setShowDetailModal(true);
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi tải thông tin xe');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('tenXe', formData.tenXe);
    formDataToSend.append('hangXe', formData.hangXe);
    formDataToSend.append('mauSac', formData.mauSac);
    formDataToSend.append('namSanXuat', formData.namSanXuat.toString());
    formDataToSend.append('gia', formData.gia);
    formDataToSend.append('soKm', formData.soKm);
    formDataToSend.append('soCho', formData.soCho.toString());
    formDataToSend.append('loaiXe', formData.loaiXe);
    formDataToSend.append('tinhTrangXe', formData.tinhTrangXe);
    formDataToSend.append('trangThai', formData.trangThai);
    formDataToSend.append('moTa', formData.moTa);

    hinhAnhFiles.forEach((file) => {
      formDataToSend.append('hinhAnh', file);
    });

    try {
      if (editingXe) {
        const response = await xeService.update(editingXe.id, formDataToSend);
        if (response.success) {
          alert('Cập nhật xe thành công');
          setShowModal(false);
          resetForm();
          fetchXe();
        }
      } else {
        const response = await xeService.create(formDataToSend);
        if (response.success) {
          alert('Thêm xe thành công');
          setShowModal(false);
          resetForm();
          fetchXe();
        }
      }
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Có lỗi xảy ra');
    }
  };

  const resetForm = () => {
    setEditingXe(null);
    setFormData({
      tenXe: '',
      hangXe: '',
      mauSac: '',
      namSanXuat: new Date().getFullYear(),
      gia: '',
      soKm: '',
      soCho: '',
      loaiXe: '',
      tinhTrangXe: 'xeCu',
      trangThai: 'dangBan',
      moTa: '',
    });
    setHinhAnhFiles([]);
    setHinhAnhPreview([]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setHinhAnhFiles([...hinhAnhFiles, ...files]);
      
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setHinhAnhPreview([...hinhAnhPreview, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setHinhAnhPreview(hinhAnhPreview.filter((_, i) => i !== index));
    setHinhAnhFiles(hinhAnhFiles.filter((_, i) => i !== index));
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Quản lý xe</h1>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Thêm xe mới</span>
          </button>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm xe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select 
                value={filterTrangThai}
                onChange={(e) => setFilterTrangThai(e.target.value)}
                className="input-field w-auto"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="dangBan">Đang bán</option>
                <option value="daBan">Đã bán</option>
                <option value="dangCho">Đang chờ</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hình ảnh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên xe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hãng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày đăng
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    </td>
                  </tr>
                ) : danhSachXe.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      Chưa có xe nào
                    </td>
                  </tr>
                ) : (
                  danhSachXe.map((xe) => {
                  const badge = getTrangThaiBadge(xe.trangThai);
                  return (
                    <motion.tr
                      key={xe.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                          {xe.hinhAnh && xe.hinhAnh.length > 0 ? (
                            <img
                              src={`http://localhost:5000/${xe.hinhAnh[0]}`}
                              alt={xe.tenXe}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              No img
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{xe.tenXe}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{xe.hangXe}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-primary-600">{formatPrice(xe.gia)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                          {badge.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(xe.ngayDang).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => handleViewDetail(xe.id)}
                            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEdit(xe)}
                            className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded"
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(xe.id)}
                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {editingXe ? 'Chỉnh sửa xe' : 'Thêm xe mới'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Tên xe *</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={formData.tenXe}
                        onChange={(e) => setFormData({...formData, tenXe: e.target.value})}
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Hãng xe *</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={formData.hangXe}
                        onChange={(e) => setFormData({...formData, hangXe: e.target.value})}
                        required 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Màu sắc *</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={formData.mauSac}
                        onChange={(e) => setFormData({...formData, mauSac: e.target.value})}
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Năm sản xuất *</label>
                      <input 
                        type="number" 
                        className="input-field" 
                        value={formData.namSanXuat}
                        onChange={(e) => setFormData({...formData, namSanXuat: parseInt(e.target.value)})}
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Số chỗ *</label>
                      <input 
                        type="number" 
                        className="input-field" 
                        value={formData.soCho}
                        onChange={(e) => setFormData({...formData, soCho: e.target.value})}
                        required 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Giá (VNĐ) *</label>
                      <input 
                        type="number" 
                        className="input-field" 
                        value={formData.gia}
                        onChange={(e) => setFormData({...formData, gia: e.target.value})}
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Số km *</label>
                      <input 
                        type="number" 
                        className="input-field" 
                        value={formData.soKm}
                        onChange={(e) => setFormData({...formData, soKm: e.target.value})}
                        required 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Loại xe *</label>
                      <select 
                        className="input-field" 
                        value={formData.loaiXe}
                        onChange={(e) => setFormData({...formData, loaiXe: e.target.value})}
                        required
                      >
                        <option value="">Chọn loại xe</option>
                        <option value="Sedan">Sedan</option>
                        <option value="SUV">SUV</option>
                        <option value="Hatchback">Hatchback</option>
                        <option value="Coupe">Coupe</option>
                        <option value="Convertible">Convertible</option>
                        <option value="Wagon">Wagon</option>
                        <option value="Pickup">Pickup</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Tình trạng *</label>
                      <select 
                        className="input-field" 
                        value={formData.tinhTrangXe}
                        onChange={(e) => setFormData({...formData, tinhTrangXe: e.target.value as 'xeMoi' | 'xeCu'})}
                        required
                      >
                        <option value="xeMoi">Xe mới</option>
                        <option value="xeCu">Xe cũ</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Trạng thái *</label>
                    <select 
                      className="input-field" 
                      value={formData.trangThai}
                      onChange={(e) => setFormData({...formData, trangThai: e.target.value as 'dangBan' | 'daBan' | 'dangCho'})}
                      required
                    >
                      <option value="dangBan">Đang bán</option>
                      <option value="daBan">Đã bán</option>
                      <option value="dangCho">Đang chờ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Mô tả *</label>
                    <textarea 
                      className="input-field" 
                      rows={4}
                      value={formData.moTa}
                      onChange={(e) => setFormData({...formData, moTa: e.target.value})}
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hình ảnh</label>
                    <input 
                      type="file" 
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="input-field" 
                    />
                    {hinhAnhPreview.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {hinhAnhPreview.map((img, index) => (
                          <div key={index} className="relative">
                            <img src={img.startsWith('http') ? img : `http://localhost:5000/${img}`} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded" />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end space-x-4 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                      className="btn-secondary"
                    >
                      Hủy
                    </button>
                    <button type="submit" className="btn-primary">
                      {editingXe ? 'Cập nhật' : 'Thêm xe'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Detail Modal */}
        {showDetailModal && selectedXe && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Chi tiết xe</h2>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedXe(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Thông tin cơ bản</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Tên xe:</span> {selectedXe.tenXe}</p>
                    <p><span className="font-medium">Hãng:</span> {selectedXe.hangXe}</p>
                    <p><span className="font-medium">Màu sắc:</span> {selectedXe.mauSac}</p>
                    <p><span className="font-medium">Năm SX:</span> {selectedXe.namSanXuat}</p>
                    <p><span className="font-medium">Số chỗ:</span> {selectedXe.soCho}</p>
                    <p><span className="font-medium">Số km:</span> {selectedXe.soKm.toLocaleString('vi-VN')} km</p>
                    <p><span className="font-medium">Loại xe:</span> {selectedXe.loaiXe}</p>
                    <p><span className="font-medium">Tình trạng:</span> {selectedXe.tinhTrangXe === 'xeMoi' ? 'Xe mới' : 'Xe cũ'}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Giá và trạng thái</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Giá:</span> {formatPrice(selectedXe.gia)}</p>
                    <p>
                      <span className="font-medium">Trạng thái:</span>{' '}
                      <span className={`px-2 py-1 rounded text-xs ${getTrangThaiBadge(selectedXe.trangThai).color}`}>
                        {getTrangThaiBadge(selectedXe.trangThai).text}
                      </span>
                    </p>
                    <p><span className="font-medium">Ngày đăng:</span> {new Date(selectedXe.ngayDang || selectedXe.createdAt || '').toLocaleDateString('vi-VN')}</p>
                    {typeof selectedXe.idChuXe === 'object' && selectedXe.idChuXe && (
                      <>
                        <p><span className="font-medium">Chủ xe:</span> {selectedXe.idChuXe.ten}</p>
                        <p><span className="font-medium">Email:</span> {selectedXe.idChuXe.email}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Mô tả</h3>
                <p className="text-sm text-gray-600">{selectedXe.moTa}</p>
              </div>
              {selectedXe.hinhAnh && selectedXe.hinhAnh.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Hình ảnh</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedXe.hinhAnh.map((img, index) => (
                      <img
                        key={index}
                        src={`http://localhost:5000/${img}`}
                        alt={`${selectedXe.tenXe} ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
                      />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default QuanLyXe;

