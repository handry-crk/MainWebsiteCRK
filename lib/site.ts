import type { Metadata } from "next";

// Set NEXT_PUBLIC_SITE_URL di hosting (mis. https://domain-klien.com) supaya canonical, sitemap, dan Open Graph benar.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} | CRK Group`, description, url: path, type: "website", locale: "id_ID", siteName: "CRK Group" },
    twitter: { card: "summary_large_image", title: `${title} | CRK Group`, description },
  };
}

export function breadcrumbLd(title: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl + "/" },
      { "@type": "ListItem", position: 2, name: title, item: siteUrl + path },
    ],
  };
}
