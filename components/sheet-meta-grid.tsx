import type { Sheet } from "@/lib/sheet-schema";

const typeLabels: Record<Sheet["type"], string> = {
  lick: "乐句",
  "full-score": "整谱"
};

const instrumentLabels: Record<Sheet["instrument"], string> = {
  "acoustic-guitar": "木吉他",
  "electric-guitar": "电吉他",
  "classical-guitar": "古典吉他",
  bass: "贝斯"
};

interface SheetMetaGridProps {
  sheet: Sheet;
}

export function SheetMetaGrid({ sheet }: SheetMetaGridProps) {
  const items = [
    ["类型", typeLabels[sheet.type]],
    ["乐器", instrumentLabels[sheet.instrument]],
    ["调弦", sheet.tuning],
    ["附件", [sheet.pdf ? "PDF" : null, sheet.bilibili ? "演示视频" : null].filter(Boolean).join(" / ") || undefined],
    ["调性", sheet.key],
    ["Capo", sheet.capo],
    ["BPM", sheet.bpm ? String(sheet.bpm) : undefined],
    ["发布", sheet.publishedAt],
    ["更新", sheet.updatedAt]
  ].filter((item): item is [string, string] => Boolean(item[1]));

  return (
    <section className="rounded-[28px] border border-[var(--line)] bg-[rgba(251,246,236,0.82)] p-5 shadow-[var(--shadow-soft)]">
      {sheet.source ? <p className="mb-4 text-sm font-semibold text-[var(--wood)]">{sheet.source}</p> : null}
      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-[var(--line)] bg-[rgba(244,234,216,0.5)] p-3">
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">{label}</dt>
            <dd className="mt-1 font-semibold text-[var(--ink)]">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
