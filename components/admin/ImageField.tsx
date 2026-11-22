"use client";
import { useRef, useState } from "react";
import { browserClient } from "@/lib/supabase";
import { parseImg } from "@/lib/content-schema";

const MAX = 1600; // sisi terpanjang setelah dikecilkan

// Mengecilkan foto di browser sebelum diunggah, supaya website tetap ringan.
async function shrink(file: File): Promise<{ blob: Blob; width: number; height: number; ext: string }> {
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, MAX / Math.max(bmp.width, bmp.height));
  const width = Math.round(bmp.width * k), height = Math.round(bmp.height * k);
  const cv = document.createElement("canvas");
  cv.width = width; cv.height = height;
  cv.getContext("2d")!.drawImage(bmp, 0, 0, width, height);
  bmp.close();
  const to = (type: string, q?: number) => new Promise<Blob | null>((res) => cv.toBlob(res, type, q));
  let blob = await to("image/webp", 0.86), ext = "webp";
  if (!blob || blob.type !== "image/webp") {
    // browser tanpa WebP (Safari lama): PNG untuk gambar tanpa latar, JPEG untuk foto
    const png = file.type === "image/png";
    blob = await to(png ? "image/png" : "image/jpeg", 0.88);
    ext = png ? "png" : "jpg";
  }
  if (!blob) throw new Error("Gambar tidak bisa diproses.");
  return { blob, width, height, ext };
}

export function ImageField({ value, onChange, folder, label }: { value: string; onChange: (v: string) => void; folder: string; label: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const img = parseImg(value);

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!/^image\/(png|jpe?g|webp)$/.test(file.type)) return setMsg("Pakai file JPG, PNG, atau WebP.");
    if (file.size > 20 * 1024 * 1024) return setMsg("File terlalu besar (maksimal 20 MB sebelum dikecilkan).");
    setBusy(true); setMsg("Mengunggah...");
    try {
      const { blob, width, height, ext } = await shrink(file);
      // Nama file asli tidak dipakai: alamat gambar terlihat publik, dan nama asli sering memuat hal yang tidak perlu tampil.
      const name = label.toLowerCase().replace(/\(.*?\)/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30) || "foto";
      const path = `${folder}/${Date.now()}-${name}.${ext}`;
      const sb = browserClient();
      const { error } = await sb.storage.from("media").upload(path, blob, { contentType: blob.type, cacheControl: "31536000" });
      if (error) throw error;
      onChange(`${sb.storage.from("media").getPublicUrl(path).data.publicUrl}|${width}|${height}`);
      setMsg(`Terunggah (${width}×${height}, ${Math.round(blob.size / 1024)} KB). Tekan Simpan untuk memakainya.`);
    } catch (err) {
      setMsg("Gagal mengunggah: " + ((err as Error).message || "coba lagi"));
    }
    setBusy(false);
  }

  return (
    <div className="adm-img">
      <div className="adm-img__box">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {img ? <img src={img.src} alt="" /> : <span>Belum ada gambar</span>}
      </div>
      <div className="adm-img__act">
        <button type="button" className="adm-btn" onClick={() => input.current?.click()} disabled={busy}>{img ? "Ganti gambar" : "Unggah gambar"}</button>
        {img && <button type="button" className="adm-btn adm-btn--ghost" onClick={() => { onChange(""); setMsg("Gambar dilepas. Tekan Simpan untuk menerapkannya."); }}>Lepas</button>}
        <input ref={input} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={pick} aria-label={`Unggah ${label}`} />
        <small role="status">{msg}</small>
      </div>
    </div>
  );
}
