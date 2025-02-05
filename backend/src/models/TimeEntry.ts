import mongoose from 'mongoose';

const timeEntrySchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  description: String,
  startTime: {
    type: Date,
    required: true,
  },
  endTime: Date,
  duration: {
    type: Number, // in minutes
    default: 0,
  },
}, {
  timestamps: true,
});

// Calculate duration when endTime is set
timeEntrySchema.pre('save', function(next) {
  if (this.endTime && this.startTime) {
    this.duration = Math.round(
      (this.endTime.getTime() - this.startTime.getTime()) / 60000
    );
  }
  next();
});

// Add indexes for better query performance
timeEntrySchema.index({ projectId: 1, userId: 1 });
timeEntrySchema.index({ userId: 1, startTime: -1 });

export const TimeEntry = mongoose.model('TimeEntry', timeEntrySchema);
