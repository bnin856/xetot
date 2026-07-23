import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Clock, MapPin, Phone, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import lichDatDichVuService from '../../services/lichDatDichVuService';
import { useAuth } from '../../contexts/AuthContext';

interface DatLichDichVuModalProps {
  idDichVu: string;
  tenDichVu: string;
  onClose: () => void;
}

const DatLichDichVuModal: React.FC<DatLichDichVuModalProps> = ({ idDichVu, tenDichVu, onClose }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    ngayDat: '',
    gioDat: '09:00',
    diaDiem: '',
    soDienThoai: user?.sdt || '',
    ghiChu: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.ngayDat || !formData.gioDat || !formData.diaDiem || !formData.soDienThoai) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Kiểm tra ngày phải trong tương lai
    const selectedDate = new Date(formData.ngayDat);
    if (selectedDate < new Date()) {
      alert('Ngày đặt lịch phải trong tương lai');
      return;
    }

    setLoading(true);
    try {
      const response = await lichDatDichVuService.datLich({
        idDichVu,
        ...formData,
      });

      // Hiển thị thông báo thành công
      setShowSuccess(true);
      
      // Tự động đóng sau 3 giây
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.response?.data?.error?.message || 'Có lỗi xảy ra khi đặt lịch');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Generate time slots
  const timeSlots = [];
  for (let hour = 8; hour <= 20; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 20) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }

  // Min date = tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Success Message */}
          {showSuccess ? (
            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mb-6 flex justify-center"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Đặt lịch thành công!</h2>
              <p className="text-gray-600 mb-6">
                Lịch đặt dịch vụ của bạn đã được gửi. Vui lòng chờ người cung cấp xác nhận.
              </p>
              <p className="text-sm text-gray-500">
                Modal sẽ tự động đóng sau 3 giây...
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Đặt lịch dịch vụ</h2>
                  <p className="text-blue-100 text-sm">{tenDichVu}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-blue-700 rounded-lg transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Ngày đặt */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <CalendarIcon className="w-4 h-4 text-blue-600" />
                Ngày đặt lịch <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="ngayDat"
                value={formData.ngayDat}
                onChange={handleChange}
                min={minDate}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Giờ đặt */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Giờ đặt lịch <span className="text-red-500">*</span>
              </label>
              <select
                name="gioDat"
                value={formData.gioDat}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            {/* Địa điểm */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Địa điểm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="diaDiem"
                value={formData.diaDiem}
                onChange={handleChange}
                placeholder="VD: 123 Đường ABC, Quận 1, TP.HCM"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Người cung cấp sẽ xác nhận địa điểm hoặc đề xuất địa điểm khác
              </p>
            </div>

            {/* Số điện thoại */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 text-blue-600" />
                Số điện thoại liên hệ <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="soDienThoai"
                value={formData.soDienThoai}
                onChange={handleChange}
                placeholder="0912345678"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Ghi chú */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú (không bắt buộc)
              </label>
              <textarea
                name="ghiChu"
                value={formData.ghiChu}
                onChange={handleChange}
                rows={3}
                placeholder="VD: Tôi muốn bảo dưỡng định kỳ cho xe..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Info box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">📌 Lưu ý:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Lịch đặt dịch vụ cần được người cung cấp xác nhận</li>
                <li>• Bạn sẽ nhận thông báo khi lịch được duyệt</li>
                <li>• Vui lòng đến đúng giờ đã hẹn</li>
                <li>• Có thể hủy lịch trước 24h nếu có việc đột xuất</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang đặt lịch...' : 'Xác nhận đặt lịch'}
              </button>
            </div>
          </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DatLichDichVuModal;

