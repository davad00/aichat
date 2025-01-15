import mongoose from 'mongoose';
import { Schema, models, model } from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface IChat {
  userId: mongoose.Types.ObjectId;
  visitorId: string;
  messages: IMessage[];
  metadata: {
    browser: string;
    os: string;
    device: string;
    ip: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ChatSchema = new Schema<IChat>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    visitorId: {
      type: String,
      required: true,
    },
    messages: [MessageSchema],
    metadata: {
      browser: String,
      os: String,
      device: String,
      ip: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Chat = models.Chat || model<IChat>('Chat', ChatSchema); 