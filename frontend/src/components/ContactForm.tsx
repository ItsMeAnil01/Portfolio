"use client";

import { useState, FormEvent } from "react";
import { submitContactForm } from "@/lib/api";

type Status = "idle" | "submitting" | "success" | "error";

const MAX_CHARS = 2000;

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [charCount, setCharCount] = useState(0);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await submitContactForm({
        name: String(formData.get("name") || ""),
        email: String(formData.get("email") || ""),
        subject: String(formData.get("subject") || ""),
        body: String(formData.get("body") || ""),
        company: String(formData.get("company") || ""), // honeypot
      });
      setStatus("success");
      form.reset();
      setCharCount(0);
    } catch (err) {
      setStatus("error");
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      if (msg.includes("429") || msg.toLowerCase().includes("rate")) {
        setErrorMsg("Too many messages — please wait a few minutes before trying again.");
      } else {
        setErrorMsg(msg);
      }
    }
  }

  if (status === "success") {
    return (
      <div
        className="rounded-lg border border-signal/40 bg-panel p-10 text-center"
        style={{ animation: "fadeUp 0.4s ease forwards" }}
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-signal/10 border border-signal/30">
          <svg className="h-5 w-5 text-signal" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <p className="font-mono text-sm text-signal">MESSAGE SENT — ORDER FILLED</p>
        <p className="mt-2 font-body text-sm text-muted">
          Thanks for reaching out. I&apos;ll reply as soon as I can.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 font-mono text-xs text-muted hover:text-signal transition-colors"
        >
          Send another →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-panelBorder bg-panel p-6">
      {/* honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" required />
        <Field label="Email" name="email" type="email" required />
      </div>

      <div className="mt-5">
        <Field label="Subject (optional)" name="subject" />
      </div>

      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between">
          <label className="font-mono text-[11px] uppercase tracking-wide text-muted">
            Message
          </label>
          <span
            className={`font-mono text-[11px] transition-colors ${
              charCount > MAX_CHARS * 0.9 ? "text-alert" : "text-muted/60"
            }`}
          >
            {charCount}/{MAX_CHARS}
          </span>
        </div>
        <textarea
          name="body"
          required
          minLength={10}
          maxLength={MAX_CHARS}
          rows={5}
          onChange={(e) => setCharCount(e.target.value.length)}
          className="w-full rounded-md border border-panelBorder bg-ink px-3 py-2 font-body text-sm text-paper outline-none placeholder:text-muted/60 focus:border-signal transition-colors"
          placeholder="What are you building, or what would you like to ask?"
        />
      </div>

      {status === "error" && (
        <p
          className="mt-4 flex items-center gap-2 rounded-md border border-alert/30 bg-alert/10 px-3 py-2 font-mono text-xs text-alert"
          style={{ animation: "slideIn 0.3s ease forwards" }}
        >
          <span>⚠</span>
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-signal px-6 py-3 font-mono text-sm font-medium text-ink transition-all hover:bg-signal/90 hover:shadow-[0_0_20px_rgba(0,217,163,0.3)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? (
          <>
            <span className="h-3.5 w-3.5 rounded-full border-2 border-ink/40 border-t-ink animate-spin" />
            Sending…
          </>
        ) : (
          "Send message →"
        )}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-muted">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full rounded-md border border-panelBorder bg-ink px-3 py-2 font-body text-sm text-paper outline-none placeholder:text-muted/60 focus:border-signal transition-colors"
      />
    </div>
  );
}

