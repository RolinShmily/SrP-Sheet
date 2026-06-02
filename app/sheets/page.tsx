import { PageShell } from "@/components/page-shell";
import { SheetExplorer } from "@/components/sheet-explorer";
import { buildSheetFacets, getSheetSummaries } from "@/lib/content";

export const metadata = {
  title: "谱例库 | SrP-Sheet",
  description: "浏览、搜索并筛选 SrP-Sheet 的吉他谱例。"
};

export default async function SheetsPage() {
  const sheets = await getSheetSummaries();

  return (
    <main className="py-14">
      <PageShell>
        <section className="mb-10 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--wood)]">谱例库</p>
          <h1 className="font-display text-[clamp(2.4rem,6vw,5rem)] font-semibold leading-none">谱例库</h1>
          <p className="mt-5 text-lg leading-8 text-[var(--ink-muted)]">用关键词、难度、技巧和附件状态快速定位需要的谱例。所有数据都来自构建期 Markdown 内容，页面加载后不需要服务器请求。</p>
        </section>
        <SheetExplorer sheets={sheets} facets={buildSheetFacets(sheets)} />
      </PageShell>
    </main>
  );
}
