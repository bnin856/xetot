import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, X, Shield, AlertCircle } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import { xeService } from '../../services/xeService';
import { useAuth } from '../../contexts/AuthContext';

const DangBanXe: React.FC = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [daXacThuc, setDaXacThuc] = useState<boolean | null>(null);
  const [hinhAnhFiles, setHinhAnhFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    tenXe: '',
    hangXe: '',
    mauSac: '',
    namSanXuat: new Date().getFullYear(),
    gia: '',
    soKm: '',
    soCho: 4,
    loaiXe: '',
    tinhTrangXe: 'xeCu' as 'xeMoi' | 'xeCu',
    moTa: '',
  });

  useEffect(() => {
    const checkXacThuc = async () => {
      if (user) {
        // Refresh user data để đảm bảo có thông tin xác thực mới nhất
        await refreshUser();
      }
    };
    checkXacThuc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) {
      setDaXacThuc(user.xacThuc?.daXacThuc || false);
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      let newFiles = Array.from(e.target.files);
      
      if (hinhAnhFiles.length + newFiles.length > 10) {
        alert('Bạn chỉ có thể tải lên tối đa 10 ảnh');
        newFiles = newFiles.slice(0, 10 - hinhAnhFiles.length);
      }

      setHinhAnhFiles(prev => [...prev, ...newFiles]);

      newFiles.forEach(file => {
        let reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrls(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setHinhAnhFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tenXe || !formData.hangXe || !formData.gia) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (hinhAnhFiles.length === 0) {
      alert('Vui lòng tải lên ít nhất 1 hình ảnh xe');
      return;
    }

    setLoading(true);
    
    try {
      let submitData = new FormData();
      submitData.append('tenXe', formData.tenXe);
      submitData.append('hangXe', formData.hangXe);
      submitData.append('mauSac', formData.mauSac);
      submitData.append('namSanXuat', formData.namSanXuat.toString());
      submitData.append('gia', formData.gia);
      submitData.append('soKm', formData.soKm);
      submitData.append('soCho', formData.soCho.toString());
      submitData.append('loaiXe', formData.loaiXe);
      submitData.append('tinhTrangXe', formData.tinhTrangXe);
      submitData.append('moTa', formData.moTa);
      submitData.append('trangThai', 'dangBan');

      hinhAnhFiles.forEach(file => {
        submitData.append('hinhAnh', file);
      });

      let response = await xeService.create(submitData);
      
      if (response.success) {
        alert('Đăng bán xe thành công! Xe của bạn đang chờ duyệt.');
        navigate('/');
      }
    } catch (error: any) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi đăng bán xe';
      
      // Kiểm tra nếu lỗi là chưa xác thực KYC
      if (error.response?.status === 403 && errorMessage.includes('xác thực')) {
        const confirm = window.confirm(
          'Bạn cần xác thực tài khoản (KYC) trước khi đăng bán xe.\n\n' +
          'Bạn có muốn chuyển đến trang xác thực ngay bây giờ không?'
        );
        if (confirm) {
          navigate('/xac-thuc');
        }
      } else {
        alert(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-3xl font-bold mb-6">Đăng bán xe</h1>
            
            {/* KYC Warning Banner */}
            {daXacThuc === false && (
              <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-900 mb-1">
                    ⚠️ Bạn cần xác thực tài khoản (KYC) trước khi đăng bán xe
                  </h3>
                  <p className="text-sm text-yellow-800 mb-3">
                    Để đảm bảo an toàn và tăng độ tin cậy, bạn cần xác thực CMND/CCCD và giấy tờ xe trước khi đăng bán.
                  </p>
                  <Link
                    to="/xac-thuc"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-semibold text-sm"
                  >
                    <Shield className="w-4 h-4" />
                    Xác thực ngay
                  </Link>
                </div>
              </div>
            )}

            {daXacThuc === true && (
              <div className="mb-6 p-4 bg-green-50 border-2 border-green-400 rounded-lg flex items-center gap-3">
                <Shield className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900">
                    ✅ Tài khoản đã được xác thực
                  </h3>
                  <p className="text-sm text-green-800">
                    Bạn có thể đăng bán xe ngay bây giờ
                  </p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên xe <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="tenXe"
                      value={formData.tenXe}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="VD: Toyota Vios 1.5G"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hãng xe <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="hangXe"
                      value={formData.hangXe}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      required
                    >
                      <option value="">Chọn hãng xe</option>
                      <option value="Toyota">Toyota</option>
                      <option value="Honda">Honda</option>
                      <option value="Mazda">Mazda</option>
                      <option value="Hyundai">Hyundai</option>
                      <option value="Kia">Kia</option>
                      <option value="Ford">Ford</option>
                      <option value="Mitsubishi">Mitsubishi</option>
                      <option value="Suzuki">Suzuki</option>
                      <option value="VinFast">VinFast</option>
                      <option value="Mercedes-Benz">Mercedes-Benz</option>
                      <option value="BMW">BMW</option>
                      <option value="Audi">Audi</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Màu sắc <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="mauSac"
                      value={formData.mauSac}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="VD: Trắng"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Năm sản xuất <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="namSanXuat"
                      value={formData.namSanXuat}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      min="1990"
                      max={new Date().getFullYear()}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá bán (₫) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="gia"
                      value={formData.gia}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="VD: 500000000"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số km đã chạy <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="soKm"
                      value={formData.soKm}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="VD: 50000"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số chỗ ngồi <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="soCho"
                      value={formData.soCho}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      required
                    >
                      <option value={4}>4 chỗ</option>
                      <option value={5}>5 chỗ</option>
                      <option value={7}>7 chỗ</option>
                      <option value={16}>16 chỗ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loại xe <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="loaiXe"
                      value={formData.loaiXe}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="VD: Sedan, SUV, Hatchback..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tình trạng xe <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="tinhTrangXe"
                      value={formData.tinhTrangXe}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      required
                    >
                      <option value="xeCu">Xe cũ (đã qua sử dụng)</option>
                      <option value="xeMoi">Xe mới (chưa qua sử dụng)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả chi tiết <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="moTa"
                    value={formData.moTa}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="Mô tả chi tiết về tình trạng xe, trang bị, lịch sử bảo dưỡng..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hình ảnh xe <span className="text-red-500">*</span>
                    <span className="text-gray-500 text-xs ml-2">(Tối đa 10 ảnh)</span>
                  </label>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="hinhAnh"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="hinhAnh"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        Nhấn để tải ảnh lên
                      </span>
                    </label>
                  </div>

                  {previewUrls.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">Lưu ý:</h3>
                  <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                    <li>Vui lòng cung cấp thông tin chính xác và trung thực</li>
                    <li>Hình ảnh rõ nét sẽ giúp xe của bạn được quan tâm nhiều hơn</li>
                    <li>Xe của bạn sẽ được admin xem xét và duyệt trước khi hiển thị</li>
                    <li>Bạn có thể chỉnh sửa thông tin xe sau khi đăng</li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                    disabled={loading}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Đang xử lý...' : 'Đăng bán xe'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DangBanXe;

