import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { plain, RichText } from "@/components/RichText";
import { getContent, getFaq, seoMeta } from "@/lib/api";

export const generateMetadata = () => seoMeta("faq", "/faq");

// FAQ umum. Jawaban yang masih berupa penanda [ISI: ...] hanya tampil selama saklar penanda menyala,
// dan tidak pernah masuk data terstruktur.
export default async function Faq() {
  const [faq, c] = await Promise.all([getFaq(), getContent()]);
  const shown = faq.filter((f) => f.a && (c.showPlaceholders || !f.a.includes("[ISI")));
  const real = faq.filter((f) => f.a && !f.a.includes("[ISI"));
  const ld = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: real.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: plain(f.a) } })) };
  return (
    <>
      {real.length > 0 && <JsonLd data={ld} />}
      <PageHero crumb="FAQ" path="/faq" seed={33} compact lines={["Yang sering", "ditanyain."]} intro={c.t("faq_intro")}>
        <Image className="phero__mascot phero__mascot--s" {...c.mascotSmall} alt="" sizes="(max-width: 900px) 40vw, 260px" />
      </PageHero>
      <section className="sec">
        <div className="wrap closing">
          <div className="faq">
            {shown.map((f) => (
              <details key={f.q}><summary>{f.q}</summary><RichText text={f.a} /></details>
            ))}
          </div>
        </div>
        <div className="wrap closing">
          <h2 className="h2">Belum ketemu jawabannya?</h2>
          <div className="kd__act">
            <Link className="btn btn--red" href="/contact">Tanya lewat Contact Us</Link>
            <Link className="tlink" href="/partnership">FAQ kemitraan</Link>
            <Link className="tlink" href="/frozen">FAQ Cimol Frozen</Link>
          </div>
        </div>
      </section>
    </>
  );
}
