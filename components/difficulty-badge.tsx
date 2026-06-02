import type { Difficulty } from "@/lib/sheet-schema";
import { cn } from "@/lib/utils";

const difficultyLabels: Record<Difficulty, string> = {
  beginner: "入门",
  intermediate: "进阶",
  advanced: "高阶"
};

const difficultyClasses: Record<Difficulty, string> = {
  beginner: "border-[color-mix(in_srgb,var(--sage)_48%,black)] bg-[color-mix(in_srgb,var(--sage)_16%,white)] text-[color-mix(in_srgb,var(--sage)_58%,black)]",
  intermediate: "border-[color-mix(in_srgb,var(--brass)_60%,black)] bg-[color-mix(in_srgb,var(--brass)_18%,white)] text-[color-mix(in_srgb,var(--brass)_62%,black)]",
  advanced: "border-[color-mix(in_srgb,var(--wine)_52%,black)] bg-[color-mix(in_srgb,var(--wine)_12%,white)] text-[color-mix(in_srgb,var(--wine)_62%,black)]"
};

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  className?: string;
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold", difficultyClasses[difficulty], className)}>
      <span aria-hidden="true">●</span>
      {difficultyLabels[difficulty]}
    </span>
  );
}
