import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../db/prisma";
import { signAdminToken } from "../utils/jwt";
import { env } from "../config/env";
import { AuthedRequest } from "../middleware/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function login(req: Request, res: Response) {
  const { email, password } = loginSchema.parse(req.body);

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const token = signAdminToken({ adminId: admin.id, email: admin.email });

  res.cookie("token", token, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: env.isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ token, admin: { id: admin.id, email: admin.email } });
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie("token");
  res.json({ success: true });
}

export async function me(req: AuthedRequest, res: Response) {
  res.json({ admin: req.admin });
}
