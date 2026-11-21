import Image from "next/image";
import Link from "next/link";
import { Bento } from "@/components/shop/Bento";
import { Quiz, type Team, type TeamKey } from "@/components/shop/Quiz";
import { prices } from "@/lib/price";
import { BouncyLink } from "@/components/shop/BouncyLink";
import { Floaters } from "@/components/shop/Floaters";
import { Starburst } from "@/components/Starburst";
import { Tape } from "@/components/Tape";
import { TornEdge } from "@/components/TornEdge";
import { getCities, getContent, getLatestNews, getMenu, getOutlets, seoMeta } from "@/lib/api";

export const generateMetadata = () => seoMeta("home", "/");

// Home disusun seperti poster yang bisa di-scroll: tiap bagian satu komposisi,
// teks sedikit, elemen saling menimpa. Tanpa kotak placeholder.
export default async function Home() {
  const [menu, news, cities, outlets, c] = await Promise.all([getMenu(), getLatestNews(), getCities(), getOutlets(), getContent()]);
  // Bento: menu andalan dulu, lalu satu menu pertama dari tiap kategori lain, maksimal 7 kotak.
  const all = menu.flatMap((cat) => cat.items);
  const best = all.filter((i) => i.best).slice(0, 3);
  const rest = menu.map((cat) => cat.items.find((i) => !best.includes(i))).filter((i): i is NonNullable<typeof i> => Boolean(i));
  const bento = [...best, ...rest].slice(0, 7);
  const soon = outlets.filter((o) => o.soon).slice(0, 5);
  // Kuis "Kamu tim cimol apa?": tiap tim dipasangkan ke menu asli yang sedang tampil. Tim tanpa menu dilewati.
  const inCat = (name: string) => menu.find((cat) => cat.name.toLowerCase() === name)?.items ?? [];
  const pickMenu: Record<TeamKey, (typeof all)[number] | undefined> = {
    original: all.find((i) => i.name.toLowerCase() === "cimol bojot") ?? inCat("cimol")[0],
    mozza: inCat("cimol").find((i) => /mozza/i.test(i.name)) ?? all.find((i) => /mozza/i.test(i.name)),
    kuah: inCat("kuah keju")[0],
    mix: inCat("mix")[0],
    baru: inCat("new series")[0],
  };
  const used = new Set<string>();
  const teams: Team[] = (Object.keys(pickMenu) as TeamKey[]).flatMap((key) => {
    const m = pickMenu[key];
    if (!m || used.has(m.name)) return [];
    used.add(m.name);
    const p = prices(m.bandung);
    return [{ key, menu: m.name, note: m.note, photo: m.photo, line: c.t(`home_quiz_${key}`), price: p.length ? `${p.length > 1 ? "Mulai" : "Harga"} Rp${p[0].toLocaleString("id-ID")} (Bandung)` : "" }];
  });

  return (
    <>
      <section className="hero sunburst">
        <Floaters />
        <div className="wrap hero__in">
          <div className="hero__type">
            <h1 className="display hero__h1">
              <span className="hero__l1">Jajanan </span>
              <span className="hero__paper">
                <span>pinggir jalan, </span>
                <span>naik kelas.</span>
              </span>
            </h1>
            <p className="hero__sub">
              {c.t("home_hero_sub")}
            </p>
            <BouncyLink href="#menu" className="btn btn--cream hero__cta">Lihat menu</BouncyLink>
            <form className="search hero__search" action="/locations" role="search">
              <label htmlFor="q">Lagi di mana, Kak?</label>
              <div className="search__row">
                <input id="q" name="q" type="search" placeholder="Kota atau nama jalan" autoComplete="off" />
                <button type="submit" className="btn btn--red btn--sm">Cari kios</button>
              </div>
            </form>
          </div>

          <div className="hero__art">
            <Image className="hero__kiosk" {...c.kiosk} alt="Kios Cimol Bojot AA dengan awning merah putih" priority sizes="(max-width: 900px) 90vw, 560px" />
            <Starburst className="hero__burst">
              {c.t("home_burst_number")}<small>{c.t("home_burst_label")}</small>
            </Starburst>
            <Image className="hero__mascot" {...c.mascot} alt="" priority sizes="(max-width: 900px) 40vw, 300px" />
          </div>
        </div>
        <TornEdge color="var(--cream)" seed={11} />
      </section>

      <section className="why">
        <div className="wrap why__in">
          <h2 className="h2 why__h">{c.t("home_why_title")}</h2>
          <ul className="why__pile">
            <li className="chip chip--red">
              <b>{c.t("home_why_1_title")}</b>
              <span>{c.t("home_why_1_text")}</span>
            </li>
            <li className="chip chip--paper">
              <b>{c.t("home_why_2_title")}</b>
              <span>{c.t("home_why_2_text")}</span>
            </li>
            <li className="chip chip--tag">
              <span>{c.t("home_why_3_text")}</span>
              <b>{c.t("home_why_3_price")}</b>
            </li>
          </ul>
        </div>
      </section>

      <section className="menu-p" id="menu">
        <TornEdge color="var(--cream)" seed={23} flip />
        <div className="menu-p__tapes">
          <Tape items={["Kasta tertinggi cimol", "Bumbunya nempel", "Kejunya narik", `Mulai ${c.t("home_why_3_price")}`]} />
          <Tape variant="red" reverse items={["Cimol Bojot", "Cimol Mozza", "Kuah Keju", "Mix", "New Series", "Frozen"]} />
        </div>
        <div className="wrap menu-p__in">
          <div className="menu-p__say">
            <p className="hand">Kasta tertinggi cimol</p>
            <h2 className="display menu-p__h">Bumbunya nempel. Kejunya narik.</h2>
          </div>
          <Image className="menu-p__logo" {...c.logo} alt="Cimol Bojot AA" sizes="200px" />
        </div>
        <div className="wrap">
          <Bento items={bento} />
          <p className="menu-p__more"><Link href="/brands" className="btn btn--cream">Lihat semua menu dan harga</Link></p>
        </div>
        <TornEdge color="var(--cream)" seed={31} />
      </section>

      {teams.length >= 3 && <Quiz teams={teams} mascot={c.mascotSmall} title={c.t("home_quiz_title")} lead={c.t("home_quiz_lead")} />}

      <section className="where">
        <div className="wrap where__in">
          <div className="where__say">
            <h2 className="display display--paper where__h">Hey, Kak!</h2>
            <p className="where__label">{c.t("home_where_label")}</p>
            <ul className="pins">
              {cities.map((c) => (
                <li key={c.name}>
                  <Link href={`/locations?q=${encodeURIComponent(c.name)}`}>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-7.1 7-12.3A7 7 0 0 0 5 9.7C5 14.9 12 22 12 22Z" /><circle cx="12" cy="9.6" r="2.6" /></svg>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {soon.length > 0 ? (
            <div className="soon">
              <p className="display soon__h">Coming soon!</p>
              <ul>
                {soon.map((o) => (
                  <li key={o.id}><b>{o.name}</b><span>{o.hours}</span></li>
                ))}
              </ul>
              <Link className="tlink" href="/locations">Lihat semua kios</Link>
            </div>
          ) : (
            <Image className="where__mascot" {...c.mascotSmall} alt="" sizes="(max-width: 900px) 50vw, 340px" />
          )}
        </div>

        {news.length > 0 && (
          <div className="wrap news">
            <div className="news__head">
              <h2 className="h2">Kabar terbaru</h2>
              <Link className="tlink" href="/news">Semua kabar</Link>
            </div>
            <ul className="tickets">
              {news.map((n) => (
                <li key={n.slug}>
                  <Link href={`/news/${n.slug}`}>
                    <span className="tickets__date">{n.date}</span>
                    <span className="tickets__title">{n.title}</span>
                    <span className="tickets__cat">{n.category}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="cta sunburst">
        <TornEdge color="var(--cream)" seed={43} flip />
        <div className="wrap cta__in">
          <Link href="/partnership" className="cta__card cta__card--a">
            <span className="display cta__h">Jualan bareng?</span>
            <span>{c.t("home_cta_1_text")}</span>
            <b>{c.t("home_cta_1_button")}</b>
          </Link>
          <Image className="cta__mascot" {...c.mascotSmall} alt="" sizes="200px" />
          <Link href="/careers" className="cta__card cta__card--b">
            <span className="display cta__h">Kerja bareng?</span>
            <span>{c.t("home_cta_2_text")}</span>
            <b>{c.t("home_cta_2_button")}</b>
          </Link>
        </div>
      </section>
    </>
  );
}
