import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SheetPdfPreview } from "@/components/sheet-pdf-preview";

describe("SheetPdfPreview", () => {
  it("previews the first PDF page and opens the PDF in a new page", () => {
    const html = renderToStaticMarkup(<SheetPdfPreview pdf="/assets/sheets/pdf/haru-dorobou.pdf" preview="/assets/sheets/pdf/haru-dorobou.pdf" />);

    expect(html).toContain("/assets/sheets/pdf/haru-dorobou.pdf#page=1");
    expect(html).toContain("target=\"_blank\"");
    expect(html).toContain("rel=\"noreferrer\"");
    expect(html).toContain("新页面打开 PDF");
  });
});
