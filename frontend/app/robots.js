const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://shovitregmi.com.np";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
