"use client";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { prices, rp } from "@/lib/price";

export const LEVELS = [
  { n: 1, name: "Kalem", say: "Aman, Kak. Buat yang baru kenalan sama pedas." },
  { n: 2, name: "Sedang", say: "Mulai kerasa, tapi masih bisa sambil ngobrol." },
  { n: 3, name: "Nampol", say: "Nah, ini baru nampol. Siapin minum ya." },
  { n: 4, name: "Seuhah", say: "Seuhah! Bibir mulai protes, tangan tetap nyomot." },
  { n: 5, name: "Meledak", say: "Meledak! Jangan salahin Aa kalau keringetan." },
] as const;

export type ShopItem = { name: string; bandung: string; jabodetabek: string; spice?: boolean };
type Line = { key: string; name: string; bandung: string; jabodetabek: string; size: 0 | 1; sizes: boolean; spice: boolean; level: number; qty: number };
type Region = "bandung" | "jabodetabek";

const lineKey = (l: Pick<Line, "name" | "size" | "level" | "spice">) => `${l.name}|${l.size}|${l.spice ? l.level : 0}`;
const unit = (l: Line, r: Region) => { const p = prices(l[r]); return p[l.size] ?? p[0] ?? 0; };

type Ctx = { add: (i: ShopItem) => void; count: number; level: number; setLevel: (n: number) => void; open: () => void };
const CartCtx = createContext<Ctx | null>(null);
export const useCart = () => useContext(CartCtx)!;

const KEY = "crk-keranjang-v1";

export function CartProvider({ whatsapp, hint, children }: { whatsapp: string; hint: string; children: React.ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [region, setRegion] = useState<Region>("bandung");
  const [level, setLevel] = useState(3);
  const [isOpen, setOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const [note, setNote] = useState("");
  const loaded = useRef(false);
  const calm = useReducedMotion();

  // keranjang diingat di perangkat ini; kalau penyimpanan tidak tersedia, keranjang tetap jalan
  useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem(KEY) ?? "null");
      if (v && Array.isArray(v.lines)) { setLines(v.lines); if (v.region === "jabodetabek") setRegion("jabodetabek"); }
    } catch {}
    loaded.current = true;
  }, []);
  useEffect(() => {
    if (!loaded.current) return;
    try { localStorage.setItem(KEY, JSON.stringify({ lines, region })); } catch {}
  }, [lines, region]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [isOpen]);

  const add = useCallback((i: ShopItem) => {
    setLines((prev) => {
      const l: Line = { key: "", name: i.name, bandung: i.bandung, jabodetabek: i.jabodetabek, size: 0, sizes: prices(i.bandung).length > 1, spice: Boolean(i.spice), level, qty: 1 };
      l.key = lineKey(l);
      const hit = prev.find((p) => p.key === l.key);
      return hit ? prev.map((p) => (p === hit ? { ...p, qty: p.qty + 1 } : p)) : [...prev, l];
    });
    setBump((b) => b + 1);
  }, [level]);

  const change = (key: string, patch: Partial<Line>) => setLines((prev) => {
    const merged: Line[] = [];
    for (const p of prev) {
      const n = p.key === key ? { ...p, ...patch } : p;
      n.key = lineKey(n);
      if (n.qty <= 0) continue;
      const dup = merged.find((m) => m.key === n.key);
      if (dup) dup.qty += n.qty; else merged.push({ ...n });
    }
    return merged;
  });

  const count = lines.reduce((s, l) => s + l.qty, 0);
  const total = lines.reduce((s, l) => s + unit(l, region) * l.qty, 0);

  function order(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (!whatsapp) return setNote("Nomor WhatsApp pemesanan belum diisi di Admin > Pengaturan.");
    const rows = lines.map((l, i) => {
      const opt = [l.sizes ? (l.size ? "Besar" : "Kecil") : "", l.spice ? `Level ${l.level} ${LEVELS[l.level - 1].name}` : ""].filter(Boolean).join(", ");
      return `${i + 1}. ${l.name}${opt ? ` (${opt})` : ""} x${l.qty} = ${rp(unit(l, region) * l.qty)}`;
    });
    const text = [
      "Halo Cimol Bojot AA, saya mau pesan:", ...rows, "",
      `Perkiraan total: ${rp(total)} (harga ${region === "bandung" ? "Bandung" : "Jabodetabek"})`,
      `Nama: ${String(fd.get("nama") ?? "").trim()}`,
      `Kota atau kios tujuan: ${String(fd.get("tujuan") ?? "").trim()}`,
      ...(String(fd.get("catatan") ?? "").trim() ? [`Catatan: ${String(fd.get("catatan")).trim()}`] : []),
    ].join("\n");
    window.open(`https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    setNote("WhatsApp terbuka di tab baru. Tinggal tekan kirim, Kak.");
  }

  const ctx = useMemo(() => ({ add, count, level, setLevel, open: () => setOpen(true) }), [add, count, level]);

  return (
    <CartCtx.Provider value={ctx}>
      {children}

      <motion.button
        type="button" className="cart-fab" onClick={() => { setNote(""); setOpen(true); }}
        aria-label={`Buka keranjang, ${count} item`}
        key={bump} initial={calm || bump === 0 ? false : { scale: 0.6, rotate: -14 }} animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 520, damping: 12 }} whileTap={{ scale: 0.9 }}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h2.2l1.9 9.2a1.6 1.6 0 0 0 1.6 1.3h7.4a1.6 1.6 0 0 0 1.6-1.2L20 8.2H7.2" /><circle cx="10" cy="19.3" r="1.5" /><circle cx="17" cy="19.3" r="1.5" /></svg>
        <span>Keranjang</span>
        <b>{count}</b>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div className="cart-veil" onClick={() => setOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.aside
              className="cart" role="dialog" aria-modal="true" aria-label="Keranjang"
              initial={{ x: "105%" }} animate={{ x: 0 }} exit={{ x: "105%" }}
              transition={calm ? { duration: 0 } : { type: "spring", stiffness: 330, damping: 30 }}
            >
              <header className="cart__head">
                <h2>Keranjang <span>{count}</span></h2>
                <button type="button" className="cart__x" onClick={() => setOpen(false)}>Tutup</button>
              </header>

              {lines.length === 0 ? (
                <div className="cart__empty">
                  <p>Keranjangnya masih kosong, Kak.</p>
                  <a className="btn btn--red" href="/#menu" onClick={() => setOpen(false)}>Pilih menu</a>
                </div>
              ) : (
                <form className="cart__body" onSubmit={order}>
                  <div className="cart__region" role="group" aria-label="Harga wilayah">
                    <span>Harga wilayah</span>
                    <button type="button" aria-pressed={region === "bandung"} onClick={() => setRegion("bandung")}>Bandung</button>
                    <button type="button" aria-pressed={region === "jabodetabek"} onClick={() => setRegion("jabodetabek")}>Jabodetabek</button>
                  </div>
                  <ul className="cart__list">
                    <AnimatePresence initial={false}>
                      {lines.map((l) => (
                        <motion.li key={l.key} layout={!calm} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: 60 }} transition={{ type: "spring", stiffness: 420, damping: 28 }}>
                          <div className="cart__row">
                            <b>{l.name}</b>
                            <span>{rp(unit(l, region) * l.qty)}</span>
                          </div>
                          <div className="cart__opts">
                            {l.sizes && (
                              <label>Ukuran
                                <select value={l.size} onChange={(e) => change(l.key, { size: Number(e.target.value) as 0 | 1 })}>
                                  <option value={0}>Kecil</option><option value={1}>Besar</option>
                                </select>
                              </label>
                            )}
                            {l.spice && (
                              <label>Level pedas
                                <select value={l.level} onChange={(e) => change(l.key, { level: Number(e.target.value) })}>
                                  {LEVELS.map((v) => <option key={v.n} value={v.n}>{v.n}. {v.name}</option>)}
                                </select>
                              </label>
                            )}
                            <div className="cart__qty" role="group" aria-label={`Jumlah ${l.name}`}>
                              <button type="button" onClick={() => change(l.key, { qty: l.qty - 1 })} aria-label="Kurangi">−</button>
                              <output>{l.qty}</output>
                              <button type="button" onClick={() => change(l.key, { qty: l.qty + 1 })} aria-label="Tambah">+</button>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                  <div className="cart__total"><span>Perkiraan total</span><b>{rp(total)}</b></div>
                  <p className="cart__hint">{hint}</p>
                  <div className="cart__fields">
                    <label>Nama<input name="nama" required maxLength={80} autoComplete="name" /></label>
                    <label>Kota atau kios tujuan<input name="tujuan" required maxLength={120} placeholder="Mis. Kios Margonda, Depok" /></label>
                    <label>Catatan (opsional)<textarea name="catatan" rows={2} maxLength={300} /></label>
                  </div>
                  <button type="submit" className="btn btn--red cart__send">Pesan via WhatsApp</button>
                  <p className="cart__note" role="status">{note}</p>
                  <button type="button" className="cart__clear" onClick={() => setLines([])}>Kosongkan keranjang</button>
                </form>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </CartCtx.Provider>
  );
}

// Tombol tambah ke keranjang, membal saat ditekan.
export function AddToCart({ item, label = "Tambah", className = "", mini = false }: { item: ShopItem; label?: string; className?: string; mini?: boolean }) {
  const { add } = useCart();
  const [n, setN] = useState(0);
  return (
    <motion.button
      type="button" className={`add${mini ? " add--mini" : ""} ${className}`} onClick={() => { add(item); setN(n + 1); }}
      whileHover={{ y: -2 }} whileTap={{ scale: 0.88, y: 3 }} transition={{ type: "spring", stiffness: 600, damping: 14 }}
      aria-label={`Tambah ${item.name} ke keranjang`}
    >
      <span aria-hidden="true">+</span>{mini ? "" : n > 0 ? " Lagi" : ` ${label}`}
    </motion.button>
  );
}

// Tautan/tombol utama yang membal (spring) saat disentuh.
export function BouncyLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <motion.a href={href} className={className} whileHover={{ scale: 1.06, rotate: -2 }} whileTap={{ scale: 0.9, rotate: 2 }} transition={{ type: "spring", stiffness: 520, damping: 11 }}>
      {children}
    </motion.a>
  );
}
