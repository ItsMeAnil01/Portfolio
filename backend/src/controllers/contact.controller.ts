import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../db/prisma";
import { sendContactNotification } from "../utils/mailer";
import { AuthedRequest } from "../middleware/auth";
import { ApiError } from "../middleware/errorHandler";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required.").max(120),
  email: z.string().email("Enter a valid email address."),
  subject: z.string().max(200).optional(),
  body: z.string().min(10, "Message should be at least 10 characters.").max(5000),
  // simple honeypot field — bots fill it, humans never see it
  company: z.string().max(0).optional(),
});

// POST /api/contact — public
export async function submitContact(req: Request, res: Response) {
  const data = contactSchema.parse(req.body);

  const message = await prisma.message.create({
    data: {
      name: data.name,
      email: data.email,
      subject: data.subject,
      body: data.body,
    },
  });

  // Don't let a mail failure fail the request — the message is already saved.
  try {
    await sendContactNotification(data);
  } catch (err) {
    console.error("Failed to send contact notification email:", err);
  }

  res.status(201).json({ success: true, id: message.id });
}

// GET /api/admin/messages — admin only
export async function listMessages(_req: AuthedRequest, res: Response) {
  const messages = await prisma.message.findMany({ orderBy: { createdAt: "desc" } });
  res.json({ messages });
}

// PATCH /api/admin/messages/:id/read — admin only
export async function markMessageRead(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  const existing = await prisma.message.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Message not found.");

  const message = await prisma.message.update({ where: { id }, data: { read: true } });
  res.json({ message });
}
