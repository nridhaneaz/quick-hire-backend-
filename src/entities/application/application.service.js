import Application from "./application.model.js";
import { createPaginationInfo } from "../../lib/pagination.js";

export const createApplication = async (payload) => {
  return await Application.create(payload);
};

export const getAllApplications = async ({ page = 1, limit = 10, job }) => {
  const _page = Number(page) || 1;
  const _limit = Number(limit) || 10;
  const skip = (_page - 1) * _limit;

  const filter = {};
  if (job) filter.job = job;

  const totalData = await Application.countDocuments(filter);

  const applications = await Application.find(filter)
    .populate("job", "title company")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(_limit);

  const paginationInfo = createPaginationInfo(_page, _limit, totalData);

  return { applications, paginationInfo };
};

export const getApplicationById = async (id) => {
  return await Application.findById(id).populate("job", "title company");
};

export const updateApplicationStatus = async ({ id, status }) => {
  return await Application.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
};

export const updateApplication = async ({ id, update }) => {
  return await Application.findByIdAndUpdate(id, update, { new: true });
};

export const deleteApplication = async (id) => {
  return await Application.findByIdAndDelete(id);
};

export const getApplicationsByEmail = async ({ email, page = 1, limit = 20 }) => {
  const _page = Number(page) || 1;
  const _limit = Number(limit) || 20;
  const skip = (_page - 1) * _limit;

  const totalData = await Application.countDocuments({ email });
  const applications = await Application.find({ email })
    .populate('job', 'title company location jobType companyLogo')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(_limit);

  const paginationInfo = { page: _page, limit: _limit, total: totalData };
  return { applications, paginationInfo };
};
