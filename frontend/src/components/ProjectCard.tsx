import { Project } from "@/types";

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const stats = project.stats && Object.keys(project.stats).length > 0
    ? Object.entries(project.stats)
    : null;

  return (
    <article className="group rounded-lg border border-panelBorder bg-panel p-6 transition hover:border-signal/50">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-wide text-muted">
            {project.category} · TICKET #{String(index + 1).padStart(2, "0")}
          </div>
          <h3 className="mt-1 font-display text-xl font-medium text-paper">
            {project.title}
          </h3>
        </div>
        {project.featured && (
          <span className="shrink-0 rounded border border-signal/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-signal">
            Featured
          </span>
        )}
      </div>

      <p className="font-body text-sm text-muted">{project.tagline}</p>
      <p className="mt-3 font-body text-sm leading-relaxed text-muted/90">
        {project.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded border border-panelBorder px-2 py-1 font-mono text-[11px] text-muted"
          >
            {tech}
          </span>
        ))}
      </div>

      {stats && (
        <dl className="mt-4 flex flex-wrap gap-4 border-t border-panelBorder pt-4">
          {stats.map(([key, value]) => (
            <div key={key}>
              <dt className="font-mono text-[10px] uppercase tracking-wide text-muted">{key}</dt>
              <dd className="font-mono text-sm text-signal">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-5 flex gap-4 font-mono text-xs">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-paper underline decoration-panelBorder underline-offset-4 transition hover:text-signal hover:decoration-signal"
          >
            Source →
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-paper underline decoration-panelBorder underline-offset-4 transition hover:text-signal hover:decoration-signal"
          >
            Live →
          </a>
        )}
      </div>
    </article>
  );
}
