"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { browserClient } from "@/lib/supabase";
import { ImageField } from "./ImageField";
import type { F, Resource } from "./resources";

type Row = Record<string, unknown>;

const toLocal = (iso: unknown) => {
  if (!iso) return "";
  const d = new Date(String(iso));
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};
const show = (f: F, v: unknown) =>
  f.type === "bool" ? (v ? "Ya" : "Tidak") : f.type === "datetime" && v ? new Date(String(v)).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : String(v ?? "");

export function Crud({ res, extra }: { res: Resource; extra?: (reload: () => void, rows: Row[]) => React.ReactNode }) {
  const sb = browserClient();
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState<Row | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await sb.from(res.table).select("*").order(res.order, { ascending: res.asc ?? true }).limit(5000);
    if (error) setMsg("Gagal memuat: " + error.message);
    else setRows(data ?? []);
  }, [sb, res]);
  useEffect(() => { setEdit(null); setQ(""); setMsg(""); load(); }, [load]);

  const cols = res.fields.filter((f) => f.list);
  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? rows.filter((r) => cols.some((c) => String(r[c.key] ?? "").toLowerCase().includes(t))) : rows;
  }, [rows, q, cols]);

  const blank = () => Object.fromEntries(res.fields.map((f) => [f.key, f.def ?? (f.type === "datetime" ? new Date().toISOString() : f.type === "number" ? "" : "")]));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!edit) return;
    setBusy(true);
    const body: Row = {};
    for (const f of res.fields) {
      const v = edit[f.key];
      const nullable = f.key.endsWith("_url") || f.key === "note" || f.key === "category_note" || f.key === "badge";
      if (f.type === "number") body[f.key] = v === "" || v == null ? null : Number(v);
      else if (f.type === "bool") body[f.key] = Boolean(v);
      else if (typeof v === "string") body[f.key] = v.trim() === "" && nullable ? null : v.trim();
      else body[f.key] = v ?? (nullable ? null : "");
    }
    const { error } = edit.id ? await sb.from(res.table).update(body).eq("id", edit.id) : await sb.from(res.table).insert(body);
    setBusy(false);
    if (error) return setMsg("Gagal menyimpan: " + error.message);
    setMsg("Tersimpan. Website publik ikut berubah dalam beberapa menit.");
    setEdit(null);
    load();
  }

  async function remove() {
    if (!edit?.id) return;
    setBusy(true);
    const { error } = await sb.from(res.table).delete().eq("id", edit.id);
    setBusy(false);
    setConfirmDel(false);
    if (error) return setMsg("Gagal menghapus: " + error.message);
    setMsg("Terhapus.");
    setEdit(null);
    load();
  }

  if (edit) {
    return (
      <form className="adm-form" onSubmit={save}>
        <h2>{edit.id ? `Ubah ${res.one}` : `Tambah ${res.one}`}</h2>
        {res.fields.map((f) => (
          <div key={f.key} className={f.type === "bool" ? "adm-check" : "adm-f"}>
            {f.type === "bool" ? (
              <label><input type="checkbox" checked={Boolean(edit[f.key])} onChange={(e) => setEdit({ ...edit, [f.key]: e.target.checked })} /> {f.label}</label>
            ) : (
              <>
                <label htmlFor={`f-${f.key}`}>{f.label}{f.required ? " *" : ""}</label>
                {f.type === "image" ? (
                  <ImageField value={String(edit[f.key] ?? "")} onChange={(v) => setEdit({ ...edit, [f.key]: v })} folder={res.table} label={f.label} />
                ) : f.type === "textarea" ? (
                  <textarea id={`f-${f.key}`} rows={f.key === "body" ? 12 : 3} required={f.required} value={String(edit[f.key] ?? "")} onChange={(e) => setEdit({ ...edit, [f.key]: e.target.value })} />
                ) : f.type === "select" ? (
                  <select id={`f-${f.key}`} value={String(edit[f.key] ?? "")} onChange={(e) => setEdit({ ...edit, [f.key]: e.target.value })}>
                    {f.options?.map((o) => <option key={o}>{o}</option>)}
                  </select>
                ) : f.type === "datetime" ? (
                  <input id={`f-${f.key}`} type="datetime-local" value={toLocal(edit[f.key])} onChange={(e) => setEdit({ ...edit, [f.key]: e.target.value ? new Date(e.target.value).toISOString() : null })} />
                ) : (
                  <input id={`f-${f.key}`} type={f.type === "number" ? "number" : "text"} step="any" required={f.required} value={String(edit[f.key] ?? "")} onChange={(e) => setEdit({ ...edit, [f.key]: e.target.value })} />
                )}
                {f.hint && <small>{f.hint}</small>}
              </>
            )}
          </div>
        ))}
        <div className="adm-actions">
          <button className="adm-btn adm-btn--main" disabled={busy}>{busy ? "Menyimpan..." : "Simpan"}</button>
          <button type="button" className="adm-btn" onClick={() => { setEdit(null); setConfirmDel(false); }}>Batal</button>
          {Boolean(edit.id) && (confirmDel
            ? <button type="button" className="adm-btn adm-btn--danger" onClick={remove} disabled={busy}>Ya, hapus permanen</button>
            : <button type="button" className="adm-btn adm-btn--ghost" onClick={() => setConfirmDel(true)}>Hapus</button>)}
        </div>
        <p role="status" className="adm-msg">{msg}</p>
      </form>
    );
  }

  return (
    <div>
      <div className="adm-head">
        <h2>{res.title} <span>{rows.length}</span></h2>
        <div className="adm-actions">
          <input className="adm-search" type="search" placeholder="Cari..." aria-label="Cari" value={q} onChange={(e) => setQ(e.target.value)} />
          <button className="adm-btn adm-btn--main" onClick={() => { setMsg(""); setEdit(blank()); }}>Tambah {res.one}</button>
        </div>
      </div>
      {extra?.(load, rows)}
      <p role="status" className="adm-msg">{msg}</p>
      <div className="adm-tablewrap">
        <table className="adm-table">
          <thead><tr>{cols.map((c) => <th key={c.key}>{c.label}</th>)}<th /></tr></thead>
          <tbody>
            {shown.length === 0 && <tr><td colSpan={cols.length + 1}>Belum ada data. Tekan "Tambah {res.one}".</td></tr>}
            {shown.slice(0, 500).map((r) => (
              <tr key={String(r.id)}>
                {cols.map((c) => <td key={c.key}>{show(c, r[c.key])}</td>)}
                <td><button className="adm-link" onClick={() => { setMsg(""); setEdit(r); }}>Ubah</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {shown.length > 500 && <p className="adm-msg">Menampilkan 500 dari {shown.length}. Pakai pencarian untuk menyaring.</p>}
    </div>
  );
}
