import express from "express";
import {
  createCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController,
} from "./category.controller.js";

import { verifyToken, adminMiddleware } from "../../core/middlewares/authMiddleware.js";
import { upload } from "../../core/middlewares/multer.js";

const router = express.Router();

// public
router.get("/", getAllCategoriesController);
router.get("/:id", getCategoryByIdController);

// admin + multipart
router.post("/", verifyToken, adminMiddleware, upload.single("image"), createCategoryController);
router.put("/:id", verifyToken, adminMiddleware, upload.single("image"), updateCategoryController);
router.delete("/:id", verifyToken, adminMiddleware, deleteCategoryController);

export default router;