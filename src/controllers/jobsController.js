import Job from "../models/Job.js";

// Create a new job
export async function createJob(req, res) {
  try {
    const { title, description, budget, category } = req.body;
    if (!title || !budget) {
      return res.status(400).json({ message: "Title and budget are required" });
    }

    const job = await Job.create({
      client: req.user._id,
      title,
      description,
      budget,
      category,
      status: "open",
    });

    res.status(201).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

// List all jobs with optional filters
export async function listJobs(req, res) {
  try {
    const { category, status } = req.query;
    const query = {};
    if (category) query.category = category;
    if (status) query.status = status;

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .populate("client", "name profileImage")
      .populate("freelancer", "name profileImage");

    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

// Get single job by ID
export async function getJob(req, res) {
  try {
    const job = await Job.findById(req.params.id)
      .populate("client", "name profileImage")
      .populate("freelancer", "name profileImage");

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

// Update job (only if open and belongs to client)
export async function updateJob(req, res) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (String(job.client) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (job.status !== "open") {
      return res.status(400).json({ message: "Only open jobs can be updated" });
    }

    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

// Delete job (only if belongs to client)
export async function deleteJob(req, res) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (String(job.client) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await job.deleteOne();
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

// Assign a freelancer to a job (client only)
export async function assignFreelancer(req, res) {
  try {
    const { freelancerId } = req.body;
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (String(job.client) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (job.status !== "open") {
      return res
        .status(400)
        .json({ message: "Only open jobs can be assigned" });
    }

    job.freelancer = freelancerId;
    job.status = "in_progress";
    await job.save();

    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
