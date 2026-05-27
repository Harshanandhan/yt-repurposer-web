"use client";

import { useState } from "react";

export default function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const res = await fetch("/api/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="text-sm bg-white/20 text-white border border-white/30 px-4 py-2 rounded-full hover:bg-white/30 transition-colors font-medium disabled:opacity-50"
    >
      {loading ? "Loading…" : "Manage subscription"}
    </button>
  );
}
