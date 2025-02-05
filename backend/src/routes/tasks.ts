import express from 'express';
import { protect } from '../middleware/auth';
import {
  createTask,
  updateTaskStatus,
  assignTask,
  deleteTask,
  getProjectTasks,
} from '../controllers/taskController';

const router = express.Router();

router.use(protect);

// Project tasks
router.get('/projects/:projectId/tasks', getProjectTasks);
router.post('/projects/:projectId/tasks', createTask);

// Task operations
router.patch('/tasks/:taskId/status', updateTaskStatus);
router.post('/tasks/:taskId/assign', assignTask);
router.delete('/tasks/:taskId', deleteTask);

export default router; 