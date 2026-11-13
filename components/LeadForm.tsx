"use client";
import { useState } from "react";
import { browserClient, supabaseConfigured } from "@/lib/supabase";

export type Field = { name: string; label: string; type?: "text" | "tel" | "email" | "url" | "textarea" | "select"; options?: string[]; required?: boolean };
type Kind = "application" | "partnership" | "contact";

// Form menyimpan ke tabel `submissions` (terbaca di Admin > Kotak masuk).
// Bila Supabase belum diatur atau penyimpanan gagal, pengunjung diarahkan ke WhatsApp.
export function LeadForm({ kind, fields, whatsapp, intro, submitLabel = "Kirim" }: { kind: Kind; fields: Field[]; whatsapp: string; intro: string; submitLabel?: string }) {
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [waUrl, setWaUrl] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get("situs")) return; // honeypot
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
    setState("done");
  }

  return (
    <form className="form" onSubmit={onSubmit}>
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
      <div className="form__f--wide form__end">
        <button type="submit" className="btn btn--red" disabled={state === "busy"}>{state === "busy" ? "Mengirim..." : submitLabel}</button>
        <p role="status" className="form__msg">
          {state === "done" && "Terkirim. Kami hubungi lewat WhatsApp di jam kerja, Kak."}
          {state === "error" && (waUrl
            ? <>Belum terkirim. <a className="tlink" href={waUrl} target="_blank" rel="noopener">Kirim lewat WhatsApp saja</a></>
            : "Belum terkirim. Coba lagi sebentar lagi, Kak.")}
        </p>
      </div>
    </form>
  );
}
