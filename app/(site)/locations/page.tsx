import { JsonLd } from "@/components/JsonLd";
import { OutletFinder } from "@/components/OutletFinder";
import { PageHero } from "@/components/PageHero";
import { getOutlets } from "@/lib/api";
import { pageMeta, siteUrl } from "@/lib/site";

export const metadata = pageMeta({
  title: "Store Locations",
  description: "Cari kios Cimol Bojot AA terdekat di Bandung, Cimahi, Bogor, Depok, Bekasi, Tangerang, dan Tangerang Selatan. Lengkap dengan alamat, jam buka, dan petunjuk arah.",
  path: "/locations",
});

export default async function Locations() {
  const outlets = await getOutlets();
  const ld = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Outlet Cimol Bojot AA",
    url: siteUrl + "/locations",
    itemListElement: outlets.filter((o) => !o.soon).map((o, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: { "@type": "Restaurant", name: `Cimol Bojot AA ${o.name}`, ...(o.hours ? { openingHours: o.hours } : {}), address: { "@type": "PostalAddress", streetAddress: o.address, addressLocality: o.city, addressCountry: "ID" }, geo: { "@type": "GeoCoordinates", latitude: o.lat, longitude: o.lng } },
    })),
  };
  return (
    <>
      <JsonLd data={ld} />
      <PageHero crumb="Store Locations" path="/locations" seed={13} title="Outlet terdekat" intro="Ketik nama kota atau jalan, atau pakai lokasi Kakak supaya langsung diurutkan dari yang paling dekat." />
      <section className="sec">
        <div className="wrap">
          <OutletFinder outlets={outlets} />
        </div>
      </section>
    </>
  );
}
