"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  adminListProjects,
  adminCreateProject,
  adminUpdateProject,
  adminDeleteProject,
  adminListMessages,
  adminMarkMessageRead,
  adminLogout,
  adminListExperiences,
  adminCreateExperience,
  adminUpdateExperience,
  adminDeleteExperience,
  adminListSkills,
  adminCreateSkill,
  adminUpdateSkill,
  adminDeleteSkill,
} from "@/lib/api";
import { Project, Message, Experience, Skill } from "@/types";
import ThemeToggle from "@/components/ThemeToggle";

type Tab = "projects" | "experiences" | "skills" | "messages";

const emptyProjectForm = {
  title: "",
  slug: "",
  tagline: "",
  description: "",
  techStack: "",
  category: "",
  githubUrl: "",
  liveUrl: "",
  imageUrl: "",
  featured: false,
  published: true,
};

const emptyExperienceForm = {
  company: "",
  role: "",
  location: "",
  startDate: "",
  endDate: "",
  description: "",
  order: 0,
};

const emptySkillForm = {
  name: "",
  category: "Frontend",
  color: "#61DAFB",
  order: 0,
};

const SKILL_CATEGORIES = [
  "Programming Languages",
  "Core CS",
  "Frontend",
  "Backend",
  "Databases",
  "Cloud & Tools",
  "Testing & Workflow",
];

const PRESET_COLORS = [
  { name: "React Cyan", hex: "#61DAFB" },
  { name: "TS Blue", hex: "#3178C6" },
  { name: "JS Yellow", hex: "#F7DF1E" },
  { name: "Node Green", hex: "#68A063" },
  { name: "HTML Red", hex: "#E34C26" },
  { name: "Tailwind Cyan", hex: "#38BDF8" },
  { name: "Postgres Blue", hex: "#336791" },
  { name: "Prisma Indigo", hex: "#5A67D8" },
  { name: "AWS Orange", hex: "#FF9900" },
  { name: "Alert Coral", hex: "#FF6B5C" },
  { name: "Teal Signal", hex: "#00D9A3" },
];

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("projects");

  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Projects CRUD state
  const [editingProjId, setEditingProjId] = useState<string | null>(null);
  const [projForm, setProjForm] = useState(emptyProjectForm);
  const [savingProj, setSavingProj] = useState(false);
  const [confirmDeleteProjId, setConfirmDeleteProjId] = useState<string | null>(null);
  const [togglingProjId, setTogglingProjId] = useState<string | null>(null);

  // Experiences CRUD state
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [expForm, setExpForm] = useState(emptyExperienceForm);
  const [savingExp, setSavingExp] = useState(false);
  const [confirmDeleteExpId, setConfirmDeleteExpId] = useState<string | null>(null);

  // Skills CRUD state
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [skillForm, setSkillForm] = useState(emptySkillForm);
  const [savingSkill, setSavingSkill] = useState(false);
  const [confirmDeleteSkillId, setConfirmDeleteSkillId] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("admin_token");
    if (!t) {
      router.replace("/admin/login");
      return;
    }
    setToken(t);
  }, [router]);

  useEffect(() => {
    if (!token) return;
    loadData(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function loadData(t: string) {
    setLoading(true);
    setError("");
    try {
      const [p, m, e, s] = await Promise.all([
        adminListProjects(t),
        adminListMessages(t),
        adminListExperiences(t),
        adminListSkills(t),
      ]);
      setProjects(p.projects);
      setMessages(m.messages);
      setExperiences(e.experiences);
      setSkills(s.skills);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data.");
      if (err instanceof Error && err.message.toLowerCase().includes("auth")) {
        localStorage.removeItem("admin_token");
        router.replace("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  }

  // ---- Projects Handler ----
  function startEditProject(project: Project) {
    setEditingProjId(project.id);
    setProjForm({
      title: project.title,
      slug: project.slug,
      tagline: project.tagline,
      description: project.description,
      techStack: project.techStack.join(", "),
      category: project.category,
      githubUrl: project.githubUrl ?? "",
      liveUrl: project.liveUrl ?? "",
      imageUrl: project.imageUrl ?? "",
      featured: project.featured,
      published: project.published,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetProjectForm() {
    setEditingProjId(null);
    setProjForm(emptyProjectForm);
  }

  async function handleProjSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSavingProj(true);
    setError("");

    const payload = {
      title: projForm.title,
      slug: projForm.slug || slugify(projForm.title),
      tagline: projForm.tagline,
      description: projForm.description,
      techStack: projForm.techStack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      category: projForm.category,
      githubUrl: projForm.githubUrl || undefined,
      liveUrl: projForm.liveUrl || undefined,
      imageUrl: projForm.imageUrl || undefined,
      featured: projForm.featured,
      published: projForm.published,
    };

    try {
      if (editingProjId) {
        await adminUpdateProject(token, editingProjId, payload);
      } else {
        await adminCreateProject(token, payload);
      }
      resetProjectForm();
      await loadData(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSavingProj(false);
    }
  }

  async function handleProjDelete(id: string) {
    if (!token) return;
    try {
      await adminDeleteProject(token, id);
      setConfirmDeleteProjId(null);
      await loadData(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    }
  }

  async function toggleProjectField(id: string, field: "published" | "featured", value: boolean) {
    if (!token) return;
    setTogglingProjId(id + field);
    try {
      await adminUpdateProject(token, id, { [field]: value });
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setTogglingProjId(null);
    }
  }

  // ---- Experiences Handler ----
  function startEditExperience(exp: Experience) {
    setEditingExpId(exp.id);
    setExpForm({
      company: exp.company,
      role: exp.role,
      location: exp.location ?? "",
      startDate: exp.startDate,
      endDate: exp.endDate,
      description: exp.description,
      order: exp.order,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetExperienceForm() {
    setEditingExpId(null);
    setExpForm(emptyExperienceForm);
  }

  async function handleExpSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSavingExp(true);
    setError("");

    try {
      if (editingExpId) {
        await adminUpdateExperience(token, editingExpId, expForm);
      } else {
        await adminCreateExperience(token, expForm);
      }
      resetExperienceForm();
      await loadData(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Experience save failed.");
    } finally {
      setSavingExp(false);
    }
  }

  async function handleExpDelete(id: string) {
    if (!token) return;
    try {
      await adminDeleteExperience(token, id);
      setConfirmDeleteExpId(null);
      await loadData(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Experience delete failed.");
    }
  }

  // ---- Skills Handler ----
  function startEditSkill(skill: Skill) {
    setEditingSkillId(skill.id);
    setSkillForm({
      name: skill.name,
      category: skill.category,
      color: skill.color,
      order: skill.order,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetSkillForm() {
    setEditingSkillId(null);
    setSkillForm(emptySkillForm);
  }

  async function handleSkillSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSavingSkill(true);
    setError("");

    try {
      if (editingSkillId) {
        await adminUpdateSkill(token, editingSkillId, skillForm);
      } else {
        await adminCreateSkill(token, skillForm);
      }
      resetSkillForm();
      await loadData(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Skill save failed.");
    } finally {
      setSavingSkill(false);
    }
  }

  async function handleSkillDelete(id: string) {
    if (!token) return;
    try {
      await adminDeleteSkill(token, id);
      setConfirmDeleteSkillId(null);
      await loadData(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Skill delete failed.");
    }
  }

  // ---- Messages Handler ----
  async function handleMarkRead(id: string) {
    if (!token) return;
    await adminMarkMessageRead(token, id);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
  }

  async function handleLogout() {
    try {
      await adminLogout();
    } catch {
      // ignore
    }
    localStorage.removeItem("admin_token");
    router.replace("/admin/login");
  }

  if (!token) return null;

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <main className="min-h-screen bg-ink px-6 py-10 md:px-12">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="font-mono text-xs uppercase tracking-wide text-signal">
              // admin dashboard
            </div>
            <h1 className="mt-1 font-display text-2xl text-paper">Manage portfolio</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="rounded-md border border-panelBorder px-4 py-2 font-mono text-xs text-muted hover:border-alert hover:text-alert transition-colors"
            >
              Log out
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <dl className="mb-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-panelBorder bg-panelBorder sm:grid-cols-4">
          {[
            { label: "Total projects", value: projects.length },
            { label: "Experiences", value: experiences.length },
            { label: "Skills Dynamic", value: skills.length },
            { label: "Unread messages", value: unreadCount },
          ].map((stat) => (
            <div key={stat.label} className="bg-panel px-4 py-3">
              <dt className="font-mono text-[11px] uppercase tracking-wide text-muted">
                {stat.label}
              </dt>
              <dd className="mt-1 font-display text-2xl text-paper">{stat.value}</dd>
            </div>
          ))}
        </dl>

        {/* Tabs */}
        <div className="mb-8 flex flex-wrap gap-2 font-mono text-xs">
          <button
            onClick={() => setTab("projects")}
            className={`rounded-md px-4 py-2 transition-colors ${
              tab === "projects"
                ? "bg-signal text-ink"
                : "border border-panelBorder text-muted hover:border-signal/50"
            }`}
          >
            Projects ({projects.length})
          </button>
          <button
            onClick={() => setTab("experiences")}
            className={`rounded-md px-4 py-2 transition-colors ${
              tab === "experiences"
                ? "bg-signal text-ink"
                : "border border-panelBorder text-muted hover:border-signal/50"
            }`}
          >
            Experiences ({experiences.length})
          </button>
          <button
            onClick={() => setTab("skills")}
            className={`rounded-md px-4 py-2 transition-colors ${
              tab === "skills"
                ? "bg-signal text-ink"
                : "border border-panelBorder text-muted hover:border-signal/50"
            }`}
          >
            Skills ({skills.length})
          </button>
          <button
            onClick={() => setTab("messages")}
            className={`relative rounded-md px-4 py-2 transition-colors ${
              tab === "messages"
                ? "bg-signal text-ink"
                : "border border-panelBorder text-muted hover:border-signal/50"
            }`}
          >
            Messages
            {unreadCount > 0 && (
              <span className="ml-2 rounded-full bg-alert px-1.5 py-0.5 text-[10px] text-paper">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {error && (
          <p className="mb-6 flex items-center gap-2 rounded-md border border-alert/40 bg-alert/10 px-4 py-2 font-mono text-xs text-alert">
            ⚠ {error}
          </p>
        )}

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-16 rounded-lg" />
            ))}
          </div>
        ) : tab === "projects" ? (
          /* PROJECTS TAB */
          <div className="grid gap-8 md:grid-cols-[1fr_1.3fr]">
            <div>
              <h2 className="mb-3 font-display text-lg text-paper">
                {editingProjId ? "✏️ Edit project" : "＋ Add project"}
              </h2>
              <form
                onSubmit={handleProjSubmit}
                className="space-y-3 rounded-lg border border-panelBorder bg-panel p-5"
              >
                <Input
                  label="Title"
                  value={projForm.title}
                  onChange={(v) => setProjForm({ ...projForm, title: v, slug: slugify(v) })}
                  required
                />
                <Input
                  label="Slug"
                  value={projForm.slug}
                  onChange={(v) => setProjForm({ ...projForm, slug: v })}
                  required
                />
                <Input
                  label="Tagline"
                  value={projForm.tagline}
                  onChange={(v) => setProjForm({ ...projForm, tagline: v })}
                  required
                />
                <Textarea
                  label="Description"
                  value={projForm.description}
                  onChange={(v) => setProjForm({ ...projForm, description: v })}
                  required
                />
                <Input
                  label="Tech stack"
                  value={projForm.techStack}
                  onChange={(v) => setProjForm({ ...projForm, techStack: v })}
                />
                <Input
                  label="Category"
                  value={projForm.category}
                  onChange={(v) => setProjForm({ ...projForm, category: v })}
                  required
                />
                <Input
                  label="GitHub URL"
                  value={projForm.githubUrl}
                  onChange={(v) => setProjForm({ ...projForm, githubUrl: v })}
                />
                <Input
                  label="Live URL"
                  value={projForm.liveUrl}
                  onChange={(v) => setProjForm({ ...projForm, liveUrl: v })}
                />
                <Input
                  label="Image URL"
                  value={projForm.imageUrl}
                  onChange={(v) => setProjForm({ ...projForm, imageUrl: v })}
                />
                {projForm.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={projForm.imageUrl}
                    alt="preview"
                    className="mt-1 h-28 w-full rounded-md border border-panelBorder object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
                <div className="flex gap-5 pt-1">
                  <Toggle
                    label="Featured"
                    checked={projForm.featured}
                    onChange={(v) => setProjForm({ ...projForm, featured: v })}
                  />
                  <Toggle
                    label="Published"
                    checked={projForm.published}
                    onChange={(v) => setProjForm({ ...projForm, published: v })}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={savingProj}
                    className="rounded-md bg-signal px-5 py-2 font-mono text-xs font-medium text-ink hover:bg-signal/90 disabled:opacity-60 transition-colors"
                  >
                    {savingProj ? "Saving…" : editingProjId ? "Update project" : "Create project"}
                  </button>
                  {editingProjId && (
                    <button
                      type="button"
                      onClick={resetProjectForm}
                      className="rounded-md border border-panelBorder px-5 py-2 font-mono text-xs text-muted hover:border-signal/50 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div>
              <h2 className="mb-3 font-display text-lg text-paper">All projects</h2>
              <div className="space-y-2">
                {projects.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-lg border border-panelBorder bg-panel p-4 transition hover:border-panelBorder/80"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-display text-sm text-paper truncate">{p.title}</p>
                          {p.featured && (
                            <span className="rounded border border-signal/30 px-1.5 py-0.5 font-mono text-[10px] text-signal">
                              featured
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 font-mono text-xs text-muted">{p.category}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-mono text-[10px] text-muted">pub</span>
                          <button
                            onClick={() => toggleProjectField(p.id, "published", !p.published)}
                            disabled={togglingProjId === p.id + "published"}
                            className={`relative h-5 w-9 rounded-full transition-colors ${
                              p.published ? "bg-signal" : "bg-panelBorder"
                            }`}
                            aria-label={p.published ? "Unpublish" : "Publish"}
                          >
                            <span
                              className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-ink transition-transform ${
                                p.published ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-mono text-[10px] text-muted">feat</span>
                          <button
                            onClick={() => toggleProjectField(p.id, "featured", !p.featured)}
                            disabled={togglingProjId === p.id + "featured"}
                            className={`relative h-5 w-9 rounded-full transition-colors ${
                              p.featured ? "bg-signal" : "bg-panelBorder"
                            }`}
                            aria-label={p.featured ? "Unfeature" : "Feature"}
                          >
                            <span
                              className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-ink transition-transform ${
                                p.featured ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-3 font-mono text-xs shrink-0">
                        <button
                          onClick={() => startEditProject(p)}
                          className="text-signal hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setConfirmDeleteProjId(p.id)}
                          className="text-alert hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {confirmDeleteProjId === p.id && (
                      <div className="mt-3 flex items-center gap-3 rounded-md border border-alert/30 bg-alert/5 px-3 py-2">
                        <span className="font-mono text-xs text-alert flex-1">
                          Delete &ldquo;{p.title}&rdquo;?
                        </span>
                        <button
                          onClick={() => handleProjDelete(p.id)}
                          className="rounded bg-alert px-3 py-1 font-mono text-xs text-paper hover:bg-alert/80 transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmDeleteProjId(null)}
                          className="font-mono text-xs text-muted hover:text-paper transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : tab === "experiences" ? (
          /* EXPERIENCES TAB */
          <div className="grid gap-8 md:grid-cols-[1fr_1.3fr]">
            <div>
              <h2 className="mb-3 font-display text-lg text-paper">
                {editingExpId ? "✏️ Edit Experience" : "＋ Add Experience"}
              </h2>
              <form
                onSubmit={handleExpSubmit}
                className="space-y-3 rounded-lg border border-panelBorder bg-panel p-5"
              >
                <Input
                  label="Company"
                  value={expForm.company}
                  onChange={(v) => setExpForm({ ...expForm, company: v })}
                  required
                />
                <Input
                  label="Role"
                  value={expForm.role}
                  onChange={(v) => setExpForm({ ...expForm, role: v })}
                  required
                />
                <Input
                  label="Location"
                  value={expForm.location}
                  onChange={(v) => setExpForm({ ...expForm, location: v })}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Start Date"
                    value={expForm.startDate}
                    onChange={(v) => setExpForm({ ...expForm, startDate: v })}
                    required
                  />
                  <Input
                    label="End Date"
                    value={expForm.endDate}
                    onChange={(v) => setExpForm({ ...expForm, endDate: v })}
                    required
                  />
                </div>
                <Textarea
                  label="Description"
                  value={expForm.description}
                  onChange={(v) => setExpForm({ ...expForm, description: v })}
                  required
                />
                <InputNumber
                  label="Sort Order"
                  value={expForm.order}
                  onChange={(v) => setExpForm({ ...expForm, order: v })}
                />
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={savingExp}
                    className="rounded-md bg-signal px-5 py-2 font-mono text-xs font-medium text-ink hover:bg-signal/90 disabled:opacity-60 transition-colors"
                  >
                    {savingExp ? "Saving…" : editingExpId ? "Update Experience" : "Create Experience"}
                  </button>
                  {editingExpId && (
                    <button
                      type="button"
                      onClick={resetExperienceForm}
                      className="rounded-md border border-panelBorder px-5 py-2 font-mono text-xs text-muted hover:border-signal/50 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div>
              <h2 className="mb-3 font-display text-lg text-paper">Timeline experiences</h2>
              <div className="space-y-2">
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="rounded-lg border border-panelBorder bg-panel p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-sm text-paper">{exp.role}</p>
                        <p className="font-mono text-xs text-signal">
                          {exp.company} · <span className="text-muted">{exp.startDate} - {exp.endDate}</span>
                        </p>
                      </div>
                      <div className="flex gap-3 font-mono text-xs shrink-0">
                        <button
                          onClick={() => startEditExperience(exp)}
                          className="text-signal hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setConfirmDeleteExpId(exp.id)}
                          className="text-alert hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {confirmDeleteExpId === exp.id && (
                      <div className="mt-3 flex items-center gap-3 rounded-md border border-alert/30 bg-alert/5 px-3 py-2">
                        <span className="font-mono text-xs text-alert flex-1">
                          Delete this experience?
                        </span>
                        <button
                          onClick={() => handleExpDelete(exp.id)}
                          className="rounded bg-alert px-3 py-1 font-mono text-xs text-paper hover:bg-alert/80 transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmDeleteExpId(null)}
                          className="font-mono text-xs text-muted hover:text-paper transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : tab === "skills" ? (
          /* SKILLS TAB */
          <div className="grid gap-8 md:grid-cols-[1fr_1.3fr]">
            <div>
              <h2 className="mb-3 font-display text-lg text-paper">
                {editingSkillId ? "✏️ Edit Skill" : "＋ Add Skill"}
              </h2>
              <form
                onSubmit={handleSkillSubmit}
                className="space-y-3 rounded-lg border border-panelBorder bg-panel p-5"
              >
                <Input
                  label="Skill Name"
                  value={skillForm.name}
                  onChange={(v) => setSkillForm({ ...skillForm, name: v })}
                  required
                />

                <div>
                  <label className="mb-1 block font-mono text-[11px] uppercase tracking-wide text-muted">
                    Category
                  </label>
                  <select
                    value={skillForm.category}
                    onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                    className="w-full rounded-md border border-panelBorder bg-ink px-3 py-1.5 font-body text-sm text-paper outline-none focus:border-signal transition-colors"
                  >
                    {SKILL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-mono text-[11px] uppercase tracking-wide text-muted">
                    Skill Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={skillForm.color}
                      onChange={(e) => setSkillForm({ ...skillForm, color: e.target.value })}
                      className="h-8 w-8 cursor-pointer rounded border border-panelBorder bg-transparent"
                    />
                    <Input
                      label=""
                      value={skillForm.color}
                      onChange={(v) => setSkillForm({ ...skillForm, color: v })}
                      required
                    />
                  </div>
                  {/* Preset Colors */}
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setSkillForm({ ...skillForm, color: c.hex })}
                        className="flex h-5 w-5 items-center justify-center rounded-full border border-panelBorder hover:scale-110 transition-transform"
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                <InputNumber
                  label="Sort Order"
                  value={skillForm.order}
                  onChange={(v) => setSkillForm({ ...skillForm, order: v })}
                />

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={savingSkill}
                    className="rounded-md bg-signal px-5 py-2 font-mono text-xs font-medium text-ink hover:bg-signal/90 disabled:opacity-60 transition-colors"
                  >
                    {savingSkill ? "Saving…" : editingSkillId ? "Update Skill" : "Create Skill"}
                  </button>
                  {editingSkillId && (
                    <button
                      type="button"
                      onClick={resetSkillForm}
                      className="rounded-md border border-panelBorder px-5 py-2 font-mono text-xs text-muted hover:border-signal/50 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div>
              <h2 className="mb-3 font-display text-lg text-paper">Dynamic skills list</h2>
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {skills.map((s) => (
                  <div
                    key={s.id}
                    className="rounded-lg border border-panelBorder bg-panel p-3 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="h-3 w-3 rounded-full shrink-0"
                        style={{ backgroundColor: s.color }}
                      />
                      <div className="min-w-0">
                        <p className="font-mono text-sm text-paper truncate">{s.name}</p>
                        <p className="font-mono text-[10px] text-muted">{s.category}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 font-mono text-xs shrink-0">
                      <button
                        onClick={() => startEditSkill(s)}
                        className="text-signal hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setConfirmDeleteSkillId(s.id)}
                        className="text-alert hover:underline"
                      >
                        Delete
                      </button>
                    </div>

                    {confirmDeleteSkillId === s.id && (
                      <div className="absolute right-3 bg-panel border border-alert/30 p-2 rounded-md flex items-center gap-2">
                        <span className="font-mono text-[10px] text-alert">Delete?</span>
                        <button
                          onClick={() => handleSkillDelete(s.id)}
                          className="bg-alert text-paper rounded px-2 py-0.5 text-[10px] hover:bg-alert/80"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setConfirmDeleteSkillId(null)}
                          className="text-muted text-[10px]"
                        >
                          No
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* MESSAGES TAB */
          <div className="space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`rounded-lg border bg-panel p-4 transition ${
                  m.read ? "border-panelBorder opacity-70" : "border-signal/30"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-display text-sm text-paper">{m.name}</p>
                      {!m.read && (
                        <span className="rounded-full bg-signal/15 px-2 py-0.5 font-mono text-[10px] text-signal border border-signal/30">
                          new
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-xs text-muted">{m.email}</p>
                    {m.subject && (
                      <p className="mt-1 font-mono text-xs text-muted/80">
                        Re: {m.subject}
                      </p>
                    )}
                    <p className="mt-2 font-body text-sm text-muted leading-relaxed">
                      {m.body}
                    </p>
                    <p className="mt-2 font-mono text-[11px] text-muted/60">
                      {new Date(m.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <a
                      href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(
                        m.subject || "Your message"
                      )}&body=Hi ${encodeURIComponent(m.name)},%0A%0A`}
                      className="rounded border border-panelBorder px-3 py-1.5 font-mono text-[11px] text-muted hover:border-signal hover:text-signal transition-colors text-center"
                    >
                      Reply ↗
                    </a>
                    {!m.read && (
                      <button
                        onClick={() => handleMarkRead(m.id)}
                        className="rounded border border-signal/30 px-3 py-1.5 font-mono text-[11px] text-signal hover:bg-signal/10 transition-colors"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <p className="rounded-lg border border-dashed border-panelBorder p-10 text-center font-mono text-xs text-muted">
                No messages yet.
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

/* ─── Shared form atoms ─────────────────────────────────── */

function Input({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      {label && (
        <label className="mb-1 block font-mono text-[11px] uppercase tracking-wide text-muted">
          {label}
        </label>
      )}
      <input
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-panelBorder bg-ink px-3 py-1.5 font-body text-sm text-paper outline-none focus:border-signal transition-colors"
      />
    </div>
  );
}

function InputNumber({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="mb-1 block font-mono text-[11px] uppercase tracking-wide text-muted">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-md border border-panelBorder bg-ink px-3 py-1.5 font-body text-sm text-paper outline-none focus:border-signal transition-colors"
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block font-mono text-[11px] uppercase tracking-wide text-muted">
        {label}
      </label>
      <textarea
        value={value}
        required={required}
        rows={4}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-panelBorder bg-ink px-3 py-1.5 font-body text-sm text-paper outline-none focus:border-signal transition-colors"
      />
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 rounded-full transition-colors ${
          checked ? "bg-signal" : "bg-panelBorder"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-ink transition-transform ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
      <span className="font-mono text-xs text-muted">{label}</span>
    </label>
  );
}
