export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-28 md:px-12 md:pt-36">
      {/* grid background */}
      <div className="grid-fade pointer-events-none absolute inset-0 -z-10" />

      {/* teal glow blob */}
      <div
        className="pointer-events-none absolute -z-10 animate-glow-pulse"
        style={{
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(var(--color-signal-rgb), 0.13) 0%, transparent 65%)",
          filter: "blur(2px)",
        }}
      />

      <div className="mx-auto max-w-5xl">
        {/* status badge */}
        <div
          className="mb-8 flex items-center gap-2 font-mono text-xs text-signal"
          style={{ animation: "fadeUp 0.5s ease 0.1s forwards", opacity: 0 }}
        >
          <span className="inline-block h-2 w-2 animate-blink rounded-full bg-signal" />
          <span>SESSION: OPEN &nbsp;—&nbsp; STATUS: BUILDING</span>
        </div>

        {/* headline */}
        <h1 className="font-display text-5xl font-medium leading-[1.2] text-paper md:text-7xl">
          <span
            className="block"
            style={{ animation: "fadeUp 0.6s ease 0.2s forwards", opacity: 0 }}
          >
            Anil.
          </span>
          <span
            className="block text-muted"
            style={{ animation: "fadeUp 0.6s ease 0.35s forwards", opacity: 0 }}
          >
            Ships full-stack products.
          </span>
          <span
            className="block text-signal"
            style={{ animation: "fadeUp 0.6s ease 0.5s forwards", opacity: 0 }}
          >
            Solves hard engineering problems.
          </span>
        </h1>

        {/* body */}
        <p
          className="mt-6 max-w-xl font-body text-base leading-relaxed text-muted md:text-lg"
          style={{ animation: "fadeUp 0.6s ease 0.65s forwards", opacity: 0 }}
        >
          Final-year CSE engineer building production-grade MERN &amp; Next.js
          applications — from REST APIs and JWT auth to cloud deployments on
          AWS with Docker and Kubernetes. Clean code, fast delivery, no shortcuts.
        </p>

        {/* CTA buttons */}
        <div
          className="mt-9 flex flex-wrap items-center gap-4"
          style={{ animation: "fadeUp 0.6s ease 0.75s forwards", opacity: 0 }}
        >
          <a
            href="#projects"
            className="group relative overflow-hidden rounded-md bg-signal px-6 py-3 font-mono text-sm font-medium text-ink transition-all hover:bg-signal/90 hover:shadow-[0_0_24px_rgba(0,217,163,0.4)]"
          >
            View projects
          </a>
          <a
            href="#contact"
            className="rounded-md border border-panelBorder px-6 py-3 font-mono text-sm text-paper transition hover:border-signal hover:text-signal"
          >
            Get in touch
          </a>
          <a
            href="https://github.com/ItsMeAnil01"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md px-4 py-3 font-mono text-xs text-muted hover:text-signal transition-colors"
          >
            GitHub ↗
          </a>
        </div>

        {/* quick-stats readout */}
        <dl
          className="mt-14 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-lg border border-panelBorder bg-panelBorder sm:grid-cols-4"
          style={{ animation: "fadeUp 0.6s ease 0.9s forwards", opacity: 0 }}
        >
          {[
            { label: "LeetCode solved", value: "200+" },
            { label: "Stack", value: "MERN" },
            { label: "Cloud", value: "AWS" },
            { label: "Based in", value: "India" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="group bg-panel px-4 py-3 transition hover:bg-panelBorder/60"
            >
              <dt className="font-mono text-[11px] uppercase tracking-wide text-muted">
                {stat.label}
              </dt>
              <dd className="mt-1 font-display text-lg text-paper group-hover:text-signal transition-colors">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
