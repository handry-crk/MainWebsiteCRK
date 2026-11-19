import type { MetadataRoute } from "next";
import { getContent, getFrozen, getNews, getOutlets } from "@/lib/api";
import { noindex, siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (noindex) return [];
  const pages = ["", "/about", "/brands", "/locations", "/careers", "/news", "/partnership", "/contact"];
  const [news, c, outlets, fz] = await Promise.all([getNews(), getContent(), getOutlets(), getFrozen()]);
  if (fz.ready) pages.push("/frozen");
  if (c.t("privacy_body")) pages.push("/privacy");
  return [
    ...pages.map((p) => ({ url: siteUrl + p })),
    ...outlets.map((o) => ({ url: `${siteUrl}/locations/${o.slug}` })),
    // lastmod hanya untuk kabar, karena tanggalnya memang diketahui
    ...news.map((n) => ({ url: `${siteUrl}/news/${n.slug}`, ...(n.isoDate ? { lastModified: n.isoDate } : {}) })),
  ];
}
