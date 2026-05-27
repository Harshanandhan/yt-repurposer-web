"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
  const { isSignedIn } = useUser();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight">
          RepurposeAI
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">
            Pricing
          </Link>
          {isSignedIn ? (
            <>
              <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="text-sm text-gray-600 hover:text-gray-900">Sign in</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="text-sm bg-black text-white px-3 py-1.5 rounded-md hover:bg-gray-800">
                  Get started
                </button>
              </SignUpButton>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
