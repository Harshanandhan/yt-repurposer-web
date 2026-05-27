import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getUserGenerations, getUserPlan } from "@/lib/supabase";
import { redirect } from "next/navigation";
import Link from "next/link";

const STYLE_COLORS: Record<string, string> = {
  story:    "bg-blue-50 text-blue-700 border-blue-200",
  insight:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  listicle: "bg-amber-50 text-amber-700 border-amber-200",
  hot_take: "bg-red-50 text-red-700 border-red-200",
  how_to:   "bg-violet-50 text-violet-700 border-violet-200",
};

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const [generations, plan] = await Promise.all([
    getUserGenerations(user.id),
    getUserPlan(user.id),
  ]);

  const totalPosts = generations.reduce((sum, g) => sum + g.posts.length, 0);

  return (
    <div className="flex flex-col min-h-[80vh]">

      {/* Header banner */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-12">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-violet-200 text-sm font-medium mb-1">Welcome back</p>
            <h1 className="text-3xl font-bold text-white">Your dashboard</h1>
            <p className="text-violet-300 text-sm mt-1">{user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
              plan === "pro"
                ? "bg-white/20 text-white border-white/30"
                : "bg-white/10 text-violet-200 border-white/20"
            }`}>
              {plan === "pro" ? "Pro — unlimited" : "Free — 5 videos/day"}
            </span>
            {plan === "free" && (
              <Link
                href="/pricing"
                className="text-sm bg-white text-violet-600 px-4 py-2 rounded-full hover:bg-violet-50 transition-colors font-semibold"
              >
                Upgrade to Pro
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-indigo-50 border-b border-indigo-100 px-6 py-6">
        <div className="max-w-5xl mx-auto grid grid-cols-3 divide-x divide-indigo-200">
          <div className="flex flex-col items-center gap-0.5 text-center px-6">
            <span className="text-3xl font-bold text-violet-600">{generations.length}</span>
            <span className="text-sm text-gray-500">Videos repurposed</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 text-center px-6">
            <span className="text-3xl font-bold text-violet-600">{totalPosts}</span>
            <span className="text-sm text-gray-500">Posts generated</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 text-center px-6">
            <span className="text-3xl font-bold text-violet-600">{plan === "pro" ? "∞" : "5/day"}</span>
            <span className="text-sm text-gray-500">Daily limit</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-5xl mx-auto">
          {generations.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M15 10l4.553-2.277A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-lg font-semibold text-gray-900">No videos yet</p>
              <p className="text-gray-400 text-sm">Paste a YouTube URL on the home page to get started.</p>
              <Link
                href="/"
                className="bg-violet-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors"
              >
                Repurpose a video
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              {/* Table header */}
              <div className="grid grid-cols-[3rem_1fr_auto_auto_auto] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div>#</div>
                <div>Video</div>
                <div className="text-center">Posts</div>
                <div>Date</div>
                <div></div>
              </div>

              {/* Table rows */}
              {generations.map((gen, i) => (
                <div
                  key={gen.id}
                  className={`grid grid-cols-[3rem_1fr_auto_auto_auto] gap-4 px-5 py-4 items-center ${
                    i < generations.length - 1 ? "border-b border-gray-100" : ""
                  } hover:bg-gray-50/50 transition-colors`}
                >
                  {/* Row number */}
                  <div className="text-sm font-semibold text-gray-400">{i + 1}</div>

                  {/* Video info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={`https://img.youtube.com/vi/${gen.video_id}/mqdefault.jpg`}
                      alt=""
                      className="w-20 h-12 object-cover rounded-lg shrink-0 bg-gray-100"
                    />
                    <div className="min-w-0">
                      <a
                        href={gen.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-violet-600 hover:underline font-medium block truncate"
                      >
                        {gen.video_url}
                      </a>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {gen.posts.map((post) => (
                          <span
                            key={post.style}
                            className={`text-xs px-1.5 py-0.5 rounded-full border font-medium capitalize ${STYLE_COLORS[post.style] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}
                          >
                            {post.style.replace("_", " ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Post count */}
                  <div className="text-center">
                    <span className="text-sm font-bold text-gray-900">{gen.posts.length}</span>
                    <span className="text-xs text-gray-400 block">posts</span>
                  </div>

                  {/* Date */}
                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    {new Date(gen.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>

                  {/* View posts */}
                  <Link
                    href={`/dashboard/${gen.id}`}
                    className="text-xs font-semibold text-violet-600 hover:text-violet-700 border border-violet-200 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                  >
                    View posts
                  </Link>
                </div>
              ))}

              {/* Footer */}
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  {generations.length} video{generations.length !== 1 ? "s" : ""} · {totalPosts} posts total
                </p>
                <Link
                  href="/"
                  className="text-xs font-semibold text-violet-600 hover:text-violet-700"
                >
                  + Repurpose another video
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
