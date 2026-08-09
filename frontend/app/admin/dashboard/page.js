"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const fields = [
  { key: "name", label: "Name" },
  { key: "title", label: "Title" },
  { key: "tagline", label: "Tagline" },
  { key: "major", label: "Major (shown in About stat card)" },
  { key: "location", label: "Location" },
  { key: "email", label: "Contact email" },
  { key: "phone", label: "Phone (optional)" },
  { key: "resumeUrl", label: "Resume URL (optional)" },
  { key: "avatarUrl", label: "Avatar image URL (optional)" },
  { key: "githubUrl", label: "GitHub URL" },
  { key: "linkedinUrl", label: "LinkedIn URL" },
  { key: "instagramUrl", label: "Instagram URL" },
  { key: "whatsappUrl", label: "WhatsApp link" },
];

export default function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | saving | saved | error
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/profile")
      .then(setProfile)
      .then(() => setStatus("ready"))
      .catch((err) => {
        setError(err.message);
        setStatus("error");
      });
  }, []);

  function update(key, value) {
    setProfile((p) => ({ ...p, [key]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setStatus("saving");
    setError("");
    try {
      const updated = await api.put("/profile", profile);
      setProfile(updated);
      setStatus("saved");
      setTimeout(() => setStatus("ready"), 1500);
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  if (status === "loading") {
    return <p className="font-mono text-sm text-muted">Loading profile...</p>;
  }

  if (!profile) {
    return (
      <p className="font-mono text-sm text-red-400">
        Could not load profile: {error}
      </p>
    );
  }

  return (
    <div>
      <p className="eyebrow">Overview</p>
      <h1 className="font-display mt-2 text-2xl font-semibold">Site content</h1>
      <p className="mt-2 text-sm text-muted">
        This is what powers your homepage. Changes appear on the live site
        within a minute.
      </p>

      <form onSubmit={handleSave} className="mt-8 space-y-6">
        <div className="card p-6">
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={!!profile.availability}
              onChange={(e) => update("availability", e.target.checked)}
              className="h-4 w-4"
            />
            Show &quot;available for work&quot; status
          </label>
        </div>

        <div className="card grid gap-5 p-6 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="label" htmlFor={f.key}>
                {f.label}
              </label>
              <input
                id={f.key}
                className="input mt-2"
                value={profile[f.key] || ""}
                onChange={(e) => update(f.key, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="card p-6">
          <label className="label" htmlFor="bio">
            Bio
          </label>
          <textarea
            id="bio"
            rows={6}
            className="input mt-2 resize-none"
            value={profile.bio || ""}
            onChange={(e) => update("bio", e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="btn-primary"
            disabled={status === "saving"}
          >
            {status === "saving" ? "Saving..." : "Save changes"}
          </button>
          {status === "saved" && (
            <span className="font-mono text-sm text-accent2">Saved.</span>
          )}
          {status === "error" && (
            <span className="font-mono text-sm text-red-400">{error}</span>
          )}
        </div>
      </form>
    </div>
  );
}
