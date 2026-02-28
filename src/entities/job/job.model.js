import mongoose from "mongoose";

const SalarySchema = new mongoose.Schema(
  {
    min: { type: Number, default: null },
    max: { type: Number, default: null },
    currency: { type: String, default: "USD" },
  },
  { _id: false }
);

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    companyLogo: { type: String, default: "" },
    location: { type: String, default: "" },
    jobType: { type: String, default: "Full Time" },
    tags: { type: [String], default: [] },

    salary: { type: SalarySchema, default: () => ({}) },

    about: { type: String, default: "" },
    responsibilities: { type: [String], default: [] },
    requirements: { type: [String], default: [] },

    isAvailable: { type: Boolean, default: true },

    status: {
      type: String,
      enum: ["ACTIVE", "ARCHIVED"],
      default: "ACTIVE",
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

const Job = mongoose.models.Job || mongoose.model("Job", JobSchema);
export default Job;