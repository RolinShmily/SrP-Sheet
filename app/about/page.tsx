import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export const metadata = {
  title: "关于 | SrP-Sheet",
  description: "SrP-Sheet 的项目定位和版权移除说明。"
};

export default function AboutPage() {
  return (
    <main className="py-14">
      <PageShell className="max-w-[980px]">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--wood)]">关于本站</p>
        <h1 className="font-display text-[clamp(2.6rem,6vw,5.5rem)] font-semibold leading-none tracking-[-0.04em]">谱例整理，不做复杂分类。</h1>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <InfoCard title="SrP-Sheet 是什么">
            <p>SrP-Sheet 是一个静态吉他谱例下载站，用来整理乐句、整谱、PDF 附件和 Bilibili 演示视频。内容以 Markdown 维护，构建期校验元数据，页面静态导出后部署。</p>
          </InfoCard>
          <InfoCard title="版权与移除练习">
            <p>站内谱例用于个人学习与练习索引。如果你认为某个 PDF、视频链接或文字说明涉及权利问题，请联系站点维护者并提供作品名、页面链接和权利说明；确认后会调整、移除或补充必要说明。</p>
          </InfoCard>
        </div>
        <Link href="/sheets/" className="mt-10 inline-flex srp-primary-cta rounded-full px-6 py-3 shadow-[var(--shadow-tight)]">
          返回谱例库
        </Link>
      </PageShell>
    </main>
  );
}

function InfoCard({ title, children }: Readonly<{ title: string; children: React.ReactNode }>) {
  return (
    <section className="rounded-[28px] border border-[var(--line)] bg-[rgba(251,246,236,0.78)] p-6 leading-8 text-[var(--ink-muted)] shadow-[var(--shadow-soft)]">
      <h2 className="mb-3 font-display text-2xl font-semibold text-[var(--ink)]">{title}</h2>
      {children}
    </section>
  );
}
