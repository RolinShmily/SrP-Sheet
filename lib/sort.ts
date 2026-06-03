import type { SheetSummary } from "@/lib/sheet-schema";

export type SheetSort = "newest" | "title";

export function sortSheets(sheets: readonly SheetSummary[], sort: SheetSort): SheetSummary[] {
  return [...sheets].sort((left, right) => {
    if (sort === "title") return left.title.localeCompare(right.title);
    return right.updatedAt.localeCompare(left.updatedAt) || left.title.localeCompare(right.title);
  });
}
