import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export default function NotFound() {
  return (
    <main className="py-20">
      <PageShell className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--wood)]">404</p>
        <h1 className="mt-4 font-display text-[clamp(3rem,8vw,7rem)] font-semibold leading-none">这页谱纸不在架上</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-[var(--ink-muted)]">链接可能已经移动，或这个谱例还没有被整理成 Markdown 文件。</p>
        <Link href="/sheets/" className="mt-8 inline-flex rounded-full bg-[var(--wood)] px-6 py-3 font-semibold text-[var(--paper-soft)] shadow-[var(--shadow-tight)]">
          回到谱例库
        </Link>
      </PageShell>
    </main>
  );
}
