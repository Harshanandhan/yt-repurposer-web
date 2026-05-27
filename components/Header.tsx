"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
  const { isSignedIn } = useUser();

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-violet-600 to-indigo-600">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 4h10M3 8h7M3 12h5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-bold text-white text-lg">RepurposeAI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/pricing" className="text-sm text-violet-200 hover:text-white transition-colors">
            Pricing
          </Link>
          {isSignedIn && (
            <Link href="/dashboard" className="text-sm text-violet-200 hover:text-white transition-colors">
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <UserButton />
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="text-sm text-violet-200 hover:text-white transition-colors">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="text-sm bg-white text-violet-600 px-4 py-2 rounded-full hover:bg-violet-50 transition-colors font-semibold">
                  Get started free
                </button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
