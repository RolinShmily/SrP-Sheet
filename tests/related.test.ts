import { describe, expect, it } from "vitest";
import { getRelatedSheets } from "@/lib/related";
import type { SheetSummary } from "@/lib/sheet-schema";

function sheet(slug: string, tags: string[], techniques: string[]): SheetSummary {
  return {
    title: slug,
    slug,
    type: "lick",
    summary: slug,
    difficulty: "intermediate",
    instrument: "electric-guitar",
    tuning: "E Standard",
    techniques,
    tags,
    featured: false,
    publishedAt: "2026-06-02",
    updatedAt: "2026-06-02",
    images: [],
    rights: "Original.",
    excerpt: slug,
    hasVideo: false,
    hasPdf: false,
    searchText: `${slug} ${tags.join(" ")} ${techniques.join(" ")}`
  };
}

describe("getRelatedSheets", () => {
  it("excludes the current sheet and prefers shared tags", () => {
    const current = sheet("current", ["pentatonic"], ["slide"]);
    const result = getRelatedSheets(current, [current, sheet("shared", ["pentatonic"], ["bend"]), sheet("other", ["jazz"], ["chords"])], 2);
    expect(result.map((item) => item.slug)).toEqual(["shared", "other"]);
  });

  it("caps result count", () => {
    const current = sheet("current", ["a"], ["x"]);
    const result = getRelatedSheets(current, [current, sheet("one", ["a"], ["x"]), sheet("two", ["a"], ["x"])], 1);
    expect(result).toHaveLength(1);
  });
});
