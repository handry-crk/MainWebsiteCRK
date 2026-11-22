import { getContent, getFrozen, getMenu, getSettings } from "@/lib/api";
import { siteUrl } from "@/lib/site";

// Ringkasan teks polos untuk AI assistant (GEO).
export async function GET() {
  const [menu, fz, c, st] = await Promise.all([getMenu(), getFrozen(), getContent(), getSettings()]);
  // Bagian Frozen hanya memuat isi yang nyata: c.v() tidak pernah mengembalikan penanda [ISI: ...].
  const fact = (label: string, key: string) => (c.v(key) ? [`- ${label}: ${c.v(key).replace(/\n+/g, "; ")}`] : []);
  const frozen = fz.ready ? [
    "",
    "## Cimol Bojot AA Frozen",
    c.v("frozen_sub"),
    "",
    ...fz.products.map((p) => `- ${p.name}${p.price ? `: Rp${p.price.toLocaleString("id-ID")}` : ""}${p.available ? "" : " (stok habis)"}${p.shopee || p.tokopedia || p.tiktok ? `, beli: ${p.shopee || p.tokopedia || p.tiktok}` : ""}`),
    ...fact("Isi dan berat per pack", "frozen_pack"), ...fact("Cara goreng", "frozen_cooking"), ...fact("Cara simpan", "frozen_storage"), ...fact("Masa simpan", "frozen_shelf_life"),
    ...fact("Area kirim", "frozen_area"), ...fact("Jam potong order", "frozen_cutoff"),
    `- Halaman: ${siteUrl}/frozen`,
  ] : [];
  const lines = [
    "# CRK Group",
    "",
    "CRK Group (PT Citarasa Kuliner Indonesia, Bandung) adalah perusahaan di balik Cimol Bojot AA, jajanan cimol khas Bandung dengan 500+ titik gerobak dan puluhan kios di Bandung dan Jabodetabek. Halaman Store Locations memuat daftar kios; titik gerobak tidak didaftar satu per satu.",
    ...(c.v("partnership_notice") ? ["", `${c.v("partnership_notice_title")}: ${c.v("partnership_notice")}`] : []),
    "",
    "## Menu dan harga Cimol Bojot AA (rupiah, Bandung | Jabodetabek)",
    ...menu.flatMap((c) => ["", `### ${c.name}${c.note ? ` (${c.note})` : ""}`, ...c.items.map((i) => `- ${i.name}: ${i.bandung} | ${i.jabodetabek}`)]),
    ...frozen,
    ...(st.instagram || st.tiktok ? ["", "## Akun resmi", ...(st.instagram ? [`- Instagram: ${st.instagram}`] : []), ...(st.tiktok ? [`- TikTok: ${st.tiktok}`] : [])] : []),
    "",
    "## Halaman",
    ...[["About Us", "/about"], ["Our Brands & Products", "/brands"], ["Store Locations", "/locations"], ["FAQ", "/faq"], ["Member", "/member"], ["News & Updates", "/news"], ["Partnership", "/partnership"], ["Contact Us", "/contact"]].map(([t, p]) => `- [${t}](${siteUrl}${p})`),
  ];
  return new Response(lines.join("\n"), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
