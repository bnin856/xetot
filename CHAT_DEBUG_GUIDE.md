# 🔍 Hướng dẫn Debug Chat Realtime

## ✅ Đã kiểm tra:

1. ✅ Backend routes đã có: `/api/v1/chat/*`
2. ✅ Socket.io đã được khởi tạo trong `backend/src/index.ts`
3. ✅ Frontend SocketContext đã có
4. ✅ ChatButton và ChatModal đã được tích hợp
5. ✅ Error handling đã được cải thiện

---

## 🐛 Các bước debug:

### 1. Kiểm tra Backend đang chạy:
```bash
cd backend
npm run dev
```

Kiểm tra log:
- ✅ `🚀 Server running on port 5000`
- ✅ `💬 Socket.io initialized`

### 2. Kiểm tra Frontend:
```bash
cd frontend
npm start
```

### 3. Mở Browser Console (F12):

**Khi click "Chat với người bán":**
- Xem log: `Opening chat for: { idXe, tenXe, idNguoiBan, loaiXe }`

**Khi load conversation:**
- Xem log: `Loading conversation for: { idXe, loaiXe }`
- Xem log: `Conversation response: {...}`
- Xem log: `Messages response: {...}`

**Nếu có lỗi:**
- Xem log: `Error loading conversation: ...`
- Xem log: `Error details: { message, response, status }`

### 4. Kiểm tra Network tab (F12 → Network):

**Khi click chat:**
- Request: `POST http://localhost:5000/api/v1/chat/conversation`
- Status: `200 OK` hoặc `403/404/500`
- Response: Xem có `success: true` không

### 5. Kiểm tra Socket connection:

**Trong Console:**
- Xem log: `✅ Socket connected: [socket-id]`
- Nếu không thấy: `❌ Socket disconnected` hoặc `Socket connection error`

---

## 🔧 Các lỗi thường gặp:

### Lỗi 1: "Không thể tải hội thoại"
**Nguyên nhân:**
- Backend chưa chạy
- User chưa đăng nhập
- Token không hợp lệ
- Route không đúng

**Giải pháp:**
1. Kiểm tra backend đang chạy: `http://localhost:5000/health`
2. Kiểm tra đã đăng nhập chưa
3. Kiểm tra token trong localStorage
4. Xem Network tab để biết lỗi cụ thể

### Lỗi 2: "Socket connection error"
**Nguyên nhân:**
- Backend Socket.io chưa khởi tạo
- CORS issue
- Token không hợp lệ

**Giải pháp:**
1. Kiểm tra backend log có `💬 Socket.io initialized`
2. Kiểm tra CORS config trong `backend/src/index.ts`
3. Kiểm tra token trong localStorage

### Lỗi 3: "Authentication error"
**Nguyên nhân:**
- Token hết hạn
- Token không hợp lệ

**Giải pháp:**
1. Đăng xuất và đăng nhập lại
2. Kiểm tra token trong localStorage

---

## 🧪 Test thủ công:

### Test 1: API Endpoint
```bash
# Test tạo conversation (cần token)
curl -X POST http://localhost:5000/api/v1/chat/conversation \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"idXe": "XE_ID", "loaiXe": "xe"}'
```

### Test 2: Socket.io
Mở browser console và chạy:
```javascript
// Kiểm tra socket đã connect chưa
const socket = io('http://localhost:5000', {
  auth: { token: localStorage.getItem('token') }
});

socket.on('connect', () => {
  console.log('✅ Connected:', socket.id);
});
```

---

## 📋 Checklist:

- [ ] Backend đang chạy trên port 5000
- [ ] Frontend đang chạy trên port 3000
- [ ] User đã đăng nhập
- [ ] Token có trong localStorage
- [ ] Socket.io đã connect (xem console log)
- [ ] API endpoint `/api/v1/chat/conversation` trả về 200
- [ ] Không có CORS error trong console
- [ ] Không có lỗi TypeScript khi compile

---

## 🚀 Nếu vẫn lỗi:

1. **Xem Console log** - Có thông tin chi tiết
2. **Xem Network tab** - Xem request/response
3. **Xem Backend log** - Xem có lỗi gì không
4. **Kiểm tra Database** - Xem có collection Conversation và Message không

**Copy toàn bộ error message và gửi cho tôi để debug tiếp!** 🔍

