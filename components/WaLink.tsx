import { wa } from "@/lib/api";

// Tombol WhatsApp. Selama nomor belum diisi di config/brand.ts, tampil penanda agar tidak ada tautan mati.
export function WaLink({ number, text, children, variant = "red" }: { number: string; text: string; children: React.ReactNode; variant?: "red" | "line" | "cream" }) {
  const href = wa(number, text);
  if (!href) return <span className="todo">[ISI: nomor WhatsApp] {children}</span>;
  return <a className={`btn btn--${variant}`} href={href} target="_blank" rel="noopener">{children}</a>;
}
