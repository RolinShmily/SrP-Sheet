import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { SheetCard } from "@/components/sheet-card";
import { getSheetSummaries } from "@/lib/content";

export default async function HomePage() {
  const sheets = await getSheetSummaries();
  const featured = sheets.filter((sheet) => sheet.featured).slice(0, 3);
  const featuredSheets = featured.length > 0 ? featured : sheets.slice(0, 3);
  const latestSheets = sheets.slice(0, 5);
  const videoSheet = sheets.find((sheet) => sheet.hasVideo);
  const techniques = Array.from(new Set(sheets.flatMap((sheet) => sheet.techniques))).slice(0, 6);

  return (
    <main>
      <section className="overflow-hidden py-14 sm:py-20">
        <PageShell className="grid gap-10 lg:grid-cols-[1fr_0.86fr] lg:items-center">
          <div className="reveal">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.26em] text-[var(--wood)]">谱例档案</p>
            <h1 className="font-display text-[clamp(3.2rem,9vw,7.5rem)] font-semibold leading-[0.88] tracking-[-0.05em]">SrP-Sheet</h1>
            <p className="mt-6 max-w-2xl text-xl leading-9 text-[var(--ink-muted)]">一个有谱纸质感的吉他谱例下载库：短练习、乐句、技巧片段，配 Bilibili 演示视频参考，全部由 Markdown 维护。</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/sheets/" className="rounded-full bg-[var(--wood)] px-6 py-3 font-semibold text-[var(--paper-soft)] shadow-[var(--shadow-tight)] transition hover:-translate-y-0.5">
                浏览谱例库
              </Link>
              <Link href="/about/" className="rounded-full border border-[var(--line)] bg-[rgba(251,246,236,0.72)] px-6 py-3 font-semibold text-[var(--ink)] transition hover:border-[var(--brass)]">
                了解内容边界
              </Link>
            </div>
          </div>
          <div className="reveal relative min-h-[430px]" aria-hidden="true">
            <div className="absolute left-5 top-4 w-[82%] rotate-[-4deg] rounded-[32px] border border-[var(--line)] bg-[var(--paper-soft)] p-6 shadow-[var(--shadow-soft)]">
              <div className="mb-5 flex justify-between text-xs font-bold uppercase tracking-[0.22em] text-[var(--ink-muted)]">
                <span>E Standard</span>
                <span>谱例 01</span>
              </div>
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-px bg-[var(--line)]" />
                ))}
              </div>
              <pre className="mt-7 overflow-hidden rounded-2xl border border-[var(--line)] bg-[#fffaf0] p-4 font-mono text-sm leading-7 text-[var(--ink)]">{`e|-------0-----------|
B|-----1---1---------|
G|---0-------0-------|
D|-------------------|`}</pre>
            </div>
            <div className="absolute bottom-10 right-2 rounded-full border border-[var(--line)] bg-[var(--brass)] px-5 py-3 text-sm font-bold text-[var(--wood-dark)] shadow-[var(--shadow-tight)]">演示视频</div>
            <div className="absolute bottom-0 left-0 rounded-full border border-[var(--line)] bg-[var(--paper-soft)] px-5 py-3 text-sm font-bold text-[var(--wood-dark)] shadow-[var(--shadow-tight)]">指弹 / 主音 / 节奏</div>
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
            <p className="text-[var(--ink-muted)]">每个条目都是短小、可维护的原创谱例材料，支持 PDF 下载和视频参考。</p>
          </div>
          <div className="space-y-3">
            {latestSheets.map((sheet) => (
              <Link key={sheet.slug} href={`/sheets/${sheet.slug}/`} className="flex flex-col gap-1 rounded-2xl border border-[var(--line)] bg-[rgba(251,246,236,0.7)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--brass)] sm:flex-row sm:items-center sm:justify-between">
                <span className="font-display text-xl font-semibold">{sheet.title}</span>
                <span className="text-sm font-semibold text-[var(--ink-muted)]">{sheet.difficulty} · {sheet.tuning}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-[34px] border border-[var(--line)] bg-[rgba(251,246,236,0.78)] p-7 shadow-[var(--shadow-soft)]">
          <SectionHeading eyebrow="浏览入口" title="按技巧方向浏览" />
          <div className="mt-5 flex flex-wrap gap-3">
            {techniques.map((technique) => (
              <Link key={technique} href="/sheets/" className="rounded-full border border-[var(--line)] bg-[var(--paper-soft)] px-4 py-2 text-sm font-semibold text-[var(--ink-muted)] transition hover:border-[var(--brass)] hover:text-[var(--ink)]">
                {technique}
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
