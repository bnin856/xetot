import { v2 as cloudinary } from 'cloudinary';

// Cloudinary lưu ảnh upload (biên lai, ảnh xe, giấy tờ xác thực...) trên cloud
// thay vì đĩa cục bộ, vì filesystem trên Render là ephemeral (mất dữ liệu mỗi lần
// container redeploy/restart). Nếu chưa cấu hình, middleware upload sẽ tự fallback
// về lưu đĩa cục bộ (phù hợp cho dev, KHÔNG phù hợp cho production trên Render).
export const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export default cloudinary;
