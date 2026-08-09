"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import Reveal from "@/components/Reveal";
import {
  FiMail,
  FiGithub,
  FiLinkedin,
  FiInstagram,
  FiMessageCircle,
  FiArrowRight,
} from "react-icons/fi";

export default function Contact({ profile }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      await api.post("/messages", form);
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  const rows = [
    {
      label: "Email",
      value: "Send me an email",
      href: `mailto:${profile.email}`,
      Icon: FiMail,
    },
    {
      label: "GitHub",
      value: "View my GitHub",
      href: profile.githubUrl,
      Icon: FiGithub,
    },
    {
      label: "LinkedIn",
      value: "Connect on LinkedIn",
      href: profile.linkedinUrl,
      Icon: FiLinkedin,
    },
    {
      label: "Instagram",
      value: "Follow on Instagram",
      href: profile.instagramUrl,
      Icon: FiInstagram,
    },
    {
      label: "WhatsApp",
      value: "Message on WhatsApp",
      href: profile.whatsappUrl,
      Icon: FiMessageCircle,
    },
  ].filter((r) => r.href);

  return (
    <section id="contact" className="section">
      <div className="grid gap-12 lg:grid-cols-5">
        <Reveal className="lg:col-span-2">
          <p className="eyebrow flex items-center gap-2">
            <span className="h-px w-6 bg-accent" />
            Contact
          </p>
          <h2 className="font-display mt-4 text-4xl font-semibold leading-tight md:text-5xl">
            Let&apos;s build something{" "}
            <span className="text-accent italic">worth building</span>.
          </h2>
          <p className="mt-5 text-muted">
            Have a project in mind, an opening on your team, or just want to say
            hello? I read every message and usually reply within a day or two.
          </p>

          {rows.length > 0 && (
            <div className="mt-8 overflow-hidden rounded-lg border border-border">
              {rows.map((row) => (
                <a
                  key={row.label}
                  href={row.href}
                  target={row.label === "Email" ? undefined : "_blank"}
                  rel={
                    row.label === "Email" ? undefined : "noopener noreferrer"
                  }
                  className="group flex items-center gap-4 border-b border-border px-5 py-4 transition last:border-b-0 hover:bg-surface2"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-muted transition group-hover:border-accent group-hover:text-accent">
                    <row.Icon size={17} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="label block">{row.label}</span>
                    <span className="block truncate text-sm text-ink">
                      {row.value}
                    </span>
                  </span>
                  <FiArrowRight
                    size={16}
                    className="shrink-0 text-muted opacity-0 transition group-hover:translate-x-1 group-hover:text-accent group-hover:opacity-100"
                  />
                </a>
              ))}
            </div>
          )}
        </Reveal>

        <Reveal className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="card space-y-5 p-6 md:p-8">
            <h3 className="font-display text-xl font-semibold">
              Send a message
            </h3>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  required
                  placeholder="Your name"
                  className="input mt-2"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                />
              </div>
              <div>
                <label className="label" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="you@email.com"
                  className="input mt-2"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="subject">
                Subject (optional)
              </label>
              <input
                id="subject"
                placeholder="What's this about?"
                className="input mt-2"
                value={form.subject}
                onChange={(e) => update("subject", e.target.value)}
              />
            </div>

            <div>
              <label className="label" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                placeholder="Tell me about your project or idea..."
                className="input mt-2 resize-none"
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="btn-primary transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_30px_-6px_rgb(var(--color-accent))]"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending..." : "Send message"}
              </button>
              {status === "sent" && (
                <span className="font-mono text-sm text-accent2">
                  Message sent. Thanks!
                </span>
              )}
              {status === "error" && (
                <span className="font-mono text-sm text-red-400">{error}</span>
              )}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
