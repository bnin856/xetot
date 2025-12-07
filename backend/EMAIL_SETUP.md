# Hướng dẫn cấu hình Email cho tính năng Quên Mật Khẩu

## Sử dụng Gmail

### Bước 1: Tạo App Password cho Gmail

1. Đăng nhập vào tài khoản Gmail của bạn
2. Vào [Google Account Security](https://myaccount.google.com/security)
3. Bật **2-Step Verification** (nếu chưa bật)
4. Sau khi bật, tìm mục **App passwords**
5. Chọn:
   - **Select app**: Mail
   - **Select device**: Other (Custom name)
   - Đặt tên: "Xe Tot App"
6. Click **Generate**
7. Google sẽ hiển thị mật khẩu 16 ký tự (ví dụ: `abcd efgh ijkl mnop`)

### Bước 2: Cập nhật file `.env` trong thư mục `backend`

Mở file `backend/.env` và cập nhật:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=abcdefghijklmnop
```

**Lưu ý:** 
- `EMAIL_USER`: Email Gmail của bạn
- `EMAIL_PASS`: Mật khẩu ứng dụng (16 ký tự không có khoảng trắng)
- **KHÔNG** sử dụng mật khẩu Gmail thông thường

### Bước 3: Khởi động lại Backend

```bash
cd backend
npm run dev
```

---

## Sử dụng dịch vụ Email khác

Nếu bạn muốn dùng dịch vụ email khác (Outlook, Yahoo, SMTP tùy chỉnh), cập nhật `backend/src/services/emailService.ts`:

### Outlook/Hotmail

```typescript
const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

### SMTP tùy chỉnh

```typescript
const transporter = nodemailer.createTransport({
  host: 'smtp.your-domain.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

---

## Test gửi Email

Sau khi cấu hình:

1. Vào trang web: `http://localhost:3000/quen-mat-khau`
2. Chọn **Xác thực qua Email**
3. Nhập email đã đăng ký
4. Click **Gửi mã xác thực**
5. Kiểm tra hộp thư (cả Inbox và Spam)

---

## Cấu hình SMS (Tùy chọn)

Hiện tại SMS đang ở chế độ giả lập (mock). Để kích hoạt SMS thật:

### Sử dụng Twilio

1. Đăng ký tài khoản tại [Twilio](https://www.twilio.com)
2. Lấy **Account SID** và **Auth Token**
3. Mua một số điện thoại Twilio
4. Cài đặt package:
   ```bash
   npm install twilio
   ```
5. Cập nhật `.env`:
   ```env
   TWILIO_SID=your-account-sid
   TWILIO_AUTH_TOKEN=your-auth-token
   TWILIO_PHONE_NUMBER=+1234567890
   ```
6. Bỏ comment code thật trong `backend/src/services/smsService.ts`

### Sử dụng ESMS.vn (Nhà cung cấp SMS Việt Nam)

1. Đăng ký tại [ESMS.vn](https://esms.vn)
2. Lấy **API Key** và **Secret Key**
3. Cập nhật `.env`:
   ```env
   ESMS_API_KEY=your-api-key
   ESMS_SECRET_KEY=your-secret-key
   ```
4. Bỏ comment code ESMS trong `backend/src/services/smsService.ts`

---

## Xử lý lỗi thường gặp

### "Không thể gửi email"

- Kiểm tra `EMAIL_USER` và `EMAIL_PASS` trong `.env`
- Đảm bảo đã bật 2-Step Verification và tạo App Password
- Kiểm tra kết nối Internet
- Xem log chi tiết trong terminal backend

### "Mã xác thực không hợp lệ"

- Mã chỉ có hiệu lực 15 phút
- Đảm bảo nhập đúng 6 số
- Kiểm tra email/SMS mới nhất

### "Không tìm thấy tài khoản"

- Đảm bảo email/số điện thoại đã được đăng ký trong hệ thống
- Kiểm tra chính tả

---

## Bảo mật

⚠️ **LƯU Ý QUAN TRỌNG:**

1. **KHÔNG** commit file `.env` lên Git
2. Sử dụng App Password, không dùng mật khẩu Gmail thật
3. Mã xác thực tự động hết hạn sau 15 phút
4. Mỗi mã chỉ được sử dụng 1 lần
5. Các mã cũ tự động xóa khi tạo mã mới

---

## Support

Nếu gặp vấn đề, kiểm tra log backend:

```bash
cd backend
npm run dev
```

Log sẽ hiển thị chi tiết khi gửi email/SMS.

