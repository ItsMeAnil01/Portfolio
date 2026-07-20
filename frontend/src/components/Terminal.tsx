"use client";

import { useEffect, useRef, useState, KeyboardEvent } from "react";
import { Project, Skill } from "@/types";

interface HistoryItem {
  type: "input" | "output";
  text: string;
  isHtml?: boolean;
}

interface TerminalProps {
  projects: Project[];
  skills: Skill[];
}

export default function Terminal({ projects, skills }: TerminalProps) {
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      type: "output",
      text: `Welcome to Anil's interactive portfolio CLI! (v1.0.0)\nType <span class="text-signal">help</span> to list all available commands.`,
      isHtml: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);

  // Focus terminal input on mount and on window clicks inside the terminal
  useEffect(() => {
    if (!isMinimized) {
      inputRef.current?.focus();
    }
  }, [isMinimized]);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [history]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const command = input.trim();
      if (!command) return;

      const newHistory = [...history, { type: "input", text: command } as HistoryItem];
      const cmdParts = command.toLowerCase().split(" ");
      const rootCommand = cmdParts[0];
      const arg = cmdParts[1];

      let output = "";
      let isHtml = false;

      switch (rootCommand) {
        case "help":
          output = `Available commands:\n  <span class="text-signal">about</span>      — View my profile biography\n  <span class="text-signal">skills</span>     — List categorized tech stack skills\n  <span class="text-signal">projects</span>   — View summary of seeded projects\n  <span class="text-signal">contact</span>    — Get email and social contact links\n  <span class="text-signal">theme</span>      — Toggle theme (Usage: <span class="text-muted">theme light</span> or <span class="text-muted">theme dark</span>)\n  <span class="text-signal">clear</span>      — Clear the screen command history`;
          isHtml = true;
          break;

        case "about":
          output = `Anil — Full-Stack Engineer\n--------------------------\nFinal-year Computer Science Engineering student at Chitkara University, India.\nFocused on building clean REST APIs, JWT authentication setups, Next.js user interfaces,\nand deploying workloads to AWS with Docker and Kubernetes.`;
          setTimeout(() => {
            document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
          }, 120);
          break;

        case "skills":
          // Group skills by category
          const grouped: Record<string, string[]> = {};
          skills.forEach((s) => {
            if (!grouped[s.category]) grouped[s.category] = [];
            grouped[s.category].push(s.name);
          });
          output = Object.entries(grouped)
            .map(([cat, list]) => `<span class="text-signal">${cat}:</span>\n  ${list.join(", ")}`)
            .join("\n\n");
          isHtml = true;
          setTimeout(() => {
            document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" });
          }, 120);
          break;

        case "projects":
          output = projects
            .map(
              (p) =>
                `<span class="text-signal">${p.title}</span> — ${p.tagline}\n  Stack: ${p.techStack.join(", ")}\n  Link: <a href="https://github.com/ItsMeAnil01/${p.slug}" target="_blank" class="underline hover:text-signal">${p.githubUrl || "github.com/ItsMeAnil01/" + p.slug}</a>`
            )
            .join("\n\n");
          isHtml = true;
          setTimeout(() => {
            document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
          }, 120);
          break;

        case "contact":
          output = `Contact Info:\n  Email:    <a href="mailto:anilkumar.012717@gmail.com" class="underline text-signal hover:text-signal/80">anilkumar.012717@gmail.com</a>\n  GitHub:   <a href="https://github.com/ItsMeAnil01" target="_blank" class="underline text-signal hover:text-signal/80">github.com/ItsMeAnil01</a>\n  LinkedIn: <a href="https://linkedin.com/in/anil-kumaro" target="_blank" class="underline text-signal hover:text-signal/80">linkedin.com/in/anil-kumaro</a>`;
          isHtml = true;
          setTimeout(() => {
            document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
          }, 120);
          break;

        case "theme":
          if (arg === "light" || arg === "dark") {
            document.documentElement.setAttribute("data-theme", arg);
            localStorage.setItem("theme", arg);
            window.dispatchEvent(new Event("storage"));
            output = `Theme switched to <span class="text-signal font-semibold">${arg} mode</span>.`;
          } else {
            output = `Usage: <span class="text-alert font-mono">theme light</span> or <span class="text-alert font-mono">theme dark</span>.`;
          }
          isHtml = true;
          break;

        case "clear":
          setHistory([]);
          setInput("");
          return;

        default:
          output = `Command not found: <span class="text-alert font-semibold">${command}</span>. Type <span class="text-signal">help</span> for a list of commands.`;
          isHtml = true;
      }

      setHistory([...newHistory, { type: "output", text: output, isHtml }]);
      setInput("");
    }
  };

  if (isMinimized) {
    return (
      <section id="terminal" className="px-6 py-6 md:px-12 transition-all duration-300">
        <div className="mx-auto max-w-5xl">
          <button
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2.5 rounded-lg border border-signal/30 bg-panel/70 px-4 py-2.5 font-mono text-xs text-signal hover:border-signal hover:bg-panelBorder/50 transition-all duration-200 shadow-[0_0_16px_rgba(0,217,163,0.02)] hover:shadow-[0_0_20px_rgba(0,217,163,0.1)] cursor-pointer"
          >
            <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
            <span>&gt;_ OPEN INTERACTIVE CONSOLE</span>
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="terminal" className="px-6 py-12 md:px-12 transition-all duration-300">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="font-mono text-xs uppercase tracking-wide text-signal">
            // interactive console
          </div>
          <button
            onClick={() => setIsMinimized(true)}
            className="font-mono text-[10px] text-muted hover:text-signal transition-colors uppercase tracking-wider"
          >
            Minimize console [-]
          </button>
        </div>

        {/* Terminal frame */}
        <div
          onClick={() => inputRef.current?.focus()}
          className="w-full rounded-lg border border-panelBorder bg-panel shadow-2xl flex flex-col cursor-text font-mono text-xs md:text-sm leading-relaxed"
        >
          {/* Window header */}
          <div className="flex items-center justify-between border-b border-panelBorder bg-ink/40 px-4 py-3 shrink-0">
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(true);
                }}
                className="h-3 w-3 rounded-full bg-alert/80 hover:bg-alert hover:scale-105 transition-transform"
                title="Minimize Window"
                aria-label="Minimize terminal window"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(true);
                }}
                className="h-3 w-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 hover:scale-105 transition-transform"
                title="Collapse Window"
                aria-label="Collapse terminal window"
              />
              <span className="h-3 w-3 rounded-full bg-green-500/80" />
            </div>
            <div className="text-muted text-[11px]">anil@portfolio: ~</div>
            <div className="w-12" /> {/* spacing placeholder */}
          </div>

          {/* Terminal Console Output */}
          <div ref={consoleRef} className="p-5 md:p-6 space-y-4 overflow-y-auto max-h-[380px] bg-panel/30">
            {history.map((item, idx) => (
              <div key={idx} className="whitespace-pre-wrap font-mono">
                {item.type === "input" ? (
                  <div className="flex items-center gap-2">
                    <span className="text-signal">anil@portfolio:~$</span>
                    <span className="text-paper">{item.text}</span>
                  </div>
                ) : item.isHtml ? (
                  <div
                    className="text-muted leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item.text }}
                  />
                ) : (
                  <div className="text-muted leading-relaxed">{item.text}</div>
                )}
              </div>
            ))}
          </div>

          {/* Terminal Input Line */}
          <div className="flex items-center gap-2 border-t border-panelBorder/30 bg-ink/10 px-5 py-3 shrink-0 font-mono">
            <span className="text-signal">anil@portfolio:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-paper outline-none border-none caret-signal font-mono py-0.5"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
