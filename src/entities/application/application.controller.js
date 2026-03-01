import { generateResponse } from "../../lib/responseFormate.js";
import {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  updateApplication,
  deleteApplication,
  getApplicationsByEmail,
} from "./application.service.js";

export const getMyApplicationsController = async (req, res) => {
  try {
    const email = req.user.email;
    const { page, limit } = req.query;
    const { applications, paginationInfo } = await getApplicationsByEmail({ email, page, limit });
    generateResponse(res, 200, true, 'Your applications fetched successfully', { applications, paginationInfo });
  } catch (error) {
    generateResponse(res, 500, false, 'Failed to fetch your applications', null);
  }
};

export const applyForJobController = async (req, res) => {
  try {
    const application = await createApplication(req.body);

    generateResponse(
      res,
      201,
      true,
      "Application submitted successfully",
      application
    );
  } catch (error) {
    generateResponse(res, 500, false, "Failed to submit application", null);
  }
};

export const getAllApplicationsController = async (req, res) => {
  try {
    const { page, limit, job } = req.query;

    const { applications, paginationInfo } = await getAllApplications({
      page,
      limit,
      job,
    });

    generateResponse(res, 200, true, "Applications fetched successfully", {
      applications,
      paginationInfo,
    });
  } catch (error) {
    generateResponse(res, 500, false, "Failed to fetch applications", null);
  }
};

export const getApplicationByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await getApplicationById(id);

    if (!application)
      return generateResponse(res, 404, false, "Application not found", null);

    generateResponse(res, 200, true, "Application fetched successfully", application);
  } catch (error) {
    generateResponse(res, 500, false, "Failed to fetch application", null);
  }
};

export const updateApplicationStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const allowedFields = ["job", "fullName", "email", "resumeLink", "coverNote", "status"];
    const updatePayload = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updatePayload[field] = req.body[field];
    });

    const updated = await updateApplication({ id, update: updatePayload });

    if (!updated)
      return generateResponse(res, 404, false, "Application not found", null);

    generateResponse(res, 200, true, "Application updated successfully", updated);
  } catch (error) {
    generateResponse(res, 500, false, "Failed to update application", null);
  }
};

export const deleteApplicationController = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await deleteApplication(id);

    if (!deleted)
      return generateResponse(res, 404, false, "Application not found", null);

    generateResponse(res, 200, true, "Application deleted successfully", deleted);
  } catch (error) {
    generateResponse(res, 500, false, "Failed to delete application", null);
  }
};
