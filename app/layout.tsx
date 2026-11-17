import type { Metadata } from "next";
import { body, display, hand } from "./fonts";
import "./globals.css";
import { JsonLd } from "@/components/JsonLd";
import { brand } from "@/config/brand";
import { siteUrl } from "@/lib/site";

const orgLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: brand.company,
  legalName: brand.legalName,
  url: siteUrl,
  slogan: brand.tagline,
  address: { "@type": "PostalAddress", addressLocality: "Bandung", addressCountry: "ID" },
  brand: { "@type": "Brand", name: "Cimol Bojot AA" },
  sameAs: [brand.instagram, brand.tiktok].filter(Boolean),
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "id_ID", siteName: "CRK Group", url: "/" },
  twitter: { card: "summary_large_image" },
  title: { default: "CRK Group | Street food naik kelas", template: "%s | CRK Group" },
  description:
    "CRK Group, rumah dari Cimol Bojot AA. Jajanan kaki lima dari Bandung yang sekarang ada di 500+ titik gerobak dan kios di Bandung dan Jabodetabek.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${display.variable} ${body.variable} ${hand.variable}`}>
      <body>
        <JsonLd data={orgLd} />
        {children}
      </body>
    </html>
  );
}
