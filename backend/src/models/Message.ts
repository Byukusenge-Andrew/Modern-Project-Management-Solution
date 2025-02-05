import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  readBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

// Add indexes for better query performance
messageSchema.index({ teamId: 1, createdAt: -1 });
messageSchema.index({ readBy: 1 });

export const Message = mongoose.model('Message', messageSchema);
