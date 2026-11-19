"use client";
import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { browserClient, supabaseConfigured } from "@/lib/supabase";
import { ContentEditor } from "./ContentEditor";
import { Crud } from "./Crud";
import { download, outletCsvCols, parseCsv, resources, settingKeys, toCsv } from "./resources";

type Profile = { id: string; full_name: string | null; role: "admin" | "editor" };
type Row = Record<string, unknown>;

const tabs: [string, string, boolean][] = [
  ["home", "Ringkasan", false], ["inbox", "Kotak masuk", false], ["products", "Menu dan harga", false], ["outlets", "Outlet", false],
  ["articles", "Kabar", false], ["positions", "Lowongan", false], ["faqs", "FAQ kemitraan", false], ["frozen_products", "Frozen: produk", false], ["frozen_faqs", "Frozen: tanya jawab", false], ["content", "Konten halaman", false], ["settings", "Pengaturan", true], ["users", "Pengguna", true],
];

export function AdminApp() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);
  const [tab, setTab] = useState("home");
  // Tautan "atur ulang kata sandi" dari email membuka /admin dengan #...type=recovery
  const [recovery, setRecovery] = useState(() => typeof window !== "undefined" && window.location.hash.includes("type=recovery"));
  const [fresh, setFresh] = useState<number | null>(null); // jumlah kiriman berstatus "baru"

  useEffect(() => {
    if (!supabaseConfigured) return;
    const sb = browserClient();
    sb.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = sb.auth.onAuthStateChange((e, s) => { if (e === "PASSWORD_RECOVERY") setRecovery(true); setSession(s); });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return setProfile(undefined);
    browserClient().from("profiles").select("*").eq("id", session.user.id).maybeSingle().then(({ data }) => setProfile((data as Profile) ?? null));
  }, [session]);

  // Angka kiriman baru: dicek saat masuk, saat pindah menu, dan tiap menit selama admin terbuka.
  const staff = Boolean(session && profile);
  useEffect(() => {
    if (!staff) return;
    const load = () => browserClient().from("submissions").select("*", { count: "exact", head: true }).eq("status", "baru").then(({ count }) => setFresh(count ?? null));
    load();
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
  }, [staff, tab]);
  useEffect(() => { document.title = fresh ? `(${fresh}) CRK Admin` : "CRK Admin"; }, [fresh]);

  if (!supabaseConfigured) return <Shell><p>Supabase belum diatur. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.</p></Shell>;
  if (session === undefined) return <Shell><p>Memuat...</p></Shell>;
  if (!session) return <Shell><Login /></Shell>;
  if (recovery) return <Shell><NewPassword done={() => { setRecovery(false); history.replaceState(null, "", "/admin"); }} /></Shell>;
  if (profile === undefined) return <Shell><p>Memeriksa akses...</p></Shell>;
  if (profile === null)
    return (
      <Shell>
        <h1>Akun belum diberi akses</h1>
        <p>Akun {session.user.email} sudah masuk, tetapi belum terdaftar sebagai admin atau editor. Minta admin menambahkan ID berikut di menu Pengguna:</p>
        <p><code>{session.user.id}</code></p>
        <button className="adm-btn" onClick={() => browserClient().auth.signOut()}>Keluar</button>
      </Shell>
    );

  const isAdmin = profile.role === "admin";
  return (
    <div className="adm">
      <aside className="adm-side">
        <p className="adm-brand">CRK Admin</p>
        <nav aria-label="Admin">
          {tabs.filter(([, , adminOnly]) => !adminOnly || isAdmin).map(([k, label]) => (
            <button key={k} aria-current={tab === k ? "page" : undefined} onClick={() => setTab(k)}>
              {label}{k === "inbox" && fresh ? <b className="adm-badge" aria-label={`${fresh} kiriman baru`}>{fresh}</b> : null}
            </button>
          ))}
        </nav>
        <div className="adm-me">
          <span>{profile.full_name || session.user.email}</span>
          <small>{isAdmin ? "Admin" : "Editor"}</small>
          <button className="adm-link" onClick={() => setRecovery(true)}>Ganti kata sandi</button>
          <button className="adm-link" onClick={() => browserClient().auth.signOut()}>Keluar</button>
          <a className="adm-link" href="/" target="_blank" rel="noopener">Lihat website</a>
        </div>
      </aside>
      <main className="adm-main">
        {tab === "home" && <Summary go={setTab} />}
        {tab === "inbox" && <Inbox isAdmin={isAdmin} />}
        {tab === "outlets" && <Crud res={resources.outlets} extra={(reload, rows) => <OutletCsv reload={reload} rows={rows} />} />}
        {["products", "articles", "positions", "faqs", "frozen_products", "frozen_faqs"].includes(tab) && <Crud res={resources[tab]} />}
        {tab === "content" && <ContentEditor />}
        {tab === "settings" && isAdmin && <Settings />}
        {tab === "users" && isAdmin && <Users me={session.user.id} />}
      </main>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="adm-center"><div className="adm-card">{children}</div></div>;
}

function Login() {
  const [msg, setMsg] = useState(() => {
    // Tautan atur ulang yang sudah kedaluwarsa atau sudah dipakai kembali ke sini dengan #error=...
    if (typeof window === "undefined" || !window.location.hash.includes("error")) return "";
    return "Tautan atur ulang sudah kedaluwarsa atau sudah dipakai. Minta tautan baru lewat \"Lupa kata sandi\".";
  });
  const [busy, setBusy] = useState(false);
  const [forgot, setForgot] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email")).trim();
    setBusy(true);
    if (forgot) {
      const { error } = await browserClient().auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/admin" });
      setBusy(false);
      // Sengaja tidak membedakan email terdaftar atau tidak.
      return setMsg(error?.status === 429 ? "Terlalu sering meminta. Tunggu beberapa menit, lalu coba lagi." : "Kalau email itu terdaftar, tautan atur ulang sudah dikirim. Cek kotak masuk dan folder spam; tautannya berlaku sekitar 1 jam.");
    }
    const { error } = await browserClient().auth.signInWithPassword({ email, password: String(fd.get("password")) });
    setBusy(false);
    if (error) setMsg("Email atau kata sandi salah.");
  }
  return (
    <form className="adm-form" onSubmit={submit}>
      <h1>{forgot ? "Atur ulang kata sandi" : "Masuk ke CRK Admin"}</h1>
      {forgot && <p>Masukkan email akun admin. Kami kirim tautan untuk membuat kata sandi baru.</p>}
      <div className="adm-f"><label htmlFor="email">Email</label><input id="email" name="email" type="email" required autoComplete="username" /></div>
      {!forgot && <div className="adm-f"><label htmlFor="password">Kata sandi</label><input id="password" name="password" type="password" required autoComplete="current-password" /></div>}
      <button className="adm-btn adm-btn--main" disabled={busy}>{busy ? "Memeriksa..." : forgot ? "Kirim tautan" : "Masuk"}</button>
      <button type="button" className="adm-link" onClick={() => { setForgot(!forgot); setMsg(""); }}>{forgot ? "Kembali ke halaman masuk" : "Lupa kata sandi?"}</button>
      <p role="alert" className="adm-msg">{msg}</p>
    </form>
  );
}

// Dipakai untuk tautan atur ulang dari email dan untuk "Ganti kata sandi" saat sudah masuk.
function NewPassword({ done }: { done: () => void }) {
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const a = String(fd.get("baru")), b = String(fd.get("ulang"));
    if (a.length < 10) return setMsg("Kata sandi minimal 10 karakter.");
    if (a !== b) return setMsg("Dua isian kata sandi belum sama.");
    setBusy(true);
    const { error } = await browserClient().auth.updateUser({ password: a });
    setBusy(false);
    if (error) return setMsg("Gagal menyimpan: " + error.message);
    setOk(true);
  }
  if (ok) return (<div className="adm-form"><h1>Kata sandi tersimpan</h1><p>Pakai kata sandi baru saat masuk berikutnya.</p><button className="adm-btn adm-btn--main" onClick={done}>Lanjut ke admin</button></div>);
  return (
    <form className="adm-form" onSubmit={submit}>
      <h1>Kata sandi baru</h1>
      <div className="adm-f"><label htmlFor="baru">Kata sandi baru</label><input id="baru" name="baru" type="password" required minLength={10} autoComplete="new-password" /><small>Minimal 10 karakter.</small></div>
      <div className="adm-f"><label htmlFor="ulang">Ulangi kata sandi baru</label><input id="ulang" name="ulang" type="password" required minLength={10} autoComplete="new-password" /></div>
      <button className="adm-btn adm-btn--main" disabled={busy}>{busy ? "Menyimpan..." : "Simpan kata sandi"}</button>
      <button type="button" className="adm-link" onClick={done}>Batal</button>
      <p role="alert" className="adm-msg">{msg}</p>
    </form>
  );
}

function Summary({ go }: { go: (t: string) => void }) {
  const [n, setN] = useState<Record<string, number | null>>({});
  useEffect(() => {
    const sb = browserClient();
    const count = async (key: string, table: string, col?: string, val?: unknown) => {
      let q = sb.from(table).select("*", { count: "exact", head: true });
      if (col) q = q.eq(col, val);
      const { count: c } = await q;
      setN((p) => ({ ...p, [key]: c ?? null }));
    };
    count("inbox", "submissions", "status", "baru");
    count("outlets", "outlets", "status", "buka");
    count("products", "products", "is_available", true);
    count("articles", "articles", "is_published", true);
    count("positions", "positions", "is_open", true);
  }, []);
  const cards: [string, string, string][] = [
    ["inbox", "Pesan baru belum ditangani", "inbox"], ["outlets", "Outlet buka", "outlets"], ["products", "Menu tampil", "products"],
    ["articles", "Kabar terbit", "articles"], ["positions", "Lowongan dibuka", "positions"],
  ];
  return (
    <div>
      <div className="adm-head"><h2>Ringkasan</h2></div>
      <div className="adm-stats">
        {cards.map(([k, label, t]) => (
          <button key={k} onClick={() => go(t)}><b>{n[k] ?? "–"}</b><span>{label}</span></button>
        ))}
      </div>
      <p className="adm-msg">Perubahan konten tampil di website publik dalam beberapa menit.</p>
    </div>
  );
}

const kinds: Record<string, string> = { application: "Lamaran", partnership: "Kemitraan", contact: "Pesan" };

function Inbox({ isAdmin }: { isAdmin: boolean }) {
  const sb = browserClient();
  const [rows, setRows] = useState<Row[]>([]);
  const [kind, setKind] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const load = useCallback(async () => {
    const { data, error } = await sb.from("submissions").select("*").order("created_at", { ascending: false }).limit(1000);
    if (error) setMsg("Gagal memuat: " + error.message); else setRows(data ?? []);
  }, [sb]);
  useEffect(() => { load(); }, [load]);

  async function patch(id: unknown, body: Row) {
    const { error } = await sb.from("submissions").update(body).eq("id", id);
    setMsg(error ? "Gagal menyimpan: " + error.message : "Tersimpan.");
    load();
  }
  async function remove(id: unknown) {
    const { error } = await sb.from("submissions").delete().eq("id", id);
    setMsg(error ? "Gagal menghapus: " + error.message : "Terhapus.");
    load();
  }
  const shown = kind ? rows.filter((r) => r.kind === kind) : rows;
  const exportCsv = () => download("kotak-masuk.csv", toCsv(shown.map((r) => ({ ...r, jenis: kinds[String(r.kind)] })), ["created_at", "jenis", "name", "whatsapp", "status", "note", "payload"]));

  return (
    <div>
      <div className="adm-head">
        <h2>Kotak masuk <span>{shown.length}</span></h2>
        <div className="adm-actions">
          <select aria-label="Jenis" value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="">Semua jenis</option>
            {Object.entries(kinds).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <button className="adm-btn" onClick={exportCsv}>Unduh CSV</button>
        </div>
      </div>
      <p role="status" className="adm-msg">{msg}</p>
      <div className="adm-tablewrap">
        <table className="adm-table">
          <thead><tr><th>Tanggal</th><th>Jenis</th><th>Nama</th><th>WhatsApp</th><th>Status</th><th /></tr></thead>
          <tbody>
            {shown.length === 0 && <tr><td colSpan={6}>Belum ada pesan masuk.</td></tr>}
            {shown.map((r) => {
              const id = String(r.id);
              return [
                <tr key={id} className={r.status === "baru" ? "is-new" : ""}>
                  <td>{new Date(String(r.created_at)).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</td>
                  <td>{kinds[String(r.kind)]}</td>
                  <td>{String(r.name)}</td>
                  <td><a className="adm-link" href={`https://wa.me/${String(r.whatsapp).replace(/\D/g, "").replace(/^0/, "62")}`} target="_blank" rel="noopener">{String(r.whatsapp)}</a></td>
                  <td>
                    <select aria-label="Status" value={String(r.status)} onChange={(e) => patch(r.id, { status: e.target.value })}>
                      <option value="baru">Baru</option><option value="diproses">Diproses</option><option value="selesai">Selesai</option>
                    </select>
                  </td>
                  <td><button className="adm-link" onClick={() => setOpen(open === id ? null : id)}>{open === id ? "Tutup" : "Detail"}</button></td>
                </tr>,
                open === id && (
                  <tr key={id + "-d"} className="adm-detail">
                    <td colSpan={6}>
                      <dl>{Object.entries((r.payload as Record<string, string>) ?? {}).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{String(v)}</dd></div>)}</dl>
                      <form className="adm-note" onSubmit={(e) => { e.preventDefault(); patch(r.id, { note: new FormData(e.currentTarget).get("note") }); }}>
                        <label htmlFor={`n-${id}`}>Catatan internal</label>
                        <textarea id={`n-${id}`} name="note" rows={2} defaultValue={String(r.note ?? "")} />
                        <div className="adm-actions">
                          <button className="adm-btn">Simpan catatan</button>
                          {isAdmin && <button type="button" className="adm-btn adm-btn--ghost" onDoubleClick={() => remove(r.id)} title="Klik dua kali untuk menghapus">Hapus (klik dua kali)</button>}
                        </div>
                      </form>
                    </td>
                  </tr>
                ),
              ];
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OutletCsv({ reload, rows }: { reload: () => void; rows: Row[] }) {
  const [preview, setPreview] = useState<{ ok: Row[]; errors: string[] } | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const table = parseCsv(await file.text());
    const head = (table.shift() ?? []).map((h) => h.trim().toLowerCase());
    const errors: string[] = [], ok: Row[] = [], seen = new Set<string>();
    for (const need of ["store_code", "name", "city", "lat", "lng"]) if (!head.includes(need)) errors.push(`Kolom wajib "${need}" tidak ada di baris judul.`);
    if (errors.length === 0)
      table.forEach((cells, i) => {
        const r: Row = {};
        head.forEach((h, j) => { if (outletCsvCols.includes(h)) r[h] = (cells[j] ?? "").trim(); });
        const line = i + 2, lat = Number(String(r.lat).replace(",", ".")), lng = Number(String(r.lng).replace(",", "."));
        const bad: string[] = [];
        if (!r.store_code) bad.push("store_code kosong");
        else if (seen.has(String(r.store_code))) bad.push("store_code ganda");
        if (!r.name) bad.push("name kosong");
        if (!r.city) bad.push("city kosong");
        if (!String(r.lat) || Number.isNaN(lat) || lat < -11 || lat > 6) bad.push("lat tidak valid");
        if (!String(r.lng) || Number.isNaN(lng) || lng < 95 || lng > 141) bad.push("lng tidak valid");
        const status = String(r.status || "buka").toLowerCase();
        if (!["buka", "segera", "tutup"].includes(status)) bad.push("status harus buka, segera, atau tutup");
        if (bad.length) return errors.push(`Baris ${line}: ${bad.join(", ")}`);
        seen.add(String(r.store_code));
        for (const k of ["gofood_url", "grabfood_url", "shopeefood_url", "gmaps_url"]) if (k in r && !r[k]) r[k] = null;
        ok.push({ ...r, lat, lng, status });
      });
    setMsg("");
    setPreview({ ok, errors });
  }

  async function run() {
    if (!preview) return;
    setBusy(true);
    const sb = browserClient();
    for (let i = 0; i < preview.ok.length; i += 200) {
      const { error } = await sb.from("outlets").upsert(preview.ok.slice(i, i + 200), { onConflict: "store_code" });
      if (error) { setBusy(false); return setMsg(`Berhenti di baris data ke-${i + 1}: ${error.message}`); }
    }
    setBusy(false);
    setMsg(`${preview.ok.length} outlet diimpor.`);
    setPreview(null);
    reload();
  }

  return (
    <div className="adm-csv">
      <div className="adm-actions">
        <label className="adm-btn">Impor CSV<input type="file" accept=".csv,text/csv" onChange={onFile} hidden /></label>
        <button className="adm-btn" onClick={() => download("outlet.csv", toCsv(rows, outletCsvCols))}>Unduh CSV</button>
        <button className="adm-link" onClick={() => download("template-outlet.csv", toCsv([{ store_code: "BDG-001", name: "Cimol Bojot AA – Braga", city: "Bandung", address: "Jl. ...", landmark: "", hours: "Setiap hari 10.00–21.00", lat: -6.9175, lng: 107.6098, status: "buka" }], outletCsvCols))}>Unduh template</button>
      </div>
      {preview && (
        <div className="adm-preview">
          <p><b>{preview.ok.length}</b> baris siap diimpor, <b>{preview.errors.length}</b> bermasalah. Outlet dengan store_code yang sudah ada akan diperbarui.</p>
          {preview.errors.length > 0 && <ul>{preview.errors.slice(0, 30).map((e) => <li key={e}>{e}</li>)}{preview.errors.length > 30 && <li>dan {preview.errors.length - 30} lainnya</li>}</ul>}
          <div className="adm-actions">
            <button className="adm-btn adm-btn--main" disabled={busy || preview.ok.length === 0} onClick={run}>{busy ? "Mengimpor..." : `Impor ${preview.ok.length} outlet`}</button>
            <button className="adm-btn" onClick={() => setPreview(null)}>Batal</button>
          </div>
        </div>
      )}
      <p role="status" className="adm-msg">{msg}</p>
    </div>
  );
}

function Settings() {
  const sb = browserClient();
  const [vals, setVals] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");
  useEffect(() => {
    sb.from("site_settings").select("*").then(({ data }) => setVals(Object.fromEntries((data ?? []).map((r) => [r.key, r.value]))));
  }, [sb]);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await sb.from("site_settings").upsert([...settingKeys.map(([key]) => key), "show_placeholders"].map((key) => ({ key, value: (vals[key] ?? (key === "show_placeholders" ? "1" : "")).trim() })), { onConflict: "key" });
    setMsg(error ? "Gagal menyimpan: " + error.message : "Tersimpan. Website publik ikut berubah dalam beberapa menit.");
  }
  return (
    <form className="adm-form" onSubmit={save}>
      <h2>Pengaturan</h2>
      <div className="adm-check">
        <label>
          <input type="checkbox" checked={(vals.show_placeholders ?? "1") !== "0"} onChange={(e) => setVals({ ...vals, show_placeholders: e.target.checked ? "1" : "0" })} />
          Tampilkan penanda [ISI: ...] di website untuk teks yang belum diisi
        </label>
        <small>Nyalakan selama pengisian konten. Matikan sebelum launch: bagian yang belum diisi akan disembunyikan.</small>
      </div>
      {settingKeys.map(([key, label, hint]) => (
        <div className="adm-f" key={key}>
          <label htmlFor={`s-${key}`}>{label}</label>
          <input id={`s-${key}`} value={vals[key] ?? ""} onChange={(e) => setVals({ ...vals, [key]: e.target.value })} />
          {hint && <small>{hint}</small>}
        </div>
      ))}
      <button className="adm-btn adm-btn--main">Simpan</button>
      <p role="status" className="adm-msg">{msg}</p>
    </form>
  );
}

function Users({ me }: { me: string }) {
  const sb = browserClient();
  const [rows, setRows] = useState<Profile[]>([]);
  const [msg, setMsg] = useState("");
  const load = useCallback(async () => {
    const { data } = await sb.from("profiles").select("*").order("created_at");
    setRows((data as Profile[]) ?? []);
  }, [sb]);
  useEffect(() => { load(); }, [load]);
  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget, fd = new FormData(form);
    const { error } = await sb.from("profiles").upsert({ id: String(fd.get("id")).trim(), full_name: String(fd.get("full_name")).trim(), role: fd.get("role") });
    setMsg(error ? "Gagal: " + error.message : "Pengguna ditambahkan.");
    if (!error) form.reset();
    load();
  }
  async function remove(id: string) {
    const { error } = await sb.from("profiles").delete().eq("id", id);
    setMsg(error ? "Gagal: " + error.message : "Akses dicabut.");
    load();
  }
  return (
    <div>
      <div className="adm-head"><h2>Pengguna <span>{rows.length}</span></h2></div>
      <div className="adm-tablewrap">
        <table className="adm-table">
          <thead><tr><th>Nama</th><th>Peran</th><th>ID</th><th /></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}><td>{r.full_name}</td><td>{r.role}</td><td><code>{r.id}</code></td>
                <td>{r.id !== me && <button className="adm-link" onDoubleClick={() => remove(r.id)} title="Klik dua kali">Cabut akses (klik dua kali)</button>}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <form className="adm-form" onSubmit={add}>
        <h2>Tambah pengguna</h2>
        <p className="adm-msg">1. Buat akunnya di Supabase Dashboard, menu Authentication, Users, Add user. 2. Minta orang itu masuk ke halaman ini; layar akan menampilkan ID-nya. 3. Tempel ID itu di sini.</p>
        <div className="adm-f"><label htmlFor="u-id">ID pengguna</label><input id="u-id" name="id" required pattern="[0-9a-fA-F-]{36}" /></div>
        <div className="adm-f"><label htmlFor="u-name">Nama</label><input id="u-name" name="full_name" required /></div>
        <div className="adm-f"><label htmlFor="u-role">Peran</label><select id="u-role" name="role" defaultValue="editor"><option value="editor">Editor (konten dan kotak masuk)</option><option value="admin">Admin (semua, termasuk pengaturan dan pengguna)</option></select></div>
        <button className="adm-btn adm-btn--main">Tambah</button>
        <p role="status" className="adm-msg">{msg}</p>
      </form>
    </div>
  );
}
