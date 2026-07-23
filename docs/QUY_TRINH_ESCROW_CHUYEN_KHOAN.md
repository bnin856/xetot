# Quy trình ESCROW cho chuyển khoản online

## 🎯 Mục tiêu
Đảm bảo an toàn cho cả khách hàng và người bán khi giao dịch chuyển khoản online.

## 📊 Quy trình chi tiết

### 1. Khách đặt xe
- Trạng thái: `choNguoiBanXacNhan`
- Khách tạo đơn hàng
- Thông báo gửi đến người bán

### 2. Người bán xác nhận
- Trạng thái: `nguoiBanDaXacNhan`
- Người bán xác nhận có bán xe
- Thông báo gửi đến khách

### 3. Khách chuyển khoản + Upload biên lai
- Trạng thái: `choXacNhanThanhToan`  
- Khách chuyển khoản vào TÀI KHOẢN SÀN
- Khách upload biên lai
- Tiền được GIỮ trong ví ESCROW (100%)
- `idGiaoDichEscrow` được lưu

### 4. Người bán xác nhận giao xe
- Trạng thái: `dangGiao`
- Người bán confirm đã giao xe cho khách
- `nguoiBanXacNhanGiaoXe = true`

### 5. Khách xác nhận nhận xe OK
- Trạng thái: `daHoanThanh` (TỰ ĐỘNG)
- Khách confirm đã nhận xe và xe đúng mô tả
- `khachXacNhanNhanXe = true`
- **KHI CẢ 2 XÁC NHẬN** → Tự động:
  - Trả 99% tiền cho người bán
  - Sàn giữ 1% phí
  - Cập nhật trạng thái xe: `daBan`

## 💰 Luồng tiền

```
Khách chuyển khoản 
  ↓
Tài khoản ngân hàng sàn
  ↓
Ví ESCROW (giữ 100%)
  ↓ (Chờ cả 2 xác nhận)
Người bán (99%) + Sàn (1%)
```

## 🛡️ Bảo vệ 2 bên

### Bảo vệ khách hàng:
- Tiền được giữ trong hệ thống đến khi nhận xe
- Có thể khiếu nại nếu xe sai mô tả
- Có thể hủy đơn trước khi chuyển tiền (miễn phí)

### Bảo vệ người bán:
- Chỉ nhận tiền khi đã giao xe VÀ khách xác nhận OK
- Được bảo vệ khỏi khách hàng khiếu nại vô lý (có escrow admin xem xét)
- Chắc chắn nhận 99% giá trị đơn hàng

## 🔄 So sánh với Tiền mặt

| | Tiền mặt | Chuyển khoản |
|---|---|---|
| Đặt cọc | 2% | 100% |
| Nơi giữ tiền | Ví escrow | Ví escrow |
| Phí sàn | 0% (cho cọc) | 1% |
| Xác nhận | 1 bên (khách) | 2 bên (khách + người bán) |
| Thời gian | Gặp mặt trực tiếp | Online hoàn toàn |

## 🆕 API Endpoints mới

### Backend
```typescript
POST /api/v1/don-hang/:id/upload-bien-lai  
// Upload biên lai, giữ tiền vào escrow

POST /api/v1/don-hang/:id/nguoi-ban-xac-nhan  
// Người bán xác nhận đã giao xe

POST /api/v1/don-hang/:id/khach-xac-nhan  
// Khách xác nhận đã nhận xe OK
// → Tự động trả tiền nếu cả 2 đã xác nhận
```

### Frontend
```typescript
donHangService.uploadBienLai(id, formData)
donHangService.nguoiBanXacNhan(id)
donHangService.khachXacNhan(id)
```

## 📱 UI Components cần cập nhật

1. **ChiTietDonHang.tsx**
   - Thêm nút "Upload biên lai" (cho khách)
   - Thêm nút "Xác nhận đã giao xe" (cho người bán) 
   - Thêm nút "Xác nhận đã nhận xe" (cho khách)
   - Hiển thị trạng thái xác nhận 2 bên

2. **UploadBienLai.tsx** ✅ (Đã tạo)
   - Form upload biên lai
   - Hiển thị thông tin chuyển khoản
   - Copy thông tin tài khoản

3. **SellerDashboard.tsx** (Cần tạo)
   - Danh sách đơn hàng cần xác nhận
   - Nút xác nhận giao xe
   - Lịch sử bán hàng

## 🔐 Bảo mật

- Chỉ khách hàng của đơn mới upload được biên lai
- Chỉ người bán của đơn mới xác nhận giao xe được
- Chỉ khách hàng của đơn mới xác nhận nhận xe được
- Admin có thể can thiệp khi có tranh chấp

## ⚠️ Lưu ý quan trọng

1. Khách PHẢI chuyển khoản vào tài khoản SÀN, KHÔNG phải người bán
2. Cả 2 bên đều phải xác nhận thì tiền mới được trả
3. Nếu 1 trong 2 không xác nhận → Admin xử lý thủ công
4. Tiền trong escrow được BẢO VỆ 100% bởi hệ thống ví
5. Phí sàn 1% chỉ áp dụng cho chuyển khoản, không áp dụng cho tiền mặt

## 📞 Hỗ trợ

Nếu có vấn đề trong quá trình giao dịch, liên hệ:
- Hotline: 1900-XETOT
- Email: support@xetot.vn

