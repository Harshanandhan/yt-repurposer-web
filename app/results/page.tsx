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
      <div className="text-center py-16 text-gray-500">
        No results found. <Link href="/" className="underline">Go back</Link>
      </div>
    );
  }

  const { posts, isPro } = data;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Your LinkedIn posts</h1>
        <Link href="/" className="text-sm text-indigo-600 hover:underline">
          Generate another
        </Link>
      </div>

      {!isPro && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-center justify-between gap-4">
          <p className="text-sm text-indigo-800">
            You got 2 of 5 post styles. Upgrade to Pro to unlock Listicle, Hot Take &amp; How-To.
          </p>
          <Link
            href="/pricing"
            className="text-sm font-medium bg-indigo-600 text-white px-3 py-1.5 rounded-lg whitespace-nowrap hover:bg-indigo-700"
          >
            Upgrade
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <PostCard key={post.style} post={post} />
        ))}
      </div>
    </div>
  );
}
