const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  "C++": "#f34b7d",
  Java: "#b07219",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Shell: "#89e051",
  Dockerfile: "#384d54",
};

type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  pushed_at: string;
  fork: boolean;
};

async function getRepos(): Promise<Repo[]> {
  try {
    const res = await fetch(
      "https://api.github.com/users/ItsMeAnil01/repos?per_page=100&sort=pushed",
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return [];
    const data: Repo[] = await res.json();
    return data
      .filter((r) => !r.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
      .slice(0, 6);
  } catch {
    return [];
  }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export default async function GitHubStrip() {
  const repos = await getRepos();

  if (repos.length === 0) return null;

  return (
    <section id="github" className="px-6 py-16 md:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-end justify-between">
          <div className="font-mono text-xs uppercase tracking-wide text-signal">
            // github
          </div>
          <a
            href="https://github.com/ItsMeAnil01"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-muted hover:text-signal transition-colors"
          >
            View all repos ↗
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {repos.map((repo) => {
            const langColor = repo.language ? (LANG_COLORS[repo.language] ?? "#8B93A7") : null;
            return (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between rounded-lg border border-panelBorder bg-panel p-5 transition-all duration-200 hover:border-signal/50 hover:shadow-[0_0_20px_rgba(0,217,163,0.08)]"
              >
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    {/* folder icon */}
                    <svg
                      className="h-4 w-4 text-signal/70 shrink-0"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25v-8.5A1.75 1.75 0 0 0 14.25 3H7.5a.25.25 0 0 1-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75Z" />
                    </svg>
                    <span className="font-mono text-sm font-medium text-paper group-hover:text-signal transition-colors truncate">
                      {repo.name}
                    </span>
                  </div>
                  <p className="font-body text-xs text-muted leading-relaxed line-clamp-2 min-h-[2rem]">
                    {repo.description || "No description"}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {langColor && (
                      <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted">
                        <span
                          className="h-2.5 w-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: langColor }}
                        />
                        {repo.language}
                      </span>
                    )}
                    {repo.stargazers_count > 0 && (
                      <span className="flex items-center gap-1 font-mono text-[11px] text-muted">
                        <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
                        </svg>
                        {repo.stargazers_count}
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[11px] text-muted/70">
                    {timeAgo(repo.pushed_at)}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
