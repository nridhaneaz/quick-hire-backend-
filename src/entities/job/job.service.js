import Job from "./job.model.js";
import { createPaginationInfo } from "../../lib/pagination.js";

export const createJob = async (payload, userId = null) => {
  return await Job.create({ ...payload, createdBy: userId });
};

export const getAllJobs = async ({
  page = 1,
  limit = 10,
  search,
  location,
  jobType,
  tag,
  category,
  status,
  includeArchived,
} = {}) => {
  const _page = Number(page) || 1;
  const _limit = Number(limit) || 10;
  const skip = (_page - 1) * _limit;

  const filter = {};

  if (!includeArchived && !status) filter.status = "ACTIVE";
  if (status) filter.status = status;

  if (location) filter.location = { $regex: location, $options: "i" };
  if (jobType) filter.jobType = { $regex: jobType, $options: "i" };
  if (tag) filter.tags = { $in: [tag] };
  if (category) filter.category = category;

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
    ];
  }

  const totalData = await Job.countDocuments(filter);

  const jobs = await Job.find(filter)
    .populate("category", "name image")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(_limit);

  const paginationInfo = createPaginationInfo(_page, _limit, totalData);
  return { jobs, paginationInfo };
};

export const getJobById = async (id) => {
  return await Job.findById(id).populate("category", "name image");
};

export const updateJob = async ({ id, ...payload }) => {
  return await Job.findByIdAndUpdate(id, payload, { new: true }).populate(
    "category",
    "name image"
  );
};

export const archiveJob = async (id) => {
  return await Job.findByIdAndUpdate(id, { status: "ARCHIVED" }, { new: true }).populate(
    "category",
    "name image"
  );
};