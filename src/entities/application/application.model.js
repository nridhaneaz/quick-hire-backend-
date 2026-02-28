import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    resumeLink: { type: String, required: true },
    coverNote: { type: String, required: true },

    status: {
      type: String,
      enum: ["PENDING", "REVIEWED", "ACCEPTED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

const Application =
  mongoose.models.Application ||
  mongoose.model("Application", ApplicationSchema);

export default Application;