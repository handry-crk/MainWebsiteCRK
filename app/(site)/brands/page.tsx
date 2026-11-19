import Image from "next/image";
import { Button } from "@/components/Button";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { AddToCart } from "@/components/shop/cart";
import Link from "next/link";
import { getContent, getFrozen, getMenu, getSettings, seoMeta } from "@/lib/api";
import { siteUrl } from "@/lib/site";

export const generateMetadata = () => seoMeta("brands", "/brands");

const firstPrice = (s: string) => s.split("/")[0].trim().replace(/\./g, "");

export default async function Brands() {
  const [menu, st, c, fz] = await Promise.all([getMenu(), getSettings(), getContent(), getFrozen()]);
  const photos = menu.flatMap((cat) => cat.items.filter((i) => i.photo).map((i) => ({ ...i, photo: i.photo! })));
  const orderLinks: [string, string][] = [
    ["GoFood", st.order.gofood], ["GrabFood", st.order.grabfood], ["ShopeeFood", st.order.shopeefood],
    ["Tokopedia", st.order.tokopedia], ["Shopee", st.order.shopee], ["TikTok Shop", st.order.tiktokshop],
  ];
  const ld = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: "Menu Cimol Bojot AA",
    url: siteUrl + "/brands",
    hasMenuSection: menu.map((c) => ({
      "@type": "MenuSection",
      name: c.name,
      hasMenuItem: c.items.map((i) => ({ "@type": "MenuItem", name: i.name, offers: { "@type": "Offer", price: firstPrice(i.bandung), priceCurrency: "IDR" } })),
    })),
  };
  return (
    <>
      <JsonLd data={ld} />
      <PageHero crumb="Our Brands & Products" path="/brands" seed={9} lines={["Menu", "dan harga."]} intro={c.t("brands_intro")}>
        <Image className="phero__mascot" {...c.mascot} alt="" priority sizes="(max-width: 900px) 40vw, 300px" />
      </PageHero>

      <section className="sec">
        <div className="wrap split">
          <div className="prose">
            <p className="hand">Kasta tertinggi cimol</p>
            <h2 className="h2">Cimol Bojot AA</h2>
            <p>Cimol dari aci, digoreng, lalu dibalur bumbu bojot sampai nempel. Asalnya jajanan pinggir jalan Bandung, sekarang ada di 500+ titik gerobak dan kios.</p>
            <Button href="/locations" variant="red">Cari kios terdekat</Button>
          </div>
          <Image className="art-kiosk" {...c.kiosk} alt="Kios Cimol Bojot AA" sizes="(max-width: 900px) 90vw, 520px" />
        </div>
      </section>

      {photos.length > 0 && (
        <section className="sec sec--gallery">
          <div className="wrap">
            <h2 className="h2">Yang paling sering difoto</h2>
            <ul className="gallery">
              {photos.map((i) => (
                <li key={i.name}>
                  <Image {...i.photo} alt={i.name} sizes="(max-width: 900px) 45vw, 260px" />
                  <b>{i.name}</b>
                  <span>{i.bandung}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="sec sec--red">
        <div className="wrap">
          <div className="panel menu">
            <Image className="menu__logo" {...c.logo} alt="" sizes="200px" />
            <div className="menu__head">
              <h2 className="h2">Menu dan harga</h2>
              <p>Dalam rupiah. Harga bisa beda sedikit di beberapa gerobak, kios, dan di aplikasi ojol.</p>
            </div>
            {menu.map((c) => (
              <table key={c.name} className="menu__t">
                <caption>
                  {c.name}
                  {c.note && <small>{c.note}</small>}
                </caption>
                <thead>
                  <tr><th scope="col">Menu</th><th scope="col">Bandung</th><th scope="col">Jabodetabek</th><th scope="col"><span className="sr">Tambah ke keranjang</span></th></tr>
                </thead>
                <tbody>
                  {c.items.map((i) => (
                    <tr key={i.name}><th scope="row">{i.name}</th><td>{i.bandung}</td><td>{i.jabodetabek}</td><td className="menu__add"><AddToCart mini item={{ name: i.name, bandung: i.bandung, jabodetabek: i.jabodetabek, spice: i.spice }} /></td></tr>
                  ))}
                </tbody>
              </table>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap split split--top">
          <div className="prose">
            <h2 className="h2">Pesan dari rumah</h2>
            <p>Cimol siap makan lewat aplikasi ojol, Cimol Frozen lewat marketplace.</p>
            {fz.ready && <Link className="tlink" href="/frozen">Lihat varian dan cara goreng Cimol Frozen</Link>}
          </div>
          <ul className="links">
            {orderLinks.map(([name, url]) => (
              <li key={name}>
                {url ? <a className="btn btn--line" href={url} target="_blank" rel="noopener">{name}</a> : <span className="todo">[ISI: tautan] {name}</span>}
              </li>
            ))}
          </ul>
        </div>
        {c.t("brands_other") && (
          <div className="wrap closing">
            <h2 className="h2">Brand lain</h2>
            <p>{c.t("brands_other")}</p>
          </div>
        )}
      </section>
    </>
  );
}
