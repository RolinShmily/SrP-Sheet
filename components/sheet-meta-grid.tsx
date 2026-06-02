import { DifficultyBadge } from "@/components/difficulty-badge";
import type { Sheet } from "@/lib/sheet-schema";

const typeLabels: Record<Sheet["type"], string> = {
  exercise: "练习",
  riff: "Riff",
  lick: "乐句",
  song: "曲目",
  arrangement: "改编",
  original: "原创"
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
    ["调性", sheet.key],
    ["Capo", sheet.capo],
    ["BPM", sheet.bpm ? String(sheet.bpm) : undefined],
    ["发布", sheet.publishedAt],
    ["更新", sheet.updatedAt]
  ].filter((item): item is [string, string] => Boolean(item[1]));

  return (
    <section className="rounded-[28px] border border-[var(--line)] bg-[rgba(251,246,236,0.82)] p-5 shadow-[var(--shadow-soft)]">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <DifficultyBadge difficulty={sheet.difficulty} />
        {sheet.source ? <span className="text-sm font-semibold text-[var(--wood)]">{sheet.source}</span> : null}
      </div>
      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-[var(--line)] bg-[rgba(244,234,216,0.5)] p-3">
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">{label}</dt>
            <dd className="mt-1 font-semibold text-[var(--ink)]">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex flex-wrap gap-2">
        {[...sheet.techniques, ...sheet.tags].map((value) => (
          <span key={value} className="rounded-full border border-[var(--line)] px-2.5 py-1 text-xs font-semibold text-[var(--ink-muted)]">
            {value}
          </span>
        ))}
      </div>
    </section>
  );
}
