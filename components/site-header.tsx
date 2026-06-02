import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(244,234,216,0.82)] backdrop-blur-xl">
      <PageShell className="flex h-16 items-center justify-between gap-5">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight decoration-[var(--brass)] underline-offset-8 hover:underline">
          SrP-Sheet
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-[var(--ink-muted)]" aria-label="主导航">
          <Link className="hover:text-[var(--ink)]" href="/sheets/">
            谱例库
          </Link>
          <Link className="hover:text-[var(--ink)]" href="/about/">
            关于
          </Link>
        </nav>
      </PageShell>
    </header>
  );
}
