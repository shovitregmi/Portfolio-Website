"use client";

import { useEffect, useState } from "react";

export default function StatusBar({ profile }) {
  const [time, setTime] = useState(null);

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Kathmandu",
        })
      );
    update();
    const interval = setInterval(update, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 hidden border-t border-border bg-surface font-mono text-xs text-muted sm:flex">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-1.5">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                profile.availability ? "bg-accent2" : "bg-muted"
              }`}
            />
            {profile.availability ? "open to work" : "not available"}
          </span>
          <span>main</span>
        </div>
        <div className="flex items-center gap-4">
          {profile.location && <span>{profile.location}</span>}
          {time && <span>{time} (Kathmandu)</span>}
        </div>
      </div>
    </div>
  );
}
