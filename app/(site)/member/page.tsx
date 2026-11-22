import Image from "next/image";
import { MemberForm } from "@/components/MemberForm";
import { PageHero } from "@/components/PageHero";
import { getCities, getContent, seoMeta } from "@/lib/api";

export const generateMetadata = () => seoMeta("member", "/member");

// Pendaftaran member lewat website. Kode sumber di database: MBR-WEB.
export default async function Member() {
  const [c, cities] = await Promise.all([getContent(), getCities()]);
  const benefit = c.t("member_benefit");
  return (
    <>
      <PageHero crumb="Member" path="/member" seed={27} compact lines={["Gabung", "member."]} intro={c.t("member_intro")}>
        <Image className="phero__mascot phero__mascot--s" {...c.mascotSmall} alt="" sizes="(max-width: 900px) 40vw, 260px" />
      </PageHero>
      <section className="sec">
        <div className="wrap split split--top">
          <div className="prose">
            <h2 className="h2">Daftar di sini</h2>
            {benefit && <p>{benefit}</p>}
          </div>
          <MemberForm cities={cities.map((x) => x.name)} consent={c.t("member_consent")} privacy={Boolean(c.t("privacy_body"))} />
        </div>
      </section>
    </>
  );
}
