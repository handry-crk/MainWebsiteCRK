import { Analytics } from "@/components/Analytics";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { Motion } from "@/components/Motion";
import { brand } from "@/config/brand";
import { getContent, getFrozen, getSettings } from "@/lib/api";
import { siteUrl } from "@/lib/site";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const [{ logo, t, v }, st, fz] = await Promise.all([getContent(), getSettings(), getFrozen()]);
  const abs = (u: string) => (u.startsWith("http") ? u : siteUrl + u);
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": siteUrl + "/#organization",
    name: brand.company,
    legalName: brand.legalName,
    alternateName: "Cimol Bojot AA",
    url: siteUrl,
    logo: abs(logo.src),
    slogan: brand.tagline,
    foundingDate: "2020",
    ...(v("about_intro") ? { description: v("about_intro") } : {}),
    address: { "@type": "PostalAddress", addressLocality: "Bandung", addressRegion: "Jawa Barat", addressCountry: "ID" },
    brand: { "@type": "Brand", name: "Cimol Bojot AA" },
    sameAs: [st.instagram, st.tiktok].filter(Boolean),
    ...(st.whatsappCs ? { contactPoint: { "@type": "ContactPoint", contactType: "customer service", telephone: "+" + st.whatsappCs.replace(/\D/g, ""), availableLanguage: "Indonesian" } } : {}),
  };
  // WebSite: nama situs yang ditampilkan Google di hasil pencarian
  const site = { "@context": "https://schema.org", "@type": "WebSite", "@id": siteUrl + "/#website", name: brand.company, alternateName: ["Cimol Bojot AA", "CRK"], url: siteUrl, inLanguage: "id-ID", publisher: { "@id": siteUrl + "/#organization" } };
  return (
    <>
      <JsonLd data={org} />
      <JsonLd data={site} />
      <a className="skip" href="#main">Langsung ke isi</a>
      <Header logo={logo} frozen={fz.ready} />
      <main id="main">{children}</main>
      <Footer lead={t("footer_lead")} count={t("footer_tape_count")} privacy={Boolean(t("privacy_body"))} frozen={fz.ready} instagram={st.instagram} tiktok={st.tiktok} />
      <Motion />
      {st.gaId && <Analytics id={st.gaId} />}
    </>
  );
}
