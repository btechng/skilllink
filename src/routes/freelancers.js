// backend/routes/freelancers.js
import { Router } from "express";
import User from "../models/User.js";

const router = Router();

// GET all freelancers (for homepage)
router.get("/", async (req, res) => {
  try {
    const freelancers = await User.find({ role: "freelancer" }).select(
      "name title profileImage skills"
    ); // only needed fields
    res.json(freelancers);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET single freelancer by ID
router.get("/:id", async (req, res) => {
  try {
    const freelancer = await User.findById(req.params.id).select(
      "-password" // exclude password
    );
    if (!freelancer)
      return res.status(404).json({ message: "Freelancer not found" });
    res.json(freelancer);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
