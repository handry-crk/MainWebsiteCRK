import Link from "next/link";

type Props = { href: string; children: React.ReactNode; variant?: "cream" | "red" | "line"; className?: string };

export function Button({ href, children, variant = "cream", className = "" }: Props) {
  return (
    <Link href={href} className={`btn btn--${variant} ${className}`}>
      {children}
    </Link>
  );
}
