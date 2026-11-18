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
          // Tampil saat masuk layar, DAN saat sudah terlewat di atas layar. Tanpa syarat kedua,
          // scroll cepat (sentakan jari di HP) bisa melewati elemen sehingga ia tetap tersembunyi.
          if (!e.isIntersecting && e.boundingClientRect.top > 0) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
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

    // Jaring pengaman: apa pun yang sudah terlewat atau sedang di layar pasti ditampilkan,
    // juga saat halaman melompat (kembali dari halaman lain, tautan jangkar, sentakan jari).
    let tick = 0;
    const sweep = () => {
      tick = 0;
      for (const el of els) {
        if (el.classList.contains("is-in") || !el.classList.contains("pop")) continue;
        if (el.getBoundingClientRect().top < window.innerHeight * 0.96) { el.classList.add("is-in"); io.unobserve(el); }
      }
    };
    const onScroll = () => { if (!tick) tick = requestAnimationFrame(sweep); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pageshow", onScroll);

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
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pageshow", onScroll);
      cancelAnimationFrame(tick);
      hero?.removeEventListener("pointermove", onMove);
      for (const el of els) el.classList.remove("pop", "is-in");
    };
  }, [path]);

  return null;
}
