import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { publicProjectsRouter, adminProjectsRouter } from "./routes/projects.routes";
import { publicContactRouter, adminMessagesRouter } from "./routes/contact.routes";
import { publicExperienceRouter, adminExperienceRouter } from "./routes/experience.routes";
import { publicSkillsRouter, adminSkillsRouter } from "./routes/skills.routes";
import authRouter from "./routes/auth.routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.frontendUrl,
      credentials: true,
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());

  app.get("/health", (_req, res) => res.json({ status: "ok", uptime: process.uptime() }));

  // Public API
  app.use("/api/projects", publicProjectsRouter);
  app.use("/api/contact", publicContactRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/experiences", publicExperienceRouter);
  app.use("/api/skills", publicSkillsRouter);

  // Admin API (protected inside each router via requireAdmin)
  app.use("/api/admin/projects", adminProjectsRouter);
  app.use("/api/admin/messages", adminMessagesRouter);
  app.use("/api/admin/experiences", adminExperienceRouter);
  app.use("/api/admin/skills", adminSkillsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
