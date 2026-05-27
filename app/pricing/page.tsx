"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const FREE_FEATURES = [
  "All 5 post styles",
  "5 videos per day",
  "Choose which styles to generate",
  "Saved history & dashboard",
  "Copy to clipboard",
];

const PRO_FEATURES = [
  "Everything in Free",
  "Unlimited videos per day",
  "Priority support",
  "Early access to new features",
];

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const upgrade = async () => {
    setLoading(true);
    setError("");

    const res = await fetch("/api/create-checkout", { method: "POST" });
    const data = await res.json();

    if (!res.ok) {
      if (res.status === 401) {
        router.push("/sign-up");
        return;
      }
      setError(data.error ?? "Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    window.location.href = data.url;
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

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          <button
            onClick={upgrade}
            disabled={loading}
            className="mt-auto bg-violet-600 text-white rounded-xl py-3 text-sm font-semibold hover:bg-violet-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Redirecting to checkout…" : "Upgrade to Pro — $19/mo"}
          </button>
          <p className="text-xs text-center text-gray-400">
            Secure payment via Stripe · Cancel anytime
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-400 text-center pb-16">
        Questions?{" "}
        <a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "harshanandhan09@gmail.com"}`} className="text-violet-600 hover:underline">
          Contact us
        </a>
      </p>
    </div>
  );
}
