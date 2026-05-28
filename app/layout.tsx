import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "Repostly — YouTube to LinkedIn in 30 seconds",
  description: "Turn any YouTube video into 5 high-performing LinkedIn posts using AI. Paste a URL, pick your style, publish in 30 seconds. Free to start.",
  metadataBase: new URL("https://www.repostly.org"),
  alternates: {
    canonical: "https://www.repostly.org",
  },
  openGraph: {
    type: "website",
    url: "https://www.repostly.org",
    siteName: "Repostly",
    title: "Repostly — YouTube to LinkedIn in 30 seconds",
    description: "Turn any YouTube video into 5 high-performing LinkedIn posts using AI. Free to start.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Repostly — YouTube to LinkedIn in 30 seconds",
    description: "Turn any YouTube video into 5 high-performing LinkedIn posts using AI. Free to start.",
  },
  keywords: [
    "youtube to linkedin",
    "repurpose youtube content",
    "AI linkedin posts",
    "content repurposing tool",
    "linkedin content creator",
    "youtube transcript to post",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
