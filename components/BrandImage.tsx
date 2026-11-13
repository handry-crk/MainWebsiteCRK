import Image from "next/image";

type Props = {
  src?: string;
  alt: string;
  /** Deskripsi foto yang dibutuhkan; tampil selama src kosong. */
  label: string;
  variant?: "cutout" | "torn" | "plain";
  ratio?: string;
  className?: string;
  priority?: boolean;
};

// Semua foto lewat komponen ini. Selama `src` kosong, tampil placeholder berlabel
// supaya tim tahu foto apa yang harus disiapkan.
export function BrandImage({ src, alt, label, variant = "plain", ratio = "4 / 3", className = "", priority }: Props) {
  return (
    <figure className={`bimg bimg--${variant} ${className}`} style={{ aspectRatio: ratio }}>
      {src ? (
        <Image src={src} alt={alt} fill sizes="(max-width: 800px) 100vw, 50vw" priority={priority} />
      ) : (
        <figcaption className="bimg__ph">
          <span>Foto</span>
          {label}
        </figcaption>
      )}
    </figure>
  );
}
