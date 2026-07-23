import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Clock, MapPin, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import lichXemXeService from '../../services/lichXemXeService';
import { useAuth } from '../../contexts/AuthContext';

interface DatLichModalProps {
  idXe: string;
  tenXe: string;
  onClose: () => void;
}

const DatLichModal: React.FC<DatLichModalProps> = ({ idXe, tenXe, onClose }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ngayXem: '',
    gioXem: '09:00',
    diaDiem: '',
    soDienThoai: user?.sdt || '',
    ghiChu: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.ngayXem || !formData.gioXem || !formData.diaDiem || !formData.soDienThoai) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Kiểm tra ngày phải trong tương lai
    const selectedDate = new Date(formData.ngayXem);
    if (selectedDate < new Date()) {
      alert('Ngày xem xe phải trong tương lai');
      return;
    }

    setLoading(true);
    try {
      const response = await lichXemXeService.datLich({
        idXe,
        ...formData,
      });

      alert(response.message || 'Đặt lịch xem xe thành công! Chờ người bán xác nhận.');
      onClose();
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.response?.data?.error?.message || 'Có lỗi xảy ra khi đặt lịch');
    } finally {
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
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Đặt lịch xem xe</h2>
              <p className="text-blue-100 text-sm">{tenXe}</p>
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
            {/* Ngày xem */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <CalendarIcon className="w-4 h-4 text-blue-600" />
                Ngày xem xe <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="ngayXem"
                value={formData.ngayXem}
                onChange={handleChange}
                min={minDate}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Giờ xem */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Giờ xem xe <span className="text-red-500">*</span>
              </label>
              <select
                name="gioXem"
                value={formData.gioXem}
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
                Địa điểm xem xe <span className="text-red-500">*</span>
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
                Người bán sẽ xác nhận địa điểm hoặc đề xuất địa điểm khác
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
                placeholder="VD: Tôi muốn kiểm tra kỹ động cơ và hộp số..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Info box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">📌 Lưu ý:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Lịch xem xe cần được người bán xác nhận</li>
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
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DatLichModal;

