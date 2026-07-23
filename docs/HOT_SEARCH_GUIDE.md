# Hướng dẫn sử dụng tính năng Hot Search

## Tổng quan

Tính năng **Hot Search** (Tìm kiếm phổ biến) hiển thị dropdown với 5-6 xe phổ biến khi người dùng click vào ô tìm kiếm. Điều này giúp:
- Tăng trải nghiệm người dùng (UX)
- Gợi ý xe phổ biến ngay lập tức
- Tăng tỷ lệ click và xem chi tiết xe

## Cấu trúc

### Component HotSearchDropdown
**File:** `frontend/src/components/HotSearchDropdown.tsx`

Component này là reusable và có thể dùng cho cả xe bán và xe cho thuê.

#### Props:
```typescript
interface HotSearchDropdownProps {
  isOpen: boolean;        // Hiển thị/ẩn dropdown
  onClose: () => void;    // Callback khi đóng dropdown
  type?: 'xe' | 'xeChoThue';  // Loại xe: bán hoặc cho thuê
}
```

#### Tính năng:
- ✅ Hiển thị 6 xe phổ biến nhất
- ✅ Tự động đóng khi click bên ngoài
- ✅ Hình ảnh xe thumbnail
- ✅ Hiển thị tên xe, hãng, giá
- ✅ Icon trending cho mỗi xe
- ✅ Link "Xem tất cả" ở cuối dropdown
- ✅ Loading state khi đang tải dữ liệu
- ✅ Empty state khi chưa có dữ liệu

### Giao diện

```
┌─────────────────────────────────────┐
│ 🔥 Xe bán phổ biến                  │
├─────────────────────────────────────┤
│ [Ảnh] Toyota Vios 2020              │
│       Toyota                     📈  │
│       Giá bán: 500,000,000 ₫        │
├─────────────────────────────────────┤
│ [Ảnh] Honda City 2021               │
│       Honda                      📈  │
│       Giá bán: 550,000,000 ₫        │
├─────────────────────────────────────┤
│ ... (4 xe nữa)                      │
├─────────────────────────────────────┤
│ Xem tất cả →                        │
└─────────────────────────────────────┘
```

## Tích hợp vào các trang

### 1. Trang chủ (`/`)
**File:** `frontend/src/pages/customer/TrangChu.tsx`

**Vị trí:** Hero section - ô tìm kiếm chính

**Hành vi:**
- Click vào ô tìm kiếm → Hiện dropdown
- Enter hoặc click "Tìm kiếm" → Chuyển sang trang tìm kiếm
- Click vào xe trong dropdown → Chuyển đến trang chi tiết xe
- Click bên ngoài → Đóng dropdown

**Code:**
```typescript
const [showHotSearch, setShowHotSearch] = useState(false);

<input
  onFocus={() => setShowHotSearch(true)}
  onKeyPress={(e) => {
    if (e.key === 'Enter') {
      navigate(`/tim-kiem?q=${searchTerm}`);
      setShowHotSearch(false);
    }
  }}
/>

<HotSearchDropdown 
  isOpen={showHotSearch}
  onClose={() => setShowHotSearch(false)}
  type="xe"
/>
```

### 2. Trang thuê xe (`/thue-xe`)
**File:** `frontend/src/pages/customer/ThueXe.tsx`

**Vị trí:** Hero section - ô tìm kiếm xe cho thuê

**Hành vi:**
- Click vào ô tìm kiếm → Hiện dropdown với xe cho thuê phổ biến
- Nhập từ khóa → Tự động filter danh sách xe
- Click vào xe trong dropdown → Chuyển đến trang chi tiết xe cho thuê
- Click bên ngoài → Đóng dropdown

**Code:**
```typescript
const [showHotSearch, setShowHotSearch] = useState(false);

<input
  onFocus={() => setShowHotSearch(true)}
  onChange={(e) => setSearchTerm(e.target.value)}
/>

<HotSearchDropdown 
  isOpen={showHotSearch}
  onClose={() => setShowHotSearch(false)}
  type="xeChoThue"
/>
```

### 3. Trang tìm kiếm (`/tim-kiem`)
**File:** `frontend/src/pages/customer/TimKiemXe.tsx`

**Lưu ý:** Trang này nhận search query từ URL params, nên không cần hot search dropdown. Người dùng đã đến trang này từ trang chủ sau khi search.

## API Endpoints sử dụng

### Xe bán
```
GET /api/v1/xe?limit=6&trangThai=dangBan
```

Response:
```json
{
  "success": true,
  "data": {
    "xe": [
      {
        "id": "...",
        "tenXe": "Toyota Vios 2020",
        "hangXe": "Toyota",
        "gia": 500000000,
        "hinhAnh": ["uploads/..."]
      }
    ]
  }
}
```

### Xe cho thuê
```
GET /api/v1/xe-cho-thue?limit=6&trangThai=sanSang
```

Response:
```json
[
  {
    "id": "...",
    "tenXe": "Honda City 2021",
    "hangXe": "Honda",
    "giaThueTheoNgay": 500000,
    "hinhAnh": ["uploads/..."]
  }
]
```

## Styling

Component sử dụng Tailwind CSS với các class chính:

### Container
- `shadow-xl` - Shadow lớn cho dropdown
- `rounded-lg` - Bo góc mượt
- `z-50` - Z-index cao để hiển thị trên các element khác
- `max-h-96` - Giới hạn chiều cao
- `overflow-y-auto` - Scroll khi nội dung quá dài

### Header
- `bg-gradient-to-r from-primary-50 to-primary-100` - Gradient background
- `text-primary-700` - Màu chữ primary

### Items
- `hover:bg-gray-50` - Hover effect nhẹ
- `transition-colors` - Chuyển màu mượt mà

### Images
- `w-16 h-16` - Thumbnail size 64x64px
- `rounded-lg` - Bo góc ảnh
- `object-cover` - Crop ảnh phù hợp

## UX Features

### 1. Click bên ngoài đóng dropdown
```typescript
useEffect(() => {
  let handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  if (isOpen) {
    document.addEventListener('mousedown', handleClickOutside);
  }

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [isOpen, onClose]);
```

### 2. Auto-fetch khi mở
Dữ liệu chỉ được fetch khi dropdown được mở (tối ưu performance):
```typescript
useEffect(() => {
  if (isOpen) {
    fetchHotItems();
  }
}, [isOpen, type]);
```

### 3. Loading state
Hiển thị spinner khi đang tải dữ liệu

### 4. Empty state
Hiển thị icon clock và message khi chưa có dữ liệu

## Customization

### Thay đổi số lượng xe hiển thị
Sửa trong `fetchHotItems()`:
```typescript
let response = await xeService.getAll({ 
  limit: 10,  // Thay đổi từ 6 sang 10
  trangThai: 'dangBan' 
});
```

### Thêm sorting
```typescript
let response = await xeService.getAll({ 
  limit: 6,
  trangThai: 'dangBan',
  sort: 'createdAt',  // Sort theo ngày đăng mới nhất
  order: 'desc'
});
```

### Thay đổi tiêu đề
Sửa trong component:
```typescript
<span className="font-semibold">
  {type === 'xe' ? 'Xe hot nhất' : 'Xe cho thuê hot'}
</span>
```

## Performance

### Lazy loading
Component import xeChoThueService dynamically để tránh bundle size lớn:
```typescript
let xeChoThueService = (await import('../services/xeChoThueService')).default;
```

### Debounce (Tương lai)
Có thể thêm debounce cho search để tránh call API quá nhiều:
```typescript
import { debounce } from 'lodash';

const debouncedSearch = debounce((term) => {
  // Search logic
}, 300);
```

## Testing

### Test cases cần kiểm tra:

1. **Hiển thị dropdown**
   - [ ] Click vào ô tìm kiếm → Dropdown xuất hiện
   - [ ] Hiển thị đúng 6 xe

2. **Đóng dropdown**
   - [ ] Click bên ngoài → Dropdown đóng
   - [ ] Click vào xe → Chuyển trang và đóng dropdown
   - [ ] Press ESC → Dropdown đóng (future feature)

3. **Loading state**
   - [ ] Hiển thị spinner khi đang load
   - [ ] Hiển thị xe sau khi load xong

4. **Empty state**
   - [ ] Hiển thị message khi không có xe

5. **Navigation**
   - [ ] Click xe bán → Chuyển đến `/xe/:id`
   - [ ] Click xe thuê → Chuyển đến `/thue-xe/:id`
   - [ ] Click "Xem tất cả" → Chuyển đến trang danh sách

6. **Responsive**
   - [ ] Hiển thị tốt trên mobile
   - [ ] Hiển thị tốt trên tablet
   - [ ] Hiển thị tốt trên desktop

## Troubleshooting

### Dropdown không hiển thị
- Kiểm tra `isOpen` prop có được set đúng không
- Kiểm tra z-index của dropdown (phải > z-index của các element khác)

### Click bên ngoài không đóng
- Kiểm tra ref có được gán đúng không
- Kiểm tra event listener có được add/remove đúng không

### Ảnh không hiển thị
- Kiểm tra path ảnh: `http://localhost:5000/${hinhAnh[0]}`
- Kiểm tra CORS settings trong backend
- Kiểm tra file ảnh có tồn tại trong folder uploads không

### API không trả về dữ liệu
- Kiểm tra backend có chạy không
- Kiểm tra API endpoint đúng không
- Kiểm tra database có dữ liệu không

## Future Enhancements

1. **Thêm lịch sử tìm kiếm** - Lưu các từ khóa đã search
2. **Thêm trending tags** - Hiển thị các tag phổ biến
3. **Personalization** - Hiển thị xe dựa trên lịch sử xem của user
4. **Analytics** - Track click rate của mỗi xe trong dropdown
5. **Cache** - Cache kết quả để giảm API calls
6. **Keyboard navigation** - Di chuyển bằng mũi tên lên/xuống
7. **Highlight search term** - Highlight từ khóa tìm kiếm trong kết quả

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Dependencies

- React 18+
- react-router-dom 6+
- lucide-react (icons)
- Tailwind CSS 3+

