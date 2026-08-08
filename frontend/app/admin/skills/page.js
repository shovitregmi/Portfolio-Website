"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const empty = { name: "", category: "General", level: 70, order: 0 };

export default function SkillsAdminPage() {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    api.get("/skills").then(setSkills).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }

  useEffect(load, []);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function startEdit(skill) {
    setEditingId(skill.id);
    setForm(skill);
  }

  function resetForm() {
    setEditingId(null);
    setForm(empty);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = { ...form, level: Number(form.level), order: Number(form.order) || 0 };
    try {
      if (editingId) {
        await api.put(`/skills/${editingId}`, payload);
      } else {
        await api.post("/skills", payload);
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
    if (!confirm("Delete this skill?")) return;
    try {
      await api.del(`/skills/${id}`);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <p className="eyebrow">Skills</p>
      <h1 className="font-display mt-2 text-2xl font-semibold">
        {editingId ? "Edit skill" : "Add a skill"}
      </h1>

      <form onSubmit={handleSubmit} className="card mt-6 grid gap-5 sm:grid-cols-4 p-6">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="name">Name</label>
          <input id="name" required className="input mt-2" value={form.name} onChange={(e) => update("name", e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="category">Category</label>
          <input id="category" className="input mt-2" value={form.category} onChange={(e) => update("category", e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="level">Level (0-100)</label>
          <input id="level" type="number" min="0" max="100" className="input mt-2" value={form.level} onChange={(e) => update("level", e.target.value)} />
        </div>

        <div className="flex items-center gap-4 sm:col-span-4">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Update skill" : "Add skill"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancel
            </button>
          )}
          {error && <span className="font-mono text-sm text-red-400">{error}</span>}
        </div>
      </form>

      <h2 className="font-display mt-12 text-xl font-semibold">All skills</h2>
      {loading ? (
        <p className="mt-4 font-mono text-sm text-muted">Loading...</p>
      ) : (
        <div className="mt-4 space-y-3">
          {skills.map((skill) => (
            <div key={skill.id} className="card flex items-center justify-between gap-4 p-4">
              <div>
                <p className="font-medium">{skill.name}</p>
                <p className="text-sm text-muted">{skill.category} &middot; {skill.level}%</p>
              </div>
              <div className="flex shrink-0 gap-3">
                <button onClick={() => startEdit(skill)} className="font-mono text-xs text-accent hover:underline">
                  Edit
                </button>
                <button onClick={() => handleDelete(skill.id)} className="font-mono text-xs text-red-400 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {skills.length === 0 && <p className="font-mono text-sm text-muted">No skills yet.</p>}
        </div>
      )}
    </div>
  );
}
