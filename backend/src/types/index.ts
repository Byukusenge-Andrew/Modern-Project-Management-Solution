import { Document, Types } from 'mongoose';
import { Request } from 'express';

// User Types
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'member';
  teams: Types.ObjectId[];
  personalProjects: Types.ObjectId[];
  avatar?: string;
  matchPassword(password: string): Promise<boolean>;
}

// Project Types
export interface IProject extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  tasks: Types.ObjectId[];
  members: Types.ObjectId[];
  teamId?: Types.ObjectId;
  isPublic: boolean;
  owner: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Task Types
export interface ITask extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assigneeId?: Types.ObjectId;
  projectId: Types.ObjectId;
  teamId?: Types.ObjectId;
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Team Types
export interface ITeam extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  verificationCode: string;
  members: Types.ObjectId[];
  projects: Types.ObjectId[];
  owner: Types.ObjectId;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Message Types
export interface IMessage extends Document {
  _id: Types.ObjectId;
  teamId: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
  readBy: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Time Entry Types
export interface ITimeEntry extends Document {
  _id: Types.ObjectId;
  projectId: Types.ObjectId;
  userId: Types.ObjectId;
  description?: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}
// Request Types
export interface AuthRequest extends Request {
  user: IUser & { createdAt: Date; updatedAt: Date };
  headers: Request['headers'];
  body: Request['body'];
  params: Request['params'];
  query: Request['query'];
  app: Request['app'];
}

// Response Types
export interface ErrorResponse {
  message: string;
  stack?: string;
}

// Socket Types
export interface SocketUser {
  userId: string;
  socketId: string;
  rooms: string[];
} 