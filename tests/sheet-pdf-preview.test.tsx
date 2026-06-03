import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SheetPdfPreview } from "@/components/sheet-pdf-preview";

describe("SheetPdfPreview", () => {
  it("renders a PNG sheet preview and offers the PDF as a separate download", () => {
    const html = renderToStaticMarkup(<SheetPdfPreview pdf="/assets/sheets/pdf/haru-dorobou.pdf" preview="/assets/sheets/previews/haru-dorobou.png" title="春泥棒" />);

    expect(html).toContain("/assets/sheets/previews/haru-dorobou.png");
    expect(html).toContain("alt=\"春泥棒 谱例预览\"");
    expect(html).toContain("font-display text-4xl");
    expect(html).not.toContain("PNG 预览图");
    expect(html).not.toContain("application/pdf");
    expect(html).not.toContain("#page=1");
    expect(html).toContain("download=\"\"");
    expect(html).toContain("下载 PDF");
    expect(html).toContain("srp-primary-cta");
    expect(html).not.toContain("text-[#fff8e8]");
    expect(html).toContain("target=\"_blank\"");
  });
});
