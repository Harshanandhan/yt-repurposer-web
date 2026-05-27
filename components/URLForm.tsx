"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function URLForm() {
  const [url, setUrl] = useState("");
  const [topicHint, setTopicHint] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
    <form onSubmit={submit} className="flex flex-col gap-3 w-full max-w-xl">
      <input
        type="url"
        placeholder="https://youtube.com/watch?v=..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
        className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        type="text"
        placeholder="Optional: topic hint (e.g. 'AI productivity hacks')"
        value={topicHint}
        onChange={(e) => setTopicHint(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 text-white rounded-lg px-4 py-3 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Generating posts..." : "Generate LinkedIn posts"}
      </button>
    </form>
  );
}
