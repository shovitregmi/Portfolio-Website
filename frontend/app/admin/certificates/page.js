"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const empty = {
  title: "",
  issuer: "",
  issueDate: "",
  credentialId: "",
  credentialUrl: "",
  imageUrl: "",
  status: "completed",
  order: 0,
};

const STATUS_OPTIONS = [
  { value: "completed", label: "Completed" },
  { value: "participated", label: "Participated" },
  { value: "in_progress", label: "In Progress" },
];

export default function CertificatesAdminPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    api
      .get("/certificates")
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
      issueDate: item.issueDate ? item.issueDate.slice(0, 10) : "",
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
        await api.put(`/certificates/${editingId}`, payload);
      } else {
        await api.post("/certificates", payload);
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
    if (!confirm("Delete this certificate?")) return;
    try {
      await api.del(`/certificates/${id}`);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <p className="eyebrow">Certificates</p>
      <h1 className="font-display mt-2 text-2xl font-semibold">
        {editingId ? "Edit certificate" : "Add certificate"}
      </h1>

      <form onSubmit={handleSubmit} className="card mt-6 grid gap-5 p-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="title">Title</label>
          <input id="title" required className="input mt-2" value={form.title} onChange={(e) => update("title", e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="issuer">Issuer</label>
          <input id="issuer" required className="input mt-2" value={form.issuer} onChange={(e) => update("issuer", e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="issueDate">Issue date</label>
          <input id="issueDate" type="date" className="input mt-2" value={form.issueDate} onChange={(e) => update("issueDate", e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="credentialId">Credential ID</label>
          <input id="credentialId" className="input mt-2" value={form.credentialId || ""} onChange={(e) => update("credentialId", e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="status">Status</label>
          <select id="status" className="input mt-2" value={form.status} onChange={(e) => update("status", e.target.value)}>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="credentialUrl">Credential URL</label>
          <input id="credentialUrl" className="input mt-2" value={form.credentialUrl || ""} onChange={(e) => update("credentialUrl", e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="imageUrl">Image URL</label>
          <input id="imageUrl" className="input mt-2" value={form.imageUrl || ""} onChange={(e) => update("imageUrl", e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="order">Display order</label>
          <input id="order" type="number" className="input mt-2" value={form.order} onChange={(e) => update("order", e.target.value)} />
        </div>
        <div className="flex items-center gap-4 sm:col-span-2">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Update" : "Add certificate"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn-ghost">Cancel</button>
          )}
          {error && <span className="font-mono text-sm text-red-400">{error}</span>}
        </div>
      </form>

      <h2 className="font-display mt-12 text-xl font-semibold">All certificates</h2>
      {loading ? (
        <p className="mt-4 font-mono text-sm text-muted">Loading...</p>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="card flex items-center justify-between gap-4 p-4">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted">{item.issuer} · {item.status}</p>
              </div>
              <div className="flex shrink-0 gap-3">
                <button onClick={() => startEdit(item)} className="font-mono text-xs text-accent hover:underline">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="font-mono text-xs text-red-400 hover:underline">Delete</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="font-mono text-sm text-muted">No certificates yet.</p>}
        </div>
      )}
    </div>
  );
}
