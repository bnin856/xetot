import mongoose from 'mongoose';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Retry vài lần trước khi bỏ cuộc: ngay sau khi máy vừa khởi động lại, mạng/DNS
// có thể chưa sẵn sàng kịp cho SRV lookup của mongodb+srv://, khiến lần connect
// đầu tiên thất bại dù MongoDB Atlas vẫn hoạt động bình thường.
export const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await mongoose.connect(mongoURI);
      console.log('✅ MongoDB Connected');
      return;
    } catch (error) {
      console.error(`❌ MongoDB connection error (lần ${attempt}/${MAX_RETRIES}):`, error);

      if (attempt === MAX_RETRIES) {
        process.exit(1);
      }

      await wait(RETRY_DELAY_MS);
    }
  }
};

