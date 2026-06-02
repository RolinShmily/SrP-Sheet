import type { Difficulty, SheetSummary } from "@/lib/sheet-schema";

const difficultyOrder: Record<Difficulty, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2
};

export type SheetSort = "newest" | "title" | "difficulty";

export function sortSheets(sheets: readonly SheetSummary[], sort: SheetSort): SheetSummary[] {
  return [...sheets].sort((left, right) => {
    if (sort === "title") return left.title.localeCompare(right.title);
    if (sort === "difficulty") return difficultyOrder[left.difficulty] - difficultyOrder[right.difficulty] || left.title.localeCompare(right.title);
    return right.updatedAt.localeCompare(left.updatedAt) || left.title.localeCompare(right.title);
  });
}
