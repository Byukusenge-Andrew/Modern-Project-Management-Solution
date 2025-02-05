import { RequestHandler } from 'express';
import { IGetUserAuthInfoRequest } from '../types/express';
import { Task } from '../models/Task';
import { Project } from '../models/Project';

export const createTask: RequestHandler = async (req: IGetUserAuthInfoRequest, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, priority, dueDate } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.members.includes(req.user!._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      projectId,
      teamId: project.teamId,
    });

    await Project.findByIdAndUpdate(projectId, {
      $push: { tasks: task._id },
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTaskStatus: RequestHandler = async (req: IGetUserAuthInfoRequest, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const task = await Task.findById(taskId).populate('projectId');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = task.projectId as any;
    if (!project.members.includes(req.user!._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    task.status = status;
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const assignTask: RequestHandler = async (req: IGetUserAuthInfoRequest, res) => {
  try {
    const { taskId } = req.params;
    const { assigneeId } = req.body;

    const task = await Task.findById(taskId).populate('projectId');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = task.projectId as any;
    if (!project.members.includes(req.user!._id.toString())) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!project.members.includes(assigneeId.toString())) {
      return res.status(400).json({ message: 'Assignee must be a project member' });
    }

    task.assigneeId = assigneeId;
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTask: RequestHandler = async (req: IGetUserAuthInfoRequest, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId).populate('projectId');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = task.projectId as any;
    if (!project.members.includes(req.user!._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Task.findByIdAndDelete(taskId);
    await Project.findByIdAndUpdate(project._id, {
      $pull: { tasks: taskId },
    });

    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProjectTasks: RequestHandler = async (req: IGetUserAuthInfoRequest, res) => {
  try {
    const { projectId } = req.params;
    const { status } = req.query;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.members.includes(req.user!._id) && !project.isPublic) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const query: any = { projectId };
    if (status) {
      Object.assign(query, { status });
    }

    const tasks = await Task.find(query)
      .populate('assigneeId', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 