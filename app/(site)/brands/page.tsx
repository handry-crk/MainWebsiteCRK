import { BrandImage } from "@/components/BrandImage";
import { Button } from "@/components/Button";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { getMenu, getSettings } from "@/lib/api";
import { pageMeta, siteUrl } from "@/lib/site";

export const metadata = pageMeta({
  title: "Our Brands & Products",
  description: "Menu dan harga Cimol Bojot AA: Cimol Bojot, Mozza, Beef, Ayam, Mix, Kuah Keju, New Series, dan Cimol Frozen. Harga Bandung dan Jabodetabek.",
  path: "/brands",
});

const firstPrice = (s: string) => s.split("/")[0].trim().replace(/\./g, "");

export default async function Brands() {
  const [menu, st] = await Promise.all([getMenu(), getSettings()]);
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
      <PageHero crumb="Our Brands & Products" path="/brands" seed={9} title="Brand dan menu kami" intro="Saat ini rumah kami diisi Cimol Bojot AA. Semua menu dan harganya ada di halaman ini." />

      <section className="sec">
        <div className="wrap split">
          <div className="prose">
            <p className="hand">Kasta tertinggi cimol</p>
            <h2 className="h2">Cimol Bojot AA</h2>
            <p>Cimol dari aci, digoreng, lalu dibalur bumbu bojot sampai nempel. Asalnya jajanan pinggir jalan Bandung, sekarang ada di 400+ titik.</p>
            <Button href="/locations" variant="red">Cari outlet terdekat</Button>
          </div>
          <BrandImage variant="torn" ratio="5 / 4" alt="Aneka menu Cimol Bojot AA" label="Semua varian dalam satu foto" className="tilt-r" />
        </div>
      </section>

      <section className="sec sec--red">
        <div className="wrap">
          <div className="panel menu">
            <div className="menu__head">
              <h2 className="h2">Menu dan harga</h2>
              <p>Dalam rupiah. Harga bisa beda sedikit di beberapa outlet dan di aplikasi ojol.</p>
            </div>
            {menu.map((c) => (
              <table key={c.name} className="menu__t">
                <caption>
                  {c.name}
                  {c.note && <small>{c.note}</small>}
                </caption>
                <thead>
                  <tr><th scope="col">Menu</th><th scope="col">Bandung</th><th scope="col">Jabodetabek</th></tr>
                </thead>
                <tbody>
                  {c.items.map((i) => (
                    <tr key={i.name}><th scope="row">{i.name}</th><td>{i.bandung}</td><td>{i.jabodetabek}</td></tr>
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
          </div>
          <ul className="links">
            {orderLinks.map(([name, url]) => (
              <li key={name}>
                {url ? <a className="btn btn--line" href={url} target="_blank" rel="noopener">{name}</a> : <span className="todo">[ISI: tautan] {name}</span>}
              </li>
            ))}
          </ul>
        </div>
        <div className="wrap closing">
          <h2 className="h2">Brand lain</h2>
          <p>[ISI: brand lain di bawah CRK Group, bila ada. Hapus bagian ini bila belum ada.]</p>
        </div>
      </section>
    </>
  );
}
