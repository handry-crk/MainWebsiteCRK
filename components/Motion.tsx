"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Elemen yang "ditempel" saat masuk layar. Kelas .pop diberi dari sini supaya
// tanpa JavaScript semua isi tetap terlihat.
const POP = [
  ".chip", ".why__h", ".menu-p__say > *", ".menu-p__board", ".where__h", ".where__label", ".pins li", ".soon", ".cta__card",
  ".rows li", ".facts p", ".ptypes > li", ".form", ".menu", ".job", ".faq details", ".road li", ".art-kiosk",
  ".sec .h2", ".lead", ".tickets li", ".prose > p", ".news__head",
].join(",");

export function Motion() {
  const path = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = [...document.querySelectorAll<HTMLElement>(POP)];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );
    for (const el of els) {
      // yang sudah terlihat saat halaman dibuka dibiarkan, supaya tidak berkedip
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) continue;
      // jeda bertingkat untuk elemen yang bersaudara
      const i = el.parentElement ? [...el.parentElement.children].indexOf(el) : 0;
      el.style.animationDelay = `${Math.min(i, 6) * 80}ms`;
      el.classList.add("pop");
      io.observe(el);
    }

    // gambar di hero ikut bergeser sedikit mengikuti kursor
    const art = document.querySelector<HTMLElement>(".hero__art, .phero__art");
    const hero = art?.closest("section");
    const onMove = (ev: PointerEvent) => {
      if (!art || !hero || ev.pointerType !== "mouse") return;
      const r = hero.getBoundingClientRect();
      art.style.setProperty("--px", ((ev.clientX - r.left) / r.width - 0.5).toFixed(3));
      art.style.setProperty("--py", ((ev.clientY - r.top) / r.height - 0.5).toFixed(3));
    };
    hero?.addEventListener("pointermove", onMove);

    return () => {
      io.disconnect();
      hero?.removeEventListener("pointermove", onMove);
      for (const el of els) el.classList.remove("pop", "is-in");
    };
  }, [path]);

  return null;
}
