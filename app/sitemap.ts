import type { MetadataRoute } from "next";
import { getNews } from "@/lib/api";
import { noindex, siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (noindex) return [];
  const pages = ["", "/about", "/brands", "/locations", "/careers", "/news", "/partnership", "/contact"];
  const news = await getNews();
  return [
    ...pages.map((p) => ({ url: siteUrl + p })),
    // lastmod hanya untuk kabar, karena tanggalnya memang diketahui
    ...news.map((n) => ({ url: `${siteUrl}/news/${n.slug}`, ...(n.isoDate ? { lastModified: n.isoDate } : {}) })),
  ];
}
