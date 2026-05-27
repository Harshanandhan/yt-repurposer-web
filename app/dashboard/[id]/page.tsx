import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getGenerationById } from "@/lib/supabase";
import { notFound, redirect } from "next/navigation";
import PostCard from "@/components/PostCard";
import Link from "next/link";

export default async function GenerationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const generation = await getGenerationById(id, user.id);
  if (!generation) notFound();

  return (
    <div className="flex flex-col min-h-[80vh]">

      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-violet-300 hover:text-white text-sm mb-4 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to dashboard
          </Link>

          <div className="flex items-start gap-4">
            <img
              src={`https://img.youtube.com/vi/${generation.video_id}/mqdefault.jpg`}
              alt="Video thumbnail"
              className="w-28 h-20 object-cover rounded-xl shrink-0 bg-white/10"
            />
            <div className="min-w-0">
              <p className="text-violet-200 text-xs font-medium uppercase tracking-wider mb-1">
                {generation.posts.length} posts generated
              </p>
              <a
                href={generation.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-semibold hover:text-violet-200 transition-colors break-all text-sm"
              >
                {generation.video_url}
              </a>
              <p className="text-violet-300 text-xs mt-1">
                {new Date(generation.created_at).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="flex-1 px-6 py-10">
        <div className="max-w-4xl mx-auto flex flex-col gap-5">
          <h2 className="text-lg font-bold text-gray-900">Your posts</h2>
          {generation.posts.map((post) => (
            <PostCard key={post.style} post={post} />
          ))}
        </div>
      </div>

    </div>
  );
}
