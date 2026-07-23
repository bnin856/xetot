import express from 'express';
import { createServer } from 'http';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { initializeSocket } from './socket';

// Import routes
import authRoutes from './routes/auth';
import xeRoutes from './routes/xe';
import donHangRoutes from './routes/donHang';
import khachHangRoutes from './routes/khachHang';
import thanhToanRoutes from './routes/thanhToan';
import danhGiaRoutes from './routes/danhGia';
import khuyenMaiRoutes from './routes/khuyenMai';
import thongBaoRoutes from './routes/thongBao';
import hoTroRoutes from './routes/hoTro';
import yeuCauBanXeRoutes from './routes/yeuCauBanXe';
import baoCaoRoutes from './routes/baoCao';
import xeChoThueRoutes from './routes/xeChoThue';
import donThueXeRoutes from './routes/donThueXe';
import dichVuRoutes from './routes/dichVu';
import passwordResetRoutes from './routes/passwordReset';
import escrowRoutes from './routes/escrow';
import walletRoutes from './routes/wallet';
import chatRoutes from './routes/chat';
import lichXemXeRoutes from './routes/lichXemXe';
import lichDatDichVuRoutes from './routes/lichDatDichVu';
import xacThucRoutes from './routes/xacThuc';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve ảnh/tệp đã upload (biên lai, hình ảnh xe, giấy tờ xác thực...)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Rate limiting
app.use('/api/', rateLimiter);

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/password-reset', passwordResetRoutes);
app.use('/api/v1/xe', xeRoutes);
app.use('/api/v1/xe-cho-thue', xeChoThueRoutes);
app.use('/api/v1/don-thue-xe', donThueXeRoutes);
app.use('/api/v1/dich-vu', dichVuRoutes);
app.use('/api/v1/escrow', escrowRoutes);
app.use('/api/v1/wallet', walletRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/lich-xem-xe', lichXemXeRoutes);
app.use('/api/v1/lich-dat-dich-vu', lichDatDichVuRoutes);
app.use('/api/v1/xac-thuc', xacThucRoutes);
app.use('/api/v1/don-hang', donHangRoutes);
app.use('/api/v1/khach-hang', khachHangRoutes);
app.use('/api/v1/thanh-toan', thanhToanRoutes);
app.use('/api/v1/danh-gia', danhGiaRoutes);
app.use('/api/v1/khuyen-mai', khuyenMaiRoutes);
app.use('/api/v1/thong-bao', thongBaoRoutes);
app.use('/api/v1/ho-tro', hoTroRoutes);
app.use('/api/v1/yeu-cau-ban-xe', yeuCauBanXeRoutes);
app.use('/api/v1/bao-cao', baoCaoRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handler
app.use(errorHandler);

// Create HTTP server
const server = createServer(app);

// Initialize Socket.io
const io = initializeSocket(server);

// Import utility để tự động cập nhật trạng thái đơn thuê xe
import { updateDonThueXeStatus } from './utils/updateDonThueXeStatus';

// Connect to database and start server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`💬 Socket.io initialized`);
    
    // Tự động cập nhật trạng thái đơn thuê xe mỗi giờ
    setInterval(() => {
      updateDonThueXeStatus();
    }, 60 * 60 * 1000); // Mỗi giờ
    
    // Cập nhật ngay khi start server
    updateDonThueXeStatus();
  });
});

export default app;
export { io };

