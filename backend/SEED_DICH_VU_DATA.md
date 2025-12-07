# Hướng dẫn Seed Dữ liệu Dịch vụ Xe

File này hướng dẫn cách chạy script để tạo dữ liệu mẫu cho dịch vụ xe và người cung cấp dịch vụ.

## Chạy Script

```bash
cd backend
npm run seed:dichvu
```

## Dữ liệu được tạo

### 4 Người cung cấp dịch vụ (Service Providers)

1. **Nguyễn Văn Sửa Xe**
   - Email: `provider1@test.com`
   - Password: `provider123`
   - SĐT: `0911111111`
   - Địa chỉ: `123 Đường Nguyễn Văn Cừ, Quận 5, TP.HCM`
   - Chuyên: Sửa chữa

2. **Trần Thị Bảo Dưỡng**
   - Email: `provider2@test.com`
   - Password: `provider123`
   - SĐT: `0922222222`
   - Địa chỉ: `456 Đường Lê Lợi, Quận 1, TP.HCM`
   - Chuyên: Bảo trì

3. **Lê Văn Chăm Sóc Xe**
   - Email: `provider3@test.com`
   - Password: `provider123`
   - SĐT: `0933333333`
   - Địa chỉ: `789 Đường Võ Văn Tần, Quận 3, TP.HCM`
   - Chuyên: Chăm sóc

4. **Phạm Thị Phụ Kiện**
   - Email: `provider4@test.com`
   - Password: `provider123`
   - SĐT: `0944444444`
   - Địa chỉ: `321 Đường Nguyễn Trãi, Quận 1, TP.HCM`
   - Chuyên: Phụ kiện

### 12 Dịch vụ được tạo

#### Provider 1 - Sửa chữa (3 dịch vụ):
- Sửa chữa động cơ chuyên nghiệp (2,000,000 ₫)
- Sửa chữa hệ thống phanh (1,500,000 ₫)
- Sửa chữa điều hòa xe hơi (800,000 ₫)

#### Provider 2 - Bảo trì (3 dịch vụ):
- Bảo dưỡng định kỳ xe hơi (1,200,000 ₫)
- Thay nhớt động cơ cao cấp (500,000 ₫)
- Cân chỉnh bánh xe chuyên nghiệp (300,000 ₫)

#### Provider 3 - Chăm sóc (3 dịch vụ):
- Rửa xe và đánh bóng ngoại thất (400,000 ₫)
- Vệ sinh nội thất xe hơi (600,000 ₫)
- Dán phim cách nhiệt cao cấp (3,000,000 ₫)

#### Provider 4 - Phụ kiện (3 dịch vụ):
- Lắp đặt camera hành trình (2,500,000 ₫)
- Lắp đặt hệ thống âm thanh (5,000,000 ₫)
- Lắp đặt cảm biến áp suất lốp (1,800,000 ₫)

## Lưu ý

- Tất cả người cung cấp đã được xác thực (verified)
- Tất cả dịch vụ đều có `idNguoiCungCap` được link đúng
- Tất cả dịch vụ đều ở trạng thái `hoatDong`
- Mỗi dịch vụ đều có địa chỉ và số điện thoại liên hệ

## Test chức năng đặt lịch

1. Đăng nhập với tài khoản customer bất kỳ
2. Vào trang `/dich-vu` để xem danh sách dịch vụ
3. Click vào một dịch vụ để xem chi tiết
4. Click "Đặt lịch ngay" hoặc "Đặt lịch dịch vụ"
5. Điền form và submit
6. Kiểm tra lịch đặt ở `/lich-dat-dich-vu`

## Đăng nhập với tài khoản provider

Bạn có thể đăng nhập với tài khoản provider để:
- Xem các lịch đặt dịch vụ của mình
- Duyệt/từ chối lịch đặt
- Đánh dấu hoàn thành dịch vụ

