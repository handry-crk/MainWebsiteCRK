import type { MetadataRoute } from "next";
import { getNews } from "@/lib/api";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/about", "/brands", "/locations", "/careers", "/news", "/partnership", "/contact"];
  const news = await getNews();
  return [
    ...pages.map((p) => ({ url: siteUrl + p, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.8 })),
    ...news.map((n) => ({ url: `${siteUrl}/news/${n.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
