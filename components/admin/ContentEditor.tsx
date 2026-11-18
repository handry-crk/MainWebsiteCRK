"use client";
import { useEffect, useState } from "react";
import { browserClient } from "@/lib/supabase";
import { contentSchema } from "@/lib/content-schema";
import { ImageField } from "./ImageField";

// Admin > Konten halaman: semua teks dan gambar halaman yang sebelumnya tertanam di kode.
export function ContentEditor() {
  const sb = browserClient();
  const [vals, setVals] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<Record<string, string>>({});
  const [page, setPage] = useState(contentSchema[0].page);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    sb.from("page_content").select("key,value").then(({ data, error }) => {
      if (error) return setMsg("Gagal memuat: " + error.message + ". Pastikan cms-2026-11-19.sql sudah dijalankan.");
      const v = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
      setVals(v); setSaved(v); setReady(true);
    });
  }, [sb]);

  const group = contentSchema.find((g) => g.page === page)!;
  const dirty = Object.keys({ ...vals, ...saved }).filter((k) => (vals[k] ?? "") !== (saved[k] ?? ""));
  const missing = (g: (typeof contentSchema)[number]) => g.fields.filter((f) => f.ph && !(vals[f.key] ?? "").trim()).length;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (dirty.length === 0) return setMsg("Tidak ada perubahan.");
    setBusy(true);
    const { error } = await sb.from("page_content").upsert(dirty.map((key) => ({ key, value: (vals[key] ?? "").trim(), updated_at: new Date().toISOString() })), { onConflict: "key" });
    setBusy(false);
    if (error) return setMsg("Gagal menyimpan: " + error.message);
    setSaved({ ...vals });
    setMsg(`${dirty.length} isian tersimpan. Website publik ikut berubah dalam beberapa menit.`);
  }

  return (
    <form onSubmit={save}>
      <div className="adm-head">
        <h2>Konten halaman</h2>
        <div className="adm-actions">
          {dirty.length > 0 && <span className="adm-dirty">{dirty.length} belum disimpan</span>}
          <button className="adm-btn adm-btn--main" disabled={busy || !ready}>{busy ? "Menyimpan..." : "Simpan"}</button>
        </div>
      </div>
      <div className="adm-pages" role="tablist" aria-label="Halaman">
        {contentSchema.map((g) => (
          <button key={g.page} type="button" role="tab" aria-selected={page === g.page} onClick={() => setPage(g.page)}>
            {g.page}{missing(g) > 0 && <b title="Isian wajib yang masih kosong">{missing(g)}</b>}
          </button>
        ))}
      </div>
      <p role="status" className="adm-msg">{msg}</p>
      {group.note && <p className="adm-note-top">{group.note}</p>}
      <div className="adm-form adm-form--wide">
        {group.fields.map((f) => {
          const v = vals[f.key] ?? "";
          const empty = !v.trim();
          return (
            <div className="adm-f" key={f.key}>
              <label htmlFor={`c-${f.key}`}>{f.label}{f.ph && empty && <i className="adm-need">belum diisi</i>}</label>
              {f.type === "image" ? (
                <ImageField value={v} onChange={(nv) => setVals({ ...vals, [f.key]: nv })} folder="halaman" label={f.label} />
              ) : f.type === "textarea" ? (
                <textarea id={`c-${f.key}`} rows={3} value={v} placeholder={f.def ?? ""} onChange={(e) => setVals({ ...vals, [f.key]: e.target.value })} />
              ) : (
                <input id={`c-${f.key}`} value={v} placeholder={f.def ?? ""} onChange={(e) => setVals({ ...vals, [f.key]: e.target.value })} />
              )}
              <small>
                {f.hint ? f.hint + ". " : ""}
                {f.type !== "image" && (f.def ? "Kosong = memakai teks bawaan (tertulis samar di kolom)." : f.ph ? `Kosong = tampil sebagai ${f.ph} atau disembunyikan, sesuai Pengaturan.` : "")}
              </small>
            </div>
          );
        })}
      </div>
      <div className="adm-actions adm-sticky">
        <button className="adm-btn adm-btn--main" disabled={busy || !ready}>{busy ? "Menyimpan..." : "Simpan"}</button>
        {dirty.length > 0 && <button type="button" className="adm-btn" onClick={() => { setVals({ ...saved }); setMsg("Perubahan dibatalkan."); }}>Batalkan perubahan</button>}
      </div>
    </form>
  );
}
