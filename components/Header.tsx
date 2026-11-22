"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { nav } from "@/config/brand";
import { NavLink } from "./NavLink";
import type { Img } from "@/lib/content-schema";

// `frozen` = halaman Frozen sudah punya harga dan tautan beli; baru saat itu masuk menu utama, setelah Our Brands & Products.
export function Header({ logo, frozen = false }: { logo: Img; frozen?: boolean }) {
  const items = frozen ? [...nav.slice(0, 2), { href: "/frozen", label: "Frozen" }, ...nav.slice(2)] : nav;
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="hdr">
      <div className="wrap hdr__in">
        <Link href="/" className="hdr__logo" onClick={() => setOpen(false)}>
          <Image {...logo} alt="Cimol Bojot AA, CRK Group" priority sizes="120px" />
        </Link>
        <nav className="hdr__nav" aria-label="Utama">
          {items.map((n) => (
            <NavLink key={n.href} href={n.href}>{n.label}</NavLink>
          ))}
        </nav>
        <Link href="/locations" className="btn btn--cream btn--sm hdr__cta">Cari kios</Link>
        <button className="hdr__burger" aria-expanded={open} aria-controls="mnav" onClick={() => setOpen(!open)}>
          {open ? "Tutup" : "Menu"}
        </button>
      </div>
      <div id="mnav" className={`mnav${open ? " is-open" : ""}`} hidden={!open}>
        <nav className="wrap" aria-label="Menu">
          <Link href="/" onClick={() => setOpen(false)}>Home</Link>
          {items.map((n) => (
            <NavLink key={n.href} href={n.href} onClick={() => setOpen(false)}>{n.label}</NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
