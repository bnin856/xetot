# Backend - Hệ thống bán xe ô tô

## Công nghệ sử dụng

- **Node.js** + **Express** với **TypeScript**
- **MongoDB** với **Mongoose**
- **JWT** cho authentication
- **bcryptjs** cho password hashing
- **Multer** cho file upload
- **Helmet** cho security
- **CORS** cho cross-origin requests
- **Rate limiting** cho bảo vệ API

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

3. Cập nhật các biến môi trường trong `.env`:
- `MONGODB_URI`: Đường dẫn kết nối MongoDB
- `JWT_SECRET`: Secret key cho JWT
- `PORT`: Port cho server (mặc định 5000)

4. Đảm bảo MongoDB đang chạy

## Chạy ứng dụng

### Development mode:
```bash
npm run dev
```

### Production mode:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Đăng ký
- `POST /api/v1/auth/login` - Đăng nhập
- `GET /api/v1/auth/me` - Lấy thông tin user hiện tại

### Xe
- `GET /api/v1/xe` - Lấy danh sách xe (có filter, search, pagination)
- `GET /api/v1/xe/:id` - Lấy chi tiết xe
- `POST /api/v1/xe` - Tạo xe mới (Admin only)
- `PUT /api/v1/xe/:id` - Cập nhật xe (Admin only)
- `DELETE /api/v1/xe/:id` - Xóa xe (Admin only)

### Đơn hàng
- `POST /api/v1/don-hang` - Tạo đơn hàng
- `GET /api/v1/don-hang/my-orders` - Lấy đơn hàng của user
- `GET /api/v1/don-hang/all` - Lấy tất cả đơn hàng (Admin only)
- `PUT /api/v1/don-hang/:id/trang-thai` - Cập nhật trạng thái đơn hàng (Admin only)

### Khách hàng
- `GET /api/v1/khach-hang` - Lấy danh sách khách hàng (Admin only)
- `GET /api/v1/khach-hang/:id` - Lấy chi tiết khách hàng (Admin only)

### Thanh toán
- `POST /api/v1/thanh-toan` - Tạo thanh toán
- `GET /api/v1/thanh-toan/my-payments` - Lấy lịch sử thanh toán của user

### Đánh giá
- `POST /api/v1/danh-gia` - Tạo đánh giá
- `GET /api/v1/danh-gia/xe/:idXe` - Lấy đánh giá của xe

### Khuyến mãi
- `GET /api/v1/khuyen-mai` - Lấy danh sách khuyến mãi đang hoạt động
- `POST /api/v1/khuyen-mai` - Tạo khuyến mãi (Admin only)

### Thông báo
- `GET /api/v1/thong-bao/my-notifications` - Lấy thông báo của user
- `POST /api/v1/thong-bao` - Tạo thông báo (Admin only)

### Hỗ trợ
- `POST /api/v1/ho-tro` - Tạo yêu cầu hỗ trợ
- `GET /api/v1/ho-tro/my-support` - Lấy yêu cầu hỗ trợ của user
- `GET /api/v1/ho-tro/all` - Lấy tất cả yêu cầu hỗ trợ (Admin only)

### Yêu cầu đăng bán xe hộ
- `POST /api/v1/yeu-cau-ban-xe` - Tạo yêu cầu đăng bán xe hộ
- `GET /api/v1/yeu-cau-ban-xe/my-requests` - Lấy yêu cầu của user
- `GET /api/v1/yeu-cau-ban-xe/all` - Lấy tất cả yêu cầu (Admin only)
- `PUT /api/v1/yeu-cau-ban-xe/:id/duyet` - Duyệt yêu cầu và tạo xe (Admin only)

### Báo cáo
- `GET /api/v1/bao-cao/tong-quan` - Lấy báo cáo tổng quan (Admin only)

## Authentication

Sử dụng JWT Bearer token:
```
Authorization: Bearer <token>
```

## File Upload

Upload ảnh xe sử dụng multipart/form-data với field name `hinhAnh` (có thể upload nhiều ảnh).

## Cấu trúc thư mục

```
backend/
├── src/
│   ├── config/         # Database config
│   ├── controllers/    # Business logic
│   ├── middleware/     # Auth, error handling, upload
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── utils/          # Helper functions
│   └── index.ts         # Entry point
├── uploads/            # Uploaded files
└── dist/               # Compiled JavaScript
```
