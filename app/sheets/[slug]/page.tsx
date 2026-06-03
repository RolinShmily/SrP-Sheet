import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BilibiliEmbed } from "@/components/bilibili-embed";
import { PageShell } from "@/components/page-shell";
import { SheetCard } from "@/components/sheet-card";
import { SheetMetaGrid } from "@/components/sheet-meta-grid";
import { SheetPdfPreview } from "@/components/sheet-pdf-preview";
import { getAllSheets, getSheetBySlug, toSheetSummary } from "@/lib/content";
import { getRelatedSheets } from "@/lib/related";

interface SheetPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const sheets = await getAllSheets();
  return sheets.map((sheet) => ({ slug: sheet.slug }));
}

export async function generateMetadata({ params }: SheetPageProps): Promise<Metadata> {
  const { slug } = await params;
  const sheet = await getSheetBySlug(slug);

  if (!sheet) {
    return { title: "谱例未找到 | SrP-Sheet" };
  }

  return {
    title: `${sheet.title} | SrP-Sheet`,
    description: sheet.summary
  };
}

export default async function SheetDetailPage({ params }: SheetPageProps) {
  const { slug } = await params;
  const sheet = await getSheetBySlug(slug);

  if (!sheet) notFound();

  const summaries = (await getAllSheets()).map(toSheetSummary);
  const currentSummary = toSheetSummary(sheet);
  const related = getRelatedSheets(currentSummary, summaries, 3);

  return (
    <main className="py-14">
      <PageShell>
        <Link href="/sheets/" className="text-sm font-semibold text-[var(--wood)] underline decoration-[var(--brass)] underline-offset-4">
          ← 返回谱例库
        </Link>
        <header className="mt-8 max-w-4xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--wood)]">谱例详情</p>
          <h1 className="font-display text-[clamp(2.5rem,6vw,5.4rem)] font-semibold leading-none tracking-[-0.04em]">{sheet.title}</h1>
          <p className="mt-5 text-xl leading-9 text-[var(--ink-muted)]">{sheet.summary}</p>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <article className="min-w-0 space-y-8">
            <SheetMetaGrid sheet={sheet} />
            {sheet.bilibili ? <BilibiliEmbed video={sheet.bilibili} /> : null}
            {sheet.pdf ? <SheetPdfPreview pdf={sheet.pdf} preview={sheet.preview} /> : null}
            <section className="sheet-prose rounded-[30px] border border-[var(--line)] bg-[rgba(251,246,236,0.86)] p-6 shadow-[var(--shadow-soft)] sm:p-8" dangerouslySetInnerHTML={{ __html: sheet.html }} />
            {sheet.images.length > 0 ? (
              <section className="rounded-[28px] border border-[var(--line)] bg-[rgba(251,246,236,0.78)] p-6 shadow-[var(--shadow-soft)]">
                <h2 className="font-display text-2xl font-semibold">附件</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {sheet.images.map((image) => (
                    <a key={image.src} href={image.src} target="_blank" rel="noreferrer" className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold text-[var(--wood-dark)] underline decoration-[var(--brass)] underline-offset-4">
                      {image.alt}
                    </a>
                  ))}
                </div>
              </section>
            ) : null}
          </article>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <section className="rounded-[28px] border border-[var(--line)] bg-[var(--paper-soft)] p-5 shadow-[var(--shadow-soft)]">
              <h2 className="font-display text-2xl font-semibold">版权说明</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--ink-muted)]">{sheet.rights}</p>
            </section>
            <section className="rounded-[28px] border border-[var(--line)] bg-[var(--paper-soft)] p-5 shadow-[var(--shadow-soft)]">
              <h2 className="font-display text-2xl font-semibold">相关谱例</h2>
              <div className="mt-4 space-y-3">
                {related.map((item) => (
                  <Link key={item.slug} href={`/sheets/${item.slug}/`} className="block rounded-2xl border border-[var(--line)] p-3 text-sm font-semibold text-[var(--ink-muted)] transition hover:border-[var(--brass)] hover:text-[var(--ink)]">
                    {item.title}
                  </Link>
                ))}
              </div>
            </section>
          </aside>
        </div>

        {related.length > 0 ? (
          <section className="mt-16">
            <h2 className="mb-5 font-display text-3xl font-semibold">相关谱例</h2>
            <div className="grid gap-5 md:grid-cols-3">
              {related.map((item) => <SheetCard key={item.slug} sheet={item} />)}
            </div>
          </section>
        ) : null}
      </PageShell>
    </main>
  );
}
