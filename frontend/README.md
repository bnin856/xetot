# Frontend - Hệ thống bán xe ô tô

## Công nghệ sử dụng

- React 19 với TypeScript
- Tailwind CSS cho styling
- Framer Motion cho animations
- React Router DOM cho routing
- Lucide React cho icons

## Cài đặt

```bash
npm install
```

## Chạy ứng dụng

```bash
npm start
```

Ứng dụng sẽ chạy tại http://localhost:3000

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

## Ghi chú

- Backend API sẽ được tích hợp sau
- Hiện tại sử dụng mock data
- Cần cấu hình API endpoint trong `src/services/` khi backend sẵn sàng
