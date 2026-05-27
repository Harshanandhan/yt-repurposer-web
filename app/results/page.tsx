"use client";

import { useEffect, useState } from "react";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import type { Post } from "@/lib/supabase";

interface ResultData {
  posts: Post[];
  isPro: boolean;
}

export default function ResultsPage() {
  const [data, setData] = useState<ResultData | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("repurpose_results");
    if (raw) setData(JSON.parse(raw));
  }, []);

  if (!data) {
    return (
      <div className="text-center py-32 text-gray-400">
        No results found.{" "}
        <Link href="/" className="text-violet-600 hover:underline">Go back</Link>
      </div>
    );
  }

  const { posts, isPro } = data;

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-10 text-center">
        <p className="text-violet-200 text-sm font-medium uppercase tracking-widest mb-2">Done!</p>
        <h1 className="text-3xl font-bold text-white">Your LinkedIn posts are ready</h1>
        <p className="text-violet-200 mt-2 text-sm">
          {posts.length} posts generated · Click <span className="text-white font-medium">Copy</span> on any card to grab it
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-6">

        {/* Upgrade banner for free users */}
        {!isPro && (
          <div className="border border-violet-200 bg-violet-50 rounded-2xl p-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-violet-900">Unlock 3 more post styles</p>
              <p className="text-sm text-violet-600 mt-0.5">Get Listicle, Hot Take & How-To with Pro — $19/mo</p>
            </div>
            <Link
              href="/pricing"
              className="shrink-0 bg-violet-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-violet-700 transition-colors"
            >
              Upgrade →
            </Link>
          </div>
        )}

        {/* Post cards */}
        <div className="flex flex-col gap-5">
          {posts.map((post) => (
            <PostCard key={post.style} post={post} />
          ))}
        </div>

        {/* Bottom actions */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href="/"
            className="text-sm font-medium text-violet-600 border border-violet-200 px-4 py-2.5 rounded-xl hover:bg-violet-50 transition-colors"
          >
            + Generate another video
          </Link>
          {!isPro && (
            <Link href="/pricing" className="text-sm text-gray-400 hover:text-violet-600 transition-colors">
              See all 5 styles →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
