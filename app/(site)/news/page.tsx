import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { getNews } from "@/lib/api";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "News & Updates",
  description: "Kabar terbaru CRK Group dan Cimol Bojot AA: outlet baru, produk baru, promo, dan berita perusahaan.",
  path: "/news",
});

export default async function News() {
  const news = await getNews();
  const [first, ...rest] = news;
  return (
    <>
      <PageHero crumb="News & Updates" path="/news" seed={19} lines={["Kabar", "terbaru."]} intro="Kios baru, produk baru, promo, dan cerita dari dapur CRK Group.">
        <Image className="phero__mascot phero__mascot--s" src="/brand/mascot-small.png" width={332} height={302} alt="" priority sizes="(max-width: 900px) 40vw, 260px" />
      </PageHero>
      <section className="sec">
        <div className="wrap">
          {!first ? (
            <p>Belum ada kabar. Mampir lagi nanti, Kak.</p>
          ) : (
            <>
              <Link href={`/news/${first.slug}`} className="lead">
                <span className="lead__meta">{first.category} · {first.date}</span>
                <span className="lead__title">{first.title}</span>
                <span>{first.excerpt}</span>
              </Link>
              <ul className="tickets">
                {rest.map((n) => (
                  <li key={n.slug}>
                    <Link href={`/news/${n.slug}`}>
                      <span className="tickets__date">{n.date}</span>
                      <span className="tickets__title">{n.title}</span>
                      <span className="tickets__cat">{n.category}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
    </>
  );
}
