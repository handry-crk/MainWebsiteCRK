"use client";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Img } from "@/lib/content-schema";
import { LEVELS, useCart } from "./cart";

// Meter level pedas: geser atau klik, kartu dan reaksi maskot ikut berubah.
// Level yang dipilih di sini jadi level bawaan untuk menu pedas yang ditambahkan ke keranjang.
export function SpiceMeter({ mascot, spicy }: { mascot: Img; spicy: string[] }) {
  const { level, setLevel } = useCart();
  const calm = useReducedMotion();
  const lv = LEVELS[level - 1];
  const spring = { type: "spring" as const, stiffness: 480, damping: 13 };

  return (
    <section className={`spice spice--${level}`} aria-labelledby="spice-h">
      <div className="wrap spice__in">
        <div className="spice__say">
          <h2 className="h2" id="spice-h">Seberapa berani, Kak?</h2>
          <p className="spice__lead">Geser meternya. Level ini jadi pilihan awal saat menu pedas masuk keranjang.</p>
          <motion.div className="spice__card" layout={!calm} transition={spring}>
            <div className="spice__top">
              <span className="spice__n">Level {lv.n}</span>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.b key={lv.n} className="spice__name" initial={calm ? false : { scale: 0.4, rotate: -12, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={spring}>
                  {lv.name}
                </motion.b>
              </AnimatePresence>
            </div>
            <input
              className="spice__range" type="range" min={1} max={5} step={1} value={level}
              onChange={(e) => setLevel(Number(e.target.value))} aria-label="Level pedas" aria-valuetext={`Level ${lv.n}, ${lv.name}`}
              style={{ ["--fill" as string]: `${((level - 1) / 4) * 100}%` }}
            />
            <div className="spice__dots" role="group" aria-label="Pilih level pedas">
              {LEVELS.map((v) => (
                <motion.button key={v.n} type="button" aria-pressed={v.n === level} onClick={() => setLevel(v.n)} whileTap={{ scale: 0.85 }} transition={spring}>
                  <svg viewBox="0 0 60 60" aria-hidden="true"><path d="M44 12c2 9-1 22-10 31-7 7-16 9-24 7 9-2 15-8 19-15 4-8 5-16 3-22 4-3 9-3 12-1z" /><path className="stem" d="M38 12c0-4 2-7 6-8" /></svg>
                  <span>{v.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
          {spicy.length > 0 && <p className="spice__menus">Bisa pilih level: {spicy.join(", ")}.</p>}
        </div>

        <div className="spice__mascot">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p key={lv.n} className="spice__bubble" initial={calm ? false : { scale: 0.5, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.1 } }} transition={spring}>
              {lv.say}
            </motion.p>
          </AnimatePresence>
          <motion.div
            animate={calm ? undefined : { rotate: [0, -level * 2.4, level * 2.4, 0], y: [0, -level * 3, 0], scale: 1 + level * 0.025 }}
            transition={{ duration: Math.max(0.35, 1.5 - level * 0.22), repeat: Infinity, ease: "easeInOut" }}
          >
            <Image {...mascot} alt="" sizes="(max-width: 900px) 46vw, 300px" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
