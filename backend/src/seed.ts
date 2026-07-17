import bcrypt from "bcryptjs";
import { prisma } from "./db/prisma";
import { env } from "./config/env";

async function main() {
  // 0. Clear dynamic data (but keep admins to avoid breaking active sessions)
  await prisma.project.deleteMany({});
  await prisma.experience.deleteMany({});
  await prisma.skill.deleteMany({});
  console.log("Cleared existing projects, experiences, and skills.");

  // 1. Bootstrap the admin login used by /admin/login
  if (env.admin.email && env.admin.password) {
    const passwordHash = await bcrypt.hash(env.admin.password, 12);
    await prisma.admin.upsert({
      where: { email: env.admin.email },
      update: { passwordHash },
      create: { email: env.admin.email, passwordHash },
    });
    console.log(`Admin account ready: ${env.admin.email}`);
  } else {
    console.warn("ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin bootstrap.");
  }

  // 2. Seed starter projects
  const projects = [
    {
      title: "Formify.ai",
      slug: "formify-ai",
      tagline: "White-label multi-tenant SaaS form, quiz & exam builder",
      description:
        "A MERN-stack smart form builder built toward a white-label SaaS product — subdomain-based tenant routing, per-org branding, plan-gated features, and Razorpay-powered subscriptions. Includes a multi-provider AI abstraction layer (Anthropic + Gemini) for AI-assisted form generation.",
      techStack: ["MongoDB", "Express", "React", "Node.js", "Razorpay", "Docker"],
      category: "Full-Stack SaaS",
      githubUrl: "https://github.com/ItsMeAnil01/formify-ai",
      liveUrl: "",
      imageUrl: "",
      stats: { status: "In active development" },
      featured: true,
      order: 1,
      published: true,
    },
    {
      title: "SecureChat",
      slug: "securechat",
      tagline: "End-to-end encrypted real-time messaging platform",
      description:
        "A real-time chat platform built with Next.js and Socket.io, using MongoDB for persistence and JWT for auth. Focused on a clean design system, robust form validation, and a secure backend built incrementally from the ground up.",
      techStack: ["Next.js", "TypeScript", "MongoDB", "Socket.io", "JWT"],
      category: "Full-Stack",
      githubUrl: "",
      liveUrl: "",
      imageUrl: "",
      stats: {},
      featured: true,
      order: 2,
      published: true,
    },
    {
      title: "ResumeAI",
      slug: "resumeai",
      tagline: "AI-powered resume builder for job-seeking engineers",
      description:
        "A full-stack resume builder targeting freshers and recent grads in the Indian engineering market. Generates LaTeX resumes across multiple templates, scores resumes against job descriptions via keyword matching, and writes tailored cover letters using the Claude API.",
      techStack: ["React", "Vite", "Node.js", "Express", "LaTeX", "Claude API"],
      category: "Full-Stack / AI",
      githubUrl: "",
      liveUrl: "",
      imageUrl: "",
      stats: {},
      featured: true,
      order: 3,
      published: true,
    },
  ];

  for (const project of projects) {
    await prisma.project.create({ data: project });
  }
  console.log(`Seeded ${projects.length} projects.`);

  // 3. Seed starter experiences
  const experiences = [
    {
      company: "Freelance",
      role: "Full-Stack Developer",
      location: "Remote",
      startDate: "Jan 2024",
      endDate: "Present",
      description: "• Architected and shipped production-grade MERN and Next.js applications for clients.\n• Integrated payment gateways including Razorpay and Stripe with webhook handling.\n• Containerized microservices with Docker and deployed them to AWS EC2 instances.",
      order: 1,
    },
    {
      company: "Chitkara University",
      role: "CSE Undergraduate Student",
      location: "Himachal Pradesh, India",
      startDate: "Aug 2023",
      endDate: "Present",
      description: "• Maintaining a strong academic foundation in Computer Science Engineering.\n• Deepening knowledge in Core CS: Data Structures & Algorithms, Operating Systems, Computer Networks, and DBMS.\n• Active builder of utility projects and campus coding communities.",
      order: 2,
    }
  ];

  for (const exp of experiences) {
    await prisma.experience.create({ data: exp });
  }
  console.log(`Seeded ${experiences.length} work experiences.`);

  // 4. Seed user's complete skills
  const skills = [
    // Programming Languages
    { name: "JavaScript", category: "Programming Languages", color: "#F7DF1E", order: 1 },
    { name: "TypeScript", category: "Programming Languages", color: "#3178C6", order: 2 },
    { name: "Python", category: "Programming Languages", color: "#3572A5", order: 3 },
    { name: "Java", category: "Programming Languages", color: "#ED8B00", order: 4 },
    { name: "C++", category: "Programming Languages", color: "#F34B7D", order: 5 },
    { name: "C", category: "Programming Languages", color: "#A8B9CC", order: 6 },
    // Core CS
    { name: "Data Structures & Algorithms", category: "Core CS", color: "#00D9A3", order: 7 },
    { name: "Object-Oriented Programming", category: "Core CS", color: "#00D9A3", order: 8 },
    { name: "Operating Systems", category: "Core CS", color: "#8B93A7", order: 9 },
    { name: "Computer Networks", category: "Core CS", color: "#8B93A7", order: 10 },
    { name: "DBMS", category: "Core CS", color: "#8B93A7", order: 11 },
    // Frontend
    { name: "React.js", category: "Frontend", color: "#61DAFB", order: 12 },
    { name: "Next.js", category: "Frontend", color: "#E8EAED", order: 13 },
    { name: "HTML", category: "Frontend", color: "#E34C26", order: 14 },
    { name: "CSS", category: "Frontend", color: "#563D7C", order: 15 },
    { name: "Tailwind CSS", category: "Frontend", color: "#38BDF8", order: 16 },
    // Backend
    { name: "Node.js", category: "Backend", color: "#68A063", order: 17 },
    { name: "Express.js", category: "Backend", color: "#8B93A7", order: 18 },
    { name: "REST APIs", category: "Backend", color: "#00D9A3", order: 19 },
    { name: "JWT Authentication", category: "Backend", color: "#F59E0B", order: 20 },
    { name: "Socket.io", category: "Backend", color: "#E8EAED", order: 21 },
    // Databases
    { name: "MongoDB", category: "Databases", color: "#47A248", order: 22 },
    { name: "PostgreSQL", category: "Databases", color: "#336791", order: 23 },
    { name: "SQL", category: "Databases", color: "#F29111", order: 24 },
    // Cloud & Tools
    { name: "AWS (EC2, S3)", category: "Cloud & Tools", color: "#FF9900", order: 25 },
    { name: "Docker", category: "Cloud & Tools", color: "#2496ED", order: 26 },
    { name: "Kubernetes", category: "Cloud & Tools", color: "#326CE5", order: 27 },
    { name: "GitHub Actions", category: "Cloud & Tools", color: "#E8EAED", order: 28 },
    { name: "Linux", category: "Cloud & Tools", color: "#FCC624", order: 29 },
    { name: "Git", category: "Cloud & Tools", color: "#F05032", order: 30 },
    { name: "GitHub", category: "Cloud & Tools", color: "#E8EAED", order: 31 },
    // Testing & Workflow
    { name: "Debugging", category: "Testing & Workflow", color: "#FF6B5C", order: 32 },
    { name: "Integration Testing", category: "Testing & Workflow", color: "#00D9A3", order: 33 },
    { name: "Code Reviews", category: "Testing & Workflow", color: "#8B93A7", order: 34 },
    { name: "Pull Requests", category: "Testing & Workflow", color: "#8B93A7", order: 35 }
  ];

  for (const skill of skills) {
    await prisma.skill.create({ data: skill });
  }
  console.log(`Seeded ${skills.length} skills.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
