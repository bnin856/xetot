# Hướng dẫn Seed Dữ liệu Test

## Mục đích
Script này sẽ thêm dữ liệu test vào database để bạn có thể test các tính năng:
- 💬 Nhắn tin với người bán
- 📅 Đặt lịch xem xe

## Dữ liệu sẽ được tạo

### 👥 Người bán (3 người)
1. **seller1@test.com** / seller123
   - Tên: Trần Văn Bán Xe
   - SĐT: 0912345678
   - Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM
   - ✅ Đã xác thực (có thể đăng bán xe)

2. **seller2@test.com** / seller123
   - Tên: Nguyễn Thị Bán Xe
   - SĐT: 0923456789
   - Địa chỉ: 456 Đường XYZ, Quận 2, TP.HCM
   - ✅ Đã xác thực (có thể đăng bán xe)

3. **seller3@test.com** / seller123
   - Tên: Lê Văn Bán Xe
   - SĐT: 0934567890
   - Địa chỉ: 789 Đường DEF, Quận 3, TP.HCM
   - ✅ Đã xác thực (có thể đăng bán xe)

### 🚗 Xe có người bán (6 xe)
1. **Toyota Camry 2024** - seller1@test.com
2. **Honda CR-V 2023** - seller1@test.com
3. **Mazda CX-5 2022** - seller2@test.com
4. **Ford Ranger Raptor 2023** - seller2@test.com
5. **VinFast VF 8 2023** - seller3@test.com
6. **Mercedes-Benz C200 2022** - seller3@test.com

Tất cả xe đều có `idChuXe` được liên kết với người bán, nên bạn có thể:
- Click "Chat với người bán" để test tính năng chat
- Click "Đặt lịch xem xe" để test tính năng đặt lịch

## Cách chạy

### Bước 1: Đảm bảo MongoDB đang chạy
```bash
# Kiểm tra MongoDB connection string trong .env
```

### Bước 2: Chạy script seed
```bash
cd backend
npm run seed:test
```

### Bước 3: Kiểm tra kết quả
Script sẽ hiển thị:
- ✅ Số lượng người bán đã tạo
- ✅ Số lượng xe đã tạo
- 📝 Thông tin đăng nhập test

## Lưu ý

- Script sẽ **KHÔNG xóa** dữ liệu hiện có
- Nếu email đã tồn tại, script sẽ bỏ qua (không tạo trùng)
- Xe test sẽ được **xóa và tạo lại** mỗi lần chạy (để đảm bảo có idChuXe)

## Test Flow

1. **Đăng nhập với tài khoản customer:**
   - Email: `customer@example.com`
   - Password: `customer123`

2. **Xem chi tiết một trong các xe trên**

3. **Test Chat:**
   - Click "Chat với người bán"
   - Hoặc click "Đặt mua ngay" → "Nhắn tin với người bán"
   - Modal chat sẽ mở ra

4. **Test Đặt lịch:**
   - Click "Đặt lịch xem xe"
   - Hoặc click "Đặt mua ngay" → "Đặt lịch xem xe"
   - Form đặt lịch sẽ mở ra

## Troubleshooting

Nếu gặp lỗi:
1. Kiểm tra MongoDB connection trong `.env`
2. Đảm bảo backend dependencies đã được cài: `npm install`
3. Kiểm tra console log để xem lỗi cụ thể

