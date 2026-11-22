import Link from "next/link";

// Format ringan untuk isi kabar dan jawaban FAQ, tanpa HTML dari admin:
//   ## Subjudul        - butir daftar        1. langkah bernomor
//   **tebal**          [teks tautan](/halaman atau https://...)
// Baris kosong memisahkan paragraf.
function inline(s: string, k: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(((?:https?:\/\/|\/)[^)\s]+)\)/g;
  let last = 0, m: RegExpExecArray | null, i = 0;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    if (m[1]) out.push(<b key={`${k}-${i++}`}>{m[1]}</b>);
    else if (m[3].startsWith("/")) out.push(<Link key={`${k}-${i++}`} className="tlink" href={m[3]}>{m[2]}</Link>);
    else out.push(<a key={`${k}-${i++}`} className="tlink" href={m[3]} target="_blank" rel="noopener">{m[2]}</a>);
    last = m.index + m[0].length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

export function RichText({ text, blocks }: { text?: string; blocks?: string[] }) {
  const list = blocks ?? (text ?? "").split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return (
    <>
      {list.map((b, i) => {
        const lines = b.split("\n").map((l) => l.trim()).filter(Boolean);
        if (/^##\s+/.test(b) && lines.length === 1) return <h2 key={i} className="rt__h">{b.replace(/^##\s+/, "")}</h2>;
        if (lines.every((l) => /^-\s+/.test(l))) return <ul key={i} className="rt__list">{lines.map((l, j) => <li key={j}>{inline(l.replace(/^-\s+/, ""), `${i}-${j}`)}</li>)}</ul>;
        if (lines.every((l) => /^\d+[.)]\s+/.test(l))) return <ol key={i} className="rt__list">{lines.map((l, j) => <li key={j}>{inline(l.replace(/^\d+[.)]\s+/, ""), `${i}-${j}`)}</li>)}</ol>;
        return <p key={i}>{inline(lines.join(" "), String(i))}</p>;
      })}
    </>
  );
}
