import express from "express";
import {
  applyForJobController,
  getAllApplicationsController,
  getApplicationByIdController,
  updateApplicationStatusController,
  deleteApplicationController,
  getMyApplicationsController,
} from "./application.controller.js";

import { verifyToken, adminMiddleware } from "../../core/middlewares/authMiddleware.js";

const router = express.Router();

// Public: Apply — receives JSON body, parsed by global express.json()
router.post("/", verifyToken, applyForJobController);

// User: view own applications (must be before /:id)
router.get("/my-applications", verifyToken, getMyApplicationsController);

// Admin
router.get("/", verifyToken, adminMiddleware, getAllApplicationsController);
router.get("/:id", verifyToken, adminMiddleware, getApplicationByIdController);
router.put("/:id", verifyToken, adminMiddleware, updateApplicationStatusController);
router.delete("/:id", verifyToken, adminMiddleware, deleteApplicationController);

export default router;
