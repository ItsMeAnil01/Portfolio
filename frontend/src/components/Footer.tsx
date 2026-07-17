export default function Footer() {
  return (
    <footer className="border-t border-panelBorder px-6 py-10 md:px-12">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 font-mono text-xs text-muted sm:flex-row sm:items-center">
        <span>© {new Date().getFullYear()} Anil. Built with Next.js & Express.</span>
        <div className="flex gap-5">
          <a
            href="https://github.com/ItsMeAnil01"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-signal"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/anil-kumar0/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-signal"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
