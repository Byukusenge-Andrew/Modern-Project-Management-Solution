import { Request, Response } from 'express';
import { Team } from '../models/Team';
import { User } from '../models/User';
import { RequestHandler } from 'express';
import { IUser } from '../types';

export const createTeam: RequestHandler = async (req, res) => {
  try {
    const user = req.user as IUser;
    const { name, description, isPublic } = req.body;

    const team = await Team.create({
      name,
      description,
      isPublic,
      owner: user._id,
      members: [user._id],
    });

    await User.findByIdAndUpdate(user._id, {
      $push: { teams: team._id },
    });

    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const joinTeam: RequestHandler = async (req, res) => {
  try {
    const user = req.user as IUser;
    const { verificationCode } = req.body;

    const team = await Team.findOne({ verificationCode });
    if (!team) {
      return res.status(404).json({ message: 'Invalid team code' });
    }

    if (team.members.includes(user._id)) {
      return res.status(400).json({ message: 'Already a member of this team' });
    }

    await Team.findByIdAndUpdate(team._id, {
      $push: { members: user._id },
    });

    await User.findByIdAndUpdate(user._id, {
      $push: { teams: team._id },
    });

    res.json({ message: 'Successfully joined team' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const leaveTeam = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { teamId } = req.params;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (team.owner.toString() === user._id.toString()) {
      return res.status(400).json({ message: 'Team owner cannot leave the team' });
    }

    await Team.findByIdAndUpdate(teamId, {
      $pull: { members: user._id },
    });

    await User.findByIdAndUpdate(user._id, {
      $pull: { teams: teamId },
    });

    res.json({ message: 'Successfully left team' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTeamMembers = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { teamId } = req.params;

    const team = await Team.findById(teamId)
      .populate('members', 'name email avatar')
      .populate('owner', 'name email avatar');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (!team.members.some(m => m._id.toString() === user._id.toString()) && !team.isPublic) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(team.members);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTeam = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { teamId } = req.params;
    const updates = req.body;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (team.owner.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Only team owner can update team' });
    }

    const updatedTeam = await Team.findByIdAndUpdate(
      teamId,
      { $set: updates },
      { new: true }
    ).populate('members', 'name email avatar');

    res.json(updatedTeam);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserTeams = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const teams = await Team.find({
      members: user._id,
    })
      .populate('members', 'name email avatar')
      .populate('owner', 'name email avatar')
      .populate('projects');

    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const regenerateTeamCode = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { teamId } = req.params;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (team.owner.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Only team owner can regenerate code' });
    }

    const updatedTeam = await Team.findByIdAndUpdate(
      teamId,
      { $set: { verificationCode: undefined } },
      { new: true }
    );

    res.json({ verificationCode: updatedTeam?.verificationCode });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 