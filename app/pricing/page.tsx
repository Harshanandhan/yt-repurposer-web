"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

const FREE_FEATURES = ["Story post", "Insight post", "Unlimited generations"];
const PRO_FEATURES = ["All 5 post styles", "Saved history & dashboard", "Priority support"];

export default function PricingPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const upgrade = async () => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/create-checkout", { method: "POST" });
    const { url } = await res.json();
    window.location.href = url;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 flex flex-col gap-10 items-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Simple pricing</h1>
        <p className="text-gray-500 mt-2">Start free. Upgrade when you need more.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 w-full">
        {/* Free */}
        <div className="border border-gray-200 rounded-2xl p-6 bg-white flex flex-col gap-4">
          <div>
            <p className="font-semibold text-gray-900">Free</p>
            <p className="text-3xl font-bold mt-1">$0</p>
          </div>
          <ul className="flex flex-col gap-2">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-green-500">✓</span> {f}
              </li>
            ))}
          </ul>
          <button
            onClick={() => router.push("/")}
            className="mt-auto border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-50"
          >
            Get started free
          </button>
        </div>

        {/* Pro */}
        <div className="border-2 border-indigo-600 rounded-2xl p-6 bg-white flex flex-col gap-4 relative">
          <span className="absolute -top-3 left-4 bg-indigo-600 text-white text-xs font-semibold px-3 py-0.5 rounded-full">
            Most popular
          </span>
          <div>
            <p className="font-semibold text-gray-900">Pro</p>
            <p className="text-3xl font-bold mt-1">
              $19<span className="text-base font-normal text-gray-500">/mo</span>
            </p>
          </div>
          <ul className="flex flex-col gap-2">
            {[...FREE_FEATURES, ...PRO_FEATURES].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-green-500">✓</span> {f}
              </li>
            ))}
          </ul>
          <button
            onClick={upgrade}
            disabled={loading}
            className="mt-auto bg-indigo-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Redirecting..." : "Upgrade to Pro"}
          </button>
        </div>
      </div>
    </div>
  );
}
