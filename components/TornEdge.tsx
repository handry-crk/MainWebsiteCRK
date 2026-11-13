// Tepi sobekan kertas di antara dua section. `color` = warna kertas yang "menimpa".
function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

export function TornEdge({ color, seed = 7, flip = false }: { color: string; seed?: number; flip?: boolean }) {
  const r = rng(seed);
  const pts: string[] = [];
  let x = 0;
  while (x < 1200) {
    pts.push(`${x.toFixed(0)},${(6 + r() * 22).toFixed(1)}`);
    x += 8 + r() * 26;
  }
  pts.push(`1200,${(8 + r() * 18).toFixed(1)}`);
  return (
    <svg className={`torn${flip ? " torn--flip" : ""}`} viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true">
      <polygon points={`0,40 ${pts.join(" ")} 1200,40`} fill={color} />
    </svg>
  );
}
