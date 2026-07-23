# Frontend - Hệ thống bán xe ô tô

## Công nghệ sử dụng

- React 19 với TypeScript
- Vite cho build tool và dev server
- Tailwind CSS cho styling
- Framer Motion cho animations
- React Router DOM cho routing
- Lucide React cho icons

## Cài đặt

```bash
npm install
```

## Chạy ứng dụng

### Development
```bash
npm run dev
```

Ứng dụng sẽ chạy tại http://localhost:3000

### Build cho production
```bash
npm run build
```

### Preview build
```bash
npm run preview
```

## Biến môi trường

Tạo file `.env` trong thư mục `frontend` với nội dung:
```
VITE_API_URL=http://localhost:5000
```

## Cấu trúc thư mục

```
src/
├── components/       # Các component tái sử dụng
│   └── Layout/      # Layout components (Header, Footer, AdminLayout)
├── contexts/        # React Contexts (AuthContext)
├── pages/          # Các trang
│   ├── admin/      # Trang quản trị
│   └── customer/   # Trang khách hàng
├── types/          # TypeScript types
├── utils/          # Utility functions
└── App.tsx         # Main app component với routing
```

## Tính năng

### Khách hàng
- Đăng ký/Đăng nhập
- Tìm kiếm xe với bộ lọc
- Xem chi tiết xe
- Đặt mua xe
- Quản lý đơn hàng
- Quản lý tài khoản
- Nhờ đăng bán xe hộ

### Admin
- Quản lý xe
- Quản lý đơn hàng
- Quản lý khách hàng
- Báo cáo và thống kê
- Quản lý thanh toán
- Và nhiều tính năng khác...

### Người bán / Cho thuê / Dịch vụ
- Dashboard riêng theo vai trò (`/seller`, `/rental`, `/service`)
- Quản lý tin đăng, xác nhận/từ chối đơn hàng, xem doanh thu và lịch sử giao dịch

## Ghi chú

- Xem hướng dẫn cài đặt và chạy đầy đủ (cả backend) tại [README.md ở thư mục gốc](../README.md)
- Trong development, API được gọi qua Vite proxy (xem `vite.config.ts`) nên không cần cấu hình `VITE_API_URL`
