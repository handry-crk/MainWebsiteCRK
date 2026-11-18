export type F = {
  key: string; label: string;
  type?: "text" | "textarea" | "number" | "bool" | "select" | "datetime" | "image";
  options?: string[]; required?: boolean; list?: boolean; hint?: string; def?: unknown;
};
export type Resource = { table: string; title: string; one: string; order: string; asc?: boolean; fields: F[] };

export const resources: Record<string, Resource> = {
  products: {
    table: "products", title: "Menu dan harga", one: "menu", order: "sort",
    fields: [
      { key: "name", label: "Nama menu", required: true, list: true },
      { key: "category", label: "Kategori", required: true, list: true, hint: "Mis. Cimol, Mix, Kuah Keju, New Series, Minuman, Frozen" },
      { key: "category_note", label: "Catatan kategori", hint: "Tampil di bawah judul kategori. Isi sama untuk semua menu di kategori itu." },
      { key: "price_bandung", label: "Harga Bandung", required: true, list: true, hint: "Tulis seperti tampil, mis. 6.000 / 12.000" },
      { key: "price_jabodetabek", label: "Harga Jabodetabek", required: true, list: true },
      { key: "note", label: "Keterangan singkat", hint: "Dipakai untuk menu andalan di Home" },
      { key: "photo_url", label: "Foto menu", type: "image", hint: "Tampil di halaman menu dan, untuk menu andalan, di Home. Sebaiknya persegi." },
      { key: "sort", label: "Urutan", type: "number", def: 0 },
      { key: "badge", label: "Label kecil", hint: "Opsional, tampil di kotak menu. Mis. Baru, Favorit" },
      { key: "has_spice", label: "Bisa pilih level pedas", type: "bool", def: false, list: true },
      { key: "is_bestseller", label: "Menu andalan (kotak besar di Home)", type: "bool", def: false, list: true },
      { key: "is_available", label: "Tampil di website", type: "bool", def: true, list: true },
    ],
  },
  outlets: {
    table: "outlets", title: "Outlet", one: "outlet", order: "city",
    fields: [
      { key: "store_code", label: "Kode toko", required: true, list: true, hint: "Unik. Dipakai saat impor CSV untuk memperbarui data." },
      { key: "name", label: "Nama outlet", required: true, list: true, hint: "Cimol Bojot AA – [Area], sama dengan nama di Google Business Profile" },
      { key: "city", label: "Kota", required: true, list: true },
      { key: "address", label: "Alamat", type: "textarea" },
      { key: "landmark", label: "Patokan" },
      { key: "hours", label: "Jam buka", hint: "Mis. Setiap hari 10.00–21.00" },
      { key: "lat", label: "Latitude", type: "number", required: true },
      { key: "lng", label: "Longitude", type: "number", required: true },
      { key: "gofood_url", label: "Tautan GoFood" },
      { key: "grabfood_url", label: "Tautan GrabFood" },
      { key: "shopeefood_url", label: "Tautan ShopeeFood" },
      { key: "gmaps_url", label: "Tautan Google Maps", hint: "Dipakai tombol Petunjuk arah. Kosong = memakai koordinat." },
      { key: "status", label: "Status", type: "select", options: ["buka", "segera", "tutup"], def: "buka", list: true, hint: "segera = tampil dengan label Segera buka; tutup = tidak tampil" },
    ],
  },
  articles: {
    table: "articles", title: "Kabar", one: "kabar", order: "published_at", asc: false,
    fields: [
      { key: "title", label: "Judul", required: true, list: true },
      { key: "slug", label: "Slug (alamat halaman)", required: true, hint: "Huruf kecil, angka, dan tanda hubung. Mis. kios-baru-kelapa-dua" },
      { key: "category", label: "Kategori", type: "select", options: ["Outlet baru", "Produk", "Promo", "Perusahaan"], def: "Perusahaan", list: true },
      { key: "excerpt", label: "Ringkasan (1 kalimat)", type: "textarea", hint: "Dipakai sebagai deskripsi di Google" },
      { key: "cover_url", label: "Foto sampul", type: "image", hint: "Tampil di daftar kabar, halaman kabar, dan saat tautan dibagikan. Sebaiknya mendatar (4:3)." },
      { key: "body", label: "Isi", type: "textarea", hint: "Pisahkan paragraf dengan satu baris kosong" },
      { key: "published_at", label: "Tanggal terbit", type: "datetime", list: true },
      { key: "is_published", label: "Terbitkan", type: "bool", def: false, list: true },
    ],
  },
  positions: {
    table: "positions", title: "Lowongan", one: "lowongan", order: "created_at", asc: false,
    fields: [
      { key: "title", label: "Posisi", required: true, list: true },
      { key: "department", label: "Departemen", list: true },
      { key: "location", label: "Lokasi", list: true },
      { key: "type", label: "Jenis", type: "select", options: ["Full-time", "Part-time", "Crew Outlet", "Magang"], def: "Full-time" },
      { key: "summary", label: "Ringkasan pekerjaan", type: "textarea" },
      { key: "requirements", label: "Syarat", type: "textarea", hint: "Satu syarat per baris" },
      { key: "is_open", label: "Lowongan dibuka", type: "bool", def: true, list: true },
    ],
  },
  faqs: {
    table: "faqs", title: "FAQ kemitraan", one: "pertanyaan", order: "sort",
    fields: [
      { key: "question", label: "Pertanyaan", required: true, list: true },
      { key: "answer", label: "Jawaban", type: "textarea", required: true },
      { key: "sort", label: "Urutan", type: "number", def: 0, list: true },
    ],
  },
};

export const settingKeys: [string, string, string][] = [
  ["whatsapp_cs", "WhatsApp customer service", "Format 628xxxxxxxxxx, tanpa spasi atau tanda +"],
  ["whatsapp_partnership", "WhatsApp kemitraan", "Format 628xxxxxxxxxx"],
  ["instagram", "Instagram", "Tautan lengkap, diawali https://"],
  ["tiktok", "TikTok", "Tautan lengkap"],
  ["gofood", "GoFood", "Tautan toko atau pencarian brand"],
  ["grabfood", "GrabFood", ""],
  ["shopeefood", "ShopeeFood", ""],
  ["tokopedia", "Tokopedia", ""],
  ["shopee", "Shopee", ""],
  ["tiktokshop", "TikTok Shop", ""],
];

// ---------- CSV ----------
export function parseCsv(text: string): string[][] {
  const out: string[][] = [];
  let row: string[] = [], cell = "", q = false;
  const t = text.replace(/^﻿/, "");
  const delim = (t.split("\n")[0].match(/;/g)?.length ?? 0) > (t.split("\n")[0].match(/,/g)?.length ?? 0) ? ";" : ",";
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) {
      if (c === '"' && t[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === delim) { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && t[i + 1] === "\n") i++;
      row.push(cell); cell = "";
      if (row.some((x) => x.trim() !== "")) out.push(row);
      row = [];
    } else cell += c;
  }
  row.push(cell);
  if (row.some((x) => x.trim() !== "")) out.push(row);
  return out;
}

export function toCsv(rows: Record<string, unknown>[], cols: string[]): string {
  const esc = (v: unknown) => {
    const s = v == null ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return "﻿" + [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\r\n");
}

export function download(name: string, text: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

export const outletCsvCols = ["store_code", "name", "city", "address", "landmark", "hours", "lat", "lng", "gofood_url", "grabfood_url", "shopeefood_url", "gmaps_url", "status"];
