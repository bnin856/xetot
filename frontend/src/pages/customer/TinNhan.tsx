import React, { useEffect, useState } from 'react';
import { MessageCircle, Search, User } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';
import { motion } from 'framer-motion';
import chatService, { Conversation } from '../../services/chatService';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import ChatModal from '../../components/Chat/ChatModal';

const TinNhan: React.FC = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  // Tự động mở conversation nếu có query params
  useEffect(() => {
    const xeId = searchParams.get('xeId');
    const loaiXe = (searchParams.get('loaiXe') || 'xe') as 'xe' | 'xeChoThue';
    
    if (xeId && conversations.length > 0) {
      // Tìm conversation với xe này
      const conv = conversations.find(
        (c) => c.idXe._id === xeId && (c.loaiXe || 'xe') === loaiXe
      );
      
      if (conv) {
        setSelectedConversation(conv);
        // Xóa query params sau khi đã mở
        window.history.replaceState({}, '', '/tin-nhan');
      } else {
        // Nếu chưa có conversation, tạo mới
        createAndOpenConversation(xeId, loaiXe);
      }
    }
  }, [searchParams, conversations]);

  const createAndOpenConversation = async (xeId: string, loaiXe: 'xe' | 'xeChoThue') => {
    try {
      const response = await chatService.getOrCreateConversation(xeId, loaiXe);
      if (response.success && response.data.conversation) {
        setSelectedConversation(response.data.conversation);
        // Refresh conversations list
        fetchConversations();
        // Xóa query params
        window.history.replaceState({}, '', '/tin-nhan');
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  // Listen for new messages
  useEffect(() => {
    if (!socket) return;

    socket.on('new_message', () => {
      fetchConversations();
    });

    return () => {
      socket.off('new_message');
    };
  }, [socket]);

  const fetchConversations = async () => {
    try {
      const response = await chatService.getMyConversations();
      setConversations(response.data.conversations);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  const getOtherUser = (conversation: Conversation) => {
    if (!user) return null;
    return conversation.idNguoiMua._id === user.id
      ? conversation.idNguoiBan
      : conversation.idNguoiMua;
  };

  const getUnreadCount = (conversation: Conversation) => {
    if (!user) return 0;
    return conversation.idNguoiMua._id === user.id
      ? conversation.unreadCountMua
      : conversation.unreadCountBan;
  };

  const filteredConversations = conversations.filter((conv) => {
    if (!searchTerm) return true;
    
    const otherUser = getOtherUser(conv);
    const searchLower = searchTerm.toLowerCase();
    
    const tenXe = conv.idXe?.tenXe || '';
    const tenNguoiDung = otherUser?.ten || '';
    
    return (
      tenXe.toLowerCase().includes(searchLower) ||
      tenNguoiDung.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="page-container py-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <MessageCircle className="w-8 h-8 text-primary-600" />
              Tin nhắn
            </h1>
            <p className="text-gray-600">Quản lý tất cả cuộc trò chuyện của bạn</p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-4 mb-6"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên xe hoặc người dùng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </motion.div>

          {/* Conversations List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {filteredConversations.length === 0 ? (
              <div className="card p-12 text-center">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {searchTerm ? 'Không tìm thấy cuộc trò chuyện' : 'Chưa có tin nhắn nào'}
                </h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? 'Thử tìm kiếm với từ khóa khác'
                    : 'Hãy chat với người bán khi xem xe bạn quan tâm'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredConversations.map((conversation) => {
                  const otherUser = getOtherUser(conversation);
                  const unreadCount = getUnreadCount(conversation);

                  return (
                    <motion.div
                      key={conversation._id}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setSelectedConversation(conversation)}
                      className="card p-4 cursor-pointer hover:shadow-lg transition-all"
                    >
                      <div className="flex gap-4">
                        {/* Xe Image */}
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                          {conversation.idXe.hinhAnh && conversation.idXe.hinhAnh.length > 0 ? (
                            <img
                              src={`http://localhost:5000/${conversation.idXe.hinhAnh[0]}`}
                              alt={conversation.idXe.tenXe}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              No image
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="font-semibold text-lg truncate">
                              {conversation.idXe.tenXe}
                            </h3>
                            {unreadCount > 0 && (
                              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full ml-2">
                                {unreadCount}
                              </span>
                            )}
                          </div>

                          <p className="text-primary-600 font-semibold mb-2">
                            {formatPrice(conversation.idXe.gia)}
                          </p>

                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <User className="w-4 h-4" />
                            <span>{otherUser?.ten}</span>
                          </div>

                          {conversation.lastMessage && (
                            <p className={`text-sm truncate ${unreadCount > 0 ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>
                              {conversation.lastMessage}
                            </p>
                          )}

                          {conversation.lastMessageAt && (
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(conversation.lastMessageAt).toLocaleString('vi-VN')}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Chat Modal */}
      {selectedConversation && (
        <ChatModal
          idXe={selectedConversation.idXe._id}
          tenXe={selectedConversation.idXe.tenXe}
          loaiXe={selectedConversation.loaiXe || 'xe'}
          onClose={() => {
            setSelectedConversation(null);
            fetchConversations();
          }}
        />
      )}
    </MainLayout>
  );
};

export default TinNhan;

