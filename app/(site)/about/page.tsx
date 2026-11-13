import { BrandImage } from "@/components/BrandImage";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { brand } from "@/config/brand";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "About Us",
  description: "Cerita CRK Group, perusahaan di balik Cimol Bojot AA: dari gerobak di Bandung sampai 400+ titik di Bandung dan Jabodetabek.",
  path: "/about",
});

const milestones = ["[ISI: tahun] Gerobak pertama", "[ISI: tahun] Kios pertama", "[ISI: tahun] Masuk Jabodetabek", "[ISI: tahun] Tembus 400+ titik"];

export default function About() {
  return (
    <>
      <PageHero crumb="About Us" path="/about" title="Dari gerobak, naik kelas." intro="CRK Group adalah perusahaan di balik Cimol Bojot AA. Kami mengerjakan jajanan kaki lima dengan cara kerja brand besar." />

      <section className="sec">
        <div className="wrap split">
          <div className="prose">
            <h2 className="h2">Ceritanya begini</h2>
            <p>[ISI: cerita asli brand, paragraf 1. Ditulis tim CRK: siapa yang memulai, kapan, dan di mana gerobak pertamanya.]</p>
            <p>[ISI: cerita asli brand, paragraf 2. Kenapa cimol, dan apa yang berubah sejak hari pertama.]</p>
          </div>
          <BrandImage variant="torn" ratio="4 / 5" alt="Gerobak atau kios pertama Cimol Bojot AA" label="Gerobak atau kios pertama" className="tilt-r" />
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
          <p><b>400+</b> titik outlet</p>
          <p><b>2</b> wilayah: Bandung dan Jabodetabek</p>
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
