import type { SheetSummary, SheetType } from "@/lib/sheet-schema";

export interface SheetFilters {
  query?: string;
  types?: SheetType[];
  tunings?: string[];
  hasVideo?: boolean;
  hasPdf?: boolean;
}


export function filterSheets(sheets: readonly SheetSummary[], filters: SheetFilters): SheetSummary[] {
  const query = filters.query?.trim().toLowerCase() ?? "";

  return sheets.filter((sheet) => {
    if (query && !sheet.searchText.toLowerCase().includes(query)) return false;
    if (filters.types?.length && !filters.types.includes(sheet.type)) return false;
    if (filters.tunings?.length && !filters.tunings.includes(sheet.tuning)) return false;
    if (filters.hasVideo !== undefined && sheet.hasVideo !== filters.hasVideo) return false;
    if (filters.hasPdf !== undefined && sheet.hasPdf !== filters.hasPdf) return false;
    return true;
  });
}
