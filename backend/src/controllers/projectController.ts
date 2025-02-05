import { RequestHandler } from 'express';
import { Project } from '../models/Project';
import { Team } from '../models/Team';
import { User } from '../models/User';
import { IUser } from '../types';

export const createProject: RequestHandler = async (req, res) => {
  try {
    const { name, description, isPublic, teamId } = req.body;
    const user = req.user as IUser;

    const project = await Project.create({
      name,
      description,
      isPublic,
      teamId,
      owner: user._id,
      members: [user._id],
    });

    if (teamId) {
      await Team.findByIdAndUpdate(teamId, {
        $push: { projects: project._id },
      });
    }

    await User.findByIdAndUpdate(user._id, {
      $push: { personalProjects: project._id },
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProjects: RequestHandler = async (req, res) => {
  try {
    const user = req.user as IUser;
    const projects = await Project.find({
      $or: [
        { members: user._id },
        { isPublic: true },
      ],
    })
      .populate('members', 'name email avatar')
      .populate('tasks')
      .populate('owner', 'name email')
      .sort('-updatedAt');

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProjectById: RequestHandler = async (req, res) => {
  try {
    const user = req.user as IUser;
    const project = await Project.findById(req.params.id)
      .populate('members', 'name email avatar')
      .populate('tasks')
      .populate('owner', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.members.includes(user._id) && !project.isPublic) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProject: RequestHandler = async (req, res) => {
  try {
    const user = req.user as IUser;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
      .populate('members', 'name email avatar')
      .populate('tasks')
      .populate('owner', 'name email');

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProject: RequestHandler = async (req, res) => {
  try {
    const user = req.user as IUser;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Project.deleteOne({ _id: project._id });

    if (project.teamId) {
      await Team.findByIdAndUpdate(project.teamId, {
        $pull: { projects: project._id },
      });
    }

    await User.findByIdAndUpdate(user._id, {
      $pull: { personalProjects: project._id },
    });

    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const addProjectMember: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = req.user as IUser;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (project.members.includes(userId)) {
      return res.status(400).json({ message: 'User already a member' });
    }

    project.members.push(userId);
    await project.save();

    const updatedProject = await Project.findById(req.params.id)
      .populate('members', 'name email avatar')
      .populate('tasks')
      .populate('owner', 'name email');

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeProjectMember: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = req.user as IUser;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (userId === project.owner.toString()) {
      return res.status(400).json({ message: 'Cannot remove project owner' });
    }

    project.members = project.members.filter(
      (member) => member.toString() !== userId
    );
    await project.save();

    const updatedProject = await Project.findById(req.params.id)
      .populate('members', 'name email avatar')
      .populate('tasks')
      .populate('owner', 'name email');

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
