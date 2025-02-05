import mongoose from 'mongoose';
import { ITask } from '../types';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'review', 'done'],
    default: 'todo',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  assigneeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  },
  dueDate: Date,
  completedAt: Date,
}, {
  timestamps: true,
});

// Add indexes for better query performance
taskSchema.index({ projectId: 1, status: 1 });
taskSchema.index({ assigneeId: 1 });
taskSchema.index({ teamId: 1 });

// Update completedAt when status changes to 'done'
taskSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'done') {
    this.completedAt = new Date();
  }
  next();
});

export const Task = mongoose.model<ITask>('Task', taskSchema);
