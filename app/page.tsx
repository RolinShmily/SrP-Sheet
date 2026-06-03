import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { SheetCard } from "@/components/sheet-card";
import { getSheetSummaries } from "@/lib/content";

const typeLabels = {
  lick: "乐句",
  "full-score": "整谱"
} as const;

export default async function HomePage() {
  const sheets = await getSheetSummaries();
  const featured = sheets.filter((sheet) => sheet.featured).slice(0, 3);
  const featuredSheets = featured.length > 0 ? featured : sheets.slice(0, 3);
  const latestSheets = sheets.slice(0, 5);
  const videoSheet = sheets.find((sheet) => sheet.hasVideo);
  const entryLinks = [
    { label: "整谱", detail: `${sheets.filter((sheet) => sheet.type === "full-score").length} 首完整谱例` },
    { label: "乐句", detail: `${sheets.filter((sheet) => sheet.type === "lick").length} 条短谱例` },
    { label: "带 PDF", detail: `${sheets.filter((sheet) => sheet.hasPdf).length} 份附件` },
    { label: "带演示视频", detail: `${sheets.filter((sheet) => sheet.hasVideo).length} 个参考` }
  ];

  return (
    <main>
      <section className="overflow-hidden py-14 sm:py-20">
        <PageShell className="grid gap-10 lg:grid-cols-[1fr_0.86fr] lg:items-center">
          <div className="reveal">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.26em] text-[var(--wood)]">谱例档案</p>
            <h1 className="font-display text-[clamp(3.2rem,9vw,7.5rem)] font-semibold leading-[0.88] tracking-[-0.05em]">SrP-Sheet</h1>
            <p className="mt-6 max-w-2xl text-xl leading-9 text-[var(--ink-muted)]">一个有谱纸质感的吉他谱例下载库：整理乐句与整谱，配 PDF 预览和 Bilibili 演示视频参考，全部由 Markdown 维护。</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/sheets/" className="srp-primary-cta rounded-full px-6 py-3 shadow-[var(--shadow-tight)] transition hover:-translate-y-0.5">
                浏览谱例库
              </Link>
              <Link href="/about/" className="rounded-full border border-[var(--line)] bg-[rgba(251,246,236,0.72)] px-6 py-3 font-semibold text-[var(--ink)] transition hover:border-[var(--brass)]">
                了解 SrP-Sheet
              </Link>
            </div>
          </div>
          <div className="reveal relative min-h-[430px]" aria-hidden="true">
            <div className="absolute left-4 top-6 w-[84%] rotate-[-3deg] rounded-[34px] border border-[var(--line)] bg-[var(--paper-soft)] p-6 shadow-[var(--shadow-soft)]">
              <div className="mb-5 flex items-center justify-between border-b border-[var(--line)] pb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--wood)]">SrP-Sheet Index</p>
                  <p className="mt-1 font-display text-3xl font-semibold">谱例索引卡</p>
                </div>
                <span className="rounded-full bg-[var(--brass)] px-3 py-1 text-xs font-bold text-[var(--wood-dark)]">PDF</span>
              </div>
              <div className="space-y-3">
                {latestSheets.slice(0, 4).map((sheet, index) => (
                  <div key={sheet.slug} className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 rounded-2xl border border-[var(--line)] bg-[rgba(244,234,216,0.5)] px-3 py-2">
                    <span className="font-mono text-xs font-bold text-[var(--ink-muted)]">{String(index + 1).padStart(2, "0")}</span>
                    <span className="truncate font-semibold text-[var(--ink)]">{sheet.title}</span>
                    <span className="rounded-full border border-[var(--line)] px-2 py-1 text-[0.68rem] font-bold text-[var(--wood-dark)]">{typeLabels[sheet.type]}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                <span>调弦</span>
                <span>·</span>
                <span>附件</span>
                <span>·</span>
                <span>类型</span>
              </div>
            </div>
            <div className="absolute bottom-12 right-3 rotate-6 rounded-[22px] border border-[var(--line)] bg-[var(--brass)] px-5 py-4 text-sm font-bold text-[var(--wood-dark)] shadow-[var(--shadow-tight)]">新页打开 PDF</div>
            <div className="absolute bottom-0 left-2 rounded-full border border-[var(--line)] bg-[var(--paper-soft)] px-5 py-3 text-sm font-bold text-[var(--wood-dark)] shadow-[var(--shadow-tight)]">乐句 / 整谱</div>
          </div>
        </PageShell>
      </section>

      <PageShell className="space-y-20">
        <section>
          <SectionHeading eyebrow="精选推荐" title="精选谱例" />
          <div className="grid gap-5 md:grid-cols-3">
            {featuredSheets.map((sheet) => <SheetCard key={sheet.slug} sheet={sheet} featured />)}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[0.7fr_1fr] lg:items-start">
          <div>
            <SectionHeading eyebrow="最近更新" title="最近更新" />
            <p className="text-[var(--ink-muted)]">每个条目都保留清晰的类型、调弦与附件状态，支持 PDF 预览和视频参考。</p>
          </div>
          <div className="space-y-3">
            {latestSheets.map((sheet) => (
              <Link key={sheet.slug} href={`/sheets/${sheet.slug}/`} className="flex flex-col gap-1 rounded-2xl border border-[var(--line)] bg-[rgba(251,246,236,0.7)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--brass)] sm:flex-row sm:items-center sm:justify-between">
                <span className="font-display text-xl font-semibold">{sheet.title}</span>
                <span className="text-sm font-semibold text-[var(--ink-muted)]">{typeLabels[sheet.type]} · {sheet.tuning}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-[34px] border border-[var(--line)] bg-[rgba(251,246,236,0.78)] p-7 shadow-[var(--shadow-soft)]">
          <SectionHeading eyebrow="浏览入口" title="按类型与附件进入" />
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {entryLinks.map((entry) => (
              <Link key={entry.label} href="/sheets/" className="rounded-3xl border border-[var(--line)] bg-[var(--paper-soft)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--brass)]">
                <span className="font-display text-2xl font-semibold text-[var(--ink)]">{entry.label}</span>
                <span className="mt-2 block text-sm font-semibold text-[var(--ink-muted)]">{entry.detail}</span>
              </Link>
            ))}
          </div>
        </section>

        {videoSheet ? (
          <section className="grid gap-6 rounded-[34px] border border-[var(--line)] bg-[var(--wood-dark)] p-7 text-[var(--paper-soft)] shadow-[var(--shadow-soft)] md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brass)]">视频演示</p>
              <h2 className="mt-3 font-display text-4xl font-semibold">{videoSheet.title}</h2>
              <p className="mt-3 max-w-2xl text-[color-mix(in_srgb,var(--paper-soft)_74%,transparent)]">{videoSheet.summary}</p>
            </div>
            <Link href={`/sheets/${videoSheet.slug}/`} className="rounded-full bg-[var(--brass)] px-5 py-3 text-sm font-bold text-[var(--wood-dark)]">
              查看演示谱例
            </Link>
          </section>
        ) : null}
      </PageShell>
    </main>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-6">
      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.22em] text-[var(--wood)]">{eyebrow}</p>
      <h2 className="font-display text-4xl font-semibold tracking-[-0.03em]">{title}</h2>
    </div>
  );
}
