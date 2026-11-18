import type { MetadataRoute } from "next";
import { noindex, siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Alamat sementara (NEXT_PUBLIC_NOINDEX=1): halaman tetap boleh dirayapi supaya tag noindex terbaca.
  if (noindex) return { rules: { userAgent: "*", allow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin"] }, sitemap: siteUrl + "/sitemap.xml" };
}
