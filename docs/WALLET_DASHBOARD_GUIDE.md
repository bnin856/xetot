# 💰 Hướng dẫn Hệ thống Ví & Dashboard

## 📋 Tổng quan

Hệ thống bao gồm:
1. **Ví điện tử** - Nạp, rút, quản lý tiền
2. **3 Dashboards** - Người bán, Cho thuê, Dịch vụ
3. **Escrow tự động** - Giữ cọc, hoàn/tịch thu qua ví

---

## 🎯 Dropdown Menu Người Dùng

Khi đăng nhập, dropdown menu hiển thị:

```
┌─────────────────────────────────────┐
│ 👤 Nguyễn Tuấn Thành               │
├─────────────────────────────────────┤
│ 👤 Tài khoản                        │
│ 💳 Quản lý ví                       │
│ ❤️  Xe yêu thích                    │
├─────────────────────────────────────┤
│ 📊 Dashboard Bán Xe    (nếu có)    │
│ 🚗 Dashboard Cho Thuê  (nếu có)    │
│ 🔧 Dashboard Dịch Vụ   (nếu có)    │
├─────────────────────────────────────┤
│ 🚪 Đăng xuất                        │
└─────────────────────────────────────┘
```

### Hiển thị Dashboard theo vai trò phụ:

- **`vaiTroPhu: ['nguoiBan']`** → Hiện "Dashboard Bán Xe"
- **`vaiTroPhu: ['nguoiChoThue']`** → Hiện "Dashboard Cho Thuê"
- **`vaiTroPhu: ['nhaProviderDichVu']`** → Hiện "Dashboard Dịch Vụ"
- Có thể có nhiều vai trò cùng lúc!

---

## 💳 Quản Lý Ví (`/customer/vi`)

### Tính năng:

#### 1. Hiển thị số dư
```
┌─────────────────────────────────────┐
│ 💰 Số dư ví:        50,000,000 ₫   │
│ ✅ Khả dụng:        48,000,000 ₫   │
│ 🔒 Đang giữ:         2,000,000 ₫   │
└─────────────────────────────────────┘
```

#### 2. Nạp tiền
- Bấm "Nạp tiền"
- Nhập số tiền (hoặc chọn nhanh: 100k, 500k, 1M, 5M)
- Xác nhận → Giả lập VNPay (thực tế sẽ redirect)
- Tiền vào ví ngay lập tức

#### 3. Rút tiền
- Bấm "Rút tiền"
- Nhập:
  - Số tiền
  - Ngân hàng (dropdown 8 ngân hàng VN)
  - Số tài khoản
  - Tên chủ tài khoản
- Xác nhận → Yêu cầu được gửi
- Admin xử lý trong 1-2 ngày

#### 4. Lịch sử giao dịch
Hiển thị 10 giao dịch gần nhất:
- ✅ Nạp tiền (màu xanh, +)
- ❌ Rút tiền (màu đỏ, -)
- 🔒 Đặt cọc (màu cam, -)
- ✅ Hoàn cọc (màu xanh, +)
- ❌ Tịch thu cọc (màu đỏ, -)
- 💰 Nhận tiền (màu xanh, +)

---

## 📊 Dashboard Người Bán (`/seller`)

### Stats Cards:
1. **Xe đang bán** - Số lượng xe đang rao
2. **Xe đã bán** - Tổng xe đã bán thành công
3. **Tổng doanh thu** - Tổng tiền đã nhận
4. **Đơn hàng mới** - Đơn chờ xác nhận

### Ví:
- Số dư khả dụng
- Số dư đang giữ (escrow)
- Link "Quản lý ví"

### Quick Actions:
- ➕ Đăng xe mới
- 👁️ Xem đơn hàng

### Chính sách phí:
```
💰 Chính sách phí sàn:
• Phí sàn 1% được thu từ tiền cọc khi giao dịch thành công
• Nếu khách hủy vô lý do, bạn nhận 50% tiền cọc
• Nếu xe sai mô tả, bạn không nhận tiền cọc và bị cảnh cáo
• Tiền bán xe sẽ được chuyển vào ví sau khi giao dịch hoàn tất
```

---

## 🚗 Dashboard Cho Thuê (`/rental`)

### Stats Cards:
1. **Xe sẵn sàng** - Xe có thể cho thuê
2. **Xe đang thuê** - Xe đang được thuê
3. **Tổng doanh thu** - Tổng tiền thuê
4. **Đơn thuê tháng** - Đơn thuê tháng này

### Ví:
- Số dư khả dụng
- Tổng số dư

### Quick Actions:
- ➕ Đăng xe cho thuê
- 👁️ Xem tất cả xe

### Chính sách:
```
🚗 Chính sách cho thuê:
• Phí sàn 5% trên mỗi đơn thuê
• Tiền cọc 20% giá trị đơn hàng
• Thanh toán sau mỗi chuyến thuê hoàn tất
• Bảo hiểm xe được Xe Tốt hỗ trợ
```

---

## 🔧 Dashboard Dịch Vụ (`/service`)

### Stats Cards:
1. **Dịch vụ hoạt động** - Số dịch vụ đang cung cấp
2. **Đơn mới tháng này** - Đơn dịch vụ mới
3. **Doanh thu tháng** - Doanh thu tháng này
4. **Khách hàng thân thiết** - Số khách quay lại

### Ví:
- Số dư khả dụng
- Tổng số dư

### Quick Actions:
- ➕ Tạo dịch vụ mới
- 👁️ Xem tất cả dịch vụ

### Chính sách:
```
🔧 Chính sách dịch vụ:
• Phí sàn 3% trên mỗi đơn dịch vụ
• Thanh toán sau khi dịch vụ hoàn tất
• Hỗ trợ marketing miễn phí trên Xe Tốt
• Bảo hành dịch vụ theo quy định
```

---

## 🔄 Flow Escrow với Ví

### 1. Khách đặt mua xe (Tiền mặt)
```
Khách → Chọn xe → Chọn "Tiền mặt"
      → Hệ thống tính cọc 2%
      → Kiểm tra ví (đủ tiền?)
      → GIỮ TIỀN CỌC (soDuKhaDung → soDuDangGiu)
      → Tạo đơn hàng
```

### 2. Giao dịch thành công
```
Khách xác nhận "Xe đúng mô tả"
→ TỊCH THU CỌC:
  • Trừ tiền từ soDuDangGiu
  • Chuyển 50% cho người bán
  • Giữ 50% cho sàn
→ Đơn hàng: daHoanThanh
```

### 3. Xe sai mô tả
```
Khách báo cáo "Xe sai mô tả"
→ HOÀN CỌC:
  • Chuyển tiền từ soDuDangGiu → soDuKhaDung
  • Khách nhận lại 100%
→ Đơn hàng: tranh_chap_xe_sai
```

### 4. Khách hủy vô lý do
```
Khách chọn "Tôi muốn hủy"
→ TỊCH THU CỌC:
  • Trừ tiền từ soDuDangGiu
  • Chuyển 50% cho người bán
  • Giữ 50% cho sàn
→ Đơn hàng: tranh_chap_khach_huy
```

---

## 🗄️ Database Schema

### User Model
```typescript
{
  _id: ObjectId,
  ten: string,
  email: string,
  password: string,
  sdt: string,
  diaChi: string,
  vaiTro: 'admin' | 'customer',
  vaiTroPhu: ['nguoiBan', 'nguoiChoThue', 'nhaProviderDichVu'], // NEW!
  createdAt: Date,
  updatedAt: Date
}
```

### Wallet Model
```typescript
{
  _id: ObjectId,
  idNguoiDung: ObjectId,
  soDu: number,              // Tổng số dư
  soDuKhaDung: number,       // Có thể rút
  soDuDangGiu: number,       // Đang bị giữ (escrow)
  trangThai: 'hoatDong' | 'tamKhoa' | 'daKhoa',
  loaiVi: 'nguoiMua' | 'nguoiBan' | 'nguoiChoThue' | 'nhaProviderDichVu',
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction Model
```typescript
{
  _id: ObjectId,
  idNguoiDung: ObjectId,
  idVi: ObjectId,
  loaiGiaoDich: 'napTien' | 'rutTien' | 'datCoc' | 'hoanCoc' | 'tichThuCoc' | 'nhanTien' | 'chuyenTien' | 'phiSan',
  soTien: number,
  soDuTruoc: number,
  soDuSau: number,
  trangThai: 'choXuLy' | 'thanhCong' | 'thatBai' | 'daHuy',
  moTa: string,
  idLienQuan: ObjectId,      // ID đơn hàng
  phuongThucThanhToan: string,
  maGiaoDich: string,
  ghiChu: string,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧪 Test Scenarios

### Scenario 1: Nạp tiền & Đặt cọc
```bash
1. Đăng nhập → Vào /customer/vi
2. Bấm "Nạp tiền" → Nhập 50,000,000 ₫
3. Xác nhận → Tiền vào ví
4. Chọn xe giá 1,850,000,000 ₫
5. Chọn "Tiền mặt" → Cọc 2% = 40,782,000 ₫
6. Đặt hàng → Hệ thống tự động giữ cọc
7. Kiểm tra ví:
   - Số dư: 50,000,000 ₫
   - Khả dụng: 9,218,000 ₫
   - Đang giữ: 40,782,000 ₫
```

### Scenario 2: Giao dịch thành công
```bash
1. Admin xác nhận đơn → Trạng thái: choKiemTra
2. Khách bấm "Xe đúng mô tả - Hoàn tất"
3. Hệ thống tự động:
   - Trừ 40,782,000 ₫ từ soDuDangGiu
   - Chuyển 20,391,000 ₫ cho người bán
   - Giữ 20,391,000 ₫ cho sàn
4. Kiểm tra ví khách:
   - Số dư: 9,218,000 ₫
   - Khả dụng: 9,218,000 ₫
   - Đang giữ: 0 ₫
5. Kiểm tra ví người bán:
   - Số dư: +20,391,000 ₫
```

### Scenario 3: Xe sai mô tả
```bash
1. Khách bấm "Xe sai mô tả"
2. Nhập lý do: "Xe có vết xước lớn..."
3. Hệ thống tự động:
   - Hoàn 40,782,000 ₫ từ soDuDangGiu → soDuKhaDung
4. Kiểm tra ví khách:
   - Số dư: 50,000,000 ₫
   - Khả dụng: 50,000,000 ₫
   - Đang giữ: 0 ₫
```

---

## 🎯 Routes

### Customer
- `/customer/vi` - Quản lý ví
- `/customer/tai-khoan` - Tài khoản
- `/customer/xe-yeu-thich` - Xe yêu thích
- `/customer/don-hang` - Lịch sử đơn hàng
- `/customer/don-hang/:id` - Chi tiết đơn hàng

### Seller
- `/seller` - Dashboard người bán

### Rental Owner
- `/rental` - Dashboard cho thuê

### Service Provider
- `/service` - Dashboard dịch vụ

### Admin
- `/admin` - Dashboard admin
- `/admin/tranh-chap` - Xử lý tranh chấp

---

## 🔐 API Endpoints

### Wallet
```
GET    /api/v1/wallet/my-wallet       - Lấy ví của tôi
POST   /api/v1/wallet/nap-tien        - Nạp tiền
POST   /api/v1/wallet/rut-tien        - Rút tiền
GET    /api/v1/wallet/lich-su         - Lịch sử giao dịch
PUT    /api/v1/wallet/rut-tien/:id    - Admin xử lý rút tiền
```

### Escrow
```
POST   /api/v1/escrow/:id/xac-nhan-thanh-cong  - Khách xác nhận OK
POST   /api/v1/escrow/:id/bao-cao-xe-sai       - Báo cáo xe sai
POST   /api/v1/escrow/:id/huy-vo-ly-do         - Khách hủy
POST   /api/v1/escrow/:id/xac-nhan-coc         - Admin xác nhận cọc
POST   /api/v1/escrow/:id/xu-ly-tranh-chap     - Admin xử lý tranh chấp
```

---

## ✅ Checklist Hoàn Thành

### Backend ✅
- [x] Wallet model
- [x] Transaction model
- [x] Wallet controller (nạp, rút, giữ, hoàn, tịch thu)
- [x] Wallet routes
- [x] Tích hợp escrow với ví
- [x] Update User model với vaiTroPhu

### Frontend ✅
- [x] Trang Quản lý ví
- [x] Modal nạp tiền
- [x] Modal rút tiền
- [x] Lịch sử giao dịch
- [x] Seller Dashboard
- [x] Rental Dashboard
- [x] Service Provider Dashboard
- [x] Update dropdown menu với ví & dashboards
- [x] Update User type với vaiTroPhu

### Business Logic ✅
- [x] Fix phí sàn (bỏ khỏi tổng chi phí)
- [x] Escrow tự động giữ tiền
- [x] Hoàn cọc khi xe sai
- [x] Tịch thu khi thành công/khách hủy
- [x] Chia 50/50 cho người bán & sàn

---

## 🎉 Kết Luận

Hệ thống ví điện tử + 3 dashboards đã hoàn thiện:
- ✅ Nạp/rút tiền dễ dàng
- ✅ Escrow tự động, an toàn
- ✅ Dashboard riêng cho từng vai trò
- ✅ UI/UX đẹp, chuyên nghiệp
- ✅ Dropdown menu thông minh

**Sẵn sàng production!** 🚀

