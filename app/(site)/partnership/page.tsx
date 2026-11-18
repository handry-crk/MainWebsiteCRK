import Image from "next/image";
import { JsonLd } from "@/components/JsonLd";
import { LeadForm } from "@/components/LeadForm";
import { PageHero } from "@/components/PageHero";
import { WaLink } from "@/components/WaLink";
import { getContent, getPartnership, getSettings } from "@/lib/api";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Kemitraan dan Pesanan Acara Cimol Bojot AA",
  description: "Kerja sama dengan CRK Group dan Cimol Bojot AA: pesanan acara dan kantor, hampers Frozen, reseller dan agen Frozen, serta kemitraan titik outlet.",
  path: "/partnership",
});

const steps = [
  ["Chat", "Ceritakan kebutuhan Kakak lewat WhatsApp atau form."],
  ["Diskusi", "Tim kemitraan menghubungi untuk detailnya."],
  ["Penawaran", "Kami kirim penawaran tertulis."],
  ["Jalan", "Setelah sepakat, pesanan atau kerja sama dimulai."],
];

export default async function Partnership() {
  const [{ types, faq }, st, c] = await Promise.all([getPartnership(), getSettings(), getContent()]);
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <>
      {faq.length > 0 && <JsonLd data={ld} />}
      <PageHero crumb="Partnership" path="/partnership" seed={29} lines={["Jualan", "bareng CRK."]} intro="Buat acara kantor, hampers, reseller Frozen, sampai buka titik baru. Ngobrol aja dulu.">
        <Image className="phero__mascot" {...c.mascot} alt="" priority sizes="(max-width: 900px) 40vw, 300px" />
      </PageHero>

      <section className="sec">
        <div className="wrap">
          <h2 className="h2">Pilih bentuk kerja samanya</h2>
          <ul className="ptypes">
            {types.map((t, i) => (
              <li key={t.name} className="panel panel--line">
                <h3>{t.name}</h3>
                <p>{c.t(`partner_type_${i + 1}_text`)}</p>
                <WaLink number={st.whatsappPartnership} text={t.wa} variant="line">Tanya lewat WhatsApp</WaLink>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sec sec--red">
        <div className="wrap">
          <h2 className="h2 h2--cream">Caranya gimana?</h2>
          <ol className="road road--steps">
            {steps.map(([t, d]) => (
              <li key={t}><span><b>{t}</b>{d}</span></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sec">
        <div className="wrap split split--top">
          <div className="prose">
            <h2 className="h2">Ceritakan kebutuhannya</h2>
            <p>Isi form ini, tim kemitraan menghubungi lewat WhatsApp di jam kerja.</p>
          </div>
          <LeadForm
            kind="partnership"
            whatsapp={st.whatsappPartnership}
            intro="Halo tim kemitraan CRK Group, saya mau tanya kerja sama."
            submitLabel="Kirim"
            fields={[
              { name: "nama", label: "Nama", required: true },
              { name: "perusahaan", label: "Perusahaan" },
              { name: "wa", label: "No. WhatsApp", type: "tel", required: true },
              { name: "kota", label: "Kota", required: true },
              { name: "jenis", label: "Jenis kerja sama", type: "select", options: types.map((t) => t.name), required: true },
              { name: "catatan", label: "Catatan", type: "textarea" },
            ]}
          />
        </div>
        {faq.length > 0 && <div className="wrap closing">
          <h2 className="h2">Yang sering ditanyain</h2>
          <div className="faq">
            {faq.map((f) => (
              <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
            ))}
          </div>
        </div>}
      </section>
    </>
  );
}
