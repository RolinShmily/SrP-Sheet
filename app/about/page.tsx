import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export const metadata = {
  title: "关于 | SrP-Sheet",
  description: "SrP-Sheet 的项目定位、内容选择和版权联系说明。"
};

export default function AboutPage() {
  return (
    <main className="py-14">
      <PageShell className="max-w-[980px]">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--wood)]">关于本站</p>
        <h1 className="font-display text-[clamp(2.6rem,6vw,5.5rem)] font-semibold leading-none tracking-[-0.04em]">吉他谱例下载库，开箱即用。</h1>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <InfoCard title="SrP-Sheet 是什么">
            <p>SrP-Sheet 是一个静态吉他谱例下载站，用来分享短练习、原创乐句、技巧片段和 Bilibili 演示视频。第一版强调可读、可下载、可静态部署。</p>
          </InfoCard>
          <InfoCard title="内容如何选择">
            <p>优先使用原创练习、短小教育示例、公共领域或已授权素材。谱例以 Markdown 文件维护，构建期校验元数据，支持 PDF 下载和视频参考。</p>
          </InfoCard>
          <InfoCard title="版权与移除联系">
            <p>如果你认为站内材料涉及权利问题，请联系站点维护者并提供作品名、链接和权利说明。确认后会尽快调整、移除或补充授权信息。</p>
          </InfoCard>
          <InfoCard title="未来方向">
            <p>后续会加入更多原创谱例、演示视频和分主题下载分类，但不会在第一版引入账号、评论、投稿后台或服务器运行时功能。</p>
          </InfoCard>
        </div>
        <Link href="/sheets/" className="mt-10 inline-flex rounded-full bg-[var(--wood)] px-6 py-3 font-semibold text-[var(--paper-soft)] shadow-[var(--shadow-tight)]">
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
