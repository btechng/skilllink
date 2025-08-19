import axios from 'axios';
import crypto from 'crypto';
import Transaction from '../models/Transaction.js';
import Job from '../models/Job.js';
import Proposal from '../models/Proposal.js';

const PAYSTACK_BASE = 'https://api.paystack.co';

export async function initFunding(req, res) {
  try {
    const { jobId, amount } = req.body;
    if (!jobId || !amount) return res.status(400).json({ message: 'jobId and amount required' });
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (String(job.client) !== String(req.user._id)) return res.status(403).json({ message: 'Forbidden' });

    // Ideally find the accepted proposal to get freelancer id
    const accepted = await Proposal.findOne({ job: jobId, status: 'accepted' }).populate('freelancer');
    if (!accepted) return res.status(400).json({ message: 'No accepted proposal for this job' });

    const tx = await Transaction.create({
      job: jobId,
      client: req.user._id,
      freelancer: accepted.freelancer._id,
      amount,
      status: 'initialized'
    });

    const payload = {
      email: req.user.email,
      amount: Math.round(amount * 100), // kobo
      metadata: { jobId: String(jobId), txId: String(tx._id) },
      callback_url: process.env.PAYSTACK_CALLBACK_URL || ''
    };

    const { data } = await axios.post(`${PAYSTACK_BASE}/transaction/initialize`, payload, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
    });

    tx.reference = data.data.reference;
    await tx.save();

    res.json({ authorization_url: data.data.authorization_url, access_code: data.data.access_code, reference: data.data.reference, txId: tx._id });
  } catch (e) {
    console.error(e.response?.data || e);
    res.status(500).json({ message: 'Failed to initialize Paystack' });
  }
}

// Paystack webhook: verify signature and update escrow status
export async function paystackWebhook(req, res) {
  try {
    const signature = req.headers['x-paystack-signature'];
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const hash = crypto.createHmac('sha512', secret).update(req.rawBody).digest('hex');
    if (hash !== signature) return res.status(401).send('Invalid signature');

    const event = JSON.parse(req.rawBody.toString());
    if (event.event === 'charge.success') {
      const ref = event.data.reference;
      const tx = await Transaction.findOne({ reference: ref });
      if (tx) {
        tx.status = 'escrow';
        tx.meta = event.data;
        await tx.save();
      }
    }
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
}

export async function releaseFunds(req, res) {
  // For demo, we mark as released; in real life, perform transfer to freelancer subaccount
  try {
    const { jobId } = req.params;
    const tx = await Transaction.findOne({ job: jobId, status: 'escrow' });
    if (!tx) return res.status(404).json({ message: 'Escrow not found' });
    // Only client or admin can release
    if (String(tx.client) !== String(req.user._id) && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Forbidden' });
    tx.status = 'released';
    await tx.save();
    res.json(tx);
  } catch (e) { console.error(e); res.status(500).json({ message: 'Server error' }); }
}

export async function refundClient(req, res) {
  try {
    const { jobId } = req.params;
    const tx = await Transaction.findOne({ job: jobId, status: 'escrow' });
    if (!tx) return res.status(404).json({ message: 'Escrow not found' });
    // Only client or admin can refund
    if (String(tx.client) !== String(req.user._id) && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Forbidden' });
    tx.status = 'refunded';
    await tx.save();
    res.json(tx);
  } catch (e) { console.error(e); res.status(500).json({ message: 'Server error' }); }
}

export async function myTransactions(req, res) {
  const list = await Transaction.find({ $or: [{ client: req.user._id }, { freelancer: req.user._id }] })
    .populate('job', 'title')
    .sort({ createdAt: -1 });
  res.json(list);
}
