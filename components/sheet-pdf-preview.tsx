interface SheetPdfPreviewProps {
  pdf: string;
  preview?: string;
}

export function SheetPdfPreview({ pdf, preview }: SheetPdfPreviewProps) {
  const previewSrc = `${preview ?? pdf}#page=1`;

  return (
    <section className="overflow-hidden rounded-[30px] border border-[var(--line)] bg-[rgba(251,246,236,0.86)] shadow-[var(--shadow-soft)]">
      <div className="flex flex-col gap-3 border-b border-[var(--line)] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--wood)]">谱例预览</p>
          <h2 className="mt-1 font-display text-2xl font-semibold">PDF 第 1 页</h2>
        </div>
        <a href={pdf} target="_blank" rel="noreferrer" className="w-fit rounded-full bg-[var(--wood)] px-4 py-2 text-sm font-semibold text-[var(--paper-soft)] shadow-[var(--shadow-tight)] transition hover:-translate-y-0.5">
          新页面打开 PDF
        </a>
      </div>
      <object data={previewSrc} type="application/pdf" className="h-[72vh] min-h-[520px] w-full bg-[var(--paper-soft)]">
        <div className="p-6 text-[var(--ink-muted)]">
          当前浏览器无法内嵌预览 PDF。请使用上方按钮在新页面打开 PDF。
        </div>
      </object>
    </section>
  );
}
