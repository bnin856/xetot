import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, CheckCircle, CreditCard, Copy } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import { motion } from 'framer-motion';
import { donHangService } from '../../services/donHangService';
import { DonHang } from '../../types';

const UploadBienLai: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donHang, setDonHang] = useState<DonHang | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [bienLaiFile, setBienLaiFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    fetchDonHang();
  }, [id]);

  const fetchDonHang = async () => {
    if (!id) return;
    try {
      const response = await donHangService.getById(id);
      if (response.success) {
        setDonHang(response.data.donHang);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      let file = e.target.files[0];
      setBienLaiFile(file);

      let reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!id || !bienLaiFile) {
      alert('Vui lòng chọn hình ảnh biên lai');
      return;
    }

    setUploading(true);
    try {
      let formData = new FormData();
      formData.append('bienLai', bienLaiFile);

      await donHangService.uploadBienLai(id, formData);
      alert('Upload biên lai thành công! Chờ người bán xác nhận.');
      navigate(`/customer/don-hang/${id}`);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Đã copy!');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
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

  if (!donHang) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Không tìm thấy đơn hàng</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="page-container py-8">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </button>

          <div className="card p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-10 h-10 text-primary-600" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Chuyển khoản thanh toán</h1>
              <p className="text-gray-600">Vui lòng chuyển khoản và upload biên lai</p>
            </div>

            {/* Thông tin chuyển khoản */}
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 border-2 border-primary-200 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-lg text-primary-900 mb-4">Thông tin chuyển khoản</h3>
              
              <div className="space-y-3 bg-white rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ngân hàng:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">Vietcombank</span>
                    <button
                      onClick={() => copyToClipboard('Vietcombank')}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Số tài khoản:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">1234567890</span>
                    <button
                      onClick={() => copyToClipboard('1234567890')}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Chủ tài khoản:</span>
                  <span className="font-bold">CONG TY XE TOT</span>
                </div>
                
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Số tiền:</span>
                    <span className="font-bold text-xl text-primary-600">
                      {formatPrice(donHang.tongTien)}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Nội dung CK:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">XETOT {donHang._id?.slice(-8).toUpperCase()}</span>
                    <button
                      onClick={() => copyToClipboard(`XETOT ${donHang._id?.slice(-8).toUpperCase()}`)}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload biên lai */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-4">Upload biên lai chuyển khoản</h3>
              
              {!previewUrl ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
                  <input
                    type="file"
                    id="bienLai"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="bienLai"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-16 h-16 text-gray-400 mb-3" />
                    <span className="text-lg text-gray-700 mb-1">
                      Nhấn để tải biên lai lên
                    </span>
                    <span className="text-sm text-gray-500">
                      (Ảnh chụp màn hình hoặc biên lai từ ngân hàng)
                    </span>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview biên lai"
                    className="w-full max-h-96 object-contain rounded-lg border-2 border-gray-200"
                  />
                  <button
                    onClick={() => {
                      setBienLaiFile(null);
                      setPreviewUrl('');
                    }}
                    className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2"
                  >
                    Chọn ảnh khác
                  </button>
                </div>
              )}
            </div>

            {/* Lưu ý */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-800 mb-2">Lưu ý:</h4>
              <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                <li>Chuyển khoản đúng số tiền và nội dung như trên</li>
                <li>Chụp màn hình biên lai chuyển khoản thành công</li>
                <li>Upload biên lai rõ ràng, đầy đủ thông tin</li>
                <li>Sau khi upload, người bán sẽ xác nhận đã nhận tiền</li>
                <li>Đơn hàng sẽ được xử lý sau khi người bán xác nhận</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => navigate(`/customer/don-hang/${id}`)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={uploading}
              >
                Để sau
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || !bienLaiFile}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Đang upload...' : 'Xác nhận đã chuyển khoản'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UploadBienLai;

