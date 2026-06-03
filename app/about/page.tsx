import Link from "next/link";
import { socialLinks } from "@/lib/social-links";
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
        <section className="mt-8 overflow-hidden rounded-[32px] border border-[var(--line)] bg-[linear-gradient(135deg,rgba(251,246,236,0.88),rgba(236,220,190,0.72))] p-6 shadow-[var(--shadow-soft)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--wood)]">Links</p>
              <h2 className="mt-1 font-display text-3xl font-semibold tracking-[-0.03em]">找到我</h2>
            </div>
            <p className="max-w-[28rem] text-sm leading-7 text-[var(--ink-muted)]">站外内容会放在这些地方：长文、视频空间，以及个人主页。</p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {socialLinks.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="group rounded-[24px] border border-[var(--line)] bg-[rgba(255,252,244,0.74)] p-4 text-[var(--ink)] shadow-[var(--shadow-tight)] transition hover:-translate-y-1 hover:border-[var(--wood)]">
                <span className="flex items-center gap-3 font-display text-xl font-semibold">
                  <span aria-hidden="true" className="size-9 rounded-full border border-[var(--line)] bg-[var(--paper)] bg-cover bg-center bg-no-repeat p-2 transition group-hover:scale-105" style={{ backgroundImage: `url(${link.icon})` }} />
                  {link.label}
                </span>
                <span className="mt-3 block text-sm leading-6 text-[var(--ink-muted)]">{link.description}</span>
              </a>
            ))}
          </div>
        </section>
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
