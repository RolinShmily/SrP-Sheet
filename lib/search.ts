import type { Difficulty, SheetSummary, SheetType } from "@/lib/sheet-schema";

export interface SheetFilters {
  query?: string;
  difficulties?: Difficulty[];
  types?: SheetType[];
  tunings?: string[];
  tags?: string[];
  techniques?: string[];
  hasVideo?: boolean;
  hasPdf?: boolean;
}

function includesAny(values: readonly string[], filters: readonly string[] | undefined): boolean {
  return !filters?.length || filters.some((filter) => values.includes(filter));
}

export function filterSheets(sheets: readonly SheetSummary[], filters: SheetFilters): SheetSummary[] {
  const query = filters.query?.trim().toLowerCase() ?? "";

  return sheets.filter((sheet) => {
    if (query && !sheet.searchText.toLowerCase().includes(query)) return false;
    if (filters.difficulties?.length && !filters.difficulties.includes(sheet.difficulty)) return false;
    if (filters.types?.length && !filters.types.includes(sheet.type)) return false;
    if (filters.tunings?.length && !filters.tunings.includes(sheet.tuning)) return false;
    if (!includesAny(sheet.tags, filters.tags)) return false;
    if (!includesAny(sheet.techniques, filters.techniques)) return false;
    if (filters.hasVideo !== undefined && sheet.hasVideo !== filters.hasVideo) return false;
    if (filters.hasPdf !== undefined && sheet.hasPdf !== filters.hasPdf) return false;
    return true;
  });
}
