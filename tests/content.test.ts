import { describe, expect, it } from "vitest";
import { buildSheetFacets, getSheetBySlug, getSheetSummaries } from "@/lib/content";

describe("sheet content loader", () => {
  it("loads every seeded sheet as a serializable summary", async () => {
    const summaries = await getSheetSummaries();

    expect(summaries.map((sheet) => sheet.slug).sort()).toEqual([
      "demo-with-bilibili",
      "fingerstyle-arp-01",
      "hybrid-picking-study",
      "minor-pentatonic-lick-01",
      "percussive-strum-basic",
      "warmup-open-chords"
    ]);
    expect(summaries.every((sheet) => typeof sheet.searchText === "string" && sheet.searchText.length > 0)).toBe(true);
    expect(summaries.find((sheet) => sheet.slug === "demo-with-bilibili")?.hasVideo).toBe(true);
    expect(summaries.find((sheet) => sheet.slug === "warmup-open-chords")?.hasPdf).toBe(true);
  });

  it("builds facets from validated sheet metadata", async () => {
    const facets = buildSheetFacets(await getSheetSummaries());

    expect(facets.difficulties).toEqual(["advanced", "beginner", "intermediate"]);
    expect(facets.tags).toContain("warmup");
    expect(facets.techniques).toContain("fingerstyle");
  });

  it("returns a detail sheet with rendered markdown and excerpt", async () => {
    const sheet = await getSheetBySlug("minor-pentatonic-lick-01");

    expect(sheet?.html).toContain("Playing Notes");
    expect(sheet?.excerpt).toContain("minor pentatonic");
    expect(sheet?.body).toContain("```tab");
  });
});
