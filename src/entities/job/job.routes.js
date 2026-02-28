import express from "express";
import {
  createJobController,
  getAllJobsController,
  getJobByIdController,
  updateJobController,
  deleteJobController,
} from "./job.controller.js";

import { verifyToken, adminMiddleware } from "../../core/middlewares/authMiddleware.js";
import { upload } from "../../core/middlewares/multer.js";

const router = express.Router();

// public
router.get("/", getAllJobsController);
router.get("/:id", getJobByIdController);

// admin + multipart
router.post("/", verifyToken, adminMiddleware, upload.single("companyLogo"), createJobController);
router.put("/:id", verifyToken, adminMiddleware, upload.single("companyLogo"), updateJobController);
router.delete("/:id", verifyToken, adminMiddleware, deleteJobController);

export default router;