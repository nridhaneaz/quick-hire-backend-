import Category from "./category.model.js";
import Job from "../job/job.model.js";
import { createPaginationInfo } from "../../lib/pagination.js";

export const createCategory = async (payload, userId = null) => {
  return await Category.create({ ...payload, createdBy: userId });
};

// ✅ One endpoint logic: categories + jobsAvailable
export const getAllCategories = async ({ page = 1, limit = 10, search } = {}) => {
  const _page = Number(page) || 1;
  const _limit = Number(limit) || 10;
  const skip = (_page - 1) * _limit;

  const filter = {};
  if (search) filter.name = { $regex: search, $options: "i" };

  const totalData = await Category.countDocuments(filter);

  const categories = await Category.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(_limit);

  // ✅ Count ACTIVE jobs per category
  const jobCounts = await Job.aggregate([
    { $match: { status: "ACTIVE" } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);

  const countMap = new Map(jobCounts.map((j) => [String(j._id), j.count]));

  const categoriesWithCounts = categories.map((c) => ({
    _id: c._id,
    name: c.name,
    image: c.image,
    isActive: c.isActive,
    jobsAvailable: countMap.get(String(c._id)) || 0,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  }));

  const paginationInfo = createPaginationInfo(_page, _limit, totalData);

  return { categories: categoriesWithCounts, paginationInfo };
};

export const getCategoryById = async (id) => {
  return await Category.findById(id);
};

export const updateCategory = async ({ id, ...payload }) => {
  return await Category.findByIdAndUpdate(id, payload, { new: true });
};

export const deleteCategory = async (id) => {
  // Prevent deletion if any jobs (active or not) reference this category
  const jobCount = await Job.countDocuments({ category: id });
  if (jobCount > 0) {
    throw new Error(`Cannot delete: ${jobCount} job(s) are linked to this category. Remove or reassign them first.`);
  }
  return await Category.findByIdAndDelete(id);
};