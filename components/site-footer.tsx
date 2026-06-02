import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-[var(--line)] py-10 text-sm text-[var(--ink-muted)]">
      <PageShell className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p>© SrP-Sheet. 吉他谱例下载站。</p>
        <Link href="/about/" className="underline decoration-[var(--brass)] underline-offset-4">
          版权与联系说明
        </Link>
      </PageShell>
    </footer>
  );
}
