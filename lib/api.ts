// Lapisan akses data. Halaman hanya memanggil fungsi di file ini.
// - Supabase belum diatur (env kosong): memakai data contoh di data/seed.ts.
// - Supabase diatur: membaca database, di-cache dan diperbarui otomatis tiap beberapa menit.
import { cacheLife } from "next/cache";
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

export async function getOutlets(): Promise<Outlet[]> {
  "use cache";
  cacheLife("minutes");
  if (!supabaseConfigured) return seed.outlets;
  const o = (await rows<OutletRow>("outlets", "city")) ?? [];
  return o.map((r) => ({ id: r.id, name: r.name, city: r.city, address: r.address, landmark: r.landmark, hours: r.hours, lat: r.lat, lng: r.lng, gofood: r.gofood_url ?? undefined, grabfood: r.grabfood_url ?? undefined, gmaps: r.gmaps_url ?? undefined, soon: r.status === "segera" }));
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
  const img = (key: string, fallback: Img): Img => parseImg(raw[key]) ?? fallback;
  return {
    t,
    logo: img("img_logo", brand.logo),
    mascot: img("img_mascot", brand.mascot),
    mascotSmall: img("img_mascot_small", brand.mascotSmall),
    kiosk: img("img_kiosk", brand.kiosk),
    aboutStory: parseImg(raw.img_about_story),
  };
}

// Nomor WhatsApp dan tautan: dari tabel site_settings, cadangannya config/brand.ts.
export async function getSettings() {
  "use cache";
  cacheLife("minutes");
  const s: Record<string, string> = {};
  if (supabaseConfigured) for (const r of (await rows<{ key: string; value: string }>("site_settings", "key")) ?? []) s[r.key] = r.value.trim();
  return {
    showPlaceholders: s.show_placeholders !== "0",
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
