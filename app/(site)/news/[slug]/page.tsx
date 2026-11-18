import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { brand } from "@/config/brand";
import { getArticle, getNews } from "@/lib/api";
import { breadcrumbLd, pageMeta, siteUrl } from "@/lib/site";

export async function generateStaticParams() {
  const list = (await getNews()).map((n) => ({ slug: n.slug }));
  // Next mewajibkan minimal satu param saat build; slug ini berakhir di halaman 404.
  return list.length ? list : [{ slug: "belum-ada-kabar" }];
}

export async function generateMetadata({ params }: PageProps<"/news/[slug]">): Promise<Metadata> {
  const a = await getArticle((await params).slug);
  if (!a) return {};
  const meta = pageMeta({ title: a.title, description: a.excerpt, path: `/news/${a.slug}` });
  return a.cover ? { ...meta, openGraph: { ...meta.openGraph, images: [{ url: a.cover.src, width: a.cover.width, height: a.cover.height }] } } : meta;
}

export default async function Article({ params }: PageProps<"/news/[slug]">) {
  const a = await getArticle((await params).slug);
  if (!a) notFound();
  const others = (await getNews()).filter((n) => n.slug !== a.slug).slice(0, 3);
  const ld = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: a.title,
    description: a.excerpt,
    ...(a.isoDate ? { datePublished: a.isoDate } : {}),
    ...(a.cover ? { image: a.cover.src } : {}),
    mainEntityOfPage: `${siteUrl}/news/${a.slug}`,
    author: { "@type": "Organization", name: brand.company, url: siteUrl },
    publisher: { "@type": "Organization", name: brand.company, "@id": siteUrl + "/#organization" },
  };
  return (
    <article className="sec">
      <JsonLd data={ld} />
      <JsonLd data={breadcrumbLd("News & Updates", "/news")} />
      <div className="wrap article">
        <p className="article__meta"><Link className="tlink" href="/news">Kabar terbaru</Link> · {a.category} · {a.date}</p>
        <h1 className="h2 article__h">{a.title}</h1>
        {a.cover && <Image className="article__cover" {...a.cover} alt="" priority sizes="(max-width: 900px) 100vw, 860px" />}
        <div className="prose">{a.body.map((p, i) => <p key={i}>{p}</p>)}</div>
      </div>
      <div className="wrap article__more">
        <h2 className="h2">Kabar lainnya</h2>
        <ul className="tickets">
          {others.map((n) => (
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
    </article>
  );
}
