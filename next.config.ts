import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@anthropic-ai/sdk", "youtube-transcript", "stripe", "@supabase/supabase-js"],
};

export default nextConfig;
