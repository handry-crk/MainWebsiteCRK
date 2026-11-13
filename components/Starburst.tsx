// Badge starburst mustard. Pakai maksimal satu per layar.
export function Starburst({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const n = 18;
  const outer = [50, 44, 49, 42, 50, 45, 48, 43, 50, 44, 49, 42, 50, 46, 48, 43, 50, 44];
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const b = ((i + 0.5) / n) * Math.PI * 2 - Math.PI / 2;
    pts.push(`${(50 + outer[i] * Math.cos(a)).toFixed(2)},${(50 + outer[i] * Math.sin(a)).toFixed(2)}`);
    pts.push(`${(50 + 33 * Math.cos(b)).toFixed(2)},${(50 + 33 * Math.sin(b)).toFixed(2)}`);
  }
  return (
    <div className={`starburst ${className}`}>
      <svg viewBox="0 0 100 100" aria-hidden="true"><polygon points={pts.join(" ")} /></svg>
      <div className="starburst__text">{children}</div>
    </div>
  );
}
