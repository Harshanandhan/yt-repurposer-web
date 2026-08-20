# Repostly

Turn a YouTube URL into LinkedIn-ready posts.

**Live:** [https://www.repostly.org](https://www.repostly.org)

Paste a video with captions. The app pulls the transcript, calls an LLM, and returns several post styles you can copy.

## Stack

- Next.js (App Router)
- Supabase (auth + data)
- Clerk (sign-in routes in `app/`)
- Anthropic Claude / Google Generative AI
- Stripe (checkout, portal, webhooks)

## Local

```bash
npm install
npm run dev
```

You need env vars for Supabase, Stripe, and the LLM key. Do not commit secrets.

## Layout

| Path | Role |
|---|---|
| `app/page.tsx` | Marketing + URL form |
| `app/api/repurpose` | Generate posts from a transcript |
| `app/api/create-checkout` / `webhooks` | Stripe |
| `lib/transcript.ts` | Caption fetch |
| `lib/post-styles.ts` | Post style templates |
| `supabase/schema.sql` | Database schema |

## Author

Harsha Nandhan Reddy Gajulapalli  
https://github.com/Harshanandhan
