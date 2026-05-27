import URLForm from "@/components/URLForm";
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
      <section className="bg-gradient-to-br from-violet-600 via-indigo-600 to-indigo-700 pt-24 pb-28 px-6">
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

      {/* Divider */}
      <div className="py-10">
        <SectionDivider label="How it works" />
      </div>

      {/* How it works */}
      <section className="pb-20 px-6">
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
        </div>
      </section>

      {/* Divider */}
      <div className="py-2">
        <SectionDivider label="Post styles" />
      </div>

      {/* Post styles */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
          <div className="text-center flex flex-col gap-2">
            <h2 className="text-3xl font-bold text-gray-900">5 formats. Every angle covered.</h2>
            <p className="text-gray-400">One video, five completely different posts — each optimised for engagement.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {POST_STYLES.map((s) => (
              <div
                key={s.name}
                className="rounded-2xl border border-gray-200 p-5 flex flex-col gap-2 bg-white hover:border-violet-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">{s.label}</span>
                  {s.proOnly ? (
                    <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200">Pro</span>
                  ) : (
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">Free</span>
                  )}
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{s.instruction.split(".")[0]}.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="py-2">
        <SectionDivider label="Get started" />
      </div>

      {/* Final CTA */}
      <section className="py-20 px-6">
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
