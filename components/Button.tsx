import Link from "next/link";

type Props = { href: string; children: React.ReactNode; variant?: "cream" | "red" | "line"; className?: string };

// Alamat luar dibuka di tab baru.
export function Button({ href, children, variant = "cream", className = "" }: Props) {
  const cls = `btn btn--${variant} ${className}`;
  return href.startsWith("http")
    ? <a href={href} target="_blank" rel="noopener" className={cls}>{children}</a>
    : <Link href={href} className={cls}>{children}</Link>;
}
