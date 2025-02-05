import { RequestHandler } from 'express';
import { Message } from '../models/Message';
import { Team } from '../models/Team';
import { IUser } from '../types';

export const sendMessage: RequestHandler = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { content } = req.body;
    const user = req.user as IUser;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (!team.members.includes(user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const message = await Message.create({
      teamId,
      userId: user._id,
      content,
      readBy: [user._id],
    });

    // Populate user details for the response
    const populatedMessage = await Message.findById(message._id)
      .populate('userId', 'name email avatar');

    // Emit the message through WebSocket
    req.app.get('io').to(`team:${teamId}`).emit('newMessage', populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTeamMessages: RequestHandler = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { limit = 50, before } = req.query;
    const user = req.user as IUser;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (!team.members.includes(user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const query: any = { teamId };
    if (before) {
      query.createdAt = { $lt: before };
    }

    const messages = await Message.find(query)
      .populate('userId', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const markMessagesAsRead: RequestHandler = async (req, res) => {
  try {
    const { teamId } = req.params;
    const user = req.user as IUser;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (!team.members.includes(user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Message.updateMany(
      {
        teamId,
        readBy: { $ne: user._id },
      },
      {
        $addToSet: { readBy: user._id },
      }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUnreadCount: RequestHandler = async (req, res) => {
  try {
    const { teamId } = req.params;
    const user = req.user as IUser;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (!team.members.includes(user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const count = await Message.countDocuments({
      teamId,
      readBy: { $ne: user._id },
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 