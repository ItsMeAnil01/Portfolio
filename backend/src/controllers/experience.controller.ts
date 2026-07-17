import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../db/prisma";
import { ApiError } from "../middleware/errorHandler";
import { AuthedRequest } from "../middleware/auth";

const experienceSchema = z.object({
  company: z.string().min(1, "Company is required."),
  role: z.string().min(1, "Role is required."),
  location: z.string().optional().nullable(),
  startDate: z.string().min(1, "Start date is required."),
  endDate: z.string().min(1, "End date is required."),
  description: z.string().min(1, "Description is required."),
  order: z.number().int().default(0),
});

// GET /api/experiences (Public)
export async function listPublicExperiences(_req: Request, res: Response) {
  const experiences = await prisma.experience.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  res.json({ experiences });
}

// GET /api/admin/experiences (Admin)
export async function listAllExperiences(_req: AuthedRequest, res: Response) {
  const experiences = await prisma.experience.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  res.json({ experiences });
}

// POST /api/admin/experiences
export async function createExperience(req: AuthedRequest, res: Response) {
  const data = experienceSchema.parse(req.body);
  const experience = await prisma.experience.create({ data });
  res.status(201).json({ experience });
}

// PUT /api/admin/experiences/:id
export async function updateExperience(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  const data = experienceSchema.partial().parse(req.body);

  const existing = await prisma.experience.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Experience record not found.");

  const experience = await prisma.experience.update({
    where: { id },
    data,
  });
  res.json({ experience });
}

// DELETE /api/admin/experiences/:id
export async function deleteExperience(req: AuthedRequest, res: Response) {
  const { id } = req.params;

  const existing = await prisma.experience.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Experience record not found.");

  await prisma.experience.delete({ where: { id } });
  res.json({ success: true });
}
