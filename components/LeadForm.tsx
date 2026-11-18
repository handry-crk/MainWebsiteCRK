"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/track";
import { browserClient, supabaseConfigured } from "@/lib/supabase";

export type Field = { name: string; label: string; type?: "text" | "tel" | "email" | "url" | "textarea" | "select"; options?: string[]; required?: boolean };
type Kind = "application" | "partnership" | "contact";

// Form menyimpan ke tabel `submissions` (terbaca di Admin > Kotak masuk).
// Bila Supabase belum diatur atau penyimpanan gagal, pengunjung diarahkan ke WhatsApp.
export function LeadForm({ kind, fields, whatsapp, intro, consent, privacy, submitLabel = "Kirim" }: { kind: Kind; fields: Field[]; whatsapp: string; intro: string; consent: string; privacy: boolean; submitLabel?: string }) {
  const [state, setState] = useState<"idle" | "busy" | "done" | "error" | "fast">("idle");
  const [waUrl, setWaUrl] = useState("");
  const firstTouch = useRef(0); // saat pengunjung mulai mengisi

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get("situs")) return setState("done"); // kolom jebakan terisi = bot; dibuat seolah terkirim
    // Terkirim kurang dari 3 detik sejak mulai diisi: hampir pasti bot. Orang sungguhan cukup menekan kirim sekali lagi.
    if (!firstTouch.current || Date.now() - firstTouch.current < 3000) { firstTouch.current = Date.now() - 3000; return setState("fast"); }
    const val = (n: string) => String(fd.get(n) ?? "").trim();
    const payload: Record<string, string> = {};
    for (const f of fields) if (f.name !== "nama" && f.name !== "wa" && val(f.name)) payload[f.label] = val(f.name);
    const text = [intro, ...fields.map((f) => `${f.label}: ${val(f.name) || "-"}`)].join("\n");
    setWaUrl(whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(text)}` : "");

    if (!supabaseConfigured) return setState("error");
    setState("busy");
    const { error } = await browserClient().from("submissions").insert({ kind, name: val("nama"), whatsapp: val("wa"), payload });
    if (error) return setState("error");
    form.reset();
    firstTouch.current = 0;
    track("generate_lead", { form_kind: kind });
    setState("done");
  }

  return (
    <form className="form" onSubmit={onSubmit} onFocus={() => { firstTouch.current ||= Date.now(); }}>
      {fields.map((f) => (
        <div key={f.name} className={`form__f${f.type === "textarea" ? " form__f--wide" : ""}`}>
          <label htmlFor={f.name}>{f.label}{f.required ? "" : " (opsional)"}</label>
          {f.type === "textarea" ? (
            <textarea id={f.name} name={f.name} rows={4} required={f.required} maxLength={2000} />
          ) : f.type === "select" ? (
            <select id={f.name} name={f.name} required={f.required} defaultValue="">
              <option value="" disabled>Pilih salah satu</option>
              {f.options?.map((o) => <option key={o}>{o}</option>)}
            </select>
          ) : (
            <input id={f.name} name={f.name} type={f.type ?? "text"} required={f.required} maxLength={f.name === "wa" ? 20 : 200} minLength={f.name === "wa" ? 6 : undefined}
              autoComplete={f.type === "tel" ? "tel" : f.type === "email" ? "email" : undefined} />
          )}
        </div>
      ))}
      <input className="form__hp" type="text" name="situs" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <p className="form__f--wide form__consent">{consent} {privacy && <Link className="tlink" href="/privacy">Kebijakan Privasi</Link>}</p>
      <div className="form__f--wide form__end">
        <button type="submit" className="btn btn--red" disabled={state === "busy"}>{state === "busy" ? "Mengirim..." : submitLabel}</button>
        <p role="status" className="form__msg">
          {state === "fast" && "Cepat banget, Kak. Tekan kirim sekali lagi, ya."}
          {state === "done" && "Terkirim. Kami hubungi lewat WhatsApp di jam kerja, Kak."}
          {state === "error" && (waUrl
            ? <>Belum terkirim. <a className="tlink" href={waUrl} target="_blank" rel="noopener">Kirim lewat WhatsApp saja</a></>
            : "Belum terkirim. Coba lagi sebentar lagi, Kak.")}
        </p>
      </div>
    </form>
  );
}
