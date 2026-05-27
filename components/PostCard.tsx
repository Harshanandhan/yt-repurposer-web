"use client";

import { useState } from "react";
import type { Post } from "@/lib/supabase";

const STYLE_LABELS: Record<string, string> = {
  story: "Story",
  insight: "Insight",
  listicle: "Listicle",
  hot_take: "Hot Take",
  how_to: "How-To",
};

export default function PostCard({ post }: { post: Post }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(post.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
          {STYLE_LABELS[post.style] ?? post.style}
        </span>
        <button
          onClick={copy}
          className="text-xs text-gray-500 hover:text-gray-900 border border-gray-200 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{post.content}</p>
    </div>
  );
}
