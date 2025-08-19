import { Router } from 'express';
import { auth, requireRole } from '../middleware/auth.js';
import { initFunding, paystackWebhook, releaseFunds, refundClient, myTransactions } from '../controllers/transactionsController.js';
import express from 'express';

const router = Router();

router.post('/fund', auth, requireRole('client', 'admin'), initFunding);
router.post('/release/:jobId', auth, releaseFunds);
router.post('/refund/:jobId', auth, refundClient);
router.get('/me', auth, myTransactions);

// Raw body for webhook signature verification
router.post('/paystack/webhook', express.raw({ type: '*/*' }), (req, res, next) => { req.rawBody = req.body; next(); }, paystackWebhook);

export default router;
