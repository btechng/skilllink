import { Router } from 'express';
import { auth, requireRole } from '../middleware/auth.js';
import { listUsers, listJobsAdmin, listTransactions, banUser } from '../controllers/adminController.js';

const router = Router();

router.use(auth, requireRole('admin'));
router.get('/users', listUsers);
router.get('/jobs', listJobsAdmin);
router.get('/transactions', listTransactions);
router.delete('/users/:id', banUser);

export default router;
