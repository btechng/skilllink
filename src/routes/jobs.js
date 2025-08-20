import { Router } from "express";
import { auth, requireRole } from "../middleware/auth.js";
import {
  createJob,
  listJobs,
  getJob,
  updateJob,
  deleteJob,
  assignFreelancer,
} from "../controllers/jobsController.js";

const router = Router();

// Public / auth routes
router.get("/", auth, listJobs); // List all jobs (authenticated)
router.get("/:id", auth, getJob); // Get single job by ID

// Client/Admin routes
router.post("/", auth, requireRole("client", "admin"), createJob); // Create a job
router.put("/:id", auth, requireRole("client", "admin"), updateJob); // Update job
router.delete("/:id", auth, requireRole("client", "admin"), deleteJob); // Delete job
router.put(
  "/:id/assign",
  auth,
  requireRole("client", "admin"),
  assignFreelancer
); // Assign freelancer to job

export default router;
