# Hướng dẫn Xác nhận và Tranh chấp Đơn hàng

## Tổng quan

Hệ thống đã được cập nhật với quy trình xác nhận và tranh chấp đơn hàng hoàn chỉnh, bao gồm:
1. **Xác nhận đã mua/bán xong** - Khách hàng xác nhận xe đúng mô tả
2. **Báo cáo xe sai mô tả** - Khách báo cáo kèm hình ảnh chứng minh
3. **Hủy đơn hàng** - Với lý do và tùy chọn upload chứng từ

## Quy trình hoạt động

### 1. Xác nhận giao dịch thành công

**Khi nào?** 
- Đơn hàng ở trạng thái `choKiemTra`
- Khách hàng đã nhận xe và kiểm tra

**Hành động:**
- Khách click "Xe đúng mô tả - Hoàn tất"
- Hệ thống:
  - Chuyển trạng thái đơn sang `daHoanThanh`
  - Tịch thu tiền cọc:
    * 50% cho người bán
    * 50% cho sàn
  - Cập nhật `trangThaiCoc` = `daTichThu`

**UI Location:** Trang Chi tiết đơn hàng (`/customer/don-hang/:id`)

### 2. Báo cáo xe sai mô tả

**Khi nào?**
- Đơn hàng ở trạng thái `choKiemTra`
- Xe không đúng như mô tả/hình ảnh

**Yêu cầu:**
- ✅ Lý do chi tiết (bắt buộc)
- ✅ Hình ảnh chứng minh (bắt buộc, 1-5 ảnh)

**Quy trình:**
1. Khách click "Xe sai mô tả"
2. Modal hiện ra yêu cầu:
   - Nhập mô tả vấn đề
   - Upload 1-5 hình ảnh chứng minh
3. Click "Gửi báo cáo"
4. Hệ thống:
   - Chuyển trạng thái đơn sang `tranh_chap_xe_sai`
   - Lưu lý do và hình ảnh vào database
   - GIỮ NGUYÊN tiền cọc (chờ admin xác minh)
   - Thông báo: "Admin sẽ xử lý trong 24h"

**Kết quả sau khi Admin xử lý:**
- ✅ Nếu đúng sai mô tả:
  * Hoàn 100% tiền cọc cho khách
  * Ban người bán 7-14 ngày
- ❌ Nếu khách báo sai:
  * Tịch thu cọc: 50% người bán, 50% sàn

### 3. Hủy đơn hàng

**Khi nào?**
- Đơn hàng ở trạng thái `choKiemTra`
- Khách đổi ý không muốn mua nữa

**2 Trường hợp:**

#### A. Hủy không có lý do chính đáng
**Yêu cầu:**
- ✅ Lý do hủy (bắt buộc)
- ⚪ Hình ảnh chứng minh (không bắt buộc)

**Kết quả:**
- Mất 100% tiền cọc:
  * 50% cho người bán
  * 50% cho sàn
- Chuyển trạng thái sang `tranh_chap_khach_huy`
- Thông báo: "Tiền cọc sẽ không được hoàn lại"

#### B. Hủy có lý do chính đáng (với chứng từ)
**Yêu cầu:**
- ✅ Lý do hủy (bắt buộc)
- ✅ Hình ảnh chứng minh (VD: giấy bệnh viện, tai nạn...)

**Quy trình:**
1. Nhập lý do
2. Upload chứng từ (1-5 ảnh)
3. Gửi yêu cầu
4. Hệ thống:
   - Chuyển trạng thái sang `tranh_chap_khach_huy`
   - Lưu lý do và hình ảnh
   - GIỮ NGUYÊN tiền cọc (chờ admin xác minh)
   - Thông báo: "Admin sẽ xem xét trong 24h"

**Kết quả sau khi Admin xử lý:**
- ✅ Lý do chính đáng:
  * Hoàn 100% hoặc 50% tiền cọc
- ❌ Lý do không chính đáng:
  * Tịch thu cọc: 50% người bán, 50% sàn

## Cập nhật Database

### Model: DonHang
**File:** `backend/src/models/DonHang.ts`

**Thêm field mới:**
```typescript
hinhAnhChungMinh?: string[]; // Mảng đường dẫn hình ảnh
```

**Các trạng thái liên quan:**
- `choKiemTra` - Chờ khách kiểm tra xe
- `tranh_chap_xe_sai` - Khách báo cáo xe sai
- `tranh_chap_khach_huy` - Khách hủy đơn
- `daHoanThanh` - Giao dịch thành công
- `daHuy` - Đơn đã hủy

## API Endpoints

### 1. Xác nhận thành công
```
POST /api/v1/escrow/:id/xac-nhan-thanh-cong
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Giao dịch hoàn tất thành công",
  "data": { ... }
}
```

### 2. Báo cáo xe sai
```
POST /api/v1/escrow/:id/bao-cao-xe-sai
Authorization: Bearer {token}
Content-Type: multipart/form-data

Body:
- lyDo: string (bắt buộc)
- hinhAnh: File[] (bắt buộc, 1-5 files)

Response:
{
  "success": true,
  "message": "Đã ghi nhận báo cáo. Admin sẽ xử lý trong 24h.",
  "data": { ... }
}
```

### 3. Hủy đơn hàng
```
POST /api/v1/escrow/:id/huy-vo-ly-do
Authorization: Bearer {token}
Content-Type: multipart/form-data

Body:
- lyDo: string (bắt buộc)
- hinhAnh: File[] (không bắt buộc, 0-5 files)

Response:
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

## UI/UX

### Trang Chi tiết đơn hàng

**File:** `frontend/src/pages/customer/ChiTietDonHang.tsx`

#### Section Actions (khi trạng thái = choKiemTra)

```
┌─────────────────────────────────────┐
│ Xác nhận kết quả                    │
├─────────────────────────────────────┤
│ Bạn đã kiểm tra xe?                 │
│                                     │
│ [✓ Xe đúng mô tả - Hoàn tất]       │
│                                     │
│ [⚠ Xe sai mô tả]                   │
│                                     │
│ [✗ Tôi muốn hủy]                   │
└─────────────────────────────────────┘
```

### Modal Báo cáo xe sai

```
┌─────────────────────────────────────────┐
│ Báo cáo xe sai mô tả                    │
├─────────────────────────────────────────┤
│ ℹ️ • Admin sẽ xử lý trong 24h           │
│   • Hoàn 100% cọc nếu xác nhận đúng    │
│   • Cung cấp hình ảnh chứng minh       │
├─────────────────────────────────────────┤
│ Mô tả vấn đề *                          │
│ [VD: Xe bị trầy xước nhiều...]         │
│                                         │
│ Hình ảnh chứng minh * (Tối đa 5)       │
│ [📁 Nhấn để tải ảnh lên]               │
│                                         │
│ [Preview ảnh 1] [Preview ảnh 2] ...    │
│                                         │
│ [Hủy]  [Gửi báo cáo]                   │
└─────────────────────────────────────────┘
```

### Modal Hủy đơn hàng

```
┌─────────────────────────────────────────┐
│ ⚠️ Cảnh báo: Hủy đơn hàng               │
├─────────────────────────────────────────┤
│ ⛔ Bạn sẽ mất 100% tiền cọc:            │
│   • Người bán nhận: 50,000,000 ₫       │
│   • Xe Tốt nhận: 50,000,000 ₫          │
│   Chỉ hủy khi thực sự cần thiết        │
├─────────────────────────────────────────┤
│ Lý do hủy *                             │
│ [VD: Đổi ý mua xe khác...]             │
│                                         │
│ Hình ảnh chứng minh (Không bắt buộc)   │
│ Nếu có lý do chính đáng (bệnh, tai nạn) │
│ upload chứng từ để xem xét hoàn cọc    │
│                                         │
│ [📁 Nhấn để tải ảnh lên (nếu có)]      │
│                                         │
│ [Preview ảnh nếu có]                   │
│                                         │
│ [Quay lại]  [Xác nhận hủy]             │
└─────────────────────────────────────────┘
```

## Logic xử lý Backend

### Controller: escrowController.ts

**File:** `backend/src/controllers/escrowController.ts`

#### 1. baoCaoXeSaiMoTa
```typescript
- Kiểm tra quyền (chỉ khách hàng)
- Validate lyDo (bắt buộc)
- Validate hinhAnhChungMinh (bắt buộc, ít nhất 1 ảnh)
- Lưu vào database
- Chuyển trạng thái: tranh_chap_xe_sai
- GIỮ NGUYÊN tiền cọc (chờ admin xác minh)
```

#### 2. khachHangHuyVoLyDo
```typescript
- Kiểm tra quyền
- Validate lyDo (bắt buộc)
- Lưu hinhAnhChungMinh (nếu có)
- Nếu KHÔNG có hình ảnh:
  * Tịch thu cọc ngay (50/50)
  * Thông báo: Không hoàn cọc
- Nếu CÓ hình ảnh:
  * Giữ nguyên cọc
  * Chờ admin xác minh
  * Thông báo: Chờ xem xét
```

## Validation

### Frontend
- Lý do: không được để trống
- Hình ảnh báo cáo xe sai: bắt buộc 1-5 ảnh
- Hình ảnh hủy đơn: tùy chọn 0-5 ảnh
- File type: image/* (jpg, png, gif, webp)
- Hiển thị preview trước khi upload
- Cho phép xóa ảnh đã chọn

### Backend
- Validate lyDo: trim, không rỗng
- Validate files: kiểm tra có file không
- Upload middleware: xử lý multipart/form-data
- Lưu path vào database

## Quyền bảo vệ

### Khách hàng
- ✅ Xác nhận giao dịch thành công
- ✅ Báo cáo xe sai mô tả
- ✅ Hủy đơn hàng
- ❌ Không thể làm với đơn của người khác

### Người bán
- ⚪ Chưa có action (future)

### Admin
- ✅ Xử lý tranh chấp
- ✅ Xem hình ảnh chứng minh
- ✅ Quyết định hoàn/tịch thu cọc

## Flow Chart

```
Đơn hàng [choKiemTra]
         |
         ├─→ Xe đúng mô tả
         |   └─→ [daHoanThanh]
         |       └─→ Tịch thu cọc 50/50
         |
         ├─→ Xe sai mô tả (+ ảnh chứng minh)
         |   └─→ [tranh_chap_xe_sai]
         |       └─→ Chờ Admin
         |           ├─→ Xác nhận đúng: Hoàn 100% cọc
         |           └─→ Xác nhận sai: Tịch thu 50/50
         |
         └─→ Khách hủy
             ├─→ Không có ảnh chứng minh
             |   └─→ [tranh_chap_khach_huy]
             |       └─→ Tịch thu cọc ngay 50/50
             |
             └─→ Có ảnh chứng minh (lý do chính đáng)
                 └─→ [tranh_chap_khach_huy]
                     └─→ Chờ Admin
                         ├─→ Chấp nhận: Hoàn 100% hoặc 50%
                         └─→ Từ chối: Tịch thu 50/50
```

## Testing Checklist

### Frontend
- [ ] Modal báo cáo xe sai hiển thị đúng
- [ ] Upload ảnh hoạt động (1-5 ảnh)
- [ ] Preview ảnh hiển thị chính xác
- [ ] Xóa ảnh hoạt động
- [ ] Validation lý do bắt buộc
- [ ] Validation ảnh bắt buộc (báo cáo)
- [ ] Modal hủy đơn hiển thị đúng
- [ ] Hủy không ảnh: thông báo mất cọc
- [ ] Hủy có ảnh: thông báo chờ xem xét
- [ ] Disable button khi đang loading
- [ ] Clear form sau khi submit

### Backend
- [ ] API nhận được FormData
- [ ] Files được upload vào folder uploads
- [ ] Path được lưu vào database
- [ ] Validation lyDo hoạt động
- [ ] Validation files hoạt động
- [ ] Tịch thu cọc chính xác
- [ ] Trạng thái đơn hàng cập nhật đúng
- [ ] Quyền truy cập được kiểm tra

### Integration
- [ ] Flow hoàn chỉnh từ frontend → backend
- [ ] Hình ảnh hiển thị trong admin panel
- [ ] Admin có thể xem ảnh chứng minh
- [ ] Thông báo hiển thị chính xác
- [ ] Error handling hoạt động

## Security

1. **Authentication:** Yêu cầu đăng nhập
2. **Authorization:** Chỉ chủ đơn hàng mới được báo cáo/hủy
3. **File Upload:** 
   - Giới hạn số lượng (5 files)
   - Giới hạn kích thước (multer config)
   - Chỉ cho phép image files
4. **Path Traversal:** Upload middleware xử lý an toàn
5. **XSS:** Frontend sanitize input

## Future Enhancements

1. **Thông báo real-time** - Push notification cho admin
2. **Timeline tranh chấp** - Theo dõi quá trình xử lý
3. **Chat với admin** - Trao đổi trực tiếp
4. **Video chứng minh** - Cho phép upload video
5. **OCR** - Tự động đọc thông tin từ chứng từ
6. **AI phân tích ảnh** - Xác minh tính hợp lệ của chứng cứ
7. **Email notifications** - Thông báo qua email
8. **SMS alerts** - SMS khi có cập nhật

## Support

Nếu có vấn đề:
1. Kiểm tra console log
2. Kiểm tra network tab
3. Kiểm tra backend logs
4. Kiểm tra database records
5. Liên hệ: support@xetot.com

