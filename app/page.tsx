import URLForm from "@/components/URLForm";
import HeroVisual from "@/components/HeroVisual";
import StylePreviewCard from "@/components/StylePreviewCard";
import { POST_STYLES } from "@/lib/post-styles";
import Link from "next/link";

const STEPS = [
  { n: "1", title: "Paste a YouTube URL", desc: "Any video with captions — interviews, tutorials, podcasts, talks." },
  { n: "2", title: "AI reads the transcript", desc: "We extract the key ideas, insights, and stories from the video." },
  { n: "3", title: "Copy and post", desc: "Get 5 different post styles ready to publish on LinkedIn instantly." },
];

const STATS = [
  { value: "5", label: "Post styles per video" },
  { value: "30s", label: "Average generation time" },
  { value: "$0", label: "To get started" },
];

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 max-w-4xl mx-auto px-6 w-full">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 shrink-0">{label}</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-600 via-indigo-600 to-indigo-700 pt-20 pb-16 px-6">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-6">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            AI-powered content repurposing
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
            Turn YouTube videos into{" "}
            <span className="text-indigo-200">LinkedIn posts</span>{" "}
            that get clicks
          </h1>
          <p className="text-xl text-violet-200 max-w-xl leading-relaxed">
            Paste any YouTube URL. Get 5 scroll-stopping LinkedIn posts in 30 seconds — no writing, no editing, no effort.
          </p>
          <URLForm dark />
          <p className="text-xs text-violet-300">Free to use · No credit card required · 2 post styles on free plan</p>
          <HeroVisual />
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 px-6 bg-indigo-50 border-b border-indigo-100">
        <div className="max-w-2xl mx-auto grid grid-cols-3 divide-x divide-indigo-200">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1 text-center px-6">
              <span className="text-3xl font-bold text-violet-600">{s.value}</span>
              <span className="text-sm text-gray-500">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <div className="pt-16 pb-4">
        <SectionDivider label="How it works" />
      </div>
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto flex flex-col gap-12">
          <div className="text-center flex flex-col gap-2">
            <h2 className="text-3xl font-bold text-gray-900">From video to post in 3 steps</h2>
            <p className="text-gray-400">Simple, fast, and free to start.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative flex flex-col gap-4">
                {i < STEPS.length - 1 && (
                  <div className="hidden sm:block absolute top-5 left-full w-full h-px bg-gray-200 -translate-x-4 z-0" />
                )}
                <div className="relative z-10 w-10 h-10 rounded-xl bg-violet-600 text-white text-sm font-bold flex items-center justify-center shadow-md shadow-violet-200">
                  {s.n}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{s.title}</p>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* How it works visual */}
          <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-6">

            {/* Step 1: URL input mockup */}
            <div className="flex-1 w-full">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Step 1 — Paste URL</p>
              <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-2 shadow-sm">
                <div className="w-5 h-5 shrink-0">
                  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="20" height="20" rx="4" fill="#FF0000"/>
                    <path d="M8 6.5l6 3.5-6 3.5V6.5z" fill="white"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-500 truncate">youtube.com/watch?v=dQw4w9W...</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-1 shrink-0">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="14" fill="#7c3aed"/>
                <path d="M9 14h10M15 10l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xs text-violet-600 font-semibold">AI</span>
            </div>

            {/* Step 3: Output mockup */}
            <div className="flex-1 w-full flex flex-col gap-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Step 3 — Get posts</p>
              {["Story", "Insight"].map((style, i) => (
                <div key={style} className={`bg-white border rounded-xl px-3 py-2.5 flex items-center justify-between gap-2 shadow-sm ${i === 0 ? "border-blue-200" : "border-emerald-200"}`}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border shrink-0 ${i === 0 ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>{style}</span>
                    <div className="h-2 bg-gray-100 rounded-full flex-1 min-w-0" />
                  </div>
                  <div className="shrink-0 text-xs text-gray-400 border border-gray-200 px-2 py-1 rounded-lg bg-white hover:bg-gray-50">Copy</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Post styles */}
      <div className="pt-4 pb-4">
        <SectionDivider label="Post styles" />
      </div>
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col gap-10">
          <div className="text-center flex flex-col gap-2">
            <h2 className="text-3xl font-bold text-gray-900">5 formats. Every angle covered.</h2>
            <p className="text-gray-400">One video, five completely different posts — each looking like a real LinkedIn post.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {POST_STYLES.map((s) => (
              <StylePreviewCard key={s.name} name={s.name} label={s.label} proOnly={s.proOnly} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <div className="pt-4 pb-4">
        <SectionDivider label="Get started" />
      </div>
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-violet-600 to-indigo-600 rounded-3xl p-12 text-center flex flex-col items-center gap-6 shadow-xl shadow-violet-200">
          <h2 className="text-3xl font-bold text-white">Ready to stop writing from scratch?</h2>
          <p className="text-violet-200 text-lg">Paste a URL and get your first posts free — no sign up needed.</p>
          <div className="w-full max-w-xl">
            <URLForm dark />
          </div>
          <p className="text-sm text-violet-300">
            Want all 5 styles?{" "}
            <Link href="/pricing" className="text-white underline underline-offset-2 hover:text-violet-100">
              Upgrade to Pro for $19/mo
            </Link>
          </p>
        </div>
      </section>

    </div>
  );
}
