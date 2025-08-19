import User from '../models/User.js';
import Job from '../models/Job.js';
import Transaction from '../models/Transaction.js';

export async function listUsers(req, res) {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
}

export async function listJobsAdmin(req, res) {
  const jobs = await Job.find().populate('client', 'name').sort({ createdAt: -1 });
  res.json(jobs);
}

export async function listTransactions(req, res) {
  const tx = await Transaction.find().populate('job', 'title').sort({ createdAt: -1 });
  res.json(tx);
}

export async function banUser(req, res) {
  const { id } = req.params;
  await User.findByIdAndUpdate(id, { role: 'banned' });
  res.json({ ok: true });
}
