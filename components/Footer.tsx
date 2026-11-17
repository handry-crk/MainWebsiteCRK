import Link from "next/link";
import { brand, nav } from "@/config/brand";
import { Tape } from "./Tape";

export function Footer() {
  return (
    <footer className="ftr">
      <Tape variant="mustard" items={["Street food naik kelas", "Dari Bandung", "500+ titik gerobak", "Cimol Bojot AA"]} />
      <div className="awning" aria-hidden="true" />
      <div className="wrap ftr__in">
        <p className="ftr__lead">CRK Group. Street food naik kelas, dari Bandung.</p>
        <nav className="ftr__nav" aria-label="Footer">
          {nav.map((n) => (
            <Link key={n.href} href={n.href}>{n.label}</Link>
          ))}
        </nav>
        <p className="ftr__legal">© 2026 {brand.legalName}</p>
      </div>
      <div className="ftr__word" aria-hidden="true" data-word="Cimol Bojot AA" />
    </footer>
  );
}
