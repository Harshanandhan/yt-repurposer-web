import { NextRequest, NextResponse } from "next/server";
import { extractVideoId, fetchTranscript } from "@/lib/transcript";
import { generatePosts } from "@/lib/anthropic";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getOrCreateUser, getUserPlan, saveGeneration } from "@/lib/supabase";

export async function POST(req: NextRequest) {
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

  // Try to get the current user (auth is optional — anonymous users can still generate)
  let isPro = false;
  let userId: string | null = null;

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const dbUser = await getOrCreateUser(user.id, user.email ?? undefined);
      isPro = dbUser.plan === "pro";
      userId = dbUser.id;
    }
  } catch {
    // No session — continue as anonymous
  }

  let transcript: string;
  try {
    transcript = await fetchTranscript(videoId);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    const isNoCaptions = msg.toLowerCase().includes("caption") || msg.toLowerCase().includes("transcript");
    return NextResponse.json(
      { error: isNoCaptions ? msg : "Could not fetch transcript. The video may have captions disabled." },
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

  // Save to DB if the user is signed in
  if (userId) {
    try {
      await saveGeneration(userId, videoId, url, posts);
    } catch {
      // Don't fail the request if saving fails
    }
  }

  return NextResponse.json({ posts, isPro, videoId });
}
