import { fetchExperiences } from "@/lib/api";
import { Experience } from "@/types";

export default async function ExperienceComponent() {
  let experiences: Experience[] = [];
  try {
    const data = await fetchExperiences();
    experiences = data.experiences;
  } catch {
    experiences = [];
  }

  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="px-6 py-20 md:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 font-mono text-xs uppercase tracking-wide text-signal">
          // experience
        </div>

        <div className="relative border-l border-panelBorder pl-6 md:pl-8 ml-2">
          {experiences.map((exp) => (
            <div key={exp.id} className="relative mb-12 last:mb-0">
              {/* timeline node */}
              <span className="absolute -left-[31px] md:-left-[39px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-ink border border-signal transition-colors duration-300">
                <span className="h-1.5 w-1.5 rounded-full bg-signal" />
              </span>

              <div>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <h3 className="font-display text-xl font-medium text-paper">
                    {exp.role}
                  </h3>
                  <span className="font-mono text-xs text-muted shrink-0">
                    {exp.startDate} — {exp.endDate}
                  </span>
                </div>
                <div className="font-mono text-xs text-signal mt-1">
                  {exp.company} {exp.location && `· ${exp.location}`}
                </div>
                <p className="mt-4 font-body text-sm leading-relaxed text-muted/95 whitespace-pre-line">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
