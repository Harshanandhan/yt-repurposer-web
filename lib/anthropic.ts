import Anthropic from "@anthropic-ai/sdk";
import type { Post } from "./supabase";
import { POST_STYLES } from "./post-styles";

export { POST_STYLES };

const SYSTEM_PROMPT =
  "You are a LinkedIn content strategist who writes high-performing posts. " +
  "Your posts are concise, punchy, and drive engagement. " +
  "CRITICAL: Never use any markdown formatting — no **bold**, no *italics*, no headings, no bullet dashes, no underscores for emphasis. Plain text only. " +
  "Never use hashtag spam. Max 3 relevant hashtags per post, placed at the end. " +
  "Never start a post with 'I'. Vary your hooks.";

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")   // **bold**
    .replace(/\*(.*?)\*/g, "$1")        // *italic*
    .replace(/__(.*?)__/g, "$1")        // __bold__
    .replace(/_(.*?)_/g, "$1")          // _italic_
    .replace(/^#{1,6}\s+/gm, "")        // # headings
    .replace(/^[\-\*]\s+/gm, "• ")      // - bullets → •
    .trim();
}

export async function generatePosts(
  transcript: string,
  isPro: boolean,
  topicHint?: string,
  selectedStyles?: string[]
): Promise<Post[]> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  let styles = POST_STYLES.filter((s) => isPro || !s.proOnly);
  if (selectedStyles && selectedStyles.length > 0) {
    styles = styles.filter((s) => selectedStyles.includes(s.name));
  }
  const topicLine = topicHint ? `The video is about: ${topicHint}\n\n` : "";
  const excerpt = transcript.slice(0, 8000);

  const posts = await Promise.all(
    styles.map(async (style) => {
      const message = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 600,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content:
              `${topicLine}Here is the YouTube transcript:\n\n${excerpt}\n\n` +
              `Write a LinkedIn post in this style: ${style.instruction}\n\n` +
              "Output only the post text — no preamble, no labels.",
          },
        ],
      });
      return {
        style: style.name,
        content: stripMarkdown((message.content[0] as { text: string }).text),
      };
    })
  );

  return posts;
}
