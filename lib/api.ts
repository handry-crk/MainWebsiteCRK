// Lapisan akses data. Halaman hanya memanggil fungsi di file ini.
// - Supabase belum diatur (env kosong): memakai data contoh di data/seed.ts.
// - Supabase diatur: membaca database, di-cache dan diperbarui otomatis tiap beberapa menit.
import { cacheLife } from "next/cache";
import { pageMeta } from "./site";
import { brand } from "@/config/brand";
import * as seed from "@/data/seed";
import type { Category, MenuItem, NewsItem, Outlet, Position } from "@/data/seed";
import { contentFields, parseImg, type Img } from "./content-schema";
import { publicClient, supabaseConfigured } from "./supabase";

async function rows<T>(table: string, order: string, ascending = true): Promise<T[] | null> {
  try {
    const { data, error } = await publicClient().from(table).select("*").order(order, { ascending }).limit(2000);
    if (error) throw error;
    return data as T[];
  } catch (e) {
    console.error(`[supabase] gagal membaca ${table}:`, (e as Error).message ?? e);
    return null;
  }
}

type ProductRow = { category: string; category_note: string | null; name: string; note: string | null; price_bandung: string; price_jabodetabek: string; is_bestseller: boolean; photo_url?: string | null; badge?: string | null; has_spice?: boolean | null };

async function products(): Promise<ProductRow[] | null> {
  "use cache";
  cacheLife("minutes");
  return rows<ProductRow>("products", "sort");
}

// Data cadangan bila Supabase belum diatur: menu asli dari seed, tiga yang pertama ditandai andalan.
function seedMenu(): Category[] {
  const best = new Map(seed.bestSellers.map((b) => [b.name, b.note]));
  return seed.menu.map((c) => ({ ...c, items: c.items.map((i) => ({ ...i, category: c.name, best: best.has(i.name) || i.name === "Kuah Keju Mozza", note: best.get(i.name) })) }));
}

export async function getMenu(): Promise<Category[]> {
  if (!supabaseConfigured) return seedMenu();
  const p = await products();
  if (!p || p.length === 0) return seedMenu(); // harga di seed adalah harga asli, aman sebagai cadangan
  const out: Category[] = [];
  for (const r of p) {
    let c = out.find((x) => x.name === r.category);
    if (!c) out.push((c = { name: r.category, note: r.category_note ?? undefined, items: [] }));
    c.items.push({ name: r.name, bandung: r.price_bandung, jabodetabek: r.price_jabodetabek, photo: parseImg(r.photo_url) ?? undefined, note: r.note ?? undefined, badge: r.badge ?? undefined, spice: Boolean(r.has_spice), best: r.is_bestseller, category: r.category });
  }
  return out;
}

export async function getBestSellers(): Promise<MenuItem[]> {
  if (!supabaseConfigured) return seed.bestSellers;
  const p = (await products())?.filter((r) => r.is_bestseller) ?? [];
  if (p.length === 0) return seed.bestSellers;
  return p.map((r) => ({ name: r.name, note: r.note ?? "", price: Number(r.price_bandung.split("/")[0].replace(/\D/g, "")), photo: parseImg(r.photo_url) ?? undefined }));
}

type ArticleRow = { slug: string; title: string; category: string; excerpt: string; body: string; published_at: string; cover_url?: string | null };
const fmtDate = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" });

export async function getNews(): Promise<NewsItem[]> {
  "use cache";
  cacheLife("minutes");
  if (!supabaseConfigured) return seed.news;
  const a = (await rows<ArticleRow>("articles", "published_at", false)) ?? [];
  return a.map((r) => ({
    slug: r.slug, title: r.title, category: r.category, excerpt: r.excerpt,
    date: fmtDate.format(new Date(r.published_at)), isoDate: r.published_at,
    body: r.body.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean),
    cover: parseImg(r.cover_url) ?? undefined,
  }));
}
export async function getLatestNews(limit = 3) { return (await getNews()).slice(0, limit); }
export async function getArticle(slug: string) { return (await getNews()).find((n) => n.slug === slug) ?? null; }

type OutletRow = { id: string; name: string; city: string; address: string; landmark: string; hours: string; lat: number; lng: number; gofood_url: string | null; grabfood_url: string | null; gmaps_url?: string | null; status: string };

// Alamat halaman kios dibuat dari namanya ("Kios Margonda" -> /locations/kios-margonda).
// Nama yang sama diberi akhiran -2, -3. Mengganti nama kios di admin ikut mengganti alamat halamannya.
const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "kios";
export type OutletWithSlug = Outlet & { slug: string };
function withSlugs(list: Outlet[]): OutletWithSlug[] {
  const seen = new Map<string, number>();
  // Urutan tetap (menurut id) supaya akhiran -2 tidak berpindah kios saat urutan tampil berubah.
  const slugs = new Map<string, string>();
  for (const o of [...list].sort((a, b) => String(a.id).localeCompare(String(b.id)))) {
    const base = slugify(o.name), n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    slugs.set(o.id, n === 1 ? base : `${base}-${n}`);
  }
  return list.map((o) => ({ ...o, slug: slugs.get(o.id)! }));
}

export async function getOutlet(slug: string) {
  return (await getOutlets()).find((o) => o.slug === slug) ?? null;
}

export async function getOutlets(): Promise<OutletWithSlug[]> {
  "use cache";
  cacheLife("minutes");
  if (!supabaseConfigured) return withSlugs(seed.outlets);
  const o = (await rows<OutletRow>("outlets", "city")) ?? [];
  return withSlugs(o.map((r) => ({ id: r.id, name: r.name, city: r.city, address: r.address, landmark: r.landmark, hours: r.hours, lat: r.lat, lng: r.lng, gofood: r.gofood_url ?? undefined, grabfood: r.grabfood_url ?? undefined, gmaps: r.gmaps_url ?? undefined, soon: r.status === "segera" })));
}

export async function getCities() {
  const o = await getOutlets();
  const names = [...new Set(o.map((x) => x.city))];
  return names.length ? names.map((name) => ({ name })) : seed.cities;
}

type PositionRow = { id: string; title: string; department: string; location: string; type: string; summary: string; requirements: string };

export async function getPositions(): Promise<Position[]> {
  "use cache";
  cacheLife("minutes");
  if (!supabaseConfigured) return seed.positions;
  const p = (await rows<PositionRow>("positions", "created_at", false)) ?? [];
  return p.map((r) => ({ ...r, requirements: r.requirements.split("\n").map((s) => s.trim()).filter(Boolean) }));
}

export async function getPartnership() {
  "use cache";
  cacheLife("minutes");
  if (!supabaseConfigured) return { types: seed.partnershipTypes, faq: seed.partnershipFaq };
  const f = (await rows<{ question: string; answer: string }>("faqs", "sort")) ?? [];
  return { types: seed.partnershipTypes, faq: f.map((r) => ({ q: r.question, a: r.answer })) };
}

// Teks dan gambar halaman dari Admin > Konten halaman.
async function contentRows(): Promise<Record<string, string>> {
  "use cache";
  cacheLife("minutes");
  const out: Record<string, string> = {};
  if (!supabaseConfigured) return out;
  for (const r of (await rows<{ key: string; value: string }>("page_content", "key")) ?? []) out[r.key] = r.value;
  return out;
}

export async function getContent() {
  const [raw, st] = await Promise.all([contentRows(), getSettings()]);
  // t(key): isi dari admin; bila kosong, teks bawaan; bila itu pun tidak ada, penanda [ISI: ...]
  // (penanda hanya tampil selama Pengaturan > "Tampilkan penanda" menyala).
  const t = (key: string) => {
    const v = raw[key]?.trim();
    if (v) return v;
    const f = contentFields[key];
    return f?.def ?? (st.showPlaceholders ? f?.ph ?? "" : "");
  };
  // v(key): hanya isi yang sungguh ada (dari admin atau teks bawaan). Tidak pernah mengembalikan penanda [ISI: ...];
  // dipakai untuk data terstruktur dan llms.txt, yang dikutip mesin apa adanya.
  const v = (key: string) => {
    const x = raw[key]?.trim() || contentFields[key]?.def || "";
    return x.includes("[ISI") ? "" : x;
  };
  const img = (key: string, fallback: Img): Img => parseImg(raw[key]) ?? fallback;
  return {
    t,
    v,
    showPlaceholders: st.showPlaceholders,
    logo: img("img_logo", brand.logo),
    mascot: img("img_mascot", brand.mascot),
    mascotSmall: img("img_mascot_small", brand.mascotSmall),
    kiosk: img("img_kiosk", brand.kiosk),
    aboutStory: parseImg(raw.img_about_story),
  };
}

// ---------- Frozen ----------
type FrozenRow = { id: string; name: string; variant: string; flavor: string; sku: string; description: string; pack_count: number; pack_weight_g: number | null; pieces_per_pack: string; price: number | null; photo_url: string | null; shopee_url: string | null; tokopedia_url: string | null; tiktok_url: string | null; is_available: boolean; is_published: boolean };

export async function getFrozen(): Promise<{ products: seed.FrozenProduct[]; faqs: seed.FrozenFaq[]; ready: boolean }> {
  "use cache";
  cacheLife("minutes");
  let products = seed.frozenProducts, faqs = seed.frozenFaqs;
  if (supabaseConfigured) {
    // Tabel belum dibuat (frozen-2026-11-19.sql belum dijalankan) = rows() mengembalikan null: pakai isi awal.
    const [p, f] = await Promise.all([rows<FrozenRow>("frozen_products", "sort"), rows<{ question: string; answer: string; is_published: boolean }>("frozen_faqs", "sort")]);
    if (p) products = p.filter((r) => r.is_published).map((r) => ({ id: r.id, name: r.name, variant: r.variant, flavor: r.flavor, sku: r.sku, description: r.description, packCount: r.pack_count || 1, weightG: r.pack_weight_g, pieces: r.pieces_per_pack, price: r.price, photo: parseImg(r.photo_url) ?? undefined, shopee: r.shopee_url ?? undefined, tokopedia: r.tokopedia_url ?? undefined, tiktok: r.tiktok_url ?? undefined, available: r.is_available }));
    if (f) faqs = f.filter((r) => r.is_published).map((r) => ({ q: r.question, a: r.answer }));
  }
  // Siap tayang = minimal satu produk punya harga dan tautan beli. Sebelum itu halaman tidak ditautkan dan tidak diindeks.
  const ready = products.some((p) => p.price && (p.shopee || p.tokopedia || p.tiktok));
  return { products, faqs, ready };
}

// Judul dan deskripsi halaman dari Admin > Konten halaman > SEO.
export async function seoMeta(page: string, path: string) {
  const c = await getContent();
  const title = c.t(`seo_${page}_title`), description = c.t(`seo_${page}_desc`);
  const meta = pageMeta({ title, description, path });
  // Home memakai judul utuh, tanpa akhiran " | CRK Group".
  return page === "home" ? { ...meta, title: { absolute: title } } : meta;
}

// Nomor WhatsApp dan tautan: dari tabel site_settings, cadangannya config/brand.ts.
export async function getSettings() {
  "use cache";
  cacheLife("minutes");
  const s: Record<string, string> = {};
  if (supabaseConfigured) for (const r of (await rows<{ key: string; value: string }>("site_settings", "key")) ?? []) s[r.key] = r.value.trim();
  return {
    showPlaceholders: s.show_placeholders !== "0",
    gaId: /^G-[A-Z0-9]{4,}$/.test(s.ga_id ?? "") ? s.ga_id : "",
    whatsappCs: s.whatsapp_cs || brand.whatsappCs,
    whatsappPartnership: s.whatsapp_partnership || brand.whatsappPartnership,
    instagram: s.instagram || brand.instagram,
    tiktok: s.tiktok || brand.tiktok,
    order: {
      gofood: s.gofood || brand.order.gofood, grabfood: s.grabfood || brand.order.grabfood, shopeefood: s.shopeefood || brand.order.shopeefood,
      tokopedia: s.tokopedia || brand.order.tokopedia, shopee: s.shopee || brand.order.shopee, tiktokshop: s.tiktokshop || brand.order.tiktokshop,
    },
  };
}

export const rupiah = (n: number) => n.toLocaleString("id-ID");
export const wa = (number: string, text: string) => (number ? `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(text)}` : "");
