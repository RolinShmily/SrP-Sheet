import Link from "next/link";
import { socialLinks } from "@/lib/social-links";
import { PageShell } from "@/components/page-shell";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(244,234,216,0.82)] backdrop-blur-xl">
      <PageShell className="flex h-16 items-center justify-between gap-5">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight decoration-[var(--brass)] underline-offset-8 hover:underline">
          SrP-Sheet
        </Link>
        <div className="flex items-center gap-3 sm:gap-5">
          <nav className="flex items-center gap-5 text-sm font-medium text-[var(--ink-muted)]" aria-label="主导航">
            <Link className="hover:text-[var(--ink)]" href="/sheets/">
              谱例库
            </Link>
            <Link className="hover:text-[var(--ink)]" href="/about/">
              关于
            </Link>
          </nav>
          <nav className="hidden items-center gap-2 sm:flex" aria-label="外部链接">
            {socialLinks.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer" aria-label={link.label} className="grid size-9 place-items-center rounded-full border border-[var(--line)] bg-[rgba(251,246,236,0.72)] text-[var(--wood-dark)] shadow-[var(--shadow-tight)] transition hover:-translate-y-0.5 hover:border-[var(--wood)] hover:text-[var(--ink)]">
                <span aria-hidden="true" className="size-4 rounded-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${link.icon})` }} />
              </a>
            ))}
          </nav>
        </div>
      </PageShell>
    </header>
  );
}
