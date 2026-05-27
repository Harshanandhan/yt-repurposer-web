import { YoutubeTranscript } from "youtube-transcript";

export function extractVideoId(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1);
    const v = parsed.searchParams.get("v");
    if (v) return v;
  } catch {
    // treat as bare video ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  }
  throw new Error("Could not extract video ID from URL");
}

export async function fetchTranscript(videoId: string): Promise<string> {
  const items = await YoutubeTranscript.fetchTranscript(videoId);
  return items.map((i) => i.text).join(" ");
}
