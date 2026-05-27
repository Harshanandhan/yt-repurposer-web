export function extractVideoId(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1);
    const v = parsed.searchParams.get("v");
    if (v) return v;
  } catch {
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  }
  throw new Error("Could not extract video ID from URL");
}

interface SupadataChunk {
  text: string;
  offset?: number;
  duration?: number;
}

interface SupadataResponse {
  content?: string;
  chunks?: SupadataChunk[];
  lang?: string;
  error?: string;
}

export async function fetchTranscript(videoId: string): Promise<string> {
  const apiKey = process.env.SUPADATA_API_KEY;
  if (!apiKey) throw new Error("SUPADATA_API_KEY is not configured");

  const ytUrl = encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`);
  const res = await fetch(
    `https://api.supadata.ai/v1/youtube/transcript?url=${ytUrl}`,
    { headers: { "x-api-key": apiKey } }
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Transcript service error ${res.status}${body ? `: ${body}` : ""}`);
  }

  const data = (await res.json()) as SupadataResponse;

  if (data.error) throw new Error(data.error);

  const text =
    data.content?.trim() ||
    data.chunks?.map((c) => c.text).join(" ").trim();

  if (!text) throw new Error("No transcript content found for this video");
  return text;
}
