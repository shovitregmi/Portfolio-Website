"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    api.get("/messages").then(setMessages).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function toggleRead(msg) {
    try {
      await api.patch(`/messages/${msg.id}`, { read: !msg.read });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this message?")) return;
    try {
      await api.del(`/messages/${id}`);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <p className="eyebrow">Messages</p>
      <h1 className="font-display mt-2 text-2xl font-semibold">Contact form submissions</h1>

      {error && <p className="mt-4 font-mono text-sm text-red-400">{error}</p>}

      {loading ? (
        <p className="mt-4 font-mono text-sm text-muted">Loading...</p>
      ) : (
        <div className="mt-6 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`card p-5 ${msg.read ? "opacity-60" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {msg.name} <span className="font-mono text-xs text-muted">&lt;{msg.email}&gt;</span>
                  </p>
                  {msg.subject && <p className="mt-1 text-sm text-accent">{msg.subject}</p>}
                </div>
                <p className="font-mono text-xs text-muted">
                  {new Date(msg.createdAt).toLocaleString()}
                </p>
              </div>
              <p className="mt-3 whitespace-pre-line text-sm text-muted">{msg.message}</p>
              <div className="mt-4 flex gap-4">
                <button onClick={() => toggleRead(msg)} className="font-mono text-xs text-accent hover:underline">
                  {msg.read ? "Mark unread" : "Mark read"}
                </button>
                <button onClick={() => handleDelete(msg.id)} className="font-mono text-xs text-red-400 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {messages.length === 0 && <p className="font-mono text-sm text-muted">No messages yet.</p>}
        </div>
      )}
    </div>
  );
}
