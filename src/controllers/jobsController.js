import Job from '../models/Job.js';

export async function createJob(req, res) {
  try {
    const { title, description, budget, category } = req.body;
    if (!title || !budget) return res.status(400).json({ message: 'title and budget are required' });
    const job = await Job.create({ client: req.user._id, title, description, budget, category });
    res.status(201).json(job);
  } catch (e) { console.error(e); res.status(500).json({ message: 'Server error' }); }
}

export async function listJobs(req, res) {
  const { category, status } = req.query;
  const query = {};
  if (category) query.category = category;
  if (status) query.status = status;
  const jobs = await Job.find(query).sort({ createdAt: -1 }).populate('client', 'name profileImage');
  res.json(jobs);
}

export async function getJob(req, res) {
  const job = await Job.findById(req.params.id).populate('client', 'name profileImage');
  if (!job) return res.status(404).json({ message: 'Job not found' });
  res.json(job);
}

export async function updateJob(req, res) {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  if (String(job.client) !== String(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
  if (job.status !== 'open') return res.status(400).json({ message: 'Only open jobs can be updated' });
  Object.assign(job, req.body);
  await job.save();
  res.json(job);
}

export async function deleteJob(req, res) {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  if (String(job.client) !== String(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
  await job.deleteOne();
  res.json({ ok: true });
}
