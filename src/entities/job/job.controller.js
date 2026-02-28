import { generateResponse } from "../../lib/responseFormate.js";
import { cloudinaryUpload } from "../../lib/cloudinaryUpload.js";
import { createJob, getAllJobs, getJobById, updateJob, archiveJob } from "./job.service.js";

const normalizeArrayField = (value) => {
  if (value === undefined || value === null) return undefined;
  if (Array.isArray(value)) return value.filter(Boolean);

  if (typeof value === "string") {
    const t = value.trim();
    if (!t) return [];
    if (t.startsWith("[") && t.endsWith("]")) {
      try {
        const parsed = JSON.parse(t);
        return Array.isArray(parsed) ? parsed.filter(Boolean) : [t];
      } catch {
        return [t];
      }
    }
    return [t];
  }
  return undefined;
};

export const createJobController = async (req, res) => {
  try {
    const userId = req.user?._id || null;

    const tags = normalizeArrayField(req.body.tags) ?? [];
    const responsibilities = normalizeArrayField(req.body.responsibilities) ?? [];
    const requirements = normalizeArrayField(req.body.requirements) ?? [];

    let companyLogoUrl = req.body.companyLogo || "";
    if (req.file) {
      const uploaded = await cloudinaryUpload(req.file.path, undefined, "jobs");
      companyLogoUrl = uploaded?.secure_url || "";
    }

    const payload = {
      ...req.body,
      tags,
      responsibilities,
      requirements,
      companyLogo: companyLogoUrl,
    };

    const job = await createJob(payload, userId);
    generateResponse(res, 201, true, "Job created successfully", job);
  } catch (error) {
    generateResponse(res, 500, false, "Failed to create job", null);
  }
};

export const getAllJobsController = async (req, res) => {
  try {
    const { page, limit, search, location, jobType, tag, category, status, includeArchived } =
      req.query;

    const { jobs, paginationInfo } = await getAllJobs({
      page,
      limit,
      search,
      location,
      jobType,
      tag,
      category,
      status,
      includeArchived: includeArchived === "true",
    });

    generateResponse(res, 200, true, "Jobs fetched successfully", { jobs, paginationInfo });
  } catch (error) {
    generateResponse(res, 500, false, "Failed to fetch jobs", null);
  }
};

export const getJobByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await getJobById(id);

    if (!job) return generateResponse(res, 404, false, "Job not found", null);

    generateResponse(res, 200, true, "Job fetched successfully", job);
  } catch (error) {
    generateResponse(res, 500, false, "Failed to fetch job", null);
  }
};

export const updateJobController = async (req, res) => {
  try {
    const { id } = req.params;

    const payload = { ...req.body };

    if (req.body.tags !== undefined) payload.tags = normalizeArrayField(req.body.tags) ?? [];
    if (req.body.responsibilities !== undefined)
      payload.responsibilities = normalizeArrayField(req.body.responsibilities) ?? [];
    if (req.body.requirements !== undefined)
      payload.requirements = normalizeArrayField(req.body.requirements) ?? [];

    if (req.file) {
      const uploaded = await cloudinaryUpload(req.file.path, undefined, "jobs");
      payload.companyLogo = uploaded?.secure_url || "";
    }

    const updated = await updateJob({ id, ...payload });
    if (!updated) return generateResponse(res, 404, false, "Job not found", null);

    generateResponse(res, 200, true, "Job updated successfully", updated);
  } catch (error) {
    generateResponse(res, 500, false, "Failed to update job", null);
  }
};

export const deleteJobController = async (req, res) => {
  try {
    const { id } = req.params;

    const archived = await archiveJob(id);
    if (!archived) return generateResponse(res, 404, false, "Job not found", null);

    generateResponse(res, 200, true, "Job archived successfully", archived);
  } catch (error) {
    generateResponse(res, 500, false, "Failed to delete job", null);
  }
};