# Hướng dẫn bật/tắt tự động duyệt KYC

## Tính năng

Hệ thống hỗ trợ tự động duyệt KYC (Know Your Customer) ngay sau khi người dùng upload giấy tờ, không cần admin duyệt thủ công.

## Cách bật tự động duyệt

1. Mở file `.env` trong thư mục `backend`

2. Thêm dòng sau:
```env
AUTO_APPROVE_KYC=true
```

3. Khởi động lại backend:
```bash
cd backend
npm run dev
```

## Cách tắt tự động duyệt

1. Mở file `.env` trong thư mục `backend`

2. Đặt giá trị `false` hoặc xóa dòng:
```env
AUTO_APPROVE_KYC=false
```

Hoặc không có dòng này (mặc định là tắt)

3. Khởi động lại backend

## Lưu ý

- **Khi bật auto-approve**: Tất cả yêu cầu xác thực sẽ được tự động duyệt ngay sau khi upload
- **Khi tắt auto-approve**: Yêu cầu xác thực sẽ ở trạng thái "Chờ xử lý" và cần admin duyệt thủ công tại `/admin/xac-thuc`
- **Bảo mật**: Nên tắt auto-approve trong môi trường production để đảm bảo tính xác thực của giấy tờ

## Ví dụ file .env

```env
MONGODB_URI=mongodb://localhost:27017/xetot
JWT_SECRET=your-secret-key
PORT=5000
AUTO_APPROVE_KYC=true
```

