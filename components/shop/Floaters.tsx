"use client";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect } from "react";

// Hiasan melayang di hero: cimol, cabai, daun jeruk, bawang goreng.
// Bergeser halus mengikuti kursor dan posisi scroll, dengan kedalaman berbeda-beda.
const ITEMS = [
  { kind: "cimol", x: "86%", y: "4%", size: 70, depth: 30, spin: 12 },
  { kind: "cabai", x: "50%", y: "3%", size: 78, depth: -42, spin: -18 },
  { kind: "daun", x: "54%", y: "80%", size: 66, depth: 54, spin: 24 },
  { kind: "bawang", x: "41%", y: "88%", size: 54, depth: -26, spin: -30 },
  { kind: "cimol", x: "96%", y: "50%", size: 48, depth: 62, spin: 20 },
  { kind: "cabai", x: "91%", y: "84%", size: 58, depth: -34, spin: 28 },
  { kind: "daun", x: "0%", y: "90%", size: 50, depth: 40, spin: -22 },
] as const;

function Shape({ kind }: { kind: string }) {
  if (kind === "cimol")
    return (<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="25" fill="#e9a227" stroke="#1e1a17" strokeWidth="3.5" /><circle cx="21" cy="22" r="3" fill="#bf3229" /><circle cx="37" cy="19" r="2.2" fill="#bf3229" /><circle cx="40" cy="35" r="3" fill="#bf3229" /><circle cx="24" cy="39" r="2.4" fill="#bf3229" /><circle cx="31" cy="29" r="1.8" fill="#8f211c" /></svg>);
  if (kind === "cabai")
    return (<svg viewBox="0 0 60 60"><path d="M44 12c2 9-1 22-10 31-7 7-16 9-24 7 9-2 15-8 19-15 4-8 5-16 3-22 4-3 9-3 12-1z" fill="#bf3229" stroke="#1e1a17" strokeWidth="3.5" strokeLinejoin="round" /><path d="M38 12c0-4 2-7 6-8" fill="none" stroke="#3f7a2c" strokeWidth="4.5" strokeLinecap="round" /></svg>);
  if (kind === "daun")
    return (<svg viewBox="0 0 60 60"><path d="M10 50C8 30 20 12 50 10c2 24-12 40-40 40z" fill="#4f9a3a" stroke="#1e1a17" strokeWidth="3.5" strokeLinejoin="round" /><path d="M14 46C24 34 34 24 46 14" fill="none" stroke="#1e1a17" strokeWidth="2.6" strokeLinecap="round" /></svg>);
  return (<svg viewBox="0 0 60 60"><path d="M12 38c2-14 14-22 30-20-4 6-4 12 2 20-12 6-24 6-32 0z" fill="#c98a3c" stroke="#1e1a17" strokeWidth="3.5" strokeLinejoin="round" /><path d="M20 34c3-6 8-9 14-9" fill="none" stroke="#1e1a17" strokeWidth="2.4" strokeLinecap="round" /></svg>);
}

function Floater({ item, mx, my, sy, i }: { item: (typeof ITEMS)[number]; mx: MotionValue<number>; my: MotionValue<number>; sy: MotionValue<number>; i: number }) {
  const x = useTransform(mx, (v) => v * item.depth);
  const y = useTransform([my, sy] as MotionValue<number>[], ([m, s]: number[]) => m * item.depth * 0.7 + s * item.depth * -3.2);
  const rotate = useTransform(sy, (s) => item.spin + s * item.spin * 4);
  return (
    <motion.span className="floater" style={{ left: item.x, top: item.y, width: item.size, height: item.size, x, y, rotate }}>
      <motion.span animate={{ y: [0, -9, 0] }} transition={{ duration: 3.2 + i * 0.45, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}>
        <Shape kind={item.kind} />
      </motion.span>
    </motion.span>
  );
}

export function Floaters() {
  const calm = useReducedMotion();
  const rx = useMotionValue(0), ry = useMotionValue(0);
  const mx = useSpring(rx, { stiffness: 60, damping: 14 }), my = useSpring(ry, { stiffness: 60, damping: 14 });
  const { scrollY } = useScroll();
  const sy = useSpring(useTransform(scrollY, [0, 900], [0, 1], { clamp: true }), { stiffness: 80, damping: 20 });

  useEffect(() => {
    if (calm) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      rx.set(e.clientX / window.innerWidth - 0.5);
      ry.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [calm, rx, ry]);

  if (calm) return null;
  return (
    <div className="floaters" aria-hidden="true">
      {ITEMS.map((it, i) => <Floater key={i} item={it} mx={mx} my={my} sy={sy} i={i} />)}
    </div>
  );
}
