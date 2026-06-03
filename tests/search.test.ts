import { describe, expect, it } from "vitest";
import { filterSheets } from "@/lib/search";
import type { SheetSummary } from "@/lib/sheet-schema";

const sheets = [
  {
    title: "Open Chord Warmup",
    slug: "open-chord-warmup",
    type: "full-score",
    summary: "A complete chord switching score.",
    instrument: "acoustic-guitar",
    tuning: "E Standard",
    featured: false,
    publishedAt: "2026-06-02",
    images: [],
    rights: "Original.",
    excerpt: "Practice G C D changes.",
    hasVideo: false,
    hasPdf: true,
    pdf: "/assets/sheets/open-chord-warmup/sheet.pdf",
    preview: "/assets/sheets/open-chord-warmup/preview.png",
    searchText: "open chord warmup complete chord switching score e standard"
  },
  {
    title: "Pentatonic Slide Lick",
    slug: "pentatonic-slide-lick",
    type: "lick",
    summary: "A lead guitar phrase.",
    instrument: "electric-guitar",
    tuning: "Drop D",
    featured: true,
    publishedAt: "2026-06-02",
    images: [],
    rights: "Original.",
    excerpt: "Slide into the target note.",
    hasVideo: true,
    hasPdf: false,
    preview: undefined,
    searchText: "pentatonic slide lick lead guitar phrase drop d"
  }
] satisfies SheetSummary[];

describe("filterSheets", () => {
  it("matches title case-insensitively", () => {
    expect(filterSheets(sheets, { query: "PENTATONIC" }).map((sheet) => sheet.slug)).toEqual(["pentatonic-slide-lick"]);
  });

  it("filters by simplified type", () => {
    expect(filterSheets(sheets, { types: ["lick"] }).map((sheet) => sheet.slug)).toEqual(["pentatonic-slide-lick"]);
  });

  it("filters by tuning", () => {
    expect(filterSheets(sheets, { tunings: ["E Standard"] }).map((sheet) => sheet.slug)).toEqual(["open-chord-warmup"]);
  });

  it("combines search and attachment filters", () => {
    expect(filterSheets(sheets, { query: "slide", hasVideo: true }).map((sheet) => sheet.slug)).toEqual(["pentatonic-slide-lick"]);
    expect(filterSheets(sheets, { query: "slide", hasPdf: true })).toEqual([]);
  });
});
