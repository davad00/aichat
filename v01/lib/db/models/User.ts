import mongoose from 'mongoose';
import { Schema, models, model } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
  name: string;
  openRouterApiKey?: string;
  widgetSettings: {
    primaryColor: string;
    fontFamily: string;
    widgetSize: 'small' | 'medium' | 'large';
    position: 'left' | 'right';
    welcomeMessage: string;
    selectedModel: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    openRouterApiKey: {
      type: String,
    },
    widgetSettings: {
      primaryColor: {
        type: String,
        default: '#007bff',
      },
      fontFamily: {
        type: String,
        default: 'Inter',
      },
      widgetSize: {
        type: String,
        enum: ['small', 'medium', 'large'],
        default: 'medium',
      },
      position: {
        type: String,
        enum: ['left', 'right'],
        default: 'right',
      },
      welcomeMessage: {
        type: String,
        default: 'Hi! How can I help you today?',
      },
      selectedModel: {
        type: String,
        default: 'openai/gpt-3.5-turbo',
      },
    },
  },
  {
    timestamps: true,
  }
);

export const User = models.User || model<IUser>('User', UserSchema); 