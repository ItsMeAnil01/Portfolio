import { Suspense } from "react";
import { fetchProjects } from "@/lib/api";
import ProjectCard from "./ProjectCard";
import ProjectsSkeleton from "./ProjectsSkeleton";

async function ProjectList() {
  let projects: Awaited<ReturnType<typeof fetchProjects>>["projects"] = [];

  try {
    const data = await fetchProjects();
    projects = data.projects;
  } catch {
    projects = [];
  }

  if (projects.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-panelBorder p-10 text-center font-mono text-sm text-muted">
        No projects to show yet — the API may be offline, or nothing&apos;s published.
        Add some from /admin/dashboard.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {projects.map((project, i) => (
        <ProjectCard key={project.id} project={project} index={i} />
      ))}
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="px-6 py-20 md:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 font-mono text-xs uppercase tracking-wide text-signal">
          // projects
        </div>

        <Suspense fallback={<ProjectsSkeleton />}>
          <ProjectList />
        </Suspense>
      </div>
    </section>
  );
}
