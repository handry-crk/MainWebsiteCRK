import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import type { FrozenProduct } from "@/data/seed";
import { getContent, getFrozen, getNews, getSettings, rupiah, seoMeta } from "@/lib/api";
import { siteUrl, withUtm } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const [meta, { ready }] = await Promise.all([seoMeta("frozen", "/frozen"), getFrozen()]);
  // Belum ada harga dan tautan beli: halaman belum diindeks.
  return ready ? meta : { ...meta, robots: { index: false, follow: true } };
}

const shops = (p: FrozenProduct): [string, string][] =>
  ([["Shopee", p.shopee], ["Tokopedia", p.tokopedia], ["TikTok Shop", p.tiktok]] as [string, string | undefined][]).filter((x): x is [string, string] => Boolean(x[1]));
const anchor = (p: FrozenProduct) => (p.sku || p.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// Halaman Frozen: semua fakta produk sebagai teks di HTML awal, supaya terbaca Google dan asisten AI.
// Website tidak memproses pembayaran; tombol beli mengarah ke marketplace.
// Aturan isian kosong: penanda [ISI: ...] hanya tampil di halaman (mengikuti saklar di Pengaturan),
// tidak pernah masuk JSON-LD. c.t() = boleh penanda, c.v() = hanya isi nyata.
export default async function Frozen() {
  const [{ products, faqs }, c, st, news] = await Promise.all([getFrozen(), getContent(), getSettings(), getNews()]);
  const singles = products.filter((p) => p.packCount <= 1 && p.variant !== "Paket");
  const packs = products.filter((p) => p.packCount > 1 || p.variant === "Paket");
  const groups = [...new Set(singles.map((p) => p.variant))].map((v) => ({ name: v, items: singles.filter((p) => p.variant === v) }));
  const stores = ([["Shopee", st.order.shopee], ["Tokopedia", st.order.tokopedia], ["TikTok Shop", st.order.tiktokshop]] as [string, string][]).filter(([, u]) => u);
  const steps = c.t("frozen_cooking").split("\n").map((s) => s.trim()).filter(Boolean);
  const facts: [string, string][] = ([["Isi dan berat per pack", c.t("frozen_pack")], ["Bumbu", c.t("frozen_seasoning")], ["Cara simpan", c.t("frozen_storage")], ["Masa simpan", c.t("frozen_shelf_life")]] as [string, string][]).filter(([, v]) => v);
  const ship: [string, string][] = ([["Area kirim", c.t("frozen_area")], ["Metode kirim dan kemasan", c.t("frozen_method")], ["Jam potong order", c.t("frozen_cutoff")]] as [string, string][]).filter(([, v]) => v);
  const outside = c.t("frozen_outside");
  const halal = c.v("frozen_halal_no"), permit = c.v("frozen_permit_no");
  const shownFaqs = faqs.filter((f) => f.a && (c.showPlaceholders || !f.a.includes("[ISI")));
  const realFaqs = faqs.filter((f) => f.a && !f.a.includes("[ISI"));
  const related = news.filter((n) => /frozen/i.test(n.title)).slice(0, 2);
  const area = c.v("frozen_area");

  const productLd = products.map((p) => {
    const url = shops(p)[0]?.[1];
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `${siteUrl}/frozen#${anchor(p)}`,
      name: p.name,
      brand: { "@type": "Brand", name: "Cimol Bojot AA" },
      category: "Camilan beku",
      ...(p.sku ? { sku: p.sku } : {}),
      ...(p.description ? { description: p.description } : {}),
      ...(p.photo ? { image: [p.photo.src] } : {}),
      ...(p.weightG ? { weight: { "@type": "QuantitativeValue", value: p.weightG * p.packCount, unitCode: "GRM" } } : {}),
      // Tanpa harga atau tanpa tautan beli = tanpa blok offers.
      ...(p.price && url ? { offers: { "@type": "Offer", price: String(p.price), priceCurrency: "IDR", availability: `https://schema.org/${p.available ? "InStock" : "OutOfStock"}`, url, ...(area ? { areaServed: area } : {}), seller: { "@id": siteUrl + "/#organization" } } } : {}),
    };
  });
  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: realFaqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

  const card = (p: FrozenProduct) => (
    <li key={p.id} id={anchor(p)} className={`fz__card${p.available ? "" : " is-out"}`}>
      {p.photo && <Image className="fz__photo" {...p.photo} alt={`Kemasan ${p.name}`} sizes="(max-width: 700px) 45vw, 220px" />}
      <h3 className="fz__name">{p.packCount > 1 || p.variant === "Paket" ? p.name : <>{p.flavor || p.name}<small>{p.variant}</small></>}</h3>
      {p.description && <p className="fz__desc">{p.description}</p>}
      {(p.weightG || p.pieces) && <p className="fz__meta">{[p.packCount > 1 ? `${p.packCount} pack` : "", p.weightG ? `${p.weightG} gram per pack` : "", p.pieces ? `${p.pieces} butir per pack` : ""].filter(Boolean).join(", ")}</p>}
      {p.price ? <p className="fz__price"><small>Rp</small>{rupiah(p.price)}</p> : c.showPlaceholders ? <p className="todo">[ISI: harga]</p> : null}
      {!p.available && <p className="fz__out">Stok habis</p>}
      <div className="fz__buy">
        {shops(p).map(([name, url], i) => (
          <a key={name} className={`btn btn--sm ${i === 0 ? "btn--red" : "btn--line"}`} href={withUtm(url, "frozen")} target="_blank" rel="noopener" data-item={p.name}>Beli di {name}</a>
        ))}
        {shops(p).length === 0 && c.showPlaceholders && <span className="todo">[ISI: tautan beli]</span>}
      </div>
    </li>
  );

  return (
    <>
      {productLd.map((ld) => <JsonLd key={ld["@id"]} data={ld} />)}
      {realFaqs.length > 0 && <JsonLd data={faqLd} />}
      <PageHero crumb="Cimol Bojot AA Frozen" path="/frozen" seed={21} lines={["Cimol Bojot AA", "Frozen."]} intro={c.t("frozen_sub")}>
        <Image className="phero__mascot" {...c.mascotSmall} alt="" sizes="(max-width: 900px) 40vw, 300px" />
      </PageHero>

      <section className="sec">
        {stores.length > 0 && (
          <div className="wrap fz__stores">
            {stores.map(([name, url], i) => (
              <a key={name} className={`btn ${i === 0 ? "btn--red" : "btn--line"}`} href={withUtm(url, "frozen")} target="_blank" rel="noopener">Beli di {name}</a>
            ))}
          </div>
        )}
        {groups.map((g) => (
          <div key={g.name} className="wrap fz__group">
            <h2 className="h2">Isi {g.name}</h2>
            <ul className="fz__grid">{g.items.map(card)}</ul>
          </div>
        ))}
        {packs.length > 0 && (
          <div className="wrap fz__group">
            <h2 className="h2">Paket</h2>
            <ul className="fz__grid">{packs.map(card)}</ul>
          </div>
        )}
      </section>

      {(facts.length > 0 || steps.length > 0 || halal || permit) && (
        <section className="sec">
          <div className="wrap split split--top">
            <div className="prose">
              <h2 className="h2">Cara goreng dan simpan</h2>
              {steps.length > 1 ? <ol className="fz__steps">{steps.map((s) => <li key={s}>{s}</li>)}</ol> : steps.length === 1 ? <p>{steps[0]}</p> : null}
            </div>
            <dl className="kd__facts">
              {facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
              {halal && <div><dt>Sertifikat halal</dt><dd>{halal}</dd></div>}
              {permit && <div><dt>Izin edar</dt><dd>{permit}</dd></div>}
            </dl>
          </div>
        </section>
      )}

      {(ship.length > 0 || outside) && (
        <section className="sec">
          <div className="wrap split split--top">
            <div className="prose">
              <h2 className="h2">Pengiriman</h2>
              {outside && <p><b>{outside}</b></p>}
            </div>
            <dl className="kd__facts">{ship.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          </div>
        </section>
      )}

      <section className="sec">
        {shownFaqs.length > 0 && (
          <div className="wrap closing">
            <h2 className="h2">Yang sering ditanyain</h2>
            <div className="faq">
              {shownFaqs.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
            </div>
          </div>
        )}
        <div className="wrap closing">
          <h2 className="h2">Mau jadi reseller atau pesan hampers?</h2>
          <div className="kd__act">
            <Link className="btn btn--red" href="/partnership">Lihat pilihan kerja sama</Link>
            {related.map((n) => <Link key={n.slug} className="tlink" href={`/news/${n.slug}`}>{n.title}</Link>)}
          </div>
        </div>
      </section>
    </>
  );
}
