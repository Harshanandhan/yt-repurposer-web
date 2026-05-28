"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function VerifyEmailBanner({ email }: { email: string }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const resend = async () => {
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.resend({ type: "signup", email });
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-6 py-3">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-sm text-amber-800 font-medium">
          ⚠️ Your email <strong>{email}</strong> is not verified. Verify to use your free generations.
        </p>
        {sent ? (
          <span className="text-sm text-amber-700 font-semibold shrink-0">
            Sent! Check your inbox.
          </span>
        ) : (
          <button
            onClick={resend}
            disabled={loading}
            className="text-sm font-semibold text-amber-800 underline underline-offset-2 hover:text-amber-900 disabled:opacity-50 shrink-0"
          >
            {loading ? "Sending…" : "Resend verification email"}
          </button>
        )}
      </div>
    </div>
  );
}
