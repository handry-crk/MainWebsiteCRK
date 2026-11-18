import Link from "next/link";
import { brand, nav } from "@/config/brand";
import { contentFields } from "@/lib/content-schema";
import { Tape } from "./Tape";

// Tanpa props (halaman 404): memakai teks bawaan.
export function Footer({ lead = contentFields.footer_lead.def!, count = contentFields.footer_tape_count.def!, privacy = false }: { lead?: string; count?: string; privacy?: boolean }) {
  return (
    <footer className="ftr">
      <Tape variant="mustard" items={["Street food naik kelas", "Dari Bandung", count, "Cimol Bojot AA"]} />
      <div className="awning" aria-hidden="true" />
      <div className="wrap ftr__in">
        <p className="ftr__lead">{lead}</p>
        <nav className="ftr__nav" aria-label="Footer">
          {nav.map((n) => (
            <Link key={n.href} href={n.href}>{n.label}</Link>
          ))}
        </nav>
        <p className="ftr__legal">© 2026 {brand.legalName}{privacy && <> · <Link href="/privacy">Kebijakan Privasi</Link></>}</p>
      </div>
      <div className="ftr__word" aria-hidden="true" data-word="Cimol Bojot AA" />
    </footer>
  );
}
