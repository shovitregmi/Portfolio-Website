"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";

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

  return (
    <div id="contact" className="section pb-28">
      <div className="contact-section">
        <SectionHeader
          number="06"
          label="Let's Talk"
          title="Get In"
          titleAccent="Touch"
          className="!mb-8"
        />

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <Reveal>
            <p className="text-[0.84rem] leading-relaxed text-muted2">
              I&apos;m currently open to internships, freelance projects, and
              full-time opportunities. If you have a project in mind or want to
              collaborate, feel free to reach out!
            </p>

            <div className="mt-7 space-y-3">
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-2.5 text-[0.78rem] text-muted transition hover:text-accent"
                >
                  <FiMail size={15} />
                  {profile.email}
                </a>
              )}
              {profile.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  className="flex items-center gap-2.5 text-[0.78rem] text-muted transition hover:text-accent"
                >
                  {profile.phone}
                </a>
              )}
              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-[0.78rem] text-muted transition hover:text-accent"
                >
                  <FiLinkedin size={15} />
                  LinkedIn
                </a>
              )}
              {profile.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-[0.78rem] text-muted transition hover:text-accent"
                >
                  <FiGithub size={15} />
                  GitHub
                </a>
              )}
              {profile.location && (
                <p className="text-[0.78rem] text-muted2">{profile.location}</p>
              )}
            </div>
          </Reveal>

          <Reveal>
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="label" htmlFor="name">
                  Your Name
                </label>
                <input
                  id="name"
                  required
                  placeholder="Your Name"
                  className="input mt-1.5"
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
                  placeholder="you@example.com"
                  className="input mt-1.5"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </div>
              <div>
                <label className="label" htmlFor="subject">
                  Subject
                </label>
                <input
                  id="subject"
                  placeholder="Internship / Collaboration / Project"
                  className="input mt-1.5"
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
                  placeholder="Tell me about your project or opportunity..."
                  className="input mt-1.5 resize-none"
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                />
              </div>

              {status === "sent" && (
                <p className="rounded-lg border border-accent/20 bg-accent/10 px-4 py-2.5 font-mono text-sm text-accent">
                  ✓ Message sent successfully!
                </p>
              )}
              {status === "error" && (
                <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 font-mono text-sm text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="btn-primary w-full"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending..." : "Send Message →"}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
