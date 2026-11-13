// Data contoh. Semua yang bertanda [CONTOH] / [ISI: ...] harus diganti data asli lewat Admin Dashboard.
export type MenuItem = { name: string; note: string; price: number };
export type Product = { name: string; bandung: string; jabodetabek: string };
export type Category = { name: string; note?: string; items: Product[] };
export type NewsItem = { slug: string; date: string; isoDate: string | null; category: string; title: string; excerpt: string; body: string[] };
export type City = { name: string };
export type Outlet = { id: string; name: string; city: string; address: string; landmark: string; hours: string; lat: number; lng: number; gofood?: string; grabfood?: string; gmaps?: string; soon?: boolean };
export type Position = { id: string; title: string; department: string; location: string; type: string; summary: string; requirements: string[] };

export const bestSellers: MenuItem[] = [
  { name: "Cimol Bojot", note: "Yang original, bumbunya nempel", price: 6000 },
  { name: "Cimol Mozza", note: "Isi mozzarella, ditarik selagi panas", price: 10000 },
  { name: "Cimol Kuah Keju", note: "Disiram kuah keju hangat", price: 15000 },
];

const same = (name: string, p: string): Product => ({ name, bandung: p, jabodetabek: p });

// Sumber: Price Structure CRK, 13 Okt 2026.
export const menu: Category[] = [
  { name: "Cimol", note: "Harga kecil / besar", items: [
    same("Cimol Bojot", "6.000 / 12.000"),
    { name: "Cimol Mozza", bandung: "10.000 / 20.000", jabodetabek: "11.000 / 22.000" },
    { name: "Cimol Beef", bandung: "10.000 / 20.000", jabodetabek: "11.000 / 22.000" },
    { name: "Cimol Ayam", bandung: "10.000 / 20.000", jabodetabek: "11.000 / 22.000" },
  ] },
  { name: "Mix", items: [
    { name: "Mix Mozza Bojot", bandung: "16.000", jabodetabek: "17.000" },
    { name: "Mix Ayam Bojot", bandung: "16.000", jabodetabek: "17.000" },
    { name: "Mix Beef Bojot", bandung: "16.000", jabodetabek: "17.000" },
    { name: "Mix Mozza Ayam", bandung: "20.000", jabodetabek: "22.000" },
    { name: "Mix Mozza Beef", bandung: "20.000", jabodetabek: "22.000" },
  ] },
  { name: "Kuah Keju", items: [same("Kuah Keju Mozza", "15.000"), same("Kuah Keju Beef", "15.000"), same("Kuah Keju Ayam", "15.000")] },
  { name: "New Series", items: [
    same("Beef Mentai", "15.000"), same("Ayam Mentai", "15.000"), same("Ayam Saus Takoyaki", "15.000"),
    same("Ayam Kare Jepang", "15.000"), same("Beef Kare Jepang", "15.000"),
    same("Bojot Saus Misdasem", "10.000"), same("Bojot Saus Kacang", "10.000"),
  ] },
  { name: "Minuman", items: [same("Da Hong Pao", "18.000")] },
  { name: "Frozen", note: "Per pack. Rasa: Asin Pedas, Ayam Bawang, Balado, Barbeque, Jagung Bakar", items: [same("Cimol Frozen Mozza", "26.000"), same("Cimol Frozen Ayam", "25.000")] },
];

export const news: NewsItem[] = [
  { slug: "contoh-kios-kelapa-dua", date: "[ISI: tanggal]", isoDate: null, category: "Outlet baru", title: "[CONTOH] Kios baru buka di Kelapa Dua, Tangerang", excerpt: "[ISI: ringkasan 1 kalimat]", body: ["[ISI: isi artikel, ditulis tim CRK]"] },
  { slug: "contoh-segera-hadir-malang", date: "[ISI: tanggal]", isoDate: null, category: "Outlet baru", title: "[CONTOH] Cimol Bojot AA segera hadir di Kota Malang", excerpt: "[ISI: ringkasan 1 kalimat]", body: ["[ISI: isi artikel, ditulis tim CRK]"] },
  { slug: "contoh-new-series", date: "[ISI: tanggal]", isoDate: null, category: "Produk", title: "[CONTOH] Kenalan sama varian New Series", excerpt: "[ISI: ringkasan 1 kalimat]", body: ["[ISI: isi artikel, ditulis tim CRK]"] },
  { slug: "contoh-kabar-perusahaan", date: "[ISI: tanggal]", isoDate: null, category: "Perusahaan", title: "[CONTOH] Kabar dari kantor CRK Group", excerpt: "[ISI: ringkasan 1 kalimat]", body: ["[ISI: isi artikel, ditulis tim CRK]"] },
];

export const cities: City[] = ["Bandung", "Jakarta", "Bekasi", "Depok", "Tangerang", "Bogor"].map((name) => ({ name }));

// Koordinat contoh di sekitar pusat kota, BUKAN lokasi outlet sebenarnya. Ganti dengan data Formulir Titik Lokasi.
const o = (id: string, area: string, city: string, lat: number, lng: number): Outlet => ({
  id, name: `[CONTOH] Cimol Bojot AA – ${area}`, city, address: "[ISI: alamat lengkap]", landmark: "[ISI: patokan]", hours: "[ISI: jam buka]", lat, lng,
});
export const outlets: Outlet[] = [
  o("bdg-1", "Braga", "Bandung", -6.9175, 107.6098), o("bdg-2", "Dago", "Bandung", -6.8849, 107.6136), o("bdg-3", "Buah Batu", "Bandung", -6.9476, 107.6335),
  o("jkt-1", "Tebet", "Jakarta", -6.2262, 106.8583), o("jkt-2", "Kemang", "Jakarta", -6.2607, 106.8137), o("jkt-3", "Kelapa Gading", "Jakarta", -6.1588, 106.9056),
  o("bks-1", "Bekasi Barat", "Bekasi", -6.2383, 106.9756), o("bks-2", "Harapan Indah", "Bekasi", -6.1859, 106.9767),
  o("dpk-1", "Margonda", "Depok", -6.3728, 106.8347),
  o("tng-1", "Kelapa Dua", "Tangerang", -6.2441, 106.6147), o("tng-2", "Bintaro", "Tangerang", -6.2767, 106.7186),
  o("bgr-1", "Pajajaran", "Bogor", -6.6014, 106.8060),
];

export const positions: Position[] = [
  { id: "contoh-crew", title: "[CONTOH] Crew Outlet", department: "Operasional", location: "[ISI: kota]", type: "Crew Outlet", summary: "[ISI: ringkasan pekerjaan]", requirements: ["[ISI: syarat 1]", "[ISI: syarat 2]"] },
  { id: "contoh-spv", title: "[CONTOH] Supervisor Area", department: "Operasional", location: "[ISI: kota]", type: "Full-time", summary: "[ISI: ringkasan pekerjaan]", requirements: ["[ISI: syarat 1]", "[ISI: syarat 2]"] },
  { id: "contoh-mkt", title: "[CONTOH] Social Media Specialist", department: "Marketing", location: "Bandung", type: "Full-time", summary: "[ISI: ringkasan pekerjaan]", requirements: ["[ISI: syarat 1]", "[ISI: syarat 2]"] },
];

export const partnershipTypes = [
  { name: "Pesanan acara dan kantor", text: "Cimol buat rapat, ulang tahun kantor, atau acara komunitas. [ISI: minimal pesanan dan area layanan]", wa: "Halo, saya mau tanya pesanan untuk acara." },
  { name: "Hampers Frozen", text: "Cimol Frozen dikemas jadi bingkisan. [ISI: pilihan paket dan waktu pesan]", wa: "Halo, saya mau tanya hampers Frozen." },
  { name: "Reseller dan agen Frozen", text: "Jual Cimol Bojot AA Frozen di kota Kakak. [ISI: syarat dan skema]", wa: "Halo, saya tertarik jadi reseller Frozen." },
  { name: "Kemitraan titik outlet", text: "Buka titik Cimol Bojot AA bareng kami. [ISI: skema kemitraan]", wa: "Halo, saya mau tanya kemitraan titik outlet." },
];

export const partnershipFaq = [
  { q: "[ISI: pertanyaan 1]", a: "[ISI: jawaban dari tim kemitraan]" },
  { q: "[ISI: pertanyaan 2]", a: "[ISI: jawaban dari tim kemitraan]" },
  { q: "[ISI: pertanyaan 3]", a: "[ISI: jawaban dari tim kemitraan]" },
];
