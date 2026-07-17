export default function ProjectsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-panelBorder bg-panel p-6"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          {/* header row */}
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="skeleton h-3 w-24 rounded" />
              <div className="skeleton h-5 w-48 rounded" />
            </div>
            <div className="skeleton h-4 w-14 rounded" />
          </div>
          {/* tagline */}
          <div className="skeleton h-3 w-full rounded mb-2" />
          {/* description */}
          <div className="space-y-1.5 mt-3">
            <div className="skeleton h-3 w-full rounded" />
            <div className="skeleton h-3 w-5/6 rounded" />
            <div className="skeleton h-3 w-4/6 rounded" />
          </div>
          {/* tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="skeleton h-6 w-16 rounded" />
            ))}
          </div>
          {/* links */}
          <div className="mt-5 flex gap-4">
            <div className="skeleton h-3 w-14 rounded" />
            <div className="skeleton h-3 w-10 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
