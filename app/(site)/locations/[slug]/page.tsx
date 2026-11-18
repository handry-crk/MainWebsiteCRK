import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Starburst } from "@/components/Starburst";
import { WaLink } from "@/components/WaLink";
import { getOutlet, getOutlets, getSettings } from "@/lib/api";
import { pageMeta, siteUrl } from "@/lib/site";

// Satu halaman per kios: alamat, jam, petunjuk arah, dan tautan pesan.
// Dipakai untuk pencarian lokal ("cimol terdekat", nama jalan) dan sebagai tautan website di Google Business Profile tiap kios.
export async function generateStaticParams() {
  const list = (await getOutlets()).map((o) => ({ slug: o.slug }));
  // Next mewajibkan minimal satu param saat build; slug ini berakhir di halaman 404.
  return list.length ? list : [{ slug: "belum-ada-kios" }];
}

const mapsUrl = (o: { gmaps?: string; lat: number; lng: number }) => o.gmaps || `https://www.google.com/maps/dir/?api=1&destination=${o.lat},${o.lng}`;

export async function generateMetadata({ params }: PageProps<"/locations/[slug]">): Promise<Metadata> {
  const o = await getOutlet((await params).slug);
  if (!o) return {};
  const lead = `Cimol Bojot AA ${o.name} di ${o.city}: alamat, ${o.soon ? "jadwal buka" : "jam buka"}, dan petunjuk arah.`;
  const full = `${lead} ${o.address}`;
  const description = full.length <= 155 ? full : full.slice(0, 155).replace(/[\s,.]+\S*$/, "");
  return pageMeta({ title: `Cimol Bojot AA ${o.name}, ${o.city}`, description, path: `/locations/${o.slug}` });
}

export default async function OutletPage({ params }: PageProps<"/locations/[slug]">) {
  const o = await getOutlet((await params).slug);
  if (!o) notFound();
  const [all, st] = await Promise.all([getOutlets(), getSettings()]);
  const near = all.filter((x) => x.city === o.city && x.id !== o.id).slice(0, 8);
  // Judul poster: kata pertama di atas merah, sisanya di panel krem, dipecah per baris (maks. sekitar 14 huruf)
  // supaya nama kios yang panjang tidak keluar layar di ponsel.
  const [first, ...rest] = o.name.split(" ");
  const rows: string[] = [];
  for (const w of rest) {
    const last = rows[rows.length - 1];
    if (last !== undefined && (last + " " + w).length <= 14) rows[rows.length - 1] = last + " " + w;
    else rows.push(w);
  }
  const lines = rows.length ? [first, ...rows.slice(0, -1), rows[rows.length - 1] + "."] : [o.name + "."];
  const url = `${siteUrl}/locations/${o.slug}`;
  // Restaurant hanya untuk kios yang sudah buka. Tanpa jam buka (data belum memuat hari) dan tanpa koordinat
  // (titik peta sebagian kios masih perkiraan); tautan Google Maps kios dipakai sebagai gantinya.
  const ld = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": url + "#kios",
    name: `Cimol Bojot AA ${o.name}`,
    url,
    servesCuisine: "Jajanan Indonesia",
    address: { "@type": "PostalAddress", streetAddress: o.address, addressCountry: "ID" },
    ...(o.gmaps ? { hasMap: o.gmaps } : {}),
    hasMenu: siteUrl + "/brands",
    parentOrganization: { "@id": siteUrl + "/#organization" },
  };
  return (
    <>
      {!o.soon && <JsonLd data={ld} />}
      <PageHero crumb={`Cimol Bojot AA ${o.name}`} path={`/locations/${o.slug}`} parent={{ name: "Store Locations", path: "/locations" }} seed={13 + (o.name.length % 7)} compact lines={lines} intro={`Cimol Bojot AA di ${o.city}. ${o.soon ? "Segera buka." : "Sudah buka."}`}>
        <Starburst className="phero__burst kd-burst">{o.soon ? <>Segera<small>buka</small></> : <>Sudah<small>buka</small></>}</Starburst>
      </PageHero>
      <section className="sec sec--kd">
        <div className="wrap kd">
          <div className="kd__info">
            <p className="kd__back"><Link className="tlink" href="/locations">Semua kios</Link> · <Link className="tlink" href={`/locations?q=${encodeURIComponent(o.city)}`}>{o.city}</Link></p>
            <dl className="kd__facts">
              <div><dt>Alamat</dt><dd>{o.address}</dd></div>
              {o.landmark && <div><dt>Patokan</dt><dd>{o.landmark}</dd></div>}
              {o.hours && <div><dt>{o.soon ? "Jadwal buka" : "Jam buka"}</dt><dd>{o.hours}</dd></div>}
            </dl>
            <div className="kd__act">
              <a className="btn btn--red" href={mapsUrl(o)} target="_blank" rel="noopener">Petunjuk arah</a>
              {o.gofood && <a className="btn btn--line" href={o.gofood} target="_blank" rel="noopener">GoFood</a>}
              {o.grabfood && <a className="btn btn--line" href={o.grabfood} target="_blank" rel="noopener">GrabFood</a>}
            </div>
          </div>
          <aside className="kd__side">
            <h2 className="h2">Mau pesan apa, Kak?</h2>
            <p>Menu dan harga semua kios ada di satu halaman. Harga bisa beda sedikit di tiap gerobak dan kios.</p>
            <div className="kd__act">
              <Link className="btn btn--cream" href="/brands">Lihat menu dan harga</Link>
              <WaLink variant="line" number={st.whatsappCs} text={`Halo Cimol Bojot AA, saya mau tanya soal ${o.name}.`}>Tanya lewat WhatsApp</WaLink>
            </div>
          </aside>
        </div>
        {near.length > 0 && (
          <div className="wrap kd__near">
            <h2 className="h2">Kios lain di {o.city}</h2>
            <ul className="pins">
              {near.map((x) => (
                <li key={x.id}>
                  <Link href={`/locations/${x.slug}`}>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-7.1 7-12.3A7 7 0 0 0 5 9.7C5 14.9 12 22 12 22Z" /><circle cx="12" cy="9.6" r="2.6" /></svg>
                    {x.name}{x.soon ? " (segera buka)" : ""}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </>
  );
}
