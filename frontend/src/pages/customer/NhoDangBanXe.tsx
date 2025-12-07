import React, { useState } from 'react';
import { Car, DollarSign, FileText } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import { motion } from 'framer-motion';

const NhoDangBanXe: React.FC = () => {
  const [formData, setFormData] = useState({
    tenXe: '',
    hangXe: '',
    namSanXuat: '',
    soKm: '',
    mauSac: '',
    giaYeuCau: '',
    hoaHong: '5',
    moTa: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit request
    alert('Gửi yêu cầu thành công! Admin sẽ liên hệ với bạn sớm nhất.');
  };

  return (
    <MainLayout>
      <div className="page-container py-8">
        <div className="container-custom max-w-3xl">
          <h1 className="text-3xl font-bold mb-8">Nhờ đăng bán xe</h1>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="card p-8 space-y-6"
          >
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Car className="w-4 h-4" />
                <span>Tên xe</span>
              </label>
              <input
                type="text"
                name="tenXe"
                value={formData.tenXe}
                onChange={handleChange}
                className="input-field"
                placeholder="Ví dụ: Toyota Vios 2023"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hãng xe
                </label>
                <select
                  name="hangXe"
                  value={formData.hangXe}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Chọn hãng xe</option>
                  <option value="toyota">Toyota</option>
                  <option value="honda">Honda</option>
                  <option value="mazda">Mazda</option>
                  <option value="hyundai">Hyundai</option>
                  <option value="kia">Kia</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Năm sản xuất
                </label>
                <input
                  type="number"
                  name="namSanXuat"
                  value={formData.namSanXuat}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="2023"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số km đã đi
                </label>
                <input
                  type="number"
                  name="soKm"
                  value={formData.soKm}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="15000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Màu sắc
                </label>
                <input
                  type="text"
                  name="mauSac"
                  value={formData.mauSac}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Trắng"
                  required
                />
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4" />
                <span>Giá yêu cầu (VNĐ)</span>
              </label>
              <input
                type="number"
                name="giaYeuCau"
                value={formData.giaYeuCau}
                onChange={handleChange}
                className="input-field"
                placeholder="450000000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hoa hồng (%)
              </label>
              <select
                name="hoaHong"
                value={formData.hoaHong}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="3">3%</option>
                <option value="5">5%</option>
                <option value="7">7%</option>
                <option value="10">10%</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Hoa hồng sẽ được tính trên giá bán cuối cùng
              </p>
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4" />
                <span>Mô tả thêm</span>
              </label>
              <textarea
                name="moTa"
                value={formData.moTa}
                onChange={handleChange}
                className="input-field"
                rows={5}
                placeholder="Mô tả thêm về tình trạng xe, lịch sử sử dụng..."
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Lưu ý:</strong> Sau khi gửi yêu cầu, Admin sẽ xem xét và liên hệ với bạn 
                trong vòng 24 giờ để xác nhận thông tin và tiến hành đăng bán xe.
              </p>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button type="button" className="btn-secondary">
                Hủy
              </button>
              <button type="submit" className="btn-primary">
                Gửi yêu cầu
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </MainLayout>
  );
};

export default NhoDangBanXe;

