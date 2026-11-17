// Pita berjalan seperti spanduk gerobak. Isi digandakan supaya putarannya mulus.
export function Tape({ items, variant = "cream", reverse = false }: { items: string[]; variant?: "cream" | "red" | "mustard"; reverse?: boolean }) {
  const run = (hidden: boolean) => (
    <span className="tape__run" aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <span key={t}>
          {t}
          <i />
        </span>
      ))}
    </span>
  );
  return (
    <div className={`tape tape--${variant}${reverse ? " tape--rev" : ""}`}>
      <div className="tape__track">
        {run(false)}
        {run(true)}
        {run(true)}
        {run(true)}
      </div>
    </div>
  );
}
