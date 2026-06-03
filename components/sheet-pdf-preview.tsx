interface SheetPdfPreviewProps {
  pdf: string;
  preview: string;
  title: string;
}

export function SheetPdfPreview({ pdf, preview, title }: SheetPdfPreviewProps) {
  return (
    <section className="overflow-hidden rounded-[30px] border border-[var(--line)] bg-[rgba(251,246,236,0.9)] shadow-[var(--shadow-soft)]">
      <div className="flex flex-col gap-3 border-b border-[var(--line)] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--wood)]">谱例预览</p>
          <h2 className="mt-1 font-display text-2xl font-semibold">PNG 预览图</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={pdf} download target="_blank" rel="noreferrer" className="srp-primary-cta w-fit rounded-full px-4 py-2 text-sm shadow-[var(--shadow-tight)] transition hover:-translate-y-0.5">
            下载 PDF
          </a>
          <a href={preview} target="_blank" rel="noreferrer" className="w-fit rounded-full border border-[var(--wood-dark)] bg-[var(--paper-soft)] px-4 py-2 text-sm font-semibold text-[var(--wood-dark)] transition hover:-translate-y-0.5">
            打开预览图
          </a>
        </div>
      </div>
      <div className="bg-[linear-gradient(135deg,rgba(111,78,55,0.10),rgba(201,162,39,0.10))] p-4 sm:p-6">
        {/* eslint-disable-next-line @next/next/no-img-element -- Static export uses pre-generated PNG previews; Next Image Optimization is intentionally disabled. */}
        <img src={preview} alt={`${title} 谱例预览`} className="mx-auto max-h-[78vh] w-full rounded-[22px] border border-[var(--line)] bg-white object-contain shadow-[var(--shadow-tight)]" />
      </div>
    </section>
  );
}
