// "6.000 / 12.000" → [6000, 12000]; "15.000" → [15000]
export const prices = (s: string) => s.split("/").map((p) => Number(p.replace(/\D/g, ""))).filter((n) => n > 0);
export const rp = (n: number) => "Rp" + n.toLocaleString("id-ID");
