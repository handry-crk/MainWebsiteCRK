import type { Metadata } from "next";

// Set NEXT_PUBLIC_SITE_URL di hosting (mis. https://domain-klien.com) supaya canonical, sitemap, dan Open Graph benar.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

// Set NEXT_PUBLIC_NOINDEX=1 di alamat sementara (staging) supaya tidak diindeks Google sebelum launch.
export const noindex = process.env.NEXT_PUBLIC_NOINDEX === "1";

export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    // Gambar ditulis eksplisit: objek openGraph di halaman menggantikan milik layout, termasuk gambarnya.
    openGraph: { title, description, url: path, type: "website", locale: "id_ID", siteName: "CRK Group", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "CRK Group, rumahnya Cimol Bojot AA" }] },
    twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
  };
}

export function breadcrumbLd(title: string, path: string, parent?: { name: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl + "/" },
      ...(parent ? [{ "@type": "ListItem", position: 2, name: parent.name, item: siteUrl + parent.path }] : []),
      { "@type": "ListItem", position: parent ? 3 : 2, name: title, item: siteUrl + path },
    ],
  };
}

// Tautan keluar ke marketplace diberi UTM supaya kunjungan dari website terbaca di laporan toko.
export function withUtm(url: string, campaign: string) {
  try {
    const u = new URL(url);
    if (!u.searchParams.has("utm_source")) { u.searchParams.set("utm_source", "website"); u.searchParams.set("utm_medium", "referral"); u.searchParams.set("utm_campaign", campaign); }
    return u.toString();
  } catch { return url; }
}
