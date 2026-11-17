import Image from "next/image";
import { LeadForm } from "@/components/LeadForm";
import { PageHero } from "@/components/PageHero";
import { WaLink } from "@/components/WaLink";
import { getPositions, getSettings } from "@/lib/api";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Careers",
  description: "Lowongan kerja di CRK Group dan Cimol Bojot AA, dari crew outlet sampai tim kantor di Bandung dan Jabodetabek.",
  path: "/careers",
});

export default async function Careers() {
  const [positions, st] = await Promise.all([getPositions(), getSettings()]);
  return (
    <>
      <PageHero crumb="Careers" path="/careers" seed={17} lines={["Kerja bareng,", "naik kelas", "bareng."]} intro="Dari crew gerobak dan kios sampai tim kantor. Posisi yang lagi dibuka ada di bawah, lamarannya bisa lewat form atau WhatsApp.">
        <Image className="phero__mascot phero__mascot--s" src="/brand/mascot-small.png" width={332} height={302} alt="" priority sizes="(max-width: 900px) 40vw, 260px" />
      </PageHero>

      <section className="sec">
        <div className="wrap split split--top">
          <h2 className="h2">Kenapa di CRK</h2>
          <ul className="rows">
            <li><h3>[ISI: alasan 1]</h3><p>[ISI: penjelasan satu kalimat]</p></li>
            <li><h3>[ISI: alasan 2]</h3><p>[ISI: penjelasan satu kalimat]</p></li>
            <li><h3>[ISI: alasan 3]</h3><p>[ISI: penjelasan satu kalimat]</p></li>
          </ul>
        </div>
      </section>

      <section className="sec sec--red">
        <div className="wrap">
          <h2 className="h2 h2--cream">Posisi yang dibuka</h2>
          {positions.length === 0 ? (
            <div className="panel"><p>Belum ada lowongan. Titip data lewat form di bawah, nanti kami kabari, Kak.</p></div>
          ) : (
            <div className="jobs">
              {positions.map((p) => (
                <details key={p.id} className="job">
                  <summary>
                    <span className="job__title">{p.title}</span>
                    <span className="job__meta">{p.department} · {p.location} · {p.type}</span>
                  </summary>
                  <div className="job__body">
                    <p>{p.summary}</p>
                    <ul>{p.requirements.map((r) => <li key={r}>{r}</li>)}</ul>
                    <WaLink number={st.whatsappCs} text={`Halo, saya mau melamar posisi ${p.title}.`}>Lamar lewat WhatsApp</WaLink>
                  </div>
                </details>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="sec">
        <div className="wrap split split--top">
          <div className="prose">
            <h2 className="h2">Titip lamaran</h2>
            <p>Isi datanya dan sertakan tautan CV. Tim kami menghubungi lewat WhatsApp.</p>
          </div>
          <LeadForm
            kind="application"
            whatsapp={st.whatsappCs}
            intro="Halo, saya mau melamar kerja di CRK Group."
            submitLabel="Kirim lamaran"
            fields={[
              { name: "nama", label: "Nama", required: true },
              { name: "wa", label: "No. WhatsApp", type: "tel", required: true },
              { name: "posisi", label: "Posisi yang dilamar", type: "select", options: [...positions.map((p) => p.title), "Posisi lain"], required: true },
              { name: "kota", label: "Kota domisili", required: true },
              { name: "cv", label: "Tautan CV", type: "url" },
              { name: "catatan", label: "Catatan", type: "textarea" },
            ]}
          />
        </div>
      </section>
    </>
  );
}
