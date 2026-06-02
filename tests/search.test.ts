import { describe, expect, it } from "vitest";
import { filterSheets } from "@/lib/search";
import type { SheetSummary } from "@/lib/sheet-schema";

const sheets = [
  {
    title: "Open Chord Warmup",
    slug: "open-chord-warmup",
    type: "exercise",
    summary: "A beginner chord switching drill.",
    difficulty: "beginner",
    instrument: "acoustic-guitar",
    tuning: "E Standard",
    techniques: ["open-chords"],
    tags: ["warmup"],
    featured: false,
    publishedAt: "2026-06-02",
    updatedAt: "2026-06-02",
    images: [],
    rights: "Original.",
    excerpt: "Practice G C D changes.",
    hasVideo: false,
    hasPdf: true,
    searchText: "open chord warmup beginner warmup open-chords"
  },
  {
    title: "Pentatonic Slide Lick",
    slug: "pentatonic-slide-lick",
    type: "lick",
    summary: "A lead guitar phrase.",
    difficulty: "intermediate",
    instrument: "electric-guitar",
    tuning: "E Standard",
    techniques: ["slide"],
    tags: ["pentatonic"],
    featured: true,
    publishedAt: "2026-06-02",
    updatedAt: "2026-06-02",
    images: [],
    rights: "Original.",
    excerpt: "Slide into the target note.",
    hasVideo: true,
    hasPdf: false,
    searchText: "pentatonic slide lick lead guitar intermediate slide"
  }
] satisfies SheetSummary[];

describe("filterSheets", () => {
  it("matches title case-insensitively", () => {
    expect(filterSheets(sheets, { query: "PENTATONIC" }).map((sheet) => sheet.slug)).toEqual(["pentatonic-slide-lick"]);
  });

  it("matches tag or technique", () => {
    expect(filterSheets(sheets, { query: "open-chords" }).map((sheet) => sheet.slug)).toEqual(["open-chord-warmup"]);
  });

  it("filters by difficulty", () => {
    expect(filterSheets(sheets, { difficulties: ["beginner"] }).map((sheet) => sheet.slug)).toEqual(["open-chord-warmup"]);
  });

  it("combines search and filters", () => {
    expect(filterSheets(sheets, { query: "slide", difficulties: ["beginner"] })).toEqual([]);
  });
});
