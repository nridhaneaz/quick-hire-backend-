import express from 'express';
import authRoutes from '../../entities/auth/auth.routes.js';
import userRoutes from '../../entities/user/user.routes.js';
import jobRoutes from "../../entities/job/job.routes.js";
import categoryRoutes from "../../entities/category/category.routes.js";
import applicationRoutes from "../../entities/application/application.routes.js";
import broadcastRoutes from '../../entities/broadcast/broadcast.routes.js';
const router = express.Router();


router.use('/v1/auth', authRoutes);
router.use('/v1/user', userRoutes);
router.use("/v1/jobs", jobRoutes);
router.use("/v1/categories", categoryRoutes);
router.use("/v1/applications", applicationRoutes);
router.use('/v1/broadcast', broadcastRoutes);
export default router;
