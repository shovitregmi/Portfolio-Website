"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const empty = {
  title: "", summary: "", description: "", imageUrl: "",
  tags: "", liveUrl: "", repoUrl: "", featured: false, order: 0,
};

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    api.get("/projects").then(setProjects).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }

  useEffect(load, []);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function startEdit(project) {
    setEditingId(project.id);
    setForm({
      ...project,
      tags: (project.tags || []).join(", "),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(empty);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      order: Number(form.order) || 0,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, payload);
      } else {
        await api.post("/projects", payload);
      }
      resetForm();
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this project?")) return;
    try {
      await api.del(`/projects/${id}`);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <p className="eyebrow">Projects</p>
      <h1 className="font-display mt-2 text-2xl font-semibold">
        {editingId ? "Edit project" : "Add a project"}
      </h1>

      <form onSubmit={handleSubmit} className="card mt-6 grid gap-5 p-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="title">Title</label>
          <input id="title" required className="input mt-2" value={form.title} onChange={(e) => update("title", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="summary">Summary (one line)</label>
          <input id="summary" required className="input mt-2" value={form.summary} onChange={(e) => update("summary", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="description">Description</label>
          <textarea id="description" required rows={4} className="input mt-2 resize-none" value={form.description} onChange={(e) => update("description", e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="imageUrl">Image URL</label>
          <input id="imageUrl" className="input mt-2" value={form.imageUrl || ""} onChange={(e) => update("imageUrl", e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="tags">Tags (comma-separated)</label>
          <input id="tags" className="input mt-2" value={form.tags} onChange={(e) => update("tags", e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="liveUrl">Live URL</label>
          <input id="liveUrl" className="input mt-2" value={form.liveUrl || ""} onChange={(e) => update("liveUrl", e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="repoUrl">Repo URL</label>
          <input id="repoUrl" className="input mt-2" value={form.repoUrl || ""} onChange={(e) => update("repoUrl", e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="order">Display order</label>
          <input id="order" type="number" className="input mt-2" value={form.order} onChange={(e) => update("order", e.target.value)} />
        </div>
        <label className="flex items-center gap-2 self-end pb-3 text-sm">
          <input type="checkbox" checked={!!form.featured} onChange={(e) => update("featured", e.target.checked)} className="h-4 w-4" />
          Featured
        </label>

        <div className="flex items-center gap-4 sm:col-span-2">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Update project" : "Add project"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancel
            </button>
          )}
          {error && <span className="font-mono text-sm text-red-400">{error}</span>}
        </div>
      </form>

      <h2 className="font-display mt-12 text-xl font-semibold">All projects</h2>
      {loading ? (
        <p className="mt-4 font-mono text-sm text-muted">Loading...</p>
      ) : (
        <div className="mt-4 space-y-3">
          {projects.map((project) => (
            <div key={project.id} className="card flex items-center justify-between gap-4 p-4">
              <div>
                <p className="font-medium">{project.title}</p>
                <p className="text-sm text-muted">{project.summary}</p>
              </div>
              <div className="flex shrink-0 gap-3">
                <button onClick={() => startEdit(project)} className="font-mono text-xs text-accent hover:underline">
                  Edit
                </button>
                <button onClick={() => handleDelete(project.id)} className="font-mono text-xs text-red-400 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {projects.length === 0 && <p className="font-mono text-sm text-muted">No projects yet.</p>}
        </div>
      )}
    </div>
  );
}
