import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ChatModal from './ChatModal';

interface ChatButtonProps {
  idXe: string;
  tenXe: string;
  idNguoiBan: string;
  loaiXe?: 'xe' | 'xeChoThue'; // Mặc định là 'xe'
}

const ChatButton: React.FC<ChatButtonProps> = ({ idXe, tenXe, idNguoiBan, loaiXe = 'xe' }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);

  const handleClick = () => {
    if (!user) {
      alert('Vui lòng đăng nhập để chat với người bán');
      navigate('/dang-nhap');
      return;
    }

    if (user.id === idNguoiBan) {
      alert('Bạn không thể chat với chính mình');
      return;
    }

    // Kiểm tra token
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      navigate('/dang-nhap');
      return;
    }

    // Mở modal chat ngay tại trang này
    setShowChat(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
      >
        <MessageCircle className="w-5 h-5" />
        Chat với người bán
      </button>

      {showChat && (
        <ChatModal
          idXe={idXe}
          tenXe={tenXe}
          loaiXe={loaiXe}
          onClose={() => setShowChat(false)}
        />
      )}
    </>
  );
};

export default ChatButton;

