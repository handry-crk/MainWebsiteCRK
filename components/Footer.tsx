import Image from "next/image";
import Link from "next/link";
import type { Img } from "@/lib/content-schema";
import { brand, footerNav, nav } from "@/config/brand";
import { contentFields } from "@/lib/content-schema";
import { NavLink } from "./NavLink";
import { Tape } from "./Tape";

// Tanpa props (halaman 404): memakai teks bawaan.
export function Footer({ lead = contentFields.footer_lead.def!, count = contentFields.footer_tape_count.def!, privacy = false, frozen = false, instagram = brand.instagram, tiktok = brand.tiktok, icons }: { icons?: { instagram?: Img | null; tiktok?: Img | null }; lead?: string; count?: string; privacy?: boolean; frozen?: boolean; instagram?: string; tiktok?: string }) {
  return (
    <footer className="ftr">
      <Tape variant="mustard" items={["Street food naik kelas", "Dari Bandung", count, "Cimol Bojot AA"]} />
      <div className="awning" aria-hidden="true" />
      <div className="wrap ftr__in">
        <p className="ftr__lead">{lead}</p>
        <nav className="ftr__nav" aria-label="Footer">
          {nav.map((n) => (
            <NavLink key={n.href} href={n.href}>{n.label}</NavLink>
          ))}
          {frozen && <Link href="/frozen">Frozen</Link>}
          {footerNav.map((n) => (
            <NavLink key={n.href} href={n.href}>{n.label}</NavLink>
          ))}
        </nav>
        {(instagram || tiktok) && (
          <p className="ftr__social">
            Akun resmi:
            {instagram && <a href={instagram} target="_blank" rel="noopener me">{icons?.instagram && <Image src={icons.instagram.src} width={28} height={28} alt="" />}Instagram</a>}
            {tiktok && <a href={tiktok} target="_blank" rel="noopener me">{icons?.tiktok && <Image src={icons.tiktok.src} width={28} height={28} alt="" />}TikTok</a>}
          </p>
        )}
        <p className="ftr__legal">© 2026 {brand.legalName}{privacy && <> · <Link href="/privacy">Kebijakan Privasi</Link></>}</p>
      </div>
      <div className="ftr__word" aria-hidden="true" data-word="Cimol Bojot AA" />
    </footer>
  );
}
