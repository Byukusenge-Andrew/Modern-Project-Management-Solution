import mongoose from 'mongoose';
import { IProject } from '../types';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  }],
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Add indexes for better query performance
projectSchema.index({ teamId: 1 });
projectSchema.index({ members: 1 });
projectSchema.index({ owner: 1 });

export const Project = mongoose.model<IProject>('Project', projectSchema);
