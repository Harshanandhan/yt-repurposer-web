import { auth, currentUser } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getOrCreateUser, getUserGenerations } from "@/lib/supabase";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import type { Post } from "@/lib/supabase";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ upgrade?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { upgrade } = await searchParams;
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress;
  const dbUser = await getOrCreateUser(userId, email);
  const generations = await getUserGenerations(dbUser.id);

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* Gradient header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-12">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-sm text-violet-200 mt-0.5">
              {generations.length} video{generations.length !== 1 ? "s" : ""} repurposed ·{" "}
              <span className="capitalize font-medium text-white">{dbUser.plan}</span> plan
            </p>
          </div>
          <Link
            href="/"
            className="text-sm bg-white text-violet-600 px-4 py-2.5 rounded-xl hover:bg-violet-50 font-semibold transition-colors"
          >
            + New video
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto w-full px-6 py-10 flex flex-col gap-8">

      {upgrade === "success" && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-sm text-green-800 font-medium">
          🎉 You are now on Pro — all 5 post styles are unlocked!
        </div>
      )}

      {dbUser.plan === "free" && (
        <div className="border border-violet-200 bg-violet-50 rounded-2xl p-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-violet-900">Unlock all 5 post styles</p>
            <p className="text-sm text-violet-600 mt-0.5">Upgrade to Pro for $19/mo</p>
          </div>
          <Link
            href="/pricing"
            className="shrink-0 bg-violet-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-violet-700 transition-colors"
          >
            Upgrade →
          </Link>
        </div>
      )}

      {generations.length === 0 ? (
        <div className="text-center py-24 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center text-3xl">📭</div>
          <p className="text-gray-700 font-medium">No videos repurposed yet.</p>
          <p className="text-sm text-gray-400">Paste a YouTube URL to generate your first LinkedIn posts.</p>
          <Link
            href="/"
            className="text-sm font-semibold text-white bg-violet-600 px-5 py-2.5 rounded-xl hover:bg-violet-700 transition-colors"
          >
            Generate your first posts →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {generations.map((gen) => (
            <div key={gen.id} className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <a
                  href={gen.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-violet-600 hover:underline truncate max-w-sm font-medium"
                >
                  {gen.video_url}
                </a>
                <span className="text-xs text-gray-400 shrink-0 ml-4">
                  {new Date(gen.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {(gen.posts as Post[]).map((post) => (
                  <PostCard key={post.style} post={post} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
