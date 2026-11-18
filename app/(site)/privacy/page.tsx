import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { getContent } from "@/lib/api";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Kebijakan Privasi",
  description: "Kebijakan privasi website CRK Group dan Cimol Bojot AA: data yang dikumpulkan lewat form dan cara kami memakainya.",
  path: "/privacy",
});

// Isi halaman ini sepenuhnya dari klien (Admin > Konten halaman > Kebijakan Privasi).
// Selama isinya kosong dan penanda [ISI] dimatikan, halaman ini tidak ada (404) dan tautannya disembunyikan.
export default async function Privacy() {
  const c = await getContent();
  const body = c.t("privacy_body");
  if (!body) notFound();
  const updated = c.t("privacy_updated"), contact = c.t("privacy_contact");
  return (
    <>
      <PageHero crumb="Kebijakan Privasi" path="/privacy" seed={41} compact lines={["Kebijakan", "privasi."]} intro={updated ? `Berlaku sejak ${updated}.` : ""} />
      <section className="sec">
        <div className="wrap">
          <div className="prose">
            {body.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}
            {contact && <p><b>Kontak soal data pribadi:</b> {contact}</p>}
          </div>
        </div>
      </section>
    </>
  );
}
