import Link from "next/link";
import { BrandImage } from "@/components/BrandImage";
import { Button } from "@/components/Button";
import { Starburst } from "@/components/Starburst";
import { TornEdge } from "@/components/TornEdge";
import { brand } from "@/config/brand";
import { getBestSellers, getCities, getLatestNews, rupiah } from "@/lib/api";

export default async function Home() {
  const [menu, news, cities] = await Promise.all([getBestSellers(), getLatestNews(), getCities()]);

  return (
    <>
      <section className="hero sunburst">
        <div className="wrap hero__grid">
          <div className="hero__copy">
            <h1 className="display hero__h1">
              <span>Jajanan</span>
              <span>pinggir jalan,</span>
              <span>naik kelas.</span>
            </h1>
            <div className="panel hero__panel">
              <p>
                CRK Group meracik jajanan kaki lima jadi brand yang rapi dan konsisten. Rumahnya Cimol Bojot AA,
                sekarang ada di 400+ titik Bandung dan Jabodetabek.
              </p>
              <div className="btns">
                <Button href="/brands" variant="red">Kenalan sama brand kami</Button>
                <Button href="/partnership" variant="line">Jualan bareng</Button>
              </div>
            </div>
          </div>

          <div className="hero__art">
            <BrandImage
              variant="cutout"
              ratio="1 / 1"
              alt="Kios Cimol Bojot AA"
              label="Kios Cimol Bojot AA tanpa latar (PNG transparan)"
              priority
            />
            <Starburst className="hero__burst">
              400+<small>outlet</small>
            </Starburst>
          </div>

          <form className="search hero__search" action="/locations" role="search">
            <label htmlFor="q">Cari outlet terdekat</label>
            <div className="search__row">
              <input id="q" name="q" type="search" placeholder="Ketik kota atau nama jalan" autoComplete="off" />
              <button type="submit" className="btn btn--red btn--sm">Cari</button>
            </div>
          </form>

          <div className="hero__mascot" aria-hidden="true">
            {brand.mascot ? <img src={brand.mascot} alt="" /> : <span>Maskot</span>}
          </div>
        </div>
        <TornEdge color="var(--cream)" seed={11} />
      </section>

      <section className="why">
        <div className="wrap why__grid">
          <h2 className="h2 why__h">Naik kelasnya di mana?</h2>
          <ul className="why__list">
            <li>
              <h3>Rasa yang sama di tiap outlet</h3>
              <p>Bumbu dan takarannya satu resep. Beli di Braga atau di Bekasi, gigitannya sama.</p>
            </li>
            <li>
              <h3>Gerobak dan kios yang rapi</h3>
              <p>Bersih, terang, dan gampang dikenali dari jauh. Jajan kaki lima tanpa ragu.</p>
            </li>
            <li>
              <h3>Harga tetap kaki lima</h3>
              <p>Mulai Rp6.000. Naik kelasnya di cara kerja, bukan di harga.</p>
            </li>
          </ul>
        </div>
      </section>

      <section className="spot">
        <TornEdge color="var(--cream)" seed={23} flip />
        <div className="wrap spot__grid">
          <div className="spot__collage">
            <BrandImage variant="torn" ratio="4 / 5" alt="Cimol ditarik dari bumbu" label="Tarik bumbu, close-up" className="spot__a" />
            <BrandImage variant="torn" ratio="1 / 1" alt="Cimol Mozza ditarik" label="Mozza ditarik, dipegang tangan" className="spot__b" />
          </div>
          <div className="panel spot__panel">
            <p className="hand">Kasta tertinggi cimol</p>
            <h2 className="h2">Cimol Bojot AA</h2>
            <p>Cimol dari aci, digoreng, lalu dibalur bumbu bojot sampai nempel.</p>
            <ul className="board">
              {menu.map((m) => (
                <li key={m.name}>
                  <div className="board__row">
                    <span className="board__name">{m.name}</span>
                    <span className="board__dots" aria-hidden="true" />
                    <span className="board__price">{rupiah(m.price)}</span>
                  </div>
                  <p>{m.note}</p>
                </li>
              ))}
            </ul>
            <Button href="/brands" variant="red">Lihat semua menu</Button>
          </div>
        </div>
        <TornEdge color="var(--cream)" seed={31} />
      </section>

      <section className="where">
        <div className="wrap where__grid">
          <div className="where__copy">
            <h2 className="h2">Ada di kota Kakak?</h2>
            <p>Pilih kotanya, nanti kami tunjukkan outlet paling dekat lengkap dengan petunjuk arah.</p>
            <ul className="cities">
              {cities.map((c) => (
                <li key={c.name}>
                  <Link href={`/locations?q=${encodeURIComponent(c.name)}`}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="where__map">
            <BrandImage variant="torn" ratio="5 / 4" alt="Peta sebaran outlet" label="Peta sebaran outlet Bandung dan Jabodetabek" />
            <span className="hand where__sign">Bandung</span>
          </div>
        </div>

        {news.length > 0 && <div className="wrap news">
          <div className="news__head">
            <h2 className="h2">Kabar terbaru</h2>
            <Link className="tlink" href="/news">Semua kabar</Link>
          </div>
          <ul className="tickets">
            {news.map((n) => (
              <li key={n.slug}>
                <Link href="/news">
                  <span className="tickets__date">{n.date}</span>
                  <span className="tickets__title">{n.title}</span>
                  <span className="tickets__cat">{n.category}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>}
      </section>

      <section className="cta sunburst">
        <TornEdge color="var(--cream)" seed={43} flip />
        <div className="wrap cta__grid">
          <div className="panel">
            <h2 className="h2">Mau jualan bareng?</h2>
            <p>Pesanan acara kantor, hampers, reseller Frozen, sampai buka titik baru. Ngobrol aja dulu.</p>
            <Button href="/partnership" variant="red">Lihat pilihan kerja sama</Button>
          </div>
          <div className="panel">
            <h2 className="h2">Mau kerja bareng?</h2>
            <p>Dari crew outlet sampai tim kantor. Cek posisi yang lagi dibuka.</p>
            <Button href="/careers" variant="red">Lihat lowongan</Button>
          </div>
        </div>
      </section>
    </>
  );
}
