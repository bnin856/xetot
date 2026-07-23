const BACKEND_URL = 'http://localhost:5000';

// Ảnh có thể là đường dẫn tương đối do backend lưu (uploads/...) hoặc URL ngoài
// (VD: Unsplash trong dữ liệu seed). Chỉ gắn tiền tố backend cho đường dẫn tương đối.
export const getImageUrl = (path?: string | null): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${BACKEND_URL}/${path.replace(/\\/g, '/')}`;
};
