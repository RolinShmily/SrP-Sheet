import { describe, expect, it } from "vitest";
import { getRelatedSheets } from "@/lib/related";
import type { SheetSummary } from "@/lib/sheet-schema";

function sheet(slug: string, overrides: Partial<SheetSummary> = {}): SheetSummary {
  return {
    title: slug,
    slug,
    type: "lick",
    summary: slug,
    instrument: "electric-guitar",
    tuning: "E Standard",
    featured: false,
    publishedAt: "2026-06-02",
    updatedAt: "2026-06-02",
    images: [],
    rights: "Original.",
    excerpt: slug,
    hasVideo: false,
    hasPdf: false,
    preview: undefined,
    searchText: slug,
    ...overrides
  };
}

describe("getRelatedSheets", () => {
  it("excludes the current sheet and prefers shared simplified facets", () => {
    const current = sheet("current", { type: "full-score", hasPdf: true, hasVideo: true });
    const result = getRelatedSheets(current, [
      current,
      sheet("shared", { type: "full-score", hasPdf: true, hasVideo: true }),
      sheet("other", { type: "lick", tuning: "Drop D" })
    ], 2);

    expect(result.map((item) => item.slug)).toEqual(["shared", "other"]);
  });

  it("caps result count", () => {
    const current = sheet("current");
    const result = getRelatedSheets(current, [current, sheet("one"), sheet("two")], 1);
    expect(result).toHaveLength(1);
  });
});
