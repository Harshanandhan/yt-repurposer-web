"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

const FREE_FEATURES = [
  "Story post style",
  "Insight post style",
  "Unlimited video generations",
  "Copy to clipboard",
];

const PRO_FEATURES = [
  "Everything in Free",
  "Listicle post style",
  "Hot Take post style",
  "How-To post style",
  "Saved history & dashboard",
  "Priority support",
];

export default function PricingPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const upgrade = async () => {
    if (!isSignedIn) { router.push("/sign-up"); return; }
    setLoading(true);
    const res = await fetch("/api/create-checkout", { method: "POST" });
    const { url } = await res.json();
    window.location.href = url;
  };

  return (
    <div className="flex flex-col items-center gap-16">

      <div className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-16 text-center flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-violet-200">Pricing</p>
        <h1 className="text-4xl font-bold text-white">Start free. Upgrade when you need more.</h1>
        <p className="text-violet-200">No hidden fees. Cancel anytime.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 w-full max-w-3xl px-6">

        {/* Free */}
        <div className="border border-gray-200 rounded-3xl p-8 bg-white flex flex-col gap-6">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Free</p>
            <div className="flex items-end gap-1 mt-2">
              <span className="text-5xl font-bold text-gray-900">$0</span>
              <span className="text-gray-400 mb-1.5">/mo</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Perfect for trying it out</p>
          </div>
          <ul className="flex flex-col gap-3">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-gray-700">
                <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-gray-500 text-xs">✓</span>
                {f}
              </li>
            ))}
          </ul>
          <Link
            href="/"
            className="mt-auto text-center border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Get started free
          </Link>
        </div>

        {/* Pro */}
        <div className="relative border-2 border-violet-600 rounded-3xl p-8 bg-white flex flex-col gap-6 shadow-xl shadow-violet-100">
          <div className="absolute -top-3.5 left-6 bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            MOST POPULAR
          </div>
          <div>
            <p className="text-sm font-semibold text-violet-600 uppercase tracking-wide">Pro</p>
            <div className="flex items-end gap-1 mt-2">
              <span className="text-5xl font-bold text-gray-900">$19</span>
              <span className="text-gray-400 mb-1.5">/mo</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">For serious content creators</p>
          </div>
          <ul className="flex flex-col gap-3">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-gray-700">
                <span className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center shrink-0 text-violet-600 text-xs">✓</span>
                {f}
              </li>
            ))}
          </ul>
          <button
            onClick={upgrade}
            disabled={loading}
            className="mt-auto bg-violet-600 text-white rounded-xl py-3 text-sm font-semibold hover:bg-violet-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Redirecting..." : "Upgrade to Pro"}
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-400 text-center pb-16">
        Questions?{" "}
        <a href="mailto:support@repurposeai.com" className="text-violet-600 hover:underline">
          Contact us
        </a>
      </p>
    </div>
  );
}
