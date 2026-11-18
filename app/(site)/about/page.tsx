import Image from "next/image";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { brand } from "@/config/brand";
import { getContent, getOutlets, seoMeta } from "@/lib/api";

export const generateMetadata = () => seoMeta("about", "/about");

export default async function About() {
  const [outlets, c] = await Promise.all([getOutlets(), getContent()]);
  const kios = outlets.length;
  const story = [c.t("about_story_1"), c.t("about_story_2")].filter(Boolean);
  const milestones = [1, 2, 3, 4].map((i) => ({ year: c.t(`about_milestone_${i}_year`), text: c.t(`about_milestone_${i}_text`) })).filter((m) => m.year || m.text);
  const values = [1, 2, 3].map((i) => ({ title: c.t(`about_value_${i}_title`), text: c.t(`about_value_${i}_text`) })).filter((v) => v.title);
  const crew = c.t("about_crew_count");
  return (
    <>
      <PageHero crumb="About Us" path="/about" lines={["Dari gerobak,", "naik kelas."]} intro={c.t("about_intro")}>
        <Image className="phero__kiosk" {...c.kiosk} alt="Kios Cimol Bojot AA" priority sizes="(max-width: 900px) 80vw, 460px" />
      </PageHero>

      <section className="sec">
        {story.length > 0 && (
          <div className="wrap split">
            <div className="prose">
              <h2 className="h2">Ceritanya begini</h2>
              {story.map((p) => <p key={p}>{p}</p>)}
            </div>
            {c.aboutStory
              ? <Image className="art-kiosk" {...c.aboutStory} alt="Cerita Cimol Bojot AA" sizes="(max-width: 900px) 90vw, 520px" />
              : <Image className="art-mascot" {...c.mascot} alt="Maskot Cimol Bojot AA" sizes="(max-width: 900px) 60vw, 380px" />}
          </div>
        )}
      </section>

      {milestones.length > 0 && (
        <section className="sec sec--red">
          <div className="wrap">
            <h2 className="h2 h2--cream">Perjalanan kami</h2>
            <ol className="road">
              {milestones.map((m, i) => (
                <li key={i}><span>{[m.year, m.text].filter(Boolean).join(" ")}</span></li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <section className="sec">
        {values.length > 0 && (
          <div className="wrap split split--top">
            <h2 className="h2">Yang kami pegang</h2>
            <ul className="rows">
              {values.map((v) => <li key={v.title}><h3>{v.title}</h3><p>{v.text}</p></li>)}
            </ul>
          </div>
        )}
        <div className="wrap"><div className="facts">
          <p><b>500+</b> titik gerobak</p>
          {kios > 0 && <p><b>{kios}</b> kios, termasuk yang segera buka</p>}
          {crew && <p><b>{crew}</b> crew dan karyawan</p>}
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
