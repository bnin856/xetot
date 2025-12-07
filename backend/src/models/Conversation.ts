import mongoose, { Document, Schema } from 'mongoose';

export interface IConversation extends Document {
  idXe: mongoose.Types.ObjectId; // Xe đang được thảo luận
  loaiXe: 'xe' | 'xeChoThue'; // Loại xe: mua hoặc thuê
  idNguoiMua: mongoose.Types.ObjectId; // Người mua tiềm năng
  idNguoiBan: mongoose.Types.ObjectId; // Người bán xe
  lastMessage?: string; // Tin nhắn cuối cùng
  lastMessageAt?: Date; // Thời gian tin nhắn cuối
  unreadCountMua: number; // Số tin chưa đọc của người mua
  unreadCountBan: number; // Số tin chưa đọc của người bán
  trangThai: 'active' | 'closed'; // Trạng thái hội thoại
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    idXe: {
      type: Schema.Types.ObjectId,
      required: [true, 'Vui lòng chọn xe'],
    },
    loaiXe: {
      type: String,
      enum: ['xe', 'xeChoThue'],
      default: 'xe',
    },
    idNguoiMua: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Vui lòng chọn người mua'],
    },
    idNguoiBan: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Vui lòng chọn người bán'],
    },
    lastMessage: {
      type: String,
    },
    lastMessageAt: {
      type: Date,
    },
    unreadCountMua: {
      type: Number,
      default: 0,
    },
    unreadCountBan: {
      type: Number,
      default: 0,
    },
    trangThai: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Index để tìm kiếm nhanh
conversationSchema.index({ idNguoiMua: 1, idNguoiBan: 1, idXe: 1 });
conversationSchema.index({ idNguoiMua: 1 });
conversationSchema.index({ idNguoiBan: 1 });

export default mongoose.model<IConversation>('Conversation', conversationSchema);

