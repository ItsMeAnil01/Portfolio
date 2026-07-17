export default function About() {
  return (
    <section id="about" className="px-6 py-20 md:px-12">
      <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[120px_1fr]">
        <div className="font-mono text-xs uppercase tracking-wide text-signal">// about</div>

        <div className="space-y-5 font-body text-base leading-relaxed text-muted md:text-lg">
          <p>
            I&apos;m a third-year Computer Science Engineering student at Chitkara University,
            Himachal Pradesh — spending most of my time building production-grade web
            applications across the full stack.
          </p>
          <p>
            On the engineering side, I work end-to-end across the MERN stack and Next.js —
            REST APIs, JWT auth, MongoDB, MVC architecture — and deploy what I build on
            AWS with Docker and Kubernetes. I&apos;ve solved 200+ problems on LeetCode, not for
            the badge, but because clean problem decomposition carries directly into
            production code.
          </p>
          <p>
            I care about shipping software that is fast, maintainable, and well-structured.
            Whether it&apos;s architecting a backend API or wiring up a slick UI, I treat every
            layer of the stack with the same rigour: define the requirements, write clean
            code, then ship it.
          </p>
        </div>
      </div>
    </section>
  );
}
