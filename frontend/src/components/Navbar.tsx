"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Stack", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const SECTIONS = ["about", "skills", "projects", "contact"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-ink/80 border-b border-panelBorder shadow-lg shadow-black/10 py-3 backdrop-blur-md"
            : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 md:px-12">
          {/* Logo */}
          <a
            href="#"
            className="font-mono text-sm font-medium text-paper hover:text-signal transition-colors"
          >
            <span className="text-signal">{">"}</span> anil
            <span className="animate-blink text-signal">_</span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => {
              const id = href.replace("#", "");
              const isActive = active === id;
              return (
                <a
                  key={label}
                  href={href}
                  className={`relative px-4 py-2 font-mono text-xs rounded-md transition-all duration-200 ${
                    isActive
                      ? "text-signal"
                      : "text-muted hover:text-paper"
                  }`}
                >
                  {isActive && (
                    <span className="absolute inset-0 rounded-md bg-signal/10 border border-signal/20" />
                  )}
                  {label}
                </a>
              );
            })}
            <a
              href="https://github.com/ItsMeAnil01"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 mr-2 rounded-md border border-panelBorder px-4 py-2 font-mono text-xs text-muted hover:border-signal hover:text-signal transition-all duration-200"
            >
              GitHub ↗
            </a>
            <ThemeToggle />
          </div>

          {/* Mobile actions (ThemeToggle + Hamburger) */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="flex flex-col gap-1.5 p-2"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <span
                className={`block h-px w-5 bg-paper transition-transform duration-300 ${menuOpen ? "translate-y-2.5 rotate-45" : ""}`}
              />
              <span
                className={`block h-px w-5 bg-paper transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-px w-5 bg-paper transition-transform duration-300 ${menuOpen ? "-translate-y-2.5 -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-panelBorder bg-ink/95 backdrop-blur-md px-6 py-4 space-y-1">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-md px-4 py-3 font-mono text-sm text-muted hover:text-signal hover:bg-signal/5 transition-all"
              >
                {label}
              </a>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}

