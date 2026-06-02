"use client";

import { useMemo, useState } from "react";
import { FilterChip } from "@/components/filter-chip";
import { SheetCard } from "@/components/sheet-card";
import { filterSheets } from "@/lib/search";
import { sortSheets, type SheetSort } from "@/lib/sort";
import type { SheetFacets } from "@/lib/content";
import type { Difficulty, SheetSummary, SheetType } from "@/lib/sheet-schema";

interface SheetExplorerProps {
  sheets: SheetSummary[];
  facets: SheetFacets;
}

const difficultyLabels: Record<Difficulty, string> = {
  beginner: "入门",
  intermediate: "进阶",
  advanced: "高阶"
};

const typeLabels: Record<SheetType, string> = {
  exercise: "练习",
  riff: "Riff",
  lick: "乐句",
  song: "曲目",
  arrangement: "改编",
  original: "原创"
};

function toggleValue(values: string[], value: string): string[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export function SheetExplorer({ sheets, facets }: SheetExplorerProps) {
  const [query, setQuery] = useState("");
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [tunings, setTunings] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [techniques, setTechniques] = useState<string[]>([]);
  const [hasVideo, setHasVideo] = useState(false);
  const [hasPdf, setHasPdf] = useState(false);
  const [sort, setSort] = useState<SheetSort>("newest");

  const filtered = useMemo(
    () =>
      sortSheets(
        filterSheets(sheets, {
          query,
          difficulties: difficulties as Difficulty[],
          types: types as SheetType[],
          tunings,
          tags,
          techniques,
          hasVideo: hasVideo ? true : undefined,
          hasPdf: hasPdf ? true : undefined
        }),
        sort
      ),
    [difficulties, hasPdf, hasVideo, query, sheets, sort, tags, techniques, tunings, types]
  );

  const hasActiveFilters = Boolean(query.trim()) || difficulties.length > 0 || types.length > 0 || tunings.length > 0 || tags.length > 0 || techniques.length > 0 || hasVideo || hasPdf;

  function resetFilters() {
    setQuery("");
    setDifficulties([]);
    setTypes([]);
    setTunings([]);
    setTags([]);
    setTechniques([]);
    setHasVideo(false);
    setHasPdf(false);
    setSort("newest");
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-[var(--line)] bg-[rgba(251,246,236,0.84)] p-5 shadow-[var(--shadow-soft)] sm:p-7">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <label className="block">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">搜索谱例</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="search"
              placeholder="搜索标题、摘要、标签、技巧或正文摘录"
              className="mt-2 w-full rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] px-4 py-3 text-base shadow-inner outline-none placeholder:text-[color-mix(in_srgb,var(--ink-muted)_64%,white)] focus:border-[var(--brass)]"
            />
          </label>
          <label className="block min-w-44">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">排序</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SheetSort)}
              className="mt-2 w-full rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] px-4 py-3 font-semibold text-[var(--ink)] outline-none focus:border-[var(--brass)]"
            >
              <option value="newest">最新更新</option>
              <option value="title">标题 A-Z</option>
              <option value="difficulty">难度顺序</option>
            </select>
          </label>
        </div>

        <div className="mt-6 space-y-5">
          <FilterGroup label="难度">
            {facets.difficulties.map((difficulty) => (
              <FilterChip key={difficulty} active={difficulties.includes(difficulty)} onClick={() => setDifficulties((current) => toggleValue(current, difficulty))}>
                {difficultyLabels[difficulty as Difficulty] ?? difficulty}
              </FilterChip>
            ))}
          </FilterGroup>
          <FilterGroup label="类型">
            {facets.types.map((type) => (
              <FilterChip key={type} active={types.includes(type)} onClick={() => setTypes((current) => toggleValue(current, type))}>
                {typeLabels[type as SheetType] ?? type}
              </FilterChip>
            ))}
          </FilterGroup>
          <FilterGroup label="调弦">
            {facets.tunings.map((tuning) => (
              <FilterChip key={tuning} active={tunings.includes(tuning)} onClick={() => setTunings((current) => toggleValue(current, tuning))}>
                {tuning}
              </FilterChip>
            ))}
          </FilterGroup>
          <FilterGroup label="技巧">
            {facets.techniques.map((technique) => (
              <FilterChip key={technique} active={techniques.includes(technique)} onClick={() => setTechniques((current) => toggleValue(current, technique))}>
                {technique}
              </FilterChip>
            ))}
          </FilterGroup>
          <FilterGroup label="标签">
            {facets.tags.map((tag) => (
              <FilterChip key={tag} active={tags.includes(tag)} onClick={() => setTags((current) => toggleValue(current, tag))}>
                #{tag}
              </FilterChip>
            ))}
          </FilterGroup>
          <FilterGroup label="附件">
            <FilterChip active={hasVideo} onClick={() => setHasVideo((current) => !current)}>
              有演示视频
            </FilterChip>
            <FilterChip active={hasPdf} onClick={() => setHasPdf((current) => !current)}>
              有 PDF
            </FilterChip>
          </FilterGroup>
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-[var(--ink-muted)]">显示 {filtered.length} / {sheets.length} 个谱例</p>
        <button
          type="button"
          onClick={resetFilters}
          disabled={!hasActiveFilters && sort === "newest"}
          className="w-fit rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold text-[var(--ink-muted)] transition hover:border-[var(--wood)] hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-45"
        >
          清除筛选
        </button>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((sheet) => (
            <SheetCard key={sheet.slug} sheet={sheet} />
          ))}
        </div>
      ) : (
        <section className="rounded-[32px] border border-dashed border-[var(--brass)] bg-[rgba(251,246,236,0.76)] p-10 text-center shadow-[var(--shadow-soft)]">
          <p className="font-display text-3xl font-semibold">没有匹配的谱例</p>
          <p className="mx-auto mt-3 max-w-xl text-[var(--ink-muted)]">换一个关键词，或清除部分标签、技巧、难度筛选后再试。</p>
          <button type="button" onClick={resetFilters} className="mt-6 rounded-full bg-[var(--wood)] px-5 py-3 text-sm font-semibold text-[var(--paper-soft)] shadow-[var(--shadow-tight)]">
            重置全部筛选
          </button>
        </section>
      )}
    </div>
  );
}

function FilterGroup({ label, children }: Readonly<{ label: string; children: React.ReactNode }>) {
  return (
    <div className="grid gap-3 md:grid-cols-[5rem_1fr] md:items-start">
      <p className="pt-1 text-sm font-semibold text-[var(--ink-muted)]">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
