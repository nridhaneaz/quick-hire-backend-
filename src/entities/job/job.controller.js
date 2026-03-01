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

    // Parse salary if sent as JSON string (from FormData)
    let salary = req.body.salary;
    if (typeof salary === 'string') {
      try { salary = JSON.parse(salary); } catch (_) { salary = undefined; }
    }

    const payload = {
      ...req.body,
      tags,
      responsibilities,
      requirements,
      companyLogo: companyLogoUrl,
      ...(salary !== undefined && { salary }),
    };

    const job = await createJob(payload, userId);
    generateResponse(res, 201, true, "Job created successfully", job);
  } catch (error) {
    console.error("Create job error:", error);
    
    // Handle validation errors specifically
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message).join(', ');
      return generateResponse(res, 400, false, `Validation error: ${messages}`, null);
    }
    
    // Handle cast errors (invalid ObjectId)
    if (error.name === 'CastError') {
      return generateResponse(res, 400, false, `Invalid ${error.path}: ${error.value}`, null);
    }
    
    generateResponse(res, 500, false, error.message || "Failed to create job", null);
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
    console.error("Get all jobs error:", error);
    generateResponse(res, 500, false, error.message || "Failed to fetch jobs", null);
  }
};

export const getJobByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await getJobById(id);

    if (!job) return generateResponse(res, 404, false, "Job not found", null);

    generateResponse(res, 200, true, "Job fetched successfully", job);
  } catch (error) {
    console.error("Get job by ID error:", error);
    generateResponse(res, 500, false, error.message || "Failed to fetch job", null);
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

    // Parse salary if sent as JSON string (from FormData)
    if (payload.salary !== undefined && typeof payload.salary === 'string') {
      try { payload.salary = JSON.parse(payload.salary); } catch (_) { delete payload.salary; }
    }

    if (req.file) {
      const uploaded = await cloudinaryUpload(req.file.path, undefined, "jobs");
      payload.companyLogo = uploaded?.secure_url || "";
    }

    const updated = await updateJob({ id, ...payload });
    if (!updated) return generateResponse(res, 404, false, "Job not found", null);

    generateResponse(res, 200, true, "Job updated successfully", updated);
  } catch (error) {
    console.error("Update job error:", error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message).join(', ');
      return generateResponse(res, 400, false, `Validation error: ${messages}`, null);
    }
    if (error.name === 'CastError') {
      return generateResponse(res, 400, false, `Invalid ${error.path}: ${error.value}`, null);
    }
    generateResponse(res, 500, false, error.message || "Failed to update job", null);
  }
};

export const deleteJobController = async (req, res) => {
  try {
    const { id } = req.params;

    const archived = await archiveJob(id);
    if (!archived) return generateResponse(res, 404, false, "Job not found", null);

    generateResponse(res, 200, true, "Job archived successfully", archived);
  } catch (error) {
    console.error("Delete job error:", error);
    generateResponse(res, 500, false, error.message || "Failed to delete job", null);
  }
};