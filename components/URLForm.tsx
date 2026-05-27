"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { POST_STYLES } from "@/lib/post-styles";

export default function URLForm({ dark = false }: { dark?: boolean }) {
  const [url, setUrl] = useState("");
  const [topicHint, setTopicHint] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [selected, setSelected] = useState<string[]>(["story", "insight"]);
  const router = useRouter();

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data }) => {
      const signedIn = !!data.session;
      setIsSignedIn(signedIn);
      // Pre-select all available styles based on auth status
      setSelected(
        POST_STYLES.filter((s) => signedIn || !s.proOnly).map((s) => s.name)
      );
    });
  }, []);

  const toggleStyle = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const availableStyles = POST_STYLES.filter((s) => isSignedIn || !s.proOnly);
  const allSelected = availableStyles.every((s) => selected.includes(s.name));

  const toggleAll = () => {
    setSelected(allSelected ? [] : availableStyles.map((s) => s.name));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selected.length === 0) {
      setError("Please select at least one post style.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/repurpose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, topicHint, selectedStyles: selected }),
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

  const inputBase = dark
    ? "bg-white/10 border-white/20 text-white placeholder-violet-300 focus:border-white/40"
    : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-violet-100 focus:border-violet-400";

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 w-full">
      {/* URL input row */}
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
          disabled={loading || selected.length === 0}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${
            dark
              ? "bg-white text-violet-600 hover:bg-violet-50"
              : "bg-violet-600 text-white hover:bg-violet-700"
          }`}
        >
          {loading
            ? "Generating…"
            : `Generate ${selected.length} post${selected.length !== 1 ? "s" : ""}`}
        </button>
      </div>

      {/* Style picker */}
      <div className={`rounded-2xl border p-4 flex flex-col gap-3 ${
        dark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"
      }`}>
        <div className="flex items-center justify-between">
          <p className={`text-xs font-semibold uppercase tracking-wider ${dark ? "text-violet-300" : "text-gray-500"}`}>
            Choose post styles
          </p>
          <button
            type="button"
            onClick={toggleAll}
            className={`text-xs font-medium transition-colors ${dark ? "text-violet-300 hover:text-white" : "text-violet-600 hover:text-violet-800"}`}
          >
            {allSelected ? "Deselect all" : "Select all"}
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {POST_STYLES.map((style) => {
            const locked = style.proOnly && !isSignedIn;
            const checked = selected.includes(style.name) && !locked;

            return (
              <label
                key={style.name}
                className={`flex items-start gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all select-none ${
                  locked
                    ? dark
                      ? "opacity-40 cursor-not-allowed border-white/10 bg-white/5"
                      : "opacity-40 cursor-not-allowed border-gray-200 bg-white"
                    : checked
                      ? dark
                        ? "bg-white/15 border-white/30"
                        : "bg-violet-50 border-violet-300"
                      : dark
                        ? "bg-white/5 border-white/10 hover:bg-white/10"
                        : "bg-white border-gray-200 hover:border-violet-200"
                }`}
              >
                <input
                  type="checkbox"
                  disabled={locked}
                  checked={checked}
                  onChange={() => !locked && toggleStyle(style.name)}
                  className="mt-0.5 accent-violet-600 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-900"}`}>
                      {style.label}
                    </span>
                    {locked && (
                      <a
                        href="/sign-in"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-full hover:bg-violet-200 transition-colors"
                      >
                        Sign in to unlock
                      </a>
                    )}
                  </div>
                  <p className={`text-xs mt-0.5 leading-snug ${dark ? "text-violet-300" : "text-gray-500"}`}>
                    {style.description}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Topic hint toggle */}
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
          className={`rounded-xl px-4 py-2.5 text-sm outline-none border transition-all ${inputBase}`}
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
