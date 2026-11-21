"use client";
import Script from "next/script";
import { useEffect } from "react";
import { track } from "@/lib/track";

const platforms: [RegExp, string][] = [
  [/gofood|gojek/, "gofood"], [/grab\./, "grabfood"], [/shopee\.co\.id\/universal-link\/now-food|shopeefood/, "shopeefood"],
  [/tokopedia/, "tokopedia"], [/shopee/, "shopee"], [/tiktok\.com\/.*shop|shop\.tiktok/, "tiktokshop"],
];

// GA4 + pelacakan klik. Tampilan halaman dicatat otomatis oleh GA4 (enhanced measurement).
// Event klik: whatsapp_click, directions_click, order_link_click. Event lain dikirim dari komponennya
// (generate_lead, locate_me) lewat track().
export function Analytics({ id }: { id: string }) {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.href, base: Record<string, string> = { link_text: (a.textContent ?? "").trim().slice(0, 60), page: location.pathname };
      if (a.dataset.item) base.item_name = a.dataset.item;
      if (/wa\.me|api\.whatsapp\.com/.test(href)) return track("whatsapp_click", base);
      if (/google\.[a-z.]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps/.test(href)) return track("directions_click", base);
      const hit = platforms.find(([re]) => re.test(href));
      if (hit) track("order_link_click", { ...base, platform: hit[1] });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${id}');`}</Script>
    </>
  );
}
