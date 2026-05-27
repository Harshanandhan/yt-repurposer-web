import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getUserGenerations, getUserPlan } from "@/lib/supabase";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const [generations, plan] = await Promise.all([
    getUserGenerations(user.id),
    getUserPlan(user.id),
  ]);

  return (
    <div className="flex flex-col min-h-[80vh]">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-12">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-violet-200 text-sm font-medium mb-1">Your dashboard</p>
            <h1 className="text-3xl font-bold text-white">
              {generations.length} video{generations.length !== 1 ? "s" : ""} repurposed
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
              plan === "pro"
                ? "bg-white/20 text-white border-white/30"
                : "bg-white/10 text-violet-200 border-white/20"
            }`}>
              {plan === "pro" ? "Pro plan" : "Free plan"}
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

      {/* Content */}
      <div className="flex-1 px-6 py-10">
        <div className="max-w-4xl mx-auto">
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
            <div className="flex flex-col gap-4">
              {generations.map((gen) => (
                <div
                  key={gen.id}
                  className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-start gap-4 hover:shadow-sm transition-shadow"
                >
                  {/* YouTube thumbnail */}
                  <img
                    src={`https://img.youtube.com/vi/${gen.video_id}/mqdefault.jpg`}
                    alt="Video thumbnail"
                    className="w-full sm:w-36 h-24 sm:h-20 object-cover rounded-xl shrink-0 bg-gray-100"
                  />

                  <div className="flex-1 min-w-0">
                    <a
                      href={gen.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-violet-600 hover:underline break-all"
                    >
                      {gen.video_url}
                    </a>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(gen.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {gen.posts.map((post) => (
                        <span
                          key={post.style}
                          className="text-xs px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-100 font-medium capitalize"
                        >
                          {post.style.replace("_", " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
