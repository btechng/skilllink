import Proposal from '../models/Proposal.js';
import Job from '../models/Job.js';

export async function createProposal(req, res) {
  const { jobId, coverLetter, bidAmount } = req.body;
  if (!jobId || !bidAmount) return res.status(400).json({ message: 'jobId and bidAmount required' });
  const job = await Job.findById(jobId);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  if (String(job.client) === String(req.user._id)) return res.status(400).json({ message: 'Cannot propose on own job' });
  const proposal = await Proposal.create({ job: jobId, freelancer: req.user._id, coverLetter, bidAmount });
  res.status(201).json(proposal);
}

export async function getJobProposals(req, res) {
  const { jobId } = req.params;
  const job = await Job.findById(jobId);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  if (String(job.client) !== String(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
  const proposals = await Proposal.find({ job: jobId }).populate('freelancer', 'name title profileImage');
  res.json(proposals);
}

export async function acceptProposal(req, res) {
  const { id } = req.params;
  const proposal = await Proposal.findById(id).populate('job');
  if (!proposal) return res.status(404).json({ message: 'Proposal not found' });
  if (String(proposal.job.client) !== String(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
  proposal.status = 'accepted';
  await proposal.save();
  // mark job in progress
  proposal.job.status = 'in_progress';
  await proposal.job.save();
  res.json(proposal);
}

export async function rejectProposal(req, res) {
  const { id } = req.params;
  const proposal = await Proposal.findById(id).populate('job');
  if (!proposal) return res.status(404).json({ message: 'Proposal not found' });
  if (String(proposal.job.client) !== String(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
  proposal.status = 'rejected';
  await proposal.save();
  res.json(proposal);
}
