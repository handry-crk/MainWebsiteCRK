"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { brand, nav } from "@/config/brand";

export function Header() {
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
          {brand.company}
        </Link>
        <nav className="hdr__nav" aria-label="Utama">
          {nav.map((n) => (
            <Link key={n.href} href={n.href}>{n.label}</Link>
          ))}
        </nav>
        <Link href="/locations" className="btn btn--cream btn--sm hdr__cta">Cari outlet</Link>
        <button className="hdr__burger" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(!open)}>
          {open ? "Tutup" : "Menu"}
        </button>
      </div>
      <div id="menu" className={`mnav${open ? " is-open" : ""}`} hidden={!open}>
        <nav className="wrap" aria-label="Menu">
          <Link href="/" onClick={() => setOpen(false)}>Home</Link>
          {nav.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)}>{n.label}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
