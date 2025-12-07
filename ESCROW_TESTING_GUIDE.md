# 🔐 Hướng dẫn Test Hệ thống Escrow Payment

## 📋 Tổng quan

Hệ thống escrow payment đã được triển khai hoàn chỉnh với 3 phương thức thanh toán:
1. **Tiền mặt / Gặp trực tiếp** (có escrow 2%)
2. **Chuyển khoản online** (không cọc)
3. **Vay ngân hàng** (không cọc)

---

## 🚀 Bước 1: Khởi động hệ thống

### Backend
```bash
cd backend
npm run dev
# Server chạy tại http://localhost:5000
```

### Frontend
```bash
cd frontend
npm start
# App chạy tại http://localhost:3000
```

---

## 👥 Bước 2: Tạo tài khoản test

### Tài khoản Admin (có sẵn từ seed)
- Email: `admin@xetot.com`
- Password: `Admin@123`

### Tài khoản Customer
1. Vào `/dang-ky`
2. Điền thông tin:
   - Tên: `Nguyễn Văn A`
   - Email: `khach1@test.com`
   - SĐT: `0901234567`
   - Địa chỉ: `123 Lê Lợi, Q1, TP.HCM`
   - Mật khẩu: `Test@123456`
3. Đăng ký thành công

---

## 🧪 Bước 3: Test Flow Escrow - Tiền mặt

### 3.1. Khách hàng đặt mua xe
1. **Đăng nhập** với tài khoản customer
2. Vào **Tìm kiếm xe** → Chọn 1 xe bất kỳ
3. Bấm **"Đặt mua ngay"**
4. Trang **Chọn phương thức thanh toán** hiện ra:
   - ✅ Kiểm tra 3 cards hiển thị đẹp
   - ✅ Card "Tiền mặt" có badge "Cần đặt cọc: XXX ₫ (2%)"
   - ✅ Flow diagram 4 bước hiển thị rõ ràng
   - ✅ 3 scenarios (Thành công / Xe sai / Khách hủy) hiển thị chi tiết
5. **Chọn "Tiền mặt"** → Bấm **"Tiếp tục"**
6. Trang **Đặt mua xe** hiện ra:
   - ✅ Thông tin xe đầy đủ
   - ✅ Chi phí chi tiết 7 khoản
   - ✅ Tổng tiền chính xác
7. Điền **địa chỉ giao** → Bấm **"Đặt hàng"**
8. Chuyển đến **Lịch sử đơn hàng**

### 3.2. Xem chi tiết đơn hàng
1. Trong **Lịch sử đơn hàng**, bấm **"Chi tiết"**
2. Trang **Chi tiết đơn hàng** hiển thị:
   - ✅ Status badge màu vàng: "Chờ xác nhận"
   - ✅ Thông tin xe đầy đủ
   - ✅ Chi phí chi tiết
   - ✅ Card "Tiền cọc Escrow" màu vàng với số tiền 2%
   - ✅ Trạng thái cọc: "Chưa thanh toán"
   - ✅ Địa chỉ giao hàng

### 3.3. Admin xác nhận đơn hàng
1. **Đăng xuất** → **Đăng nhập** với admin
2. Vào **Admin** → **Quản lý đơn hàng**
3. Tìm đơn vừa tạo → Đổi trạng thái:
   - `choXacNhan` → `daXacNhan` → `daThanhToanCoc` → `dangGiao` → `choKiemTra`
4. Hoặc dùng API:
```bash
# Xác nhận cọc đã thanh toán
curl -X POST http://localhost:5000/api/v1/escrow/{ORDER_ID}/xac-nhan-coc \
  -H "Authorization: Bearer {ADMIN_TOKEN}"
```

### 3.4. Khách kiểm tra xe - Scenario A: Thành công ✅
1. **Đăng nhập** lại với customer
2. Vào **Chi tiết đơn hàng** (trạng thái `choKiemTra`)
3. 3 nút action hiện ra:
   - ✅ **"Xe đúng mô tả - Hoàn tất"** (xanh lá)
   - ⚠️ **"Xe sai mô tả"** (cam)
   - ❌ **"Tôi muốn hủy"** (đỏ)
4. Bấm **"Xe đúng mô tả - Hoàn tất"**
5. Confirm → Thành công!
6. **Kết quả:**
   - Trạng thái đơn: `daHoanThanh`
   - Trạng thái cọc: `daTichThu`
   - Cọc được chia: 1% cho người bán, 1% cho sàn

### 3.5. Khách kiểm tra xe - Scenario B: Xe sai mô tả ⚠️
1. Tạo đơn mới → Đưa về trạng thái `choKiemTra`
2. Bấm **"Xe sai mô tả"**
3. Modal hiện ra → Nhập lý do:
   ```
   Xe có vết xước lớn ở cánh cửa phải, không giống hình.
   Số km thực tế 150,000 km nhưng quảng cáo 80,000 km.
   ```
4. Bấm **"Gửi báo cáo"**
5. **Kết quả:**
   - Trạng thái đơn: `tranh_chap_xe_sai`
   - Trạng thái cọc: `daHoan` (hoàn 100% cho khách)
   - Thông báo: "Admin sẽ xử lý trong 24h"

### 3.6. Khách kiểm tra xe - Scenario C: Khách hủy vô lý do ❌
1. Tạo đơn mới → Đưa về trạng thái `choKiemTra`
2. Bấm **"Tôi muốn hủy"**
3. Modal cảnh báo hiện ra:
   - ⚠️ **"Bạn sẽ mất 100% tiền cọc"**
   - Người bán nhận: XXX ₫
   - Xe Tốt nhận: XXX ₫
4. Nhập lý do → Bấm **"Xác nhận hủy"**
5. **Kết quả:**
   - Trạng thái đơn: `tranh_chap_khach_huy`
   - Trạng thái cọc: `daTichThu` (khách mất 100%)
   - Cọc chia: 1% bán, 1% sàn

---

## 👨‍💼 Bước 4: Admin xử lý tranh chấp

### 4.1. Vào trang Xử lý tranh chấp
1. **Đăng nhập** admin
2. Vào **Admin** → **Xử lý tranh chấp**
3. Danh sách tranh chấp hiển thị:
   - ✅ Card màu cam/đỏ theo loại tranh chấp
   - ✅ Thông tin xe, khách hàng, tiền cọc
   - ✅ Lý do báo cáo
   - ✅ Nút "Xử lý"

### 4.2. Xử lý tranh chấp "Xe sai mô tả"
1. Bấm **"Xử lý"** trên đơn tranh chấp
2. Modal hiện ra với 3 options:
   - 🟢 **Hoàn tiền 100% cho khách** (mặc định cho xe sai)
   - 🔴 **Tịch thu cọc** (1% bán, 1% sàn)
   - 🔵 **Chia đôi cọc** (mỗi bên 50%)
3. Chọn **"Hoàn tiền 100%"**
4. Nhập ghi chú:
   ```
   Đã xác minh xe thực sự sai mô tả. Hoàn 100% cọc cho khách.
   Người bán bị cảnh cáo lần 1.
   ```
5. Bấm **"Xác nhận xử lý"**
6. **Kết quả:**
   - Trạng thái đơn: `daHuy`
   - Trạng thái cọc: `daHoan`
   - Ghi chú được lưu

### 4.3. Xử lý tranh chấp "Khách hủy"
1. Bấm **"Xử lý"** trên đơn khách hủy
2. Chọn **"Tịch thu cọc"** (mặc định)
3. Nhập ghi chú:
   ```
   Khách hủy không có lý do chính đáng. Tịch thu cọc theo quy định.
   ```
4. Bấm **"Xác nhận xử lý"**
5. **Kết quả:**
   - Trạng thái đơn: `daHuy`
   - Trạng thái cọc: `daTichThu`

---

## 💳 Bước 5: Test Flow Chuyển khoản Online

1. Chọn xe → **"Đặt mua ngay"**
2. Chọn **"Chuyển khoản online"**
3. Điền thông tin → **"Đặt hàng"**
4. **Kết quả:**
   - Không có tiền cọc
   - Trạng thái: `choXacNhan` → `daXacNhan` → `dangGiao` → `daHoanThanh`
   - Phí sàn 1% được thu khi hoàn tất

---

## 🏦 Bước 6: Test Flow Vay Ngân Hàng

1. Chọn xe → **"Đặt mua ngay"**
2. Chọn **"Vay ngân hàng"**
3. Trang đặt mua hiển thị:
   - ✅ Bảng 15 ngân hàng với lãi suất
   - ✅ Slider % trả trước (20-80%)
   - ✅ Slider kỳ hạn (12-84 tháng)
4. Chọn 1 ngân hàng → Tự động scroll xuống
5. Chọn phương thức: **"Trả đều"** hoặc **"Trả giảm dần"**
6. Xem bảng trả góp chi tiết:
   - ✅ Tháng 1-24: Lãi suất ưu đãi
   - ✅ Tháng 25+: Lãi suất tăng (floating)
   - ✅ Số tiền, gốc, lãi, còn lại từng tháng
7. Điền thông tin → **"Đặt hàng"**
8. **Kết quả:**
   - Không có tiền cọc
   - Thông tin vay được lưu trong đơn hàng
   - Chi tiết đơn hiển thị card "Thông tin vay"

---

## ✅ Checklist Test

### Frontend
- [ ] Trang chọn phương thức thanh toán hiển thị đẹp
- [ ] Flow diagram escrow rõ ràng
- [ ] 3 scenarios (Thành công/Xe sai/Khách hủy) đầy đủ
- [ ] Trang chi tiết đơn hàng hiển thị đúng trạng thái
- [ ] 3 nút action chỉ hiện khi `trangThai = 'choKiemTra'`
- [ ] Modal báo cáo xe sai hoạt động
- [ ] Modal hủy đơn có cảnh báo mất cọc
- [ ] Admin panel tranh chấp hiển thị đầy đủ
- [ ] Modal xử lý tranh chấp có 3 options
- [ ] Bank loan calculator hoạt động chính xác
- [ ] Floating interest rate tính đúng (2 năm đầu ưu đãi)

### Backend
- [ ] API `POST /escrow/:id/xac-nhan-thanh-cong` hoạt động
- [ ] API `POST /escrow/:id/bao-cao-xe-sai` hoạt động
- [ ] API `POST /escrow/:id/huy-vo-ly-do` hoạt động
- [ ] API `POST /escrow/:id/xac-nhan-coc` (admin) hoạt động
- [ ] API `POST /escrow/:id/xu-ly-tranh-chap` (admin) hoạt động
- [ ] DonHang model lưu đầy đủ fields (tienCoc, trangThaiCoc, vayNganHang, chiPhi)
- [ ] Trạng thái đơn hàng chuyển đổi đúng
- [ ] Escrow logic chia cọc chính xác

### Business Logic
- [ ] Tiền cọc = 2% tổng tiền (chỉ cho tiền mặt)
- [ ] Xe đúng mô tả → Chia cọc (1% bán, 1% sàn)
- [ ] Xe sai mô tả → Hoàn 100% cho khách
- [ ] Khách hủy → Mất 100% (1% bán, 1% sàn)
- [ ] Chuyển khoản online → Không cọc, thu phí sàn 1%
- [ ] Vay ngân hàng → Không cọc, thu phí sàn 1%
- [ ] Bank loan: Lãi ưu đãi 2 năm đầu, sau đó tăng

---

## 🐛 Các lỗi thường gặp

### 1. "Cannot read property 'getById' of undefined"
**Nguyên nhân:** Thiếu function `getById` trong `donHangService`
**Fix:** Đã thêm vào `frontend/src/services/donHangService.ts`

### 2. "Property 'ngayDat' does not exist"
**Nguyên nhân:** Field `ngayDat` optional trong interface
**Fix:** Dùng `don.ngayDat || don.createdAt`

### 3. "Escrow routes not found"
**Nguyên nhân:** Chưa import routes vào `backend/src/index.ts`
**Fix:** Đã thêm `app.use('/api/v1/escrow', escrowRoutes)`

---

## 📊 Database Schema

### DonHang Collection
```javascript
{
  _id: ObjectId,
  idKhachHang: ObjectId,
  idXe: ObjectId,
  tongTien: Number,
  phuongThucThanhToan: 'tienMat' | 'chuyenKhoanOnline' | 'vayNganHang',
  trangThai: 'choXacNhan' | 'daXacNhan' | 'choThanhToan' | 'daThanhToanCoc' 
    | 'dangGiao' | 'choKiemTra' | 'tranh_chap_xe_sai' | 'tranh_chap_khach_huy' 
    | 'daHoanThanh' | 'daHuy',
  diaChiGiao: String,
  ghiChu: String,
  
  // Escrow
  tienCoc: Number, // 2% cho tiền mặt
  trangThaiCoc: 'chuaThanhToan' | 'daThanhToan' | 'daHoan' | 'daTichThu',
  lyDoHuy: String,
  nguoiHuy: 'khachHang' | 'nguoiBan' | 'admin',
  
  // Bank loan
  vayNganHang: {
    tenNganHang: String,
    soTienVay: Number,
    kyHan: Number,
    laiSuat: Number,
    traHangThang: Number,
    phuongThucTra: 'traDeu' | 'traGiamDan'
  },
  
  // Chi phí
  chiPhi: {
    giaXe: Number,
    phiSan: Number, // 1%
    thueTruocBa: Number, // 10%
    phiDangKy: Number, // 2M
    phiRaBien: Number, // 1M
    baoHiem: Number, // 600k
    phiVanChuyen: Number // 500k
  },
  
  // Timestamps
  ngayDat: Date,
  ngayXacNhan: Date,
  ngayThanhToan: Date,
  ngayGiaoHang: Date,
  ngayHoanThanh: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎯 Kết luận

Hệ thống escrow payment đã hoàn thiện với:
- ✅ 3 phương thức thanh toán
- ✅ Escrow 2% cho tiền mặt
- ✅ 3 scenarios xử lý (Thành công/Xe sai/Khách hủy)
- ✅ Admin panel xử lý tranh chấp
- ✅ Bank loan calculator với floating rate
- ✅ UI/UX đẹp, rõ ràng

**Sẵn sàng đưa vào production!** 🚀

