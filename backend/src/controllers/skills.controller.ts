import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../db/prisma";
import { ApiError } from "../middleware/errorHandler";
import { AuthedRequest } from "../middleware/auth";

const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required."),
  category: z.string().min(1, "Category is required."),
  color: z.string().min(1, "Color is required."),
  order: z.number().int().default(0),
});

// GET /api/skills (Public)
export async function listPublicSkills(_req: Request, res: Response) {
  const skills = await prisma.skill.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
  res.json({ skills });
}

// GET /api/admin/skills (Admin)
export async function listAllSkills(_req: AuthedRequest, res: Response) {
  const skills = await prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });
  res.json({ skills });
}

// POST /api/admin/skills
export async function createSkill(req: AuthedRequest, res: Response) {
  const data = skillSchema.parse(req.body);
  const skill = await prisma.skill.create({ data });
  res.status(201).json({ skill });
}

// PUT /api/admin/skills/:id
export async function updateSkill(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  const data = skillSchema.partial().parse(req.body);

  const existing = await prisma.skill.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Skill not found.");

  const skill = await prisma.skill.update({
    where: { id },
    data,
  });
  res.json({ skill });
}

// DELETE /api/admin/skills/:id
export async function deleteSkill(req: AuthedRequest, res: Response) {
  const { id } = req.params;

  const existing = await prisma.skill.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Skill not found.");

  await prisma.skill.delete({ where: { id } });
  res.json({ success: true });
}
