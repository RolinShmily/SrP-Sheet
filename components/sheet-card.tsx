import Link from "next/link";
import type { SheetSummary } from "@/lib/sheet-schema";
import { cn } from "@/lib/utils";

const typeLabels: Record<SheetSummary["type"], string> = {
  lick: "乐句",
  "full-score": "整谱"
};

interface SheetCardProps {
  sheet: SheetSummary;
  featured?: boolean;
}

export function SheetCard({ sheet, featured = false }: SheetCardProps) {
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[26px] border border-[var(--line)] bg-[rgba(251,246,236,0.86)] p-5 shadow-[var(--shadow-soft)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-tight)]",
        featured && "md:p-6"
      )}
    >
      <div className="absolute right-0 top-0 h-16 w-16 translate-x-8 -translate-y-8 rotate-45 bg-[var(--brass)] opacity-0 transition group-hover:opacity-70" />
      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
        <span>{typeLabels[sheet.type]}</span>
        <span aria-hidden="true">/</span>
        <span>{sheet.tuning}</span>
      </div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {sheet.hasVideo ? <span className="rounded-full border border-[var(--line)] px-2.5 py-1 text-xs font-semibold text-[var(--wood-dark)]">演示视频</span> : null}
        {sheet.hasPdf ? <span className="rounded-full border border-[var(--line)] px-2.5 py-1 text-xs font-semibold text-[var(--wood-dark)]">PDF</span> : null}
      </div>
      <h3 className="font-display text-2xl font-semibold leading-tight">
        <Link href={`/sheets/${sheet.slug}/`} className="decoration-[var(--brass)] underline-offset-4 hover:underline">
          {sheet.title}
        </Link>
      </h3>
      <p className="mt-3 text-sm leading-6 text-[var(--ink-muted)]">{sheet.summary}</p>
    </article>
  );
}
