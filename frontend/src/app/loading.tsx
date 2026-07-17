import ProjectsSkeleton from "@/components/ProjectsSkeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-ink">
      <div className="px-6 py-20 md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 flex items-end justify-between">
            <div className="skeleton h-3 w-20 rounded" />
          </div>
          <ProjectsSkeleton />
        </div>
      </div>
    </main>
  );
}
