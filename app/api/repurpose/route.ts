import { NextRequest, NextResponse } from "next/server";
import { extractVideoId, fetchTranscript } from "@/lib/transcript";
import { generatePosts } from "@/lib/anthropic";

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
    posts = await generatePosts(transcript, false, topicHint);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "AI generation failed";
    const isQuota = msg.includes("429") || msg.includes("quota") || msg.includes("Too Many Requests");
    return NextResponse.json(
      { error: isQuota ? "AI quota exceeded. Please try again in a few seconds." : msg },
      { status: 500 }
    );
  }

  return NextResponse.json({ posts, isPro: false, videoId });
}
