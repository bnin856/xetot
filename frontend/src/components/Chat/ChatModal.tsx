import React, { useEffect, useState, useRef } from 'react';
import { X, Send, Image as ImageIcon, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../../contexts/SocketContext';
import chatService, { Message, Conversation } from '../../services/chatService';
import { useAuth } from '../../contexts/AuthContext';

interface ChatModalProps {
  idXe: string;
  tenXe: string;
  loaiXe?: 'xe' | 'xeChoThue';
  onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ idXe, tenXe, loaiXe = 'xe', onClose }) => {
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    loadConversation();
  }, [idXe]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket listeners
  useEffect(() => {
    if (!socket || !conversation) return;

    // Join conversation room
    socket.emit('join_conversation', conversation._id);

    // Listen for new messages
    socket.on('new_message', (newMessage: Message) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.emit('leave_conversation', conversation._id);
      socket.off('new_message');
    };
  }, [socket, conversation]);

  const loadConversation = async () => {
    try {
      setLoading(true);
      console.log('Loading conversation for:', { idXe, loaiXe });
      
      // Tạo hoặc lấy conversation
      const convResponse = await chatService.getOrCreateConversation(idXe, loaiXe);
      console.log('Conversation response:', convResponse);
      
      if (!convResponse.success || !convResponse.data.conversation) {
        throw new Error('Không thể tạo hội thoại');
      }
      
      setConversation(convResponse.data.conversation);

      // Load messages
      const messagesResponse = await chatService.getMessages(convResponse.data.conversation._id);
      console.log('Messages response:', messagesResponse);
      
      if (messagesResponse.success) {
        setMessages(messagesResponse.data.messages);
      }
    } catch (error: any) {
      console.error('Error loading conversation:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      const errorMessage = error.response?.data?.message || error.message || 'Không thể tải hội thoại';
      
      // Không đóng modal, chỉ hiển thị lỗi
      alert(`Lỗi: ${errorMessage}\n\nVui lòng kiểm tra:\n- Đã đăng nhập chưa?\n- Backend đang chạy không?\n- Console để xem chi tiết lỗi`);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputMessage.trim() || !socket || !conversation || sending) return;

    setSending(true);
    try {
      // Emit qua socket
      socket.emit('send_message', {
        idConversation: conversation._id,
        noiDung: inputMessage.trim(),
        loaiTinNhan: 'text',
      });

      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Không thể gửi tin nhắn');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getOtherUser = () => {
    if (!conversation || !user) return null;
    return conversation.idNguoiMua._id === user.id
      ? conversation.idNguoiBan
      : conversation.idNguoiMua;
  };

  const otherUser = getOtherUser();

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
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between bg-primary-600 text-white rounded-t-2xl">
            <div>
              <h3 className="font-bold text-lg">{otherUser?.ten || 'Người bán'}</h3>
              <p className="text-sm opacity-90">{tenXe}</p>
              {!isConnected && <p className="text-xs text-red-300">Đang kết nối...</p>}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-primary-700 rounded-lg transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader className="w-8 h-8 animate-spin text-primary-600" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isOwn = msg.idNguoiGui._id === user?.id;
                return (
                  <div
                    key={msg._id}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        isOwn
                          ? 'bg-primary-600 text-white'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      {!isOwn && (
                        <p className="text-xs text-gray-500 mb-1">{msg.idNguoiGui.ten}</p>
                      )}
                      <p className="break-words">{msg.noiDung}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isOwn ? 'text-primary-100' : 'text-gray-400'
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={!isConnected || sending}
              />
              <button
                onClick={handleSend}
                disabled={!inputMessage.trim() || !isConnected || sending}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {sending ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatModal;

