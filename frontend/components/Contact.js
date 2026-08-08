"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import Reveal from "@/components/Reveal";
import {
  FiMail,
  FiMapPin,
  FiGithub,
  FiLinkedin,
  FiInstagram,
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
      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  const socials = [
    {
      href: profile.githubUrl,
      label: "GitHub",
      Icon: FiGithub,
    },
    {
      href: profile.linkedinUrl,
      label: "LinkedIn",
      Icon: FiLinkedin,
    },
    {
      href: profile.instagramUrl,
      label: "Instagram",
      Icon: FiInstagram,
    },
  ].filter((s) => s.href);

  return (
    <section>
      <Reveal>
        <div className="space-y-3">
          <p className="font-mono text-sm text-accent">Contact</p>

          <h2 className="text-3xl font-semibold text-ink">
            Let's work together
          </h2>

          <p className="max-w-2xl text-muted">
            Have a project in mind, an opening on your team, or just want to
            say hello? I read every message and usually reply within a day or
            two.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <div className="card space-y-5 p-6">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-3 text-sm text-ink transition hover:text-accent"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-surface2">
                  <FiMail size={16} />
                </span>

                {profile.email}
              </a>

              {profile.location && (
                <div className="flex items-center gap-3 text-sm text-muted">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-surface2">
                    <FiMapPin size={16} />
                  </span>

                  {profile.location}
                </div>
              )}

              {profile.availability && (
                <div className="flex items-center gap-2 font-mono text-xs text-accent2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent2" />
                  Currently available for work
                </div>
              )}
            </div>

            {socials.length > 0 && (
              <div className="card flex gap-3 p-4">
                {socials.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted transition hover:border-accent hover:text-accent"
                  >
                    <Icon size={17} />
                  </a>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="card space-y-5 p-6 lg:col-span-3"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="name">
                  Name
                </label>

                <input
                  id="name"
                  required
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
                className="input mt-2 resize-none"
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="btn-primary"
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
                <span className="font-mono text-sm text-red-400">
                  {error}
                </span>
              )}
            </div>
          </form>
        </div>
      </Reveal>
    </section>
  );
}