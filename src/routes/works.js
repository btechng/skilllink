import { Router } from "express";
import { auth } from "../middleware/auth.js";
import {
  createWork,
  myWorks,
  allWorks,
} from "../controllers/workController.js";

const router = Router();

router.post("/", auth, createWork); // create a work (mediaUrl from Cloudinary client upload)
router.get("/me", auth, myWorks); // current user's works
router.get("/", allWorks); // public gallery (optional filter by ?userId=)

export default router;
