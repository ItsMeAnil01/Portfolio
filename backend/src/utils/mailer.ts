import nodemailer from "nodemailer";
import { env } from "../config/env";

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: env.smtp.port === 465,
  auth: env.smtp.user
    ? {
        user: env.smtp.user,
        pass: env.smtp.pass,
      }
    : undefined,
});

export async function sendContactNotification(params: {
  name: string;
  email: string;
  subject?: string;
  body: string;
}): Promise<void> {
  if (!env.smtp.host || !env.smtp.user) {
    // Mail isn't configured; message is still saved to the DB by the caller.
    console.warn("SMTP not configured — skipping email notification.");
    return;
  }

  await transporter.sendMail({
    from: `"Portfolio Contact Form" <${env.smtp.user}>`,
    to: env.smtp.receiver,
    replyTo: params.email,
    subject: `[Portfolio] ${params.subject || "New message"} — from ${params.name}`,
    text: `From: ${params.name} <${params.email}>\n\n${params.body}`,
    html: `
      <p><strong>From:</strong> ${escapeHtml(params.name)} (${escapeHtml(params.email)})</p>
      <p><strong>Subject:</strong> ${escapeHtml(params.subject || "N/A")}</p>
      <p>${escapeHtml(params.body).replace(/\n/g, "<br/>")}</p>
    `,
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
