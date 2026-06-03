import type { SheetSummary } from "@/lib/sheet-schema";


export function getRelatedSheets(current: SheetSummary, sheets: readonly SheetSummary[], limit = 3): SheetSummary[] {
  return sheets
    .filter((sheet) => sheet.slug !== current.slug)
    .map((sheet) => ({
      sheet,
      score:
        (current.type === sheet.type ? 3 : 0) +
        (current.tuning === sheet.tuning ? 2 : 0) +
        (current.hasPdf === sheet.hasPdf ? 1 : 0) +
        (current.hasVideo === sheet.hasVideo ? 1 : 0)
    }))
    .sort((left, right) => right.score - left.score || right.sheet.publishedAt.localeCompare(left.sheet.publishedAt) || left.sheet.title.localeCompare(right.sheet.title))
    .slice(0, limit)
    .map((entry) => entry.sheet);
}
