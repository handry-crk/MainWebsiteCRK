import { JsonLd } from "@/components/JsonLd";
import { OutletFinder } from "@/components/OutletFinder";
import { PageHero } from "@/components/PageHero";
import { Starburst } from "@/components/Starburst";
import { getOutlets, seoMeta } from "@/lib/api";
import { siteUrl } from "@/lib/site";

export const generateMetadata = () => seoMeta("locations", "/locations");

export default async function Locations() {
  const outlets = await getOutlets();
  // Satu Restaurant per kios yang sudah buka. Jam buka sengaja tidak dimasukkan: data hanya memuat jam,
  // belum memuat hari, dan Google meminta keduanya (openingHoursSpecification).
  const ld = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Kios Cimol Bojot AA",
    url: siteUrl + "/locations",
    numberOfItems: outlets.filter((o) => !o.soon).length,
    itemListElement: outlets.filter((o) => !o.soon).map((o, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Restaurant",
        name: `Cimol Bojot AA ${o.name}`,
        servesCuisine: "Jajanan Indonesia",
        address: { "@type": "PostalAddress", streetAddress: o.address, addressCountry: "ID" },
        geo: { "@type": "GeoCoordinates", latitude: o.lat, longitude: o.lng },
        ...(o.gmaps ? { hasMap: o.gmaps } : {}),
        parentOrganization: { "@id": siteUrl + "/#organization" },
      },
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
