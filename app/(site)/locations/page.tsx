import { JsonLd } from "@/components/JsonLd";
import { OutletFinder } from "@/components/OutletFinder";
import { PageHero } from "@/components/PageHero";
import { Starburst } from "@/components/Starburst";
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
      <PageHero crumb="Store Locations" path="/locations" seed={13} lines={["Kios", "terdekat."]} compact intro="Pilih kota, ketik nama jalan, atau pakai lokasi Kakak.">
        {outlets.length > 0 && <Starburst className="phero__burst">{outlets.length}<small>kios</small></Starburst>}
      </PageHero>
      <section className="sec sec--finder">
        <div className="wrap">
          <OutletFinder outlets={outlets} />
          <p className="finder__foot">Daftar ini memuat kios. Gerobak Cimol Bojot AA ada di 500+ titik lain dan tidak didaftar satu per satu.</p>
        </div>
      </section>
    </>
  );
}
