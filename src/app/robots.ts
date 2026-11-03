import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000";

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

