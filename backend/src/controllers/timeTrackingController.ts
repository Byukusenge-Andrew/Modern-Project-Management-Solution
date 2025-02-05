import { RequestHandler } from 'express';
import { TimeEntry } from '../models/TimeEntry';
import { Project } from '../models/Project';
import { IUser } from '../types';

export const startTimeTracking: RequestHandler = async (req, res) => {
  try {
    const user = req.user as IUser;
    const { projectId, description } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.members.includes(user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const activeEntry = await TimeEntry.findOne({
      userId: user._id,
      endTime: null,
    });

    if (activeEntry) {
      return res.status(400).json({ message: 'Already tracking time' });
    }

    const timeEntry = await TimeEntry.create({
      projectId,
      userId: user._id,
      description,
      startTime: new Date(),
    });

    res.status(201).json(timeEntry);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const stopTimeTracking: RequestHandler = async (req, res) => {
  try {
    const user = req.user as IUser;
    const activeEntry = await TimeEntry.findOne({
      userId: user._id,
      endTime: null,
    });

    if (!activeEntry) {
      return res.status(404).json({ message: 'No active time entry' });
    }

    activeEntry.endTime = new Date();
    await activeEntry.save();

    res.json(activeEntry);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTimeEntries: RequestHandler = async (req, res) => {
  try {
    const user = req.user as IUser;
    const { projectId, startDate, endDate } = req.query;
    const query: any = { userId: user._id };

    if (projectId) {
      query.projectId = projectId;
    }

    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) query.startTime.$gte = new Date(startDate as string);
      if (endDate) query.startTime.$lte = new Date(endDate as string);
    }

    const entries = await TimeEntry.find(query)
      .populate('projectId', 'name')
      .sort({ startTime: -1 });

    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTimeEntry: RequestHandler = async (req, res) => {
  try {
    const user = req.user as IUser;
    const entry = await TimeEntry.findOne({
      _id: req.params.entryId,
      userId: user._id,
    });

    if (!entry) {
      return res.status(404).json({ message: 'Time entry not found' });
    }

    await TimeEntry.deleteOne({ _id: entry._id });
    res.json({ message: 'Time entry removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProjectTimeStats: RequestHandler = async (req, res) => {
  try {
    const user = req.user as IUser;
    const { projectId } = req.params;
    const { startDate, endDate } = req.query;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const query: any = { projectId };
    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) query.startTime.$gte = new Date(startDate as string);
      if (endDate) query.startTime.$lte = new Date(endDate as string);
    }

    const entries = await TimeEntry.find(query);
    const totalTime = entries.reduce((acc, entry) => {
      if (entry.duration) {
        return acc + entry.duration;
      }
      return acc;
    }, 0);

    const userStats = await TimeEntry.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$userId',
          totalTime: { $sum: '$duration' },
          entries: { $sum: 1 },
        },
      },
    ]);

    res.json({
      totalTime,
      userStats,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 