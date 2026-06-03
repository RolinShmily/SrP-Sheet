import { describe, expect, it } from "vitest";
import { sheetFrontmatterSchema } from "@/lib/sheet-schema";

const validSheet = {
  title: "Minor Pentatonic Lick 01",
  slug: "minor-pentatonic-lick-01",
  type: "full-score",
  summary: "A complete score with a downloadable PDF and video reference.",
  instrument: "electric-guitar",
  tuning: "E Standard",
  key: "A minor",
  capo: null,
  bpm: 92,
  featured: true,
  publishedAt: "2026-06-02",
  cover: "/assets/sheets/minor-pentatonic-lick-01/cover.webp",
  pdf: "/assets/sheets/minor-pentatonic-lick-01/sheet.pdf",
  preview: "/assets/sheets/minor-pentatonic-lick-01/preview.png",
  images: [{ src: "/assets/sheets/minor-pentatonic-lick-01/page-1.webp", alt: "Sheet page one" }],
  bilibili: { bvid: "BV1B7411m7LV", page: 1, start: 0 },
  rights: "Original educational example."
};

describe("sheetFrontmatterSchema", () => {
  it("parses valid complete sheet metadata with a PNG preview", () => {
    const parsed = sheetFrontmatterSchema.parse(validSheet);

    expect(parsed.slug).toBe("minor-pentatonic-lick-01");
    expect(parsed.preview).toBe("/assets/sheets/minor-pentatonic-lick-01/preview.png");
    expect(() => sheetFrontmatterSchema.parse({ ...validSheet, preview: "/assets/sheets/minor-pentatonic-lick-01/sheet.pdf" })).toThrow();
  });

  it("accepts only lick and full-score content types", () => {
    expect(sheetFrontmatterSchema.parse({ ...validSheet, type: "lick" }).type).toBe("lick");
    expect(sheetFrontmatterSchema.parse({ ...validSheet, type: "full-score" }).type).toBe("full-score");
    expect(() => sheetFrontmatterSchema.parse({ ...validSheet, type: "arrangement" })).toThrow();
  });

  it("rejects removed classification fields", () => {
    expect(() => sheetFrontmatterSchema.parse({ ...validSheet, difficulty: "intermediate" })).toThrow();
    expect(() => sheetFrontmatterSchema.parse({ ...validSheet, techniques: ["fingerstyle"] })).toThrow();
    expect(() => sheetFrontmatterSchema.parse({ ...validSheet, tags: ["real-song"] })).toThrow();
    expect(() => sheetFrontmatterSchema.parse({ ...validSheet, source: "用户提供谱例" })).toThrow();
    expect(() => sheetFrontmatterSchema.parse({ ...validSheet, bilibili: { bvid: "BV1B7411m7LV", page: 1, start: 0, title: "Demo" } })).toThrow();
  });

  it("rejects missing required title", () => {
    const withoutTitle = { ...validSheet } as Partial<typeof validSheet>;
    delete withoutTitle.title;
    expect(() => sheetFrontmatterSchema.parse(withoutTitle)).toThrow();
  });

  it("rejects invalid slugs", () => {
    expect(() => sheetFrontmatterSchema.parse({ ...validSheet, slug: "Bad Slug" })).toThrow();
  });

  it("rejects removed updatedAt field", () => {
    expect(() => sheetFrontmatterSchema.parse({ ...validSheet, updatedAt: "2026-06-02" })).toThrow();
  });

  it("rejects invalid PDF paths", () => {
    expect(() => sheetFrontmatterSchema.parse({ ...validSheet, pdf: "https://example.com/sheet.pdf" })).toThrow();
  });
});
