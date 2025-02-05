import express from 'express';
import { protect } from '../middleware/auth';
import {
  startTimeTracking,
  stopTimeTracking,
  getTimeEntries,
  deleteTimeEntry,
  getProjectTimeStats,
} from '../controllers/timeTrackingController';

const router = express.Router();

router.use(protect);

// Time tracking operations
router.post('/start', startTimeTracking);
router.post('/stop', stopTimeTracking);
router.get('/entries', getTimeEntries);
router.delete('/entries/:entryId', deleteTimeEntry);

// Project time statistics
router.get('/projects/:projectId/stats', getProjectTimeStats);

export default router; 