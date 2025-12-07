import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import dichVuService from '../../services/dichVuService';

const DangKyDichVu: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hinhAnhFiles, setHinhAnhFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    tenDichVu: '',
    loaiDichVu: '' as 'suaChua' | 'baoTri' | 'chamSoc' | 'phuKien' | '',
    moTa: '',
    giaThamKhao: '',
    thoiGianThucHien: '',
    diaChi: '',
    soDienThoai: '',
  });

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

    if (!formData.tenDichVu || !formData.loaiDichVu || !formData.moTa) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (hinhAnhFiles.length === 0) {
      alert('Vui lòng tải lên ít nhất 1 hình ảnh dịch vụ');
      return;
    }

    setLoading(true);
    
    try {
      let submitData = new FormData();
      submitData.append('tenDichVu', formData.tenDichVu);
      submitData.append('loaiDichVu', formData.loaiDichVu);
      submitData.append('moTa', formData.moTa);
      submitData.append('giaThamKhao', formData.giaThamKhao);
      submitData.append('thoiGianThucHien', formData.thoiGianThucHien);
      submitData.append('diaChi', formData.diaChi);
      submitData.append('soDienThoai', formData.soDienThoai);
      submitData.append('trangThai', 'hoatDong');

      hinhAnhFiles.forEach(file => {
        submitData.append('hinhAnh', file);
      });

      let response = await dichVuService.create(submitData);
      
      if (response.success) {
        alert('Đăng ký dịch vụ thành công! Dịch vụ của bạn đang chờ duyệt.');
        navigate('/');
      }
    } catch (error: any) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký dịch vụ';
      
      // Kiểm tra nếu lỗi là chưa xác thực KYC
      if (error.response?.status === 403 && errorMessage.includes('xác thực')) {
        const confirm = window.confirm(
          'Bạn cần xác thực tài khoản (KYC) trước khi đăng ký dịch vụ.\n\n' +
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
            <h1 className="text-3xl font-bold mb-2">Đăng ký cung cấp dịch vụ</h1>
            <p className="text-gray-600 mb-6">
              Đăng ký để trở thành nhà cung cấp dịch vụ bảo dưỡng, sửa chữa xe
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên dịch vụ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="tenDichVu"
                      value={formData.tenDichVu}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="VD: Bảo dưỡng định kỳ"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loại dịch vụ <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="loaiDichVu"
                      value={formData.loaiDichVu}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      required
                    >
                      <option value="">Chọn loại dịch vụ</option>
                      <option value="suaChua">Sửa chữa</option>
                      <option value="baoTri">Bảo trì</option>
                      <option value="chamSoc">Chăm sóc</option>
                      <option value="phuKien">Phụ kiện</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá tham khảo (₫) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="giaThamKhao"
                      value={formData.giaThamKhao}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="VD: 500000"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thời gian thực hiện <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="thoiGianThucHien"
                      value={formData.thoiGianThucHien}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="VD: 1-2 giờ"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại liên hệ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="soDienThoai"
                      value={formData.soDienThoai}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="VD: 0901234567"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ cửa hàng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="diaChi"
                      value={formData.diaChi}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="VD: 123 Đường ABC, Quận 1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả chi tiết dịch vụ <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="moTa"
                    value={formData.moTa}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="Mô tả chi tiết về dịch vụ của bạn, kinh nghiệm, trang thiết bị..."
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Mô tả chi tiết sẽ giúp khách hàng hiểu rõ hơn về dịch vụ của bạn
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hình ảnh dịch vụ <span className="text-red-500">*</span>
                    <span className="text-gray-500 text-xs ml-2">(Tối đa 10 ảnh)</span>
                  </label>
                  <p className="text-sm text-gray-500 mb-3">
                    Upload hình ảnh cửa hàng, trang thiết bị, hoặc các dự án đã thực hiện
                  </p>
                  
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

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Lợi ích khi trở thành đối tác:</h3>
                  <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                    <li>Tiếp cận nguồn khách hàng lớn trên nền tảng</li>
                    <li>Quản lý lịch hẹn và đơn hàng dễ dàng</li>
                    <li>Nhận thanh toán an toàn qua hệ thống</li>
                    <li>Xây dựng thương hiệu và uy tín qua đánh giá</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">Lưu ý:</h3>
                  <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                    <li>Vui lòng cung cấp thông tin chính xác và trung thực</li>
                    <li>Hình ảnh rõ nét, chuyên nghiệp sẽ tăng uy tín của bạn</li>
                    <li>Dịch vụ sẽ được admin xem xét và duyệt trước khi hiển thị</li>
                    <li>Bạn cần đảm bảo chất lượng dịch vụ cam kết với khách hàng</li>
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
                    {loading ? 'Đang xử lý...' : 'Đăng ký dịch vụ'}
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

export default DangKyDichVu;

