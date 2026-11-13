import { LeadForm } from "@/components/LeadForm";
import { PageHero } from "@/components/PageHero";
import { WaLink } from "@/components/WaLink";
import { getSettings } from "@/lib/api";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Contact Us",
  description: "Hubungi CRK Group dan Cimol Bojot AA lewat WhatsApp customer service, tim kemitraan, atau form pesan.",
  path: "/contact",
});

export default async function Contact() {
  const st = await getSettings();
  return (
    <>
      <PageHero crumb="Contact Us" path="/contact" seed={37} title="Ngobrol, yuk." intro="Pertanyaan, keluhan, atau ajakan kerja sama. Paling cepat lewat WhatsApp." />
      <section className="sec">
        <div className="wrap">
          <ul className="ptypes ptypes--3">
            <li className="panel panel--line">
              <h3>Customer service</h3>
              <p>Soal pesanan, outlet, atau produk.</p>
              <WaLink number={st.whatsappCs} text="Halo Cimol Bojot AA, saya mau tanya." variant="line">Chat CS</WaLink>
            </li>
            <li className="panel panel--line">
              <h3>Kemitraan</h3>
              <p>Pesanan acara, hampers, reseller, dan titik outlet.</p>
              <WaLink number={st.whatsappPartnership} text="Halo tim kemitraan CRK Group." variant="line">Chat kemitraan</WaLink>
            </li>
            <li className="panel panel--line">
              <h3>Kantor</h3>
              <p>[ISI: alamat kantor]</p>
              <p>[ISI: jam kerja dan email]</p>
            </li>
          </ul>
        </div>
        <div className="wrap split split--top">
          <div className="prose">
            <h2 className="h2">Tulis pesan</h2>
            <p>Isi form ini, kami balas lewat WhatsApp di jam kerja.</p>
          </div>
          <LeadForm
            kind="contact"
            whatsapp={st.whatsappCs}
            intro="Halo CRK Group, saya mau menyampaikan pesan."
            submitLabel="Kirim pesan"
            fields={[
              { name: "nama", label: "Nama", required: true },
              { name: "wa", label: "No. WhatsApp", type: "tel", required: true },
              { name: "topik", label: "Topik", type: "select", options: ["Pertanyaan", "Keluhan", "Kemitraan", "Media", "Lainnya"], required: true },
              { name: "pesan", label: "Pesan", type: "textarea", required: true },
            ]}
          />
        </div>
      </section>
    </>
  );
}
