import { describe, expect, it } from "vitest";
import { sheetFrontmatterSchema } from "@/lib/sheet-schema";

const validSheet = {
  title: "Minor Pentatonic Lick 01",
  slug: "minor-pentatonic-lick-01",
  type: "lick",
  source: "Original Study",
  summary: "A compact phrase for practicing slides and timing.",
  difficulty: "intermediate",
  instrument: "electric-guitar",
  tuning: "E Standard",
  key: "A minor",
  capo: null,
  bpm: 92,
  techniques: ["slide", "alternate-picking"],
  tags: ["pentatonic", "lead-guitar"],
  featured: true,
  publishedAt: "2026-06-02",
  updatedAt: "2026-06-02",
  cover: "/assets/sheets/minor-pentatonic-lick-01/cover.webp",
  pdf: "/assets/sheets/minor-pentatonic-lick-01/sheet.pdf",
  images: [{ src: "/assets/sheets/minor-pentatonic-lick-01/page-1.webp", alt: "Sheet page one" }],
  bilibili: { bvid: "BV1B7411m7LV", page: 1, start: 0, title: "Demo" },
  rights: "Original educational example."
};

describe("sheetFrontmatterSchema", () => {
  it("parses valid complete sheet metadata", () => {
    expect(sheetFrontmatterSchema.parse(validSheet).slug).toBe("minor-pentatonic-lick-01");
  });

  it("rejects missing required title", () => {
    const withoutTitle = { ...validSheet } as Partial<typeof validSheet>;
    delete withoutTitle.title;
    expect(() => sheetFrontmatterSchema.parse(withoutTitle)).toThrow();
  });

  it("rejects invalid slugs", () => {
    expect(() => sheetFrontmatterSchema.parse({ ...validSheet, slug: "Bad Slug" })).toThrow();
  });

  it("rejects updatedAt earlier than publishedAt", () => {
    expect(() => sheetFrontmatterSchema.parse({ ...validSheet, publishedAt: "2026-06-03", updatedAt: "2026-06-02" })).toThrow();
  });

  it("rejects invalid PDF paths", () => {
    expect(() => sheetFrontmatterSchema.parse({ ...validSheet, pdf: "https://example.com/sheet.pdf" })).toThrow();
  });
});
