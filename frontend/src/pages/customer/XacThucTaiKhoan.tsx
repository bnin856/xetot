import React, { useState, useEffect } from 'react';
import { Shield, Upload, X, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import { motion } from 'framer-motion';
import xacThucService, { XacThuc } from '../../services/xacThucService';
import { useAuth } from '../../contexts/AuthContext';

const XacThucTaiKhoan: React.FC = () => {
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [xacThuc, setXacThuc] = useState<XacThuc | null>(null);
  const [loaiGiayTo, setLoaiGiayTo] = useState<'cmnd' | 'cccd'>('cccd');
  const [matTruoc, setMatTruoc] = useState<File | null>(null);
  const [matSau, setMatSau] = useState<File | null>(null);
  const [giayToXe, setGiayToXe] = useState<File[]>([]);
  const [previewMatTruoc, setPreviewMatTruoc] = useState('');
  const [previewMatSau, setPreviewMatSau] = useState('');
  const [previewGiayToXe, setPreviewGiayToXe] = useState<string[]>([]);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await xacThucService.getMyStatus();
      setXacThuc(response.data.xacThuc);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'matTruoc' | 'matSau' | 'giayToXe') => {
    if (!e.target.files) return;

    if (type === 'giayToXe') {
      const files = Array.from(e.target.files);
      setGiayToXe(files);
      const urls = files.map(file => URL.createObjectURL(file));
      setPreviewGiayToXe(urls);
    } else {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      if (type === 'matTruoc') {
        setMatTruoc(file);
        setPreviewMatTruoc(url);
      } else {
        setMatSau(file);
        setPreviewMatSau(url);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!matTruoc || !matSau) {
      alert('Vui lòng upload đầy đủ mặt trước và mặt sau');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('loaiGiayTo', loaiGiayTo);
      formData.append('hinhAnh', matTruoc);
      formData.append('hinhAnh', matSau);
      giayToXe.forEach(file => formData.append('hinhAnh', file));

      const response = await xacThucService.upload(formData);
      alert(response.message);
      await fetchStatus();
      // Refresh user data để cập nhật trạng thái xác thực
      await refreshUser();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  const getTrangThaiColor = (trangThai: string) => {
    switch (trangThai) {
      case 'choXuLy': return 'text-yellow-600 bg-yellow-50';
      case 'daDuyet': return 'text-green-600 bg-green-50';
      case 'tuChoi': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTrangThaiIcon = (trangThai: string) => {
    switch (trangThai) {
      case 'choXuLy': return <Clock className="w-6 h-6" />;
      case 'daDuyet': return <CheckCircle className="w-6 h-6" />;
      case 'tuChoi': return <XCircle className="w-6 h-6" />;
      default: return <AlertCircle className="w-6 h-6" />;
    }
  };

  const getTrangThaiText = (trangThai: string) => {
    switch (trangThai) {
      case 'choXuLy': return 'Đang chờ xử lý';
      case 'daDuyet': return 'Đã xác thực';
      case 'tuChoi': return 'Bị từ chối';
      default: return trangThai;
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
      <div className="page-container py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Xác thực tài khoản</h1>
            <p className="text-gray-600">
              Xác thực để tăng độ tin cậy và bảo vệ giao dịch
            </p>
          </motion.div>

          {/* Trạng thái hiện tại */}
          {xacThuc && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6 mb-6"
            >
              <h3 className="text-lg font-bold mb-4">Trạng thái xác thực</h3>
              <div className={`flex items-center gap-4 p-4 rounded-lg ${getTrangThaiColor(xacThuc.trangThai)}`}>
                {getTrangThaiIcon(xacThuc.trangThai)}
                <div className="flex-1">
                  <p className="font-semibold">{getTrangThaiText(xacThuc.trangThai)}</p>
                  <p className="text-sm">
                    Ngày gửi: {new Date(xacThuc.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                  {xacThuc.lyDoTuChoi && (
                    <p className="text-sm mt-2">
                      <strong>Lý do:</strong> {xacThuc.lyDoTuChoi}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Form upload (chỉ hiển thị nếu chưa xác thực hoặc bị từ chối) */}
          {(!xacThuc || xacThuc.trangThai === 'tuChoi') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <h3 className="text-lg font-bold mb-6">Upload giấy tờ xác thực</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Loại giấy tờ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại giấy tờ <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="loaiGiayTo"
                        value="cmnd"
                        checked={loaiGiayTo === 'cmnd'}
                        onChange={(e) => setLoaiGiayTo(e.target.value as 'cmnd')}
                        className="w-4 h-4"
                      />
                      <span>CMND (9 số)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="loaiGiayTo"
                        value="cccd"
                        checked={loaiGiayTo === 'cccd'}
                        onChange={(e) => setLoaiGiayTo(e.target.value as 'cccd')}
                        className="w-4 h-4"
                      />
                      <span>CCCD (12 số)</span>
                    </label>
                  </div>
                </div>

                {/* Mặt trước */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mặt trước <span className="text-red-500">*</span>
                  </label>
                  {previewMatTruoc ? (
                    <div className="relative">
                      <img src={previewMatTruoc} alt="Mặt trước" className="w-full rounded-lg border-2" />
                      <button
                        type="button"
                        onClick={() => {
                          setMatTruoc(null);
                          setPreviewMatTruoc('');
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary-500">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'matTruoc')}
                        className="hidden"
                      />
                      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Click để chọn ảnh</p>
                    </label>
                  )}
                </div>

                {/* Mặt sau */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mặt sau <span className="text-red-500">*</span>
                  </label>
                  {previewMatSau ? (
                    <div className="relative">
                      <img src={previewMatSau} alt="Mặt sau" className="w-full rounded-lg border-2" />
                      <button
                        type="button"
                        onClick={() => {
                          setMatSau(null);
                          setPreviewMatSau('');
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary-500">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'matSau')}
                        className="hidden"
                      />
                      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Click để chọn ảnh</p>
                    </label>
                  )}
                </div>

                {/* Giấy tờ xe (không bắt buộc) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giấy tờ xe (Cavet/Đăng ký xe - không bắt buộc)
                  </label>
                  {previewGiayToXe.length > 0 ? (
                    <div className="grid grid-cols-3 gap-4">
                      {previewGiayToXe.map((url, index) => (
                        <img key={index} src={url} alt={`Giấy tờ ${index + 1}`} className="w-full rounded-lg border-2" />
                      ))}
                    </div>
                  ) : (
                    <label className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary-500">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileChange(e, 'giayToXe')}
                        className="hidden"
                      />
                      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Click để chọn ảnh</p>
                    </label>
                  )}
                </div>

                {/* Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">📌 Lưu ý:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Ảnh phải rõ ràng, không bị mờ</li>
                    <li>• Đầy đủ 4 góc giấy tờ</li>
                    <li>• Thông tin phải khớp với tên tài khoản</li>
                    <li>• Admin sẽ xét duyệt trong vòng 24h</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !matTruoc || !matSau}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Đang gửi...' : 'Gửi yêu cầu xác thực'}
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default XacThucTaiKhoan;

