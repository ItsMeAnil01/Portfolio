import { Router } from "express";
import {
  listPublicSkills,
  listAllSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../controllers/skills.controller";
import { requireAdmin } from "../middleware/auth";

const publicRouter = Router();
publicRouter.get("/", listPublicSkills);

const adminRouter = Router();
adminRouter.use(requireAdmin);
adminRouter.get("/", listAllSkills);
adminRouter.post("/", createSkill);
adminRouter.put("/:id", updateSkill);
adminRouter.delete("/:id", deleteSkill);

export { publicRouter as publicSkillsRouter, adminRouter as adminSkillsRouter };
