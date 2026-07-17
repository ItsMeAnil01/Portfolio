import { Router } from "express";
import {
  listPublicProjects,
  listAllProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projects.controller";
import { requireAdmin } from "../middleware/auth";

const publicRouter = Router();
publicRouter.get("/", listPublicProjects);

const adminRouter = Router();
adminRouter.use(requireAdmin);
adminRouter.get("/", listAllProjects);
adminRouter.post("/", createProject);
adminRouter.put("/:id", updateProject);
adminRouter.delete("/:id", deleteProject);

export { publicRouter as publicProjectsRouter, adminRouter as adminProjectsRouter };
