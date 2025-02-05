import mongoose from 'mongoose';
import crypto from 'crypto';

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  verificationCode: {
    type: String,
    unique: true,
    default: () => crypto.randomBytes(3).toString('hex').toUpperCase(),
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Add indexes for better query performance
teamSchema.index({ members: 1 });
teamSchema.index({ verificationCode: 1 });

export const Team = mongoose.model('Team', teamSchema);
