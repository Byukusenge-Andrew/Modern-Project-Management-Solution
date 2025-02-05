import express from 'express';
import { protect } from '../middleware/auth';
import {
  createTeam,
  joinTeam,
  leaveTeam,
  getTeamMembers,
  updateTeam,
  getUserTeams,
  regenerateTeamCode,
} from '../controllers/teamController';

const router = express.Router();

router.use(protect);

// Team operations
router.post('/', createTeam);
router.get('/my-teams', getUserTeams);
router.post('/join', joinTeam);

// Specific team operations
router.get('/:teamId/members', getTeamMembers);
router.patch('/:teamId', updateTeam);
router.post('/:teamId/leave', leaveTeam);
router.post('/:teamId/regenerate-code', regenerateTeamCode);

export default router; 