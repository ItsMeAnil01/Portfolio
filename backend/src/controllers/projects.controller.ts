import { Response } from "express";
import { z } from "zod";
import { prisma } from "../db/prisma";
import { ApiError } from "../middleware/errorHandler";
import { AuthedRequest } from "../middleware/auth";
import { Request } from "express";

const projectInputSchema = z.object({
  title: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only."),
  tagline: z.string().min(1),
  description: z.string().min(1),
  techStack: z.array(z.string()).default([]),
  category: z.string().min(1),
  githubUrl: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
  imageUrl: z.string().url().optional().or(z.literal("")),
  stats: z.record(z.union([z.string(), z.number()])).optional(),
  featured: z.boolean().optional(),
  order: z.number().optional(),
  published: z.boolean().optional(),
});

// GET /api/projects — public, published only
export async function listPublicProjects(_req: Request, res: Response) {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
  });
  res.json({ projects });
}

// GET /api/admin/projects — admin, all projects
export async function listAllProjects(_req: AuthedRequest, res: Response) {
  const projects = await prisma.project.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  res.json({ projects });
}

// POST /api/admin/projects
export async function createProject(req: AuthedRequest, res: Response) {
  const data = projectInputSchema.parse(req.body);
  const project = await prisma.project.create({ data });
  res.status(201).json({ project });
}

// PUT /api/admin/projects/:id
export async function updateProject(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  const data = projectInputSchema.partial().parse(req.body);

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Project not found.");

  const project = await prisma.project.update({ where: { id }, data });
  res.json({ project });
}

// DELETE /api/admin/projects/:id
export async function deleteProject(req: AuthedRequest, res: Response) {
  const { id } = req.params;

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Project not found.");

  await prisma.project.delete({ where: { id } });
  res.json({ success: true });
}
