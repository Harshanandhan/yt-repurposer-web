"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function URLForm({ dark = false }: { dark?: boolean }) {
  const [url, setUrl] = useState("");
  const [topicHint, setTopicHint] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showHint, setShowHint] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/repurpose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, topicHint }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");

      sessionStorage.setItem("repurpose_results", JSON.stringify(data));
      router.push("/results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 w-full">
      <div className={`flex gap-2 p-1.5 rounded-2xl border transition-all ${
        dark
          ? "bg-white/10 border-white/20 focus-within:bg-white/15 focus-within:border-white/40"
          : "bg-white border-gray-200 shadow-sm focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100"
      }`}>
        <input
          type="url"
          placeholder="Paste a YouTube URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className={`flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder-opacity-70 ${
            dark ? "text-white placeholder-violet-200" : "text-gray-900 placeholder-gray-400"
          }`}
        />
        <button
          type="submit"
          disabled={loading}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${
            dark
              ? "bg-white text-violet-600 hover:bg-violet-50"
              : "bg-violet-600 text-white hover:bg-violet-700"
          }`}
        >
          {loading ? "Generating..." : "Generate posts"}
        </button>
      </div>

      <button
        type="button"
        onClick={() => setShowHint(!showHint)}
        className={`text-xs self-start transition-colors ${
          dark ? "text-violet-300 hover:text-white" : "text-gray-400 hover:text-gray-600"
        }`}
      >
        {showHint ? "▲ Hide topic hint" : "▼ Add a topic hint (optional)"}
      </button>

      {showHint && (
        <input
          type="text"
          placeholder="e.g. 'AI productivity hacks' — helps the AI write better posts"
          value={topicHint}
          onChange={(e) => setTopicHint(e.target.value)}
          className={`rounded-xl px-4 py-2.5 text-sm outline-none border transition-all ${
            dark
              ? "bg-white/10 border-white/20 text-white placeholder-violet-300 focus:border-white/40"
              : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-violet-100 focus:border-violet-400"
          }`}
        />
      )}

      {error && (
        <p className={`text-sm rounded-xl px-4 py-2.5 ${
          dark ? "bg-white/10 text-red-300 border border-red-400/30" : "text-red-500 bg-red-50 border border-red-100"
        }`}>
          {error}
        </p>
      )}
    </form>
  );
}
