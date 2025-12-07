import api from './api';

export interface Message {
  _id: string;
  idConversation: string;
  idNguoiGui: {
    _id: string;
    ten: string;
    avatar?: string;
  };
  noiDung: string;
  loaiTinNhan: 'text' | 'image' | 'file';
  hinhAnh?: string[];
  daDoc: boolean;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  loaiXe?: 'xe' | 'xeChoThue';
  idXe: {
    _id: string;
    tenXe: string;
    hinhAnh: string[];
    gia: number;
  };
  idNguoiMua: {
    _id: string;
    ten: string;
    avatar?: string;
  };
  idNguoiBan: {
    _id: string;
    ten: string;
    avatar?: string;
  };
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCountMua: number;
  unreadCountBan: number;
  trangThai: 'active' | 'closed';
  createdAt: string;
}

const chatService = {
  // Tạo hoặc lấy conversation
  getOrCreateConversation: async (idXe: string, loaiXe: 'xe' | 'xeChoThue' = 'xe'): Promise<{ success: boolean; data: { conversation: Conversation } }> => {
    const response = await api.post('/chat/conversation', { idXe, loaiXe });
    return response.data;
  },

  // Lấy danh sách conversations
  getMyConversations: async (): Promise<{ success: boolean; data: { conversations: Conversation[] } }> => {
    const response = await api.get('/chat/conversations');
    return response.data;
  },

  // Lấy messages
  getMessages: async (
    conversationId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<{
    success: boolean;
    data: {
      messages: Message[];
      pagination: { page: number; limit: number; total: number; pages: number };
    };
  }> => {
    const response = await api.get(`/chat/conversation/${conversationId}/messages`, {
      params: { page, limit },
    });
    return response.data;
  },
};

export default chatService;

