import type { SheetSummary } from "@/lib/sheet-schema";

function overlapScore(left: readonly string[], right: readonly string[]): number {
  const rightSet = new Set(right);
  return left.reduce((score, value) => score + (rightSet.has(value) ? 1 : 0), 0);
}

export function getRelatedSheets(current: SheetSummary, sheets: readonly SheetSummary[], limit = 3): SheetSummary[] {
  return sheets
    .filter((sheet) => sheet.slug !== current.slug)
    .map((sheet) => ({
      sheet,
      score:
        overlapScore(current.tags, sheet.tags) * 3 +
        overlapScore(current.techniques, sheet.techniques) * 2 +
        (current.type === sheet.type ? 1 : 0) +
        (current.difficulty === sheet.difficulty ? 1 : 0)
    }))
    .sort((left, right) => right.score - left.score || right.sheet.updatedAt.localeCompare(left.sheet.updatedAt) || left.sheet.title.localeCompare(right.sheet.title))
    .slice(0, limit)
    .map((entry) => entry.sheet);
}
