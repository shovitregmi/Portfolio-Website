"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

const navItems = [
  { href: "/admin/dashboard", label: "Overview" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/certificates", label: "Certificates" },
  { href: "/admin/messages", label: "Messages" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [admin, setAdmin] = useState(null);
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false);
      return;
    }
    api
      .get("/auth/me")
      .then((data) => setAdmin(data))
      .catch(() => router.replace("/admin/login"))
      .finally(() => setChecking(false));
  }, [isLoginPage, router]);

  if (isLoginPage) return children;

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg text-muted font-mono text-sm">
        Checking session...
      </div>
    );
  }

  if (!admin) return null; // redirect is in flight

  async function handleLogout() {
    await api.post("/auth/logout", {});
    router.replace("/admin/login");
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      <div className="flex min-h-screen">
        <aside className="hidden w-56 shrink-0 border-r border-border bg-surface p-6 md:block">
          <p className="font-display text-lg font-semibold">Admin</p>
          <p className="mt-1 truncate font-mono text-xs text-muted">{admin.email}</p>

          <nav className="mt-8 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm transition ${
                  pathname === item.href
                    ? "bg-surface2 text-accent"
                    : "text-muted hover:bg-surface2 hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-10 flex flex-col gap-2">
            <Link href="/" className="font-mono text-xs text-muted hover:text-ink">
              &larr; View live site
            </Link>
            <button
              onClick={handleLogout}
              className="text-left font-mono text-xs text-muted hover:text-red-400"
            >
              Log out
            </button>
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-10">
          <div className="mx-auto max-w-4xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
