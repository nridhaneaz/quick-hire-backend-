import { generateResponse } from "../../lib/responseFormate.js";
import { cloudinaryUpload } from "../../lib/cloudinaryUpload.js";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "./category.service.js";

export const createCategoryController = async (req, res) => {
  try {
    const userId = req.user?._id || null;

    let imageUrl = req.body.image || "";
    if (req.file) {
      const uploaded = await cloudinaryUpload(req.file.path, undefined, "categories");
      imageUrl = uploaded?.secure_url || "";
    }

    const payload = { ...req.body, image: imageUrl };
    const category = await createCategory(payload, userId);

    generateResponse(res, 201, true, "Category created successfully", category);
  } catch (error) {
    console.error("Create category error:", error);
    generateResponse(res, 500, false, "Failed to create category", null);
  }
};

export const getAllCategoriesController = async (req, res) => {
  try {
    const { page, limit, search } = req.query;

    // ✅ this already returns jobsAvailable per category
    const { categories, paginationInfo } = await getAllCategories({
      page,
      limit,
      search,
    });

    generateResponse(res, 200, true, "Categories fetched successfully", {
      categories,
      paginationInfo,
    });
  } catch (error) {
    generateResponse(res, 500, false, "Failed to fetch categories", null);
  }
};

export const getCategoryByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await getCategoryById(id);

    if (!category) return generateResponse(res, 404, false, "Category not found", null);

    generateResponse(res, 200, true, "Category fetched successfully", category);
  } catch (error) {
    generateResponse(res, 500, false, "Failed to fetch category", null);
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };

    // normalize boolean flag coming from form-data
    if (typeof payload.isActive === "string") {
      payload.isActive = payload.isActive === "true";
    }

    if (req.file) {
      const uploaded = await cloudinaryUpload(req.file.path, undefined, "categories");
      payload.image = uploaded?.secure_url || "";
    }

    const updated = await updateCategory({ id, ...payload });
    if (!updated) return generateResponse(res, 404, false, "Category not found", null);

    generateResponse(res, 200, true, "Category updated successfully", updated);
  } catch (error) {
    console.error("Update category error:", error);
    generateResponse(res, 500, false, "Failed to update category", null);
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await deleteCategory(id);
    if (!deleted) return generateResponse(res, 404, false, "Category not found", null);

    generateResponse(res, 200, true, "Category deleted successfully", deleted);
  } catch (error) {
    // Return 400 for business-rule errors (jobs still linked), 500 for unexpected
    const status = error.message.startsWith('Cannot delete') ? 400 : 500;
    generateResponse(res, status, false, error.message || "Failed to delete category", null);
  }
};
