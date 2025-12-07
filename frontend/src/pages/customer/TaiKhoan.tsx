import React, { useState } from 'react';
import { User, Lock, MapPin, Phone, Mail } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

const TaiKhoan: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    ten: user?.ten || '',
    email: user?.email || '',
    sdt: user?.sdt || '',
    diaChi: user?.diaChi || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Update user info
    alert('Cập nhật thông tin thành công!');
  };

  return (
    <MainLayout>
      <div className="page-container py-8">
        <div className="container-custom max-w-3xl">
          <h1 className="text-3xl font-bold mb-8">Quản lý tài khoản</h1>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="card p-8 space-y-6"
          >
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4" />
                <span>Họ và tên</span>
              </label>
              <input
                type="text"
                name="ten"
                value={formData.ten}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4" />
                <span>Số điện thoại</span>
              </label>
              <input
                type="tel"
                name="sdt"
                value={formData.sdt}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4" />
                <span>Địa chỉ</span>
              </label>
              <textarea
                name="diaChi"
                value={formData.diaChi}
                onChange={handleChange}
                className="input-field"
                rows={3}
              />
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Lock className="w-5 h-5" />
                <span>Đổi mật khẩu</span>
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Nhập mật khẩu mới"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Nhập lại mật khẩu mới"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button type="button" className="btn-secondary">
                Hủy
              </button>
              <button type="submit" className="btn-primary">
                Lưu thay đổi
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </MainLayout>
  );
};

export default TaiKhoan;

