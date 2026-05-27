import { NextRequest, NextResponse } from "next/server";
import { extractVideoId, fetchTranscript } from "@/lib/transcript";
import { generatePosts } from "@/lib/anthropic";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import {
  getOrCreateUser,
  getTodayGenerationCount,
  saveGeneration,
} from "@/lib/supabase";

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

  // Resolve the current user (optional — anonymous users can still generate)
  let isPro = false;
  let isSignedIn = false;
  let userId: string | null = null;

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const dbUser = await getOrCreateUser(user.id, user.email ?? undefined);
      isPro = dbUser.plan === "pro";
      isSignedIn = true;
      userId = dbUser.id;

      // Rate limit: free users get 1 generation per day
      if (!isPro) {
        const todayCount = await getTodayGenerationCount(userId);
        if (todayCount >= 1) {
          return NextResponse.json(
            {
              error:
                "You've used your 1 free generation for today. Upgrade to Pro for unlimited videos.",
            },
            { status: 429 }
          );
        }
      }
    }
  } catch {
    // No session — continue as anonymous
  }

  let transcript: string;
  try {
    transcript = await fetchTranscript(videoId);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    const isNoCaptions =
      msg.toLowerCase().includes("caption") ||
      msg.toLowerCase().includes("transcript");
    return NextResponse.json(
      {
        error: isNoCaptions
          ? msg
          : "Could not fetch transcript. The video may have captions disabled.",
      },
      { status: 422 }
    );
  }

  // Signed-in users always get all 5 styles. Anonymous users get 2.
  let posts;
  try {
    posts = await generatePosts(transcript, isSignedIn, topicHint);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "AI generation failed";
    const isQuota =
      msg.includes("429") ||
      msg.includes("quota") ||
      msg.includes("Too Many Requests");
    return NextResponse.json(
      {
        error: isQuota
          ? "AI quota exceeded. Please try again in a few seconds."
          : msg,
      },
      { status: 500 }
    );
  }

  // Save every generation for signed-in users
  if (userId) {
    try {
      await saveGeneration(userId, videoId, url, posts);
    } catch {
      // Don't fail the request if DB save fails
    }
  }

  return NextResponse.json({ posts, isPro: isSignedIn, videoId });
}
