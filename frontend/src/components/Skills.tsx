import { fetchSkills } from "@/lib/api";

const ICON_MAP: Record<string, string> = {
  "Programming Languages": "◈",
  "Core CS": "◉",
  "Frontend": "◎",
  "Backend": "◇",
  "Databases": "▣",
  "Cloud & Tools": "⬡",
  "Testing & Workflow": "◑",
};

import { Skill } from "@/types";

export default async function Skills() {
  let skills: Skill[] = [];
  try {
    const data = await fetchSkills();
    skills = data.skills;
  } catch {
    skills = [];
  }

  if (skills.length === 0) return null;

  // Group skills by category
  const groupsMap = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  // Convert to sorted groups
  const groups = Object.entries(groupsMap)
    .map(([label, list]) => {
      const sortedSkills = list.sort((a, b) => a.order - b.order);
      const minOrder = Math.min(...list.map((s) => s.order));
      return {
        label,
        icon: ICON_MAP[label] || "◈",
        skills: sortedSkills,
        minOrder,
      };
    })
    .sort((a, b) => a.minOrder - b.minOrder);

  return (
    <section id="skills" className="px-6 py-20 md:px-12">
      <div className="mx-auto max-w-5xl">
        {/* section label */}
        <div className="mb-12 font-mono text-xs uppercase tracking-wide text-signal">
          // stack
        </div>

        <div className="space-y-12">
          {groups.map((group) => (
            <div key={group.label}>
              {/* category heading */}
              <div className="mb-5 flex items-center gap-3">
                <span className="text-xl text-signal">{group.icon}</span>
                <h3 className="font-display text-2xl font-medium text-paper">
                  {group.label}
                </h3>
                <span className="flex-1 h-px bg-panelBorder" />
              </div>

              {/* skill pills */}
              <div className="flex flex-wrap gap-3">
                {group.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="group flex items-center gap-2.5 rounded-lg border border-panelBorder bg-panel px-4 py-2.5 transition-all duration-200 hover:border-signal/50 hover:bg-panelBorder/60 hover:shadow-[0_0_16px_rgba(0,217,163,0.1)]"
                  >
                    {/* color dot */}
                    <span
                      className="h-2 w-2 rounded-full shrink-0 transition-transform duration-200 group-hover:scale-125"
                      style={{ backgroundColor: skill.color }}
                    />
                    <span className="font-mono text-sm font-medium text-muted group-hover:text-paper transition-colors duration-200">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
