import { Router } from "express";
import {
  listPublicExperiences,
  listAllExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../controllers/experience.controller";
import { requireAdmin } from "../middleware/auth";

const publicRouter = Router();
publicRouter.get("/", listPublicExperiences);

const adminRouter = Router();
adminRouter.use(requireAdmin);
adminRouter.get("/", listAllExperiences);
adminRouter.post("/", createExperience);
adminRouter.put("/:id", updateExperience);
adminRouter.delete("/:id", deleteExperience);

export { publicRouter as publicExperienceRouter, adminRouter as adminExperienceRouter };
