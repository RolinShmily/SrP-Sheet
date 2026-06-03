import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SheetCard } from "@/components/sheet-card";
import { SheetMetaGrid } from "@/components/sheet-meta-grid";
import type { Sheet, SheetSummary } from "@/lib/sheet-schema";

const summary = {
  title: "春泥棒",
  slug: "haru-dorobou",
  type: "full-score",
  source: "用户提供谱例",
  summary: "完整谱例与演示视频。",
  instrument: "acoustic-guitar",
  tuning: "E Standard",
  featured: true,
  publishedAt: "2026-06-03",
  updatedAt: "2026-06-03",
  pdf: "/assets/sheets/pdf/haru-dorobou.pdf",
  preview: "/assets/sheets/previews/haru-dorobou.png",
  images: [],
  bilibili: { bvid: "BV1kzwpeaE4h", page: 1, start: 0, title: "春泥棒" },
  rights: "学习用途。",
  excerpt: "练习说明",
  hasVideo: true,
  hasPdf: true,
  searchText: "春泥棒 e standard"
} satisfies SheetSummary;

const detail = {
  ...summary,
  body: "## 练习说明\n\n内容",
  html: "<h2>练习说明</h2><p>内容</p>"
} satisfies Sheet;

describe("simplified sheet UI components", () => {
  it("renders cards with type, tuning, and attachment badges only", () => {
    const html = renderToStaticMarkup(<SheetCard sheet={summary} />);

    expect(html).toContain("整谱");
    expect(html).toContain("E Standard");
    expect(html).toContain("演示视频");
    expect(html).toContain("PDF");
    expect(html).not.toContain("入门");
    expect(html).not.toContain("进阶");
    expect(html).not.toContain("#");
  });

  it("renders detail metadata without difficulty, tags, or techniques", () => {
    const html = renderToStaticMarkup(<SheetMetaGrid sheet={detail} />);

    expect(html).toContain("整谱");
    expect(html).toContain("调弦");
    expect(html).toContain("附件");
    expect(html).not.toContain("难度");
    expect(html).not.toContain("标签");
    expect(html).not.toContain("技巧");
  });
});
