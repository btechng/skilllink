import { Router } from 'express';
import { auth, requireRole } from '../middleware/auth.js';
import { createJob, listJobs, getJob, updateJob, deleteJob } from '../controllers/jobsController.js';

const router = Router();

router.get('/', listJobs);
router.get('/:id', getJob);
router.post('/', auth, requireRole('client', 'admin'), createJob);
router.put('/:id', auth, requireRole('client', 'admin'), updateJob);
router.delete('/:id', auth, requireRole('client', 'admin'), deleteJob);

export default router;
