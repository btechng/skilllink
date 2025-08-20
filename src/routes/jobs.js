import { Router } from "express";
import { auth, requireRole } from "../middleware/auth.js";
import {
  createJob,
  listJobs,
  getJob,
  updateJob,
  deleteJob,
  assignFreelancer,
  getMyJobs,
} from "../controllers/jobsController.js";

const router = Router();

// ✅ Public / authenticated routes
router.get("/", auth, listJobs); // List jobs
router.get("/me", auth, getMyJobs); // Logged-in client’s jobs
router.get("/:id", auth, getJob); // Get single job

// ✅ Client / Admin routes
router.post("/", auth, requireRole("client", "admin"), createJob);
router.put("/:id", auth, requireRole("client", "admin"), updateJob);
router.delete("/:id", auth, requireRole("client", "admin"), deleteJob);
router.put(
  "/:id/assign",
  auth,
  requireRole("client", "admin"),
  assignFreelancer
);

export default router;
