"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Img } from "@/lib/content-schema";
import { track } from "@/lib/track";

export type TeamKey = "original" | "mozza" | "kuah" | "mix" | "baru";
// Satu tim = satu menu asli dari daftar menu. `line` = kalimat hasil (bisa diubah di Admin > Konten halaman > Home).
export type Team = { key: TeamKey; menu: string; price: string; note?: string; photo?: Img; line: string };

// Tiap jawaban memberi poin ke satu atau dua tim. Pertanyaan ditulis di sini; hasilnya selalu menu yang benar-benar dijual.
const QUESTIONS: { q: string; a: [string, TeamKey[]][] }[] = [
  { q: "Kalau jajan, Kakak tipe yang...", a: [
    ["Pesan yang itu-itu aja, udah pasti enak", ["original"]],
    ["Yang penting ada kejunya", ["mozza", "kuah"]],
    ["Nggak bisa milih, mau dua-duanya", ["mix"]],
    ["Lihat menu baru langsung penasaran", ["baru"]],
  ] },
  { q: "Cimol paling enak itu...", a: [
    ["Kering, bumbunya nempel", ["original"]],
    ["Digigit, kejunya narik", ["mozza"]],
    ["Disiram kuah hangat", ["kuah"]],
    ["Pakai saus yang nggak biasa", ["baru"]],
  ] },
  { q: "Sore ini lagi...", a: [
    ["Hujan, pengin yang anget", ["kuah"]],
    ["Panas, pengin yang ringan", ["original"]],
    ["Lapar banget", ["mix"]],
    ["Bosen, pengin yang beda", ["baru", "mozza"]],
  ] },
  { q: "Satu kata buat Kakak:", a: [
    ["Setia", ["original"]],
    ["Lumer", ["mozza"]],
    ["Anget", ["kuah"]],
    ["Maruk", ["mix"]],
    ["Kepo", ["baru"]],
  ] },
];

export function Quiz({ teams, mascot, title, lead }: { teams: Team[]; mascot: Img; title: string; lead: string }) {
  const [step, setStep] = useState(-1); // -1 = belum mulai, 0..n-1 = pertanyaan, n = hasil
  const [picks, setPicks] = useState<TeamKey[][]>([]);
  const [note, setNote] = useState("");
  const box = useRef<HTMLDivElement>(null);
  const calm = useReducedMotion();
  const has = new Set(teams.map((t) => t.key));
  // Jawaban yang menunjuk tim tanpa menu (menu disembunyikan di admin) tidak ditampilkan.
  const qs = QUESTIONS.map((x) => ({ ...x, a: x.a.filter(([, k]) => k.some((t) => has.has(t))) })).filter((x) => x.a.length > 1);
  const done = step >= qs.length;

  const result = (picks: TeamKey[][]): Team => {
    const score = new Map<TeamKey, number>();
    picks.forEach((ks) => ks.filter((k) => has.has(k)).forEach((k, i) => score.set(k, (score.get(k) ?? 0) + (i === 0 ? 2 : 1))));
    const max = Math.max(...score.values());
    const tied = teams.filter((t) => score.get(t.key) === max);
    // Seri: menang tim yang dipilih paling akhir.
    const last = [...picks].reverse().flat().find((k) => tied.some((t) => t.key === k));
    return tied.find((t) => t.key === last) ?? tied[0] ?? teams[0];
  };

  const focusBox = () => requestAnimationFrame(() => box.current?.focus({ preventScroll: true }));
  const start = () => { setPicks([]); setNote(""); setStep(0); track("quiz_start"); focusBox(); };
  const pick = (ks: TeamKey[], at: number) => {
    if (at !== picks.length) return; // ketukan kedua pada pertanyaan yang sama diabaikan
    const next = [...picks, ks];
    setPicks(next);
    setStep(step + 1);
    if (next.length >= qs.length) track("quiz_complete", { result: result(next).menu });
    focusBox();
  };

  const r = done ? result(picks) : null;

  async function share() {
    if (!r) return;
    const url = `${location.origin}/#kuis`;
    const text = `Aku tim ${r.menu}! Kamu tim cimol apa?`;
    track("quiz_share", { result: r.menu });
    try {
      if (navigator.share) { await navigator.share({ title: "Kamu tim cimol apa?", text, url }); return; }
      await navigator.clipboard.writeText(`${text} ${url}`);
      setNote("Tersalin. Tinggal tempel di chat atau Story, Kak.");
    } catch (e) {
      if ((e as Error)?.name !== "AbortError") setNote("Belum bisa dibagikan dari browser ini, Kak.");
    }
  }

  const spring = calm ? { duration: 0 } : { type: "spring" as const, stiffness: 420, damping: 26 };
  const enter = calm ? false : { opacity: 0, y: 24, rotate: -1.5 };

  return (
    <section className="quiz" id="kuis" aria-labelledby="kuis-h">
      <div className="wrap quiz__in">
        <div className="quiz__say">
          <h2 className="h2" id="kuis-h">{title}</h2>
          <p className="quiz__lead">{lead}</p>
          <Image className="quiz__mascot" {...mascot} alt="" sizes="(max-width: 900px) 34vw, 220px" />
        </div>

        <div className="quiz__card" ref={box} tabIndex={-1} aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            {step < 0 && (
              <motion.div key="mulai" className="quiz__pane quiz__pane--start" initial={enter} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, transition: { duration: 0.12 } }} transition={spring}>
                <p className="quiz__big">{qs.length} pertanyaan, kurang dari semenit.</p>
                <button type="button" className="btn btn--red" onClick={start}>Mulai kuis</button>
              </motion.div>
            )}
            {step >= 0 && !done && (
              <motion.div key={step} className="quiz__pane" initial={enter} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, y: -16, transition: { duration: 0.12 } }} transition={spring}>
                <p className="quiz__step">Pertanyaan {step + 1} dari {qs.length}</p>
                <div className="quiz__bar" aria-hidden="true">{qs.map((_, i) => <i key={i} className={i <= step ? "is-on" : ""} />)}</div>
                <h3 className="quiz__q">{qs[step].q}</h3>
                <div className="quiz__opts">
                  {qs[step].a.map(([label, ks]) => (
                    <motion.button key={label} type="button" onClick={() => pick(ks, step)} whileTap={calm ? undefined : { scale: 0.96 }}>{label}</motion.button>
                  ))}
                </div>
              </motion.div>
            )}
            {r && (
              <motion.div key="hasil" className="quiz__pane quiz__pane--result" initial={calm ? false : { opacity: 0, scale: 0.85, rotate: -4 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={calm ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 16 }}>
                <p className="quiz__step">Kakak tim</p>
                <h3 className="display quiz__team">{r.menu}</h3>
                {r.photo && <Image className="quiz__photo" {...r.photo} alt="" sizes="200px" />}
                <p className="quiz__line">{r.line}</p>
                <p className="quiz__price">{r.price}</p>
                <div className="quiz__acts">
                  <Link className="btn btn--red" href="/locations">Cari kios terdekat</Link>
                  <button type="button" className="btn btn--line" onClick={share}>Bagikan hasil</button>
                  <button type="button" className="quiz__again" onClick={start}>Ulangi kuis</button>
                  <Link className="quiz__again" href="/member">Gabung member</Link>
                </div>
                <p className="quiz__note" role="status">{note}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
