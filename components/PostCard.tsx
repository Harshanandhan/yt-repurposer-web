"use client";

import { useState } from "react";
import type { Post } from "@/lib/supabase";

const STYLE_META: Record<string, { label: string; badge: string; accent: string }> = {
  story:    { label: "Story",    badge: "bg-blue-50 text-blue-700 border-blue-200",    accent: "border-l-blue-400" },
  insight:  { label: "Insight",  badge: "bg-emerald-50 text-emerald-700 border-emerald-200", accent: "border-l-emerald-400" },
  listicle: { label: "Listicle", badge: "bg-amber-50 text-amber-700 border-amber-200",  accent: "border-l-amber-400" },
  hot_take: { label: "Hot Take", badge: "bg-red-50 text-red-700 border-red-200",       accent: "border-l-red-400" },
  how_to:   { label: "How-To",   badge: "bg-violet-50 text-violet-700 border-violet-200", accent: "border-l-violet-400" },
};

export default function PostCard({ post }: { post: Post }) {
  const [copied, setCopied] = useState(false);
  const meta = STYLE_META[post.style] ?? {
    label: post.style,
    badge: "bg-gray-50 text-gray-700 border-gray-200",
    accent: "border-l-gray-400",
  };

  const copy = async () => {
    await navigator.clipboard.writeText(post.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`bg-white border border-gray-200 border-l-4 ${meta.accent} rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-200`}>
      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/50">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${meta.badge}`}>
          {meta.label}
        </span>
        <button
          onClick={copy}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
            copied
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-white text-gray-600 border-gray-200 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200"
          }`}
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M4 4V2.5A1.5 1.5 0 0 1 5.5 1H9.5A1.5 1.5 0 0 1 11 2.5v4A1.5 1.5 0 0 1 9.5 8H8" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              Copy post
            </>
          )}
        </button>
      </div>

      {/* Post content */}
      <div className="px-5 py-5">
        <p className="text-sm text-gray-900 whitespace-pre-wrap leading-7 font-normal">{post.content}</p>
      </div>
    </div>
  );
}
