import { getMenu } from "@/lib/api";
import { siteUrl } from "@/lib/site";

// Ringkasan teks polos untuk AI assistant (GEO).
export async function GET() {
  const menu = await getMenu();
  const lines = [
    "# CRK Group",
    "",
    "CRK Group (PT Citarasa Kuliner Indonesia, Bandung) adalah perusahaan di balik Cimol Bojot AA, jajanan cimol khas Bandung dengan 400+ titik outlet di Bandung dan Jabodetabek.",
    "",
    "## Menu dan harga Cimol Bojot AA (rupiah, Bandung | Jabodetabek)",
    ...menu.flatMap((c) => ["", `### ${c.name}${c.note ? ` (${c.note})` : ""}`, ...c.items.map((i) => `- ${i.name}: ${i.bandung} | ${i.jabodetabek}`)]),
    "",
    "## Halaman",
    ...[["About Us", "/about"], ["Our Brands & Products", "/brands"], ["Store Locations", "/locations"], ["Careers", "/careers"], ["News & Updates", "/news"], ["Partnership", "/partnership"], ["Contact Us", "/contact"]].map(([t, p]) => `- [${t}](${siteUrl}${p})`),
  ];
  return new Response(lines.join("\n"), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
