import Link from "next/link";

// Tautan navigasi. Alamat luar (mis. situs rekrutmen) dibuka di tab baru.
export function NavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return href.startsWith("http")
    ? <a href={href} target="_blank" rel="noopener" onClick={onClick}>{children}</a>
    : <Link href={href} onClick={onClick}>{children}</Link>;
}
