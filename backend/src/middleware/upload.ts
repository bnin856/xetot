import multer from 'multer';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary';

if (process.env.NODE_ENV === 'production' && !isCloudinaryConfigured) {
  console.warn(
    '⚠️  CLOUDINARY_* chưa được cấu hình — file upload sẽ lưu vào đĩa cục bộ và MẤT khi container redeploy/restart.'
  );
}

// Khi đã cấu hình Cloudinary: giữ file trong memory rồi đẩy lên Cloudinary (xem uploadBufferToCloudinary).
// Khi chưa cấu hình (VD: dev local không có tài khoản Cloudinary): lưu ra đĩa như trước.
const storage = isCloudinaryConfigured
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'uploads/');
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
      },
    });

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    const error = new Error('Chỉ cho phép upload file ảnh (jpeg, jpg, png, gif, webp)') as any;
    error.statusCode = 400;
    cb(error);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB default
  },
  fileFilter,
});

// Đẩy buffer trong memory lên Cloudinary, rồi gán kết quả vào file.path/file.filename
// để code downstream (controllers dùng file.path) không cần thay đổi gì.
const uploadBufferToCloudinary = (file: Express.Multer.File): Promise<void> =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'xetot', resource_type: 'image' },
      (error, result) => {
        if (error || !result) {
          reject(new Error(error?.message || 'Upload Cloudinary thất bại'));
          return;
        }
        (file as any).path = result.secure_url;
        (file as any).filename = result.public_id;
        resolve();
      }
    );
    stream.end(file.buffer);
  });

const withCloudinaryUpload = (
  multerMiddleware: (req: Request, res: Response, cb: (err: any) => void) => void
) => (req: Request, res: Response, next: NextFunction) => {
  multerMiddleware(req, res, async (err: any) => {
    if (err) {
      next(err);
      return;
    }
    if (!isCloudinaryConfigured) {
      next();
      return;
    }
    try {
      const files = req.file ? [req.file] : ((req.files as Express.Multer.File[] | undefined) || []);
      await Promise.all(files.map(uploadBufferToCloudinary));
      next();
    } catch (uploadError) {
      next(uploadError);
    }
  });
};

export const uploadSingle = withCloudinaryUpload(upload.single('bienLai')); // Upload 1 ảnh biên lai
export const uploadMultiple = withCloudinaryUpload(upload.array('hinhAnh', 10)); // Tối đa 10 ảnh

// multer trả về file.path với dấu \ trên Windows khi lưu đĩa cục bộ, cần chuẩn hoá về /
// để dùng làm URL. Với Cloudinary, file.path đã là URL đầy đủ nên không bị ảnh hưởng.
export const toWebPath = (filePath: string): string => filePath.replace(/\\/g, '/');
