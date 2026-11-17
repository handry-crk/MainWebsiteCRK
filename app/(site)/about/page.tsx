import Image from "next/image";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { brand } from "@/config/brand";
import { getOutlets } from "@/lib/api";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "About Us",
  description: "Cerita CRK Group, perusahaan di balik Cimol Bojot AA: dari gerobak di Bandung sampai 500+ titik gerobak dan kios di Bandung dan Jabodetabek.",
  path: "/about",
});

const milestones = ["[ISI: tahun] Gerobak pertama", "[ISI: tahun] Kios pertama", "[ISI: tahun] Masuk Jabodetabek", "[ISI: tahun] Tembus 500+ titik gerobak"];

export default async function About() {
  const kios = (await getOutlets()).length;
  return (
    <>
      <PageHero crumb="About Us" path="/about" lines={["Dari gerobak,", "naik kelas."]} intro="CRK Group adalah perusahaan di balik Cimol Bojot AA. Kami mengerjakan jajanan kaki lima dengan cara kerja brand besar.">
        <Image className="phero__kiosk" {...brand.kiosk} alt="Kios Cimol Bojot AA" priority sizes="(max-width: 900px) 80vw, 460px" />
      </PageHero>

      <section className="sec">
        <div className="wrap split">
          <div className="prose">
            <h2 className="h2">Ceritanya begini</h2>
            <p>[ISI: cerita asli brand, paragraf 1. Ditulis tim CRK: siapa yang memulai, kapan, dan di mana gerobak pertamanya.]</p>
            <p>[ISI: cerita asli brand, paragraf 2. Kenapa cimol, dan apa yang berubah sejak hari pertama.]</p>
          </div>
          <Image className="art-mascot" {...brand.mascot} alt="Maskot Cimol Bojot AA" sizes="(max-width: 900px) 60vw, 380px" />
        </div>
      </section>

      <section className="sec sec--red">
        <div className="wrap">
          <h2 className="h2 h2--cream">Perjalanan kami</h2>
          <ol className="road">
            {milestones.map((m) => (
              <li key={m}><span>{m}</span></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sec">
        <div className="wrap split split--top">
          <h2 className="h2">Yang kami pegang</h2>
          <ul className="rows">
            <li><h3>[ISI: nilai 1]</h3><p>[ISI: penjelasan satu kalimat]</p></li>
            <li><h3>[ISI: nilai 2]</h3><p>[ISI: penjelasan satu kalimat]</p></li>
            <li><h3>[ISI: nilai 3]</h3><p>[ISI: penjelasan satu kalimat]</p></li>
          </ul>
        </div>
        <div className="wrap"><div className="facts">
          <p><b>500+</b> titik gerobak</p>
          <p><b>{kios > 0 ? kios : "[ISI]"}</b> kios, termasuk yang segera buka</p>
          <p><b>[ISI]</b> crew dan karyawan</p>
        </div></div>
        <div className="wrap closing">
          <p>CRK Group adalah nama dagang {brand.legalName}, Bandung.</p>
          <div className="btns">
            <Button href="/brands" variant="red">Lihat brand dan menu</Button>
            <Button href="/careers" variant="line">Kerja bareng kami</Button>
          </div>
        </div>
      </section>
    </>
  );
}
