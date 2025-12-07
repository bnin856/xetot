import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  idConversation: mongoose.Types.ObjectId; // Thuộc hội thoại nào
  idNguoiGui: mongoose.Types.ObjectId; // Người gửi
  noiDung: string; // Nội dung tin nhắn
  loaiTinNhan: 'text' | 'image' | 'file'; // Loại tin nhắn
  hinhAnh?: string[]; // Đường dẫn hình ảnh (nếu có)
  file?: string; // Đường dẫn file (nếu có)
  daDoc: boolean; // Đã đọc chưa
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    idConversation: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: [true, 'Vui lòng chọn hội thoại'],
    },
    idNguoiGui: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Vui lòng chọn người gửi'],
    },
    noiDung: {
      type: String,
      required: [true, 'Vui lòng nhập nội dung'],
      trim: true,
    },
    loaiTinNhan: {
      type: String,
      enum: ['text', 'image', 'file'],
      default: 'text',
    },
    hinhAnh: {
      type: [String],
      default: [],
    },
    file: {
      type: String,
    },
    daDoc: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index để query nhanh
messageSchema.index({ idConversation: 1, createdAt: -1 });
messageSchema.index({ idNguoiGui: 1 });

export default mongoose.model<IMessage>('Message', messageSchema);

