# Xe Tốt

Nền tảng mua bán, cho thuê xe ô tô và đặt dịch vụ sửa chữa/bảo dưỡng xe. Gồm 2 phần: `backend` (REST API + Socket.io) và `frontend` (giao diện web).

## Tính năng chính

- **Mua bán xe**: đăng bán, tìm kiếm/lọc, đặt mua, escrow tiền cọc, xác nhận giao dịch qua 2 bên (người mua/người bán)
- **Cho thuê xe**: đăng cho thuê, đặt thuê, thanh toán qua ví nội bộ
- **Dịch vụ xe**: đăng ký cung cấp dịch vụ, đặt lịch, xác nhận/hủy/hoàn thành
- **Xác thực KYC**: bắt buộc trước khi đăng bán/cho thuê/cung cấp dịch vụ
- **Ví điện tử & escrow**: giữ tiền cọc, hoàn/tịch thu cọc theo quy trình tranh chấp
- **Chat & lịch xem xe**: nhắn tin real-time (Socket.io), đặt lịch hẹn xem xe
- **Dashboard riêng theo vai trò**: Người bán, Người cho thuê, Nhà cung cấp dịch vụ, Admin — mỗi dashboard chỉ hiển thị dữ liệu của chính tài khoản đó
- **Chặn tự giao dịch**: không thể tự mua/thuê/đặt lịch dịch vụ của chính mình

## Công nghệ sử dụng

**Backend**: Node.js, Express, TypeScript, MongoDB (Mongoose), Socket.io, JWT, Multer, Helmet

**Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, React Router, Axios, Socket.io-client

## Cấu trúc thư mục

```
├── backend/          # REST API + Socket.io server
│   └── src/
│       ├── config/       # Kết nối database
│       ├── controllers/  # Business logic
│       ├── middleware/   # Auth, upload, rate limit, error handler
│       ├── models/       # Mongoose schemas
│       ├── routes/       # API routes
│       └── utils/        # Helper functions
└── frontend/         # Giao diện web (Vite + React)
    └── src/
        ├── components/   # Component tái sử dụng
        ├── contexts/      # Auth, Socket context
        ├── pages/         # Các trang (customer/admin/seller/rental/service)
        ├── services/      # Gọi API backend
        └── utils/         # Helper functions
```

## Cài đặt & chạy dự án

### 1. Cài đặt dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Cấu hình biến môi trường

Tạo file `backend/.env`:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# MongoDB connection string (local hoặc Atlas)
MONGODB_URI=mongodb://localhost:27017/xetot

# JWT
JWT_SECRET=<chuỗi ngẫu nhiên bảo mật>
JWT_EXPIRE=7d

# Upload
MAX_FILE_SIZE=5242880

# Dev only — tự động duyệt KYC khi test
AUTO_APPROVE_KYC=true

# Email / SMS (tùy chọn — để trống nếu không cần test gửi thật)
EMAIL_USER=
EMAIL_PASS=
TWILIO_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
ESMS_API_KEY=
ESMS_SECRET_KEY=
```

Frontend không bắt buộc `.env` — mặc định dùng Vite proxy để gọi backend cùng localhost, chỉ cần set `VITE_API_URL` khi deploy production trỏ tới domain API thật.

### 3. Chạy ứng dụng (development)

```bash
# Terminal 1 — backend (http://localhost:5000)
cd backend && npm run dev

# Terminal 2 — frontend (http://localhost:3000)
cd frontend && npm run dev
```

Mở trình duyệt tại `http://localhost:3000`.

### 4. Build production

```bash
cd backend && npm run build && npm start
cd frontend && npm run build && npm run preview
```

## Tài khoản test (dữ liệu seed)

| Vai trò | Email | Mật khẩu |
|---|---|---|
| Người bán (đã xác thực KYC) | seller1@test.com | seller123 |
| Người bán | seller2@test.com, seller3@test.com | seller123 |
| Nhà cung cấp dịch vụ | provider1-4@test.com | provider123 |

## Tài liệu bổ sung

Xem thêm các hướng dẫn chi tiết theo tính năng ở thư mục gốc: `ESCROW_TESTING_GUIDE.md`, `WALLET_DASHBOARD_GUIDE.md`, `HOT_SEARCH_GUIDE.md`, `CHAT_DEBUG_GUIDE.md`, `XAC_NHAN_VA_TRANH_CHAP_DON_HANG_GUIDE.md`, `QUY_TRINH_ESCROW_CHUYEN_KHOAN.md`, `HUONG_DAN_DANG_BAN_THUE_DICH_VU.md`.
