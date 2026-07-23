// Trong development để trống (Vite proxy lo phần này); trong production
// set VITE_API_URL = origin của backend (VD: https://xetot-backend.onrender.com)
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Ảnh có thể là đường dẫn tương đối do backend lưu (uploads/...) hoặc URL ngoài
// (VD: Unsplash trong dữ liệu seed). Chỉ gắn tiền tố backend cho đường dẫn tương đối.
export const getImageUrl = (path?: string | null): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${BACKEND_URL}/${path.replace(/\\/g, '/')}`;
};
