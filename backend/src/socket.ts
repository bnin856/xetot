import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { sendMessage } from './controllers/chatController';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export const initializeSocket = (server: HttpServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Middleware xác thực
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Khi có connection
  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`✅ User connected: ${socket.userId}`);

    // Join room theo userId để nhận tin nhắn riêng
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
    }

    // Join conversation room
    socket.on('join_conversation', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
      console.log(`User ${socket.userId} joined conversation ${conversationId}`);
    });

    // Leave conversation room
    socket.on('leave_conversation', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
      console.log(`User ${socket.userId} left conversation ${conversationId}`);
    });

    // Gửi tin nhắn
    socket.on('send_message', async (data: {
      idConversation: string;
      noiDung: string;
      loaiTinNhan?: 'text' | 'image' | 'file';
      hinhAnh?: string[];
    }) => {
      try {
        const result = await sendMessage(
          data.idConversation,
          socket.userId!,
          data.noiDung,
          data.loaiTinNhan,
          data.hinhAnh
        );

        if (result.success) {
          // Gửi tin nhắn cho tất cả người trong conversation
          io.to(`conversation:${data.idConversation}`).emit('new_message', result.message);

          // Có thể gửi notification riêng cho người nhận
          // io.to(`user:${receiverId}`).emit('new_notification', { ... });
        } else {
          socket.emit('message_error', { error: 'Failed to send message' });
        }
      } catch (error) {
        console.error('Error in send_message:', error);
        socket.emit('message_error', { error: 'Server error' });
      }
    });

    // User đang typing
    socket.on('typing', (data: { idConversation: string }) => {
      socket.to(`conversation:${data.idConversation}`).emit('user_typing', {
        userId: socket.userId,
      });
    });

    // User ngừng typing
    socket.on('stop_typing', (data: { idConversation: string }) => {
      socket.to(`conversation:${data.idConversation}`).emit('user_stop_typing', {
        userId: socket.userId,
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.userId}`);
    });
  });

  return io;
};

