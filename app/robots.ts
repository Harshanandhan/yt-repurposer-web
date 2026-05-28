import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/api/", "/reset-password", "/auth/"],
    },
    sitemap: "https://www.repostly.org/sitemap.xml",
  };
}
