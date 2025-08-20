import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional until assigned
    title: { type: String, required: true },
    description: { type: String },
    budget: { type: Number, required: true },
    category: { type: String },
    status: {
      type: String,
      enum: ["open", "in_progress", "completed", "cancelled"],
      default: "open",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", JobSchema);
