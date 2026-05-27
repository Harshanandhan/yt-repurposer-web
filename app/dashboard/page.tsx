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
    <div className="max-w-3xl mx-auto px-4 py-10 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Plan: <span className="font-medium capitalize">{dbUser.plan}</span>
          </p>
        </div>
        <Link
          href="/"
          className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          New video
        </Link>
      </div>

      {upgrade === "success" && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
          You are now on Pro. All 5 post styles are unlocked.
        </div>
      )}

      {dbUser.plan === "free" && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-center justify-between gap-4">
          <p className="text-sm text-indigo-800">Upgrade to Pro to unlock all post styles and save history.</p>
          <Link
            href="/pricing"
            className="text-sm font-medium bg-indigo-600 text-white px-3 py-1.5 rounded-lg whitespace-nowrap hover:bg-indigo-700"
          >
            Upgrade
          </Link>
        </div>
      )}

      {generations.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          No generations yet.{" "}
          <Link href="/" className="underline text-indigo-600">
            Generate your first one
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {generations.map((gen) => (
            <div key={gen.id} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <a
                  href={gen.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 hover:underline truncate max-w-xs"
                >
                  {gen.video_url}
                </a>
                <span className="text-xs text-gray-400 shrink-0">
                  {new Date(gen.created_at).toLocaleDateString()}
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
  );
}
