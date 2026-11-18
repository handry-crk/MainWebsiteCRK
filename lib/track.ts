// Kirim event ke Google Analytics 4. Diam saja bila GA belum dipasang (ID kosong di Admin > Pengaturan).
type Gtag = (cmd: "event", name: string, params?: Record<string, string | number>) => void;
export function track(name: string, params?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  (window as unknown as { gtag?: Gtag }).gtag?.("event", name, params);
}
