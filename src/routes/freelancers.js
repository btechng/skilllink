import { Router } from "express";
import User from "../models/User.js";

const router = Router();

// GET all freelancers (with optional skill filtering)
router.get("/", async (req, res) => {
  try {
    const { skill } = req.query;

    let query = { role: "freelancer" };

    if (skill) {
      // Split skills by comma, trim spaces, and build regex array
      const skillsArray = skill
        .split(",")
        .map((s) => new RegExp(s.trim(), "i"));

      // Match any freelancer whose skills contain at least one of the requested skills
      query.skills = { $in: skillsArray };
    }

    const freelancers = await User.find(query).select(
      "name title profileImage skills"
    );
    res.json(freelancers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// GET single freelancer by ID
router.get("/:id", async (req, res) => {
  try {
    const freelancer = await User.findById(req.params.id).select("-password");
    if (!freelancer)
      return res.status(404).json({ message: "Freelancer not found" });
    res.json(freelancer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
