import { Router } from 'express';
import { auth, requireRole } from '../middleware/auth.js';
import { createProposal, getJobProposals, acceptProposal, rejectProposal } from '../controllers/proposalsController.js';

const router = Router();

router.post('/', auth, requireRole('freelancer', 'admin'), createProposal);
router.get('/job/:jobId', auth, requireRole('client', 'admin'), getJobProposals);
router.post('/:id/accept', auth, requireRole('client', 'admin'), acceptProposal);
router.post('/:id/reject', auth, requireRole('client', 'admin'), rejectProposal);

export default router;
