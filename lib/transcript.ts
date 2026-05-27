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
  content?: string | SupadataChunk[];
  chunks?: SupadataChunk[];
  lang?: string;
  error?: string;
}

export async function fetchTranscript(videoId: string): Promise<string> {
  const apiKey = process.env.SUPADATA_API_KEY;
  if (!apiKey) throw new Error("SUPADATA_API_KEY is not configured");

  const ytUrl = encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`);
  const url = `https://api.supadata.ai/v1/youtube/transcript?url=${ytUrl}`;

  const MAX_ATTEMPTS = 3;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, attempt * 1500));

    const res = await fetch(url, { headers: { "x-api-key": apiKey } });

    if (res.status === 503 || res.status === 429) {
      if (attempt < MAX_ATTEMPTS - 1) continue;
      throw new Error("Transcript service is temporarily busy. Please try again in a moment.");
    }

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Transcript service error ${res.status}${body ? `: ${body}` : ""}`);
    }

    const data = (await res.json()) as SupadataResponse;
    if (data.error) throw new Error(data.error);

    let text = "";
    if (typeof data.content === "string") {
      text = data.content.trim();
    } else if (Array.isArray(data.content)) {
      text = data.content.map((c) => c.text).join(" ").trim();
    } else if (Array.isArray(data.chunks)) {
      text = data.chunks.map((c) => c.text).join(" ").trim();
    }

    if (!text) throw new Error("No transcript content found for this video");
    return text;
  }

  throw new Error("Transcript service is temporarily busy. Please try again in a moment.");
}
