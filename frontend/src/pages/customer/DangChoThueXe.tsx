import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import xeChoThueService from '../../services/xeChoThueService';

const DangChoThueXe: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hinhAnhFiles, setHinhAnhFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    tenXe: '',
    hangXe: '',
    dongXe: '',
    namSanXuat: new Date().getFullYear(),
    bienSoXe: '',
    mauSac: '',
    soKm: '',
    soCho: 4,
    loaiXe: '',
    giaThueTheoNgay: '',
    giaThueTheoThang: '',
    moTa: '',
    tienNghi: [] as string[],
    dieuKhoanThue: 'Khách hàng cần có GPLX hợp lệ. Đặt cọc 30% tổng giá trị thuê.',
  });

  const tienNghiOptions = [
    'Điều hòa',
    'Camera hành trình',
    'Cảm biến lùi',
    'Camera lùi',
    'Định vị GPS',
    'Bluetooth',
    'USB',
    'Ghế da',
    'Cửa sổ trời',
    'Túi khí',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTienNghiChange = (tienNghi: string) => {
    setFormData(prev => ({
      ...prev,
      tienNghi: prev.tienNghi.includes(tienNghi)
        ? prev.tienNghi.filter(t => t !== tienNghi)
        : [...prev.tienNghi, tienNghi]
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

    if (!formData.tenXe || !formData.hangXe || !formData.bienSoXe) {
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
      submitData.append('dongXe', formData.dongXe);
      submitData.append('namSanXuat', formData.namSanXuat.toString());
      submitData.append('bienSoXe', formData.bienSoXe);
      submitData.append('mauSac', formData.mauSac);
      submitData.append('soKm', formData.soKm);
      submitData.append('soCho', formData.soCho.toString());
      submitData.append('loaiXe', formData.loaiXe);
      submitData.append('giaThueTheoNgay', formData.giaThueTheoNgay);
      submitData.append('giaThueTheoThang', formData.giaThueTheoThang);
      submitData.append('moTa', formData.moTa);
      submitData.append('trangThai', 'sanSang');
      submitData.append('dieuKhoanThue', formData.dieuKhoanThue);
      
      formData.tienNghi.forEach(tienNghi => {
        submitData.append('tienNghi[]', tienNghi);
      });

      hinhAnhFiles.forEach(file => {
        submitData.append('hinhAnh', file);
      });

      let response = await xeChoThueService.create(submitData);
      
      if (response.success) {
        alert('Đăng cho thuê xe thành công! Xe của bạn đang chờ duyệt.');
        navigate('/');
      }
    } catch (error: any) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi đăng cho thuê xe';
      
      // Kiểm tra nếu lỗi là chưa xác thực KYC
      if (error.response?.status === 403 && errorMessage.includes('xác thực')) {
        const confirm = window.confirm(
          'Bạn cần xác thực tài khoản (KYC) trước khi đăng cho thuê xe.\n\n' +
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
            <h1 className="text-3xl font-bold mb-6">Đăng cho thuê xe</h1>
            
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
                      Dòng xe <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="dongXe"
                      value={formData.dongXe}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="VD: Vios"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Biển số xe <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="bienSoXe"
                      value={formData.bienSoXe}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="VD: 30A-12345"
                      required
                    />
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
                      Giá thuê theo ngày (₫) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="giaThueTheoNgay"
                      value={formData.giaThueTheoNgay}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="VD: 500000"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá thuê theo tháng (₫) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="giaThueTheoThang"
                      value={formData.giaThueTheoThang}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="VD: 12000000"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiện nghi
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {tienNghiOptions.map(tienNghi => (
                      <label key={tienNghi} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.tienNghi.includes(tienNghi)}
                          onChange={() => handleTienNghiChange(tienNghi)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm">{tienNghi}</span>
                      </label>
                    ))}
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
                    placeholder="Mô tả chi tiết về tình trạng xe, trang bị..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Điều khoản thuê
                  </label>
                  <textarea
                    name="dieuKhoanThue"
                    value={formData.dieuKhoanThue}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="Các điều khoản khi cho thuê xe..."
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
                    <li>Bạn chịu trách nhiệm về tình trạng xe khi cho thuê</li>
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
                    {loading ? 'Đang xử lý...' : 'Đăng cho thuê xe'}
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

export default DangChoThueXe;

