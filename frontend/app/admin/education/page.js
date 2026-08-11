"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const empty = {
  institution: "",
  degree: "",
  fieldOfStudy: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
  order: 0,
};

export default function EducationAdminPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    api
      .get("/education")
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function startEdit(item) {
    setEditingId(item.id);
    setForm({
      ...item,
      startDate: item.startDate ? item.startDate.slice(0, 10) : "",
      endDate: item.endDate ? item.endDate.slice(0, 10) : "",
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
    const payload = { ...form, order: Number(form.order) || 0 };
    try {
      if (editingId) {
        await api.put(`/education/${editingId}`, payload);
      } else {
        await api.post("/education", payload);
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
    if (!confirm("Delete this education entry?")) return;
    try {
      await api.del(`/education/${id}`);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <p className="eyebrow">Education</p>
      <h1 className="font-display mt-2 text-2xl font-semibold">
        {editingId ? "Edit education" : "Add education"}
      </h1>

      <form onSubmit={handleSubmit} className="card mt-6 grid gap-5 p-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="institution">Institution</label>
          <input id="institution" required className="input mt-2" value={form.institution} onChange={(e) => update("institution", e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="degree">Degree</label>
          <input id="degree" required className="input mt-2" value={form.degree} onChange={(e) => update("degree", e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="fieldOfStudy">Field of study</label>
          <input id="fieldOfStudy" className="input mt-2" value={form.fieldOfStudy || ""} onChange={(e) => update("fieldOfStudy", e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="location">Location</label>
          <input id="location" className="input mt-2" value={form.location || ""} onChange={(e) => update("location", e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="startDate">Start date</label>
          <input id="startDate" type="date" className="input mt-2" value={form.startDate} onChange={(e) => update("startDate", e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="endDate">End date</label>
          <input id="endDate" type="date" className="input mt-2" value={form.endDate || ""} onChange={(e) => update("endDate", e.target.value)} disabled={form.current} />
        </div>
        <div>
          <label className="label" htmlFor="order">Display order</label>
          <input id="order" type="number" className="input mt-2" value={form.order} onChange={(e) => update("order", e.target.value)} />
        </div>
        <label className="flex items-center gap-2 self-end pb-3 text-sm">
          <input type="checkbox" checked={!!form.current} onChange={(e) => update("current", e.target.checked)} className="h-4 w-4" />
          Currently studying here
        </label>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="description">Description (one bullet per line)</label>
          <textarea id="description" rows={4} className="input mt-2 resize-none" value={form.description || ""} onChange={(e) => update("description", e.target.value)} />
        </div>
        <div className="flex items-center gap-4 sm:col-span-2">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Update" : "Add education"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn-ghost">Cancel</button>
          )}
          {error && <span className="font-mono text-sm text-red-400">{error}</span>}
        </div>
      </form>

      <h2 className="font-display mt-12 text-xl font-semibold">All education</h2>
      {loading ? (
        <p className="mt-4 font-mono text-sm text-muted">Loading...</p>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="card flex items-center justify-between gap-4 p-4">
              <div>
                <p className="font-medium">{item.degree}</p>
                <p className="text-sm text-muted">{item.institution}</p>
              </div>
              <div className="flex shrink-0 gap-3">
                <button onClick={() => startEdit(item)} className="font-mono text-xs text-accent hover:underline">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="font-mono text-xs text-red-400 hover:underline">Delete</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="font-mono text-sm text-muted">No education entries yet.</p>}
        </div>
      )}
    </div>
  );
}
