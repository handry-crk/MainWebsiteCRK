import type { Metadata } from "next";
import { body, display, hand } from "./fonts";
import "./globals.css";
import { noindex, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Cimol Bojot AA dari CRK Group | Jajanan Aci Khas Bandung", template: "%s | CRK Group" },
  description:
    "CRK Group, rumah dari Cimol Bojot AA. Jajanan kaki lima dari Bandung yang sekarang ada di 500+ titik gerobak dan kios di Bandung dan Jabodetabek.",
  applicationName: "CRK Group",
  openGraph: { type: "website", locale: "id_ID", siteName: "CRK Group" },
  twitter: { card: "summary_large_image" },
  ...(noindex ? { robots: { index: false, follow: false } } : {}),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${display.variable} ${body.variable} ${hand.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
