import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://red-team-ai-labs.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/overview",
          "/systems",
          "/risks",
          "/policies",
          "/policy",
          "/frameworks",
          "/campaigns",
          "/campaigns/",
          "/incidents",
          "/remediation",
          "/evidence",
          "/reports",
          "/settings",
          "/login",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

