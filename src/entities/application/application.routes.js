import express from "express";
import {
  applyForJobController,
  getAllApplicationsController,
  getApplicationByIdController,
  updateApplicationStatusController,
  deleteApplicationController,
} from "./application.controller.js";

import { verifyToken, adminMiddleware } from "../../core/middlewares/authMiddleware.js";
import upload from "../../core/middlewares/multer.js";

const router = express.Router();

// Public: Apply
// Use multer's `none` to parse multipart/form-data when no file is uploaded.
router.post("/", upload.none(), applyForJobController);

// Admin
router.get("/", verifyToken, adminMiddleware, getAllApplicationsController);
router.get("/:id", verifyToken, adminMiddleware, getApplicationByIdController);
router.put("/:id", verifyToken, adminMiddleware, upload.none(), updateApplicationStatusController);
router.delete("/:id", verifyToken, adminMiddleware, deleteApplicationController);

export default router;
