import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { extractVideoId, fetchTranscript } from "@/lib/transcript";
import { generatePosts } from "@/lib/anthropic";
import { getOrCreateUser, getUserPlan, saveGeneration } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  const body = await req.json();
  const { url, topicHint } = body as { url: string; topicHint?: string };

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  let videoId: string;
  try {
    videoId = extractVideoId(url);
  } catch {
    return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
  }

  let isPro = false;
  let dbUserId: string | null = null;

  if (userId) {
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress;
    const dbUser = await getOrCreateUser(userId, email);
    dbUserId = dbUser.id;
    const plan = await getUserPlan(userId);
    isPro = plan === "pro";
  }

  let transcript: string;
  try {
    transcript = await fetchTranscript(videoId);
  } catch {
    return NextResponse.json(
      { error: "Could not fetch transcript. The video may have captions disabled." },
      { status: 422 }
    );
  }

  let posts;
  try {
    posts = await generatePosts(transcript, isPro, topicHint);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "AI generation failed";
    const isQuota = msg.includes("429") || msg.includes("quota") || msg.includes("Too Many Requests");
    return NextResponse.json(
      { error: isQuota ? "AI quota exceeded. Please try again in a few seconds." : msg },
      { status: 500 }
    );
  }

  if (dbUserId) {
    await saveGeneration(dbUserId, videoId, url, posts);
  }

  return NextResponse.json({ posts, isPro, videoId });
}
