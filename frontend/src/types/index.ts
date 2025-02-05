export interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  teams: string[];
}

export interface Team {
  id: string;
  name: string;
  description: string;
  verificationCode: string;
  members: User[];
  projects: Project[];
  owner: string;
  isPublic: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assigneeId?: string;
  projectId: string;
  teamId?: string;
  dueDate?: string;
  completedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  members: User[];
  teamId?: string;
  isPublic: boolean;
  owner: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  teamId: string;
  userId: string;
  content: string;
  createdAt: string;
  readBy: string[];
}

export interface ChatRoom {
  id: string;
  teamId: string;
  name: string;
  members: string[];
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface TimeEntry {
  id: string;
  projectId: string;
  userId: string;
  description?: string;
  startTime: string;
  endTime?: string;
  duration: number;
}