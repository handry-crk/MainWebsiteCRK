"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { browserClient, supabaseConfigured } from "@/lib/supabase";
import { track } from "@/lib/track";

// "0812 3456-7890" / "+62812..." / "62812..." -> "62812..."
export const normalizeWa = (v: string) => {
  const d = v.replace(/\D/g, "");
  return d.startsWith("62") ? d : d.startsWith("0") ? "62" + d.slice(1) : d.startsWith("8") ? "62" + d : d;
};

// Pendaftaran member dari website (kode sumber MBR-WEB). Menyimpan ke tabel `members`, terbaca di Admin > Member.
// Nomor yang sudah terdaftar mendapat pesan yang sama dengan pendaftar baru, supaya form ini tidak bisa dipakai
// untuk mengecek nomor orang lain.
export function MemberForm({ cities, consent, privacy }: { cities: string[]; consent: string; privacy: boolean }) {
  const [state, setState] = useState<"idle" | "busy" | "done" | "error" | "fast" | "wa">("idle");
  const firstTouch = useRef(0);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget, fd = new FormData(form);
    if (fd.get("situs")) return setState("done"); // kolom jebakan terisi = bot
    if (!firstTouch.current || Date.now() - firstTouch.current < 3000) { firstTouch.current = Date.now() - 3000; return setState("fast"); }
    const whatsapp = normalizeWa(String(fd.get("wa") ?? ""));
    if (!/^62\d{8,13}$/.test(whatsapp)) return setState("wa");
    if (!supabaseConfigured) return setState("error");
    setState("busy");
    const { error } = await browserClient().from("members").insert({
      name: String(fd.get("nama") ?? "").trim(), whatsapp, city: String(fd.get("kota") ?? "").trim(), source: "MBR-WEB", consent: true, consent_text: consent.slice(0, 400),
    });
    // 23505 = nomor sudah terdaftar: diperlakukan sebagai berhasil.
    if (error && error.code !== "23505") return setState("error");
    form.reset();
    firstTouch.current = 0;
    if (!error) track("sign_up", { method: "MBR-WEB" });
    setState("done");
  }

  return (
    <form className="form" onSubmit={onSubmit} onFocus={() => { firstTouch.current ||= Date.now(); }}>
      <div className="form__f"><label htmlFor="m-nama">Nama panggilan</label><input id="m-nama" name="nama" required maxLength={80} autoComplete="given-name" /></div>
      <div className="form__f"><label htmlFor="m-wa">Nomor WhatsApp</label><input id="m-wa" name="wa" type="tel" inputMode="tel" required minLength={9} maxLength={20} autoComplete="tel" placeholder="08xxxxxxxxxx" /></div>
      <div className="form__f form__f--wide">
        <label htmlFor="m-kota">Kota (opsional)</label>
        <select id="m-kota" name="kota" defaultValue="">
          <option value="">Pilih kota</option>
          {cities.map((c) => <option key={c}>{c}</option>)}
          <option>Kota lain</option>
        </select>
      </div>
      <input className="form__hp" type="text" name="situs" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <label className="form__f--wide form__check">
        <input type="checkbox" name="setuju" required />
        <span>{consent} {privacy && <Link className="tlink" href="/privacy">Kebijakan Privasi</Link>}</span>
      </label>
      <div className="form__f--wide form__end">
        <button type="submit" className="btn btn--red" disabled={state === "busy"}>{state === "busy" ? "Mendaftar..." : "Daftar member"}</button>
        <p role="status" className="form__msg">
          {state === "fast" && "Cepat banget, Kak. Tekan daftar sekali lagi, ya."}
          {state === "wa" && "Nomor WhatsApp-nya belum pas, Kak. Contoh: 081234567890."}
          {state === "done" && "Terdaftar. Makasih, Kak!"}
          {state === "error" && "Belum berhasil. Coba lagi sebentar lagi, Kak."}
        </p>
      </div>
    </form>
  );
}
