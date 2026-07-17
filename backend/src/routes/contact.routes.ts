import { Router } from "express";
import rateLimit from "express-rate-limit";
import { submitContact, listMessages, markMessageRead } from "../controllers/contact.controller";
import { requireAdmin } from "../middleware/auth";

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  message: { error: "Too many messages sent. Please try again later." },
});

const publicRouter = Router();
publicRouter.post("/", contactLimiter, submitContact);

const adminRouter = Router();
adminRouter.use(requireAdmin);
adminRouter.get("/", listMessages);
adminRouter.patch("/:id/read", markMessageRead);

export { publicRouter as publicContactRouter, adminRouter as adminMessagesRouter };
