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

const HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  Cookie: "CONSENT=YES+cb; SOCS=CAESEwgDEgk0ODE3Nzk3MjQaAmVuIAEaBgiA_LyaBg",
};

function extractJsonObject(str: string): unknown {
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (escape) { escape = false; continue; }
    if (ch === "\\" && inString) { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return JSON.parse(str.slice(0, i + 1));
    }
  }
  throw new Error("Incomplete JSON object");
}

interface CaptionTrack {
  baseUrl: string;
  languageCode: string;
  kind?: string;
}

interface PlayerResponse {
  captions?: {
    playerCaptionsTracklistRenderer?: {
      captionTracks?: CaptionTrack[];
    };
  };
}

interface CaptionEvent {
  segs?: { utf8?: string }[];
}

export async function fetchTranscript(videoId: string): Promise<string> {
  const watchRes = await fetch(
    `https://www.youtube.com/watch?v=${videoId}&hl=en`,
    { headers: HEADERS }
  );
  if (!watchRes.ok) throw new Error(`YouTube returned ${watchRes.status}`);

  const html = await watchRes.text();

  const marker = "ytInitialPlayerResponse = ";
  const idx = html.indexOf(marker);
  if (idx === -1) throw new Error("Could not find player response in YouTube page");

  const playerResponse = extractJsonObject(html.slice(idx + marker.length)) as PlayerResponse;

  const tracks =
    playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

  if (!tracks?.length) {
    throw new Error("No captions available for this video");
  }

  // prefer manual English, then any English, then first track
  const track =
    tracks.find((t) => t.languageCode === "en" && t.kind !== "asr") ??
    tracks.find((t) => t.languageCode === "en") ??
    tracks[0];

  const captionRes = await fetch(`${track.baseUrl}&fmt=json3`, {
    headers: HEADERS,
  });
  if (!captionRes.ok)
    throw new Error(`Caption fetch returned ${captionRes.status}`);

  const captionData = (await captionRes.json()) as { events?: CaptionEvent[] };

  const text = (captionData.events ?? [])
    .filter((e) => e.segs)
    .map((e) => e.segs!.map((s) => s.utf8 ?? "").join(""))
    .join(" ")
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) throw new Error("No transcript content found");

  return text;
}
