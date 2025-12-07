# Hướng dẫn sử dụng tính năng Đăng bán/cho thuê xe và Đăng ký dịch vụ

## Tổng quan

Hệ thống đã được cập nhật với 3 tính năng mới cho phép người dùng:
1. **Đăng bán xe** - Đăng tin bán xe cá nhân
2. **Đăng cho thuê xe** - Đăng tin cho thuê xe
3. **Đăng ký dịch vụ** - Đăng ký cung cấp dịch vụ bảo dưỡng, sửa chữa xe

## Cập nhật Backend

### 1. Routes đã được cập nhật

Các routes sau đã được thay đổi từ yêu cầu `requireAdmin` sang chỉ yêu cầu `authenticate`:

- **POST /api/v1/xe** - Tạo xe mới (trước đây: chỉ admin, bây giờ: user đã đăng nhập)
- **PUT /api/v1/xe/:id** - Cập nhật xe (trước đây: chỉ admin, bây giờ: user đã đăng nhập)
- **DELETE /api/v1/xe/:id** - Xóa xe (trước đây: chỉ admin, bây giờ: user đã đăng nhập)

- **POST /api/v1/xe-cho-thue** - Tạo xe cho thuê (trước đây: chỉ admin, bây giờ: user đã đăng nhập)
- **PUT /api/v1/xe-cho-thue/:id** - Cập nhật xe cho thuê (trước đây: chỉ admin, bây giờ: user đã đăng nhập)
- **DELETE /api/v1/xe-cho-thue/:id** - Xóa xe cho thuê (trước đây: chỉ admin, bây giờ: user đã đăng nhập)

- **POST /api/v1/dich-vu** - Tạo dịch vụ mới (trước đây: chỉ admin, bây giờ: user đã đăng nhập)
- **PUT /api/v1/dich-vu/:id** - Cập nhật dịch vụ (trước đây: chỉ admin, bây giờ: user đã đăng nhập)
- **DELETE /api/v1/dich-vu/:id** - Xóa dịch vụ (trước đây: chỉ admin, bây giờ: user đã đăng nhập)

### 2. Models đã được cập nhật

#### XeChoThue Model
Thêm trường mới:
```typescript
idChuXe?: mongoose.Types.ObjectId; // ID của người đăng cho thuê
```

#### DichVu Model
Thêm các trường mới:
```typescript
idNguoiCungCap?: mongoose.Types.ObjectId; // ID của nhà cung cấp dịch vụ
diaChi?: string; // Địa chỉ cửa hàng
soDienThoai?: string; // SĐT liên hệ
```

## Frontend - Trang mới

### 1. Trang Đăng bán xe (`/dang-ban-xe`)
**File:** `frontend/src/pages/customer/DangBanXe.tsx`

**Tính năng:**
- Form nhập thông tin xe: tên, hãng, màu sắc, năm sản xuất, giá, số km, số chỗ, loại xe
- Upload tối đa 10 hình ảnh
- Xem trước hình ảnh trước khi đăng
- Validation đầy đủ
- Gửi thông báo thành công/thất bại

**Các trường bắt buộc:**
- Tên xe
- Hãng xe
- Màu sắc
- Năm sản xuất
- Giá bán
- Số km đã chạy
- Số chỗ ngồi
- Loại xe
- Mô tả chi tiết
- Ít nhất 1 hình ảnh

### 2. Trang Đăng cho thuê xe (`/dang-cho-thue-xe`)
**File:** `frontend/src/pages/customer/DangChoThueXe.tsx`

**Tính năng:**
- Form nhập thông tin xe cho thuê: tên, hãng, dòng xe, biển số, màu sắc, năm sản xuất, số km, số chỗ
- Nhập giá thuê theo ngày và theo tháng
- Chọn tiện nghi (checkbox): Điều hòa, Camera hành trình, Cảm biến lùi, v.v.
- Nhập điều khoản thuê xe
- Upload tối đa 10 hình ảnh
- Validation đầy đủ

**Các trường bắt buộc:**
- Tên xe
- Hãng xe
- Dòng xe
- Biển số xe (unique)
- Màu sắc
- Năm sản xuất
- Số km đã chạy
- Số chỗ ngồi
- Loại xe
- Giá thuê theo ngày
- Giá thuê theo tháng
- Mô tả chi tiết
- Ít nhất 1 hình ảnh

### 3. Trang Đăng ký dịch vụ (`/dang-ky-dich-vu`)
**File:** `frontend/src/pages/customer/DangKyDichVu.tsx`

**Tính năng:**
- Form đăng ký dịch vụ: tên dịch vụ, loại dịch vụ, giá tham khảo, thời gian thực hiện
- Nhập thông tin liên hệ: số điện thoại, địa chỉ cửa hàng
- Loại dịch vụ: Sửa chữa, Bảo trì, Chăm sóc, Phụ kiện
- Upload tối đa 10 hình ảnh (cửa hàng, trang thiết bị, dự án đã làm)
- Hiển thị lợi ích khi trở thành đối tác

**Các trường bắt buộc:**
- Tên dịch vụ
- Loại dịch vụ
- Giá tham khảo
- Thời gian thực hiện
- Số điện thoại liên hệ
- Địa chỉ cửa hàng
- Mô tả chi tiết
- Ít nhất 1 hình ảnh

## Tích hợp vào Trang chủ

Trang chủ (`/`) đã được cập nhật với section mới "Bạn muốn kinh doanh?" (chỉ hiển thị khi user đã đăng nhập).

Section này bao gồm 3 cards:
1. **Đăng bán xe** - Link đến `/dang-ban-xe`
2. **Đăng cho thuê xe** - Link đến `/dang-cho-thue-xe`
3. **Đăng ký dịch vụ** - Link đến `/dang-ky-dich-vu`

## Quy trình sử dụng

### Đăng bán xe
1. User đăng nhập vào hệ thống
2. Vào trang chủ, click vào "Đăng bán xe" hoặc truy cập trực tiếp `/dang-ban-xe`
3. Điền đầy đủ thông tin xe và upload hình ảnh
4. Click "Đăng bán xe"
5. Hệ thống tạo bản ghi xe mới với trạng thái `dangBan`
6. Thông báo "Đăng bán xe thành công! Xe của bạn đang chờ duyệt."
7. Chuyển về trang chủ

### Đăng cho thuê xe
1. User đăng nhập vào hệ thống
2. Vào trang chủ, click vào "Đăng cho thuê xe" hoặc truy cập trực tiếp `/dang-cho-thue-xe`
3. Điền đầy đủ thông tin xe cho thuê, chọn tiện nghi, upload hình ảnh
4. Click "Đăng cho thuê xe"
5. Hệ thống tạo bản ghi xe cho thuê mới với trạng thái `sanSang`
6. Lưu thông tin người đăng vào field `idChuXe`
7. Thông báo "Đăng cho thuê xe thành công! Xe của bạn đang chờ duyệt."
8. Chuyển về trang chủ

### Đăng ký dịch vụ
1. User đăng nhập vào hệ thống
2. Vào trang chủ, click vào "Đăng ký dịch vụ" hoặc truy cập trực tiếp `/dang-ky-dich-vu`
3. Điền đầy đủ thông tin dịch vụ, upload hình ảnh cửa hàng/trang thiết bị
4. Click "Đăng ký dịch vụ"
5. Hệ thống tạo bản ghi dịch vụ mới với trạng thái `hoatDong`
6. Lưu thông tin người cung cấp vào field `idNguoiCungCap`
7. Thông báo "Đăng ký dịch vụ thành công! Dịch vụ của bạn đang chờ duyệt."
8. Chuyển về trang chủ

## Ghi chú quan trọng

### Phân quyền
- Tất cả 3 tính năng yêu cầu user phải đăng nhập (`ProtectedRoute`)
- User thường có thể tạo, sửa, xóa xe/dịch vụ của mình
- Admin vẫn có toàn quyền quản lý tất cả

### Upload hình ảnh
- Tối đa 10 hình ảnh cho mỗi bài đăng
- Hỗ trợ các định dạng: JPG, PNG, GIF, WebP
- Preview trước khi upload
- Có thể xóa ảnh đã chọn trước khi submit

### Validation
- Tất cả các trường bắt buộc đều được validate ở frontend
- Backend cũng có validation để đảm bảo dữ liệu hợp lệ
- Hiển thị thông báo lỗi rõ ràng cho user

### Trạng thái
- **Xe bán:** `dangBan` (mặc định khi tạo)
- **Xe cho thuê:** `sanSang` (mặc định khi tạo)
- **Dịch vụ:** `hoatDong` (mặc định khi tạo)

## Testing

### Test flow đăng bán xe
```bash
1. Đăng nhập với tài khoản customer
2. Truy cập /dang-ban-xe
3. Điền form và upload ảnh
4. Submit và kiểm tra response
5. Verify xe được tạo trong database
```

### Test flow đăng cho thuê xe
```bash
1. Đăng nhập với tài khoản customer
2. Truy cập /dang-cho-thue-xe
3. Điền form, chọn tiện nghi và upload ảnh
4. Submit và kiểm tra response
5. Verify xe cho thuê được tạo trong database
```

### Test flow đăng ký dịch vụ
```bash
1. Đăng nhập với tài khoản customer
2. Truy cập /dang-ky-dich-vu
3. Điền form và upload ảnh
4. Submit và kiểm tra response
5. Verify dịch vụ được tạo trong database
```

## API Endpoints

### Đăng bán xe
```
POST /api/v1/xe
Content-Type: multipart/form-data
Authorization: Bearer {token}

Body:
- tenXe
- hangXe
- mauSac
- namSanXuat
- gia
- soKm
- soCho
- loaiXe
- moTa
- trangThai: "dangBan"
- hinhAnh: File[] (max 10)
```

### Đăng cho thuê xe
```
POST /api/v1/xe-cho-thue
Content-Type: multipart/form-data
Authorization: Bearer {token}

Body:
- tenXe
- hangXe
- dongXe
- namSanXuat
- bienSoXe
- mauSac
- soKm
- soCho
- loaiXe
- giaThueTheoNgay
- giaThueTheoThang
- moTa
- trangThai: "sanSang"
- tienNghi: string[]
- dieuKhoanThue
- hinhAnh: File[] (max 10)
```

### Đăng ký dịch vụ
```
POST /api/v1/dich-vu
Content-Type: multipart/form-data
Authorization: Bearer {token}

Body:
- tenDichVu
- loaiDichVu
- moTa
- giaThamKhao
- thoiGianThucHien
- diaChi
- soDienThoai
- trangThai: "hoatDong"
- hinhAnh: File[] (max 10)
```

## Các cải tiến trong tương lai

1. **Dashboard quản lý** - Trang dashboard cho seller/rental owner/service provider để quản lý các bài đăng của mình
2. **Thống kê** - Hiển thị số lượt xem, số lượt liên hệ cho mỗi bài đăng
3. **Xác minh** - Hệ thống xác minh danh tính người bán/cho thuê
4. **Rating** - Cho phép khách hàng đánh giá người bán/cho thuê/nhà cung cấp dịch vụ
5. **Gói đăng tin** - Các gói đăng tin có phí với nhiều ưu đãi
6. **Push notifications** - Thông báo khi có người quan tâm đến bài đăng

## Liên hệ hỗ trợ

Nếu có vấn đề khi sử dụng các tính năng mới, vui lòng liên hệ:
- Email: support@xetot.com
- Hotline: 1900-xxxx

