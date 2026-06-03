import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { excerptFromMarkdown, markdownToHtml } from "@/lib/markdown";
import { sheetFrontmatterSchema, type Sheet, type SheetSummary } from "@/lib/sheet-schema";

const sheetsDirectory = path.join(process.cwd(), "content", "sheets");

function createSearchText(sheet: Sheet): string {
  return [
    sheet.title,
    sheet.summary,
    sheet.type,
    sheet.instrument,
    sheet.tuning,
    sheet.key,
    sheet.excerpt
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export async function getAllSheets(): Promise<Sheet[]> {
  const entries = await fs.readdir(sheetsDirectory, { withFileTypes: true });
  const files = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".md"));
  const sheets = await Promise.all(
    files.map(async (file) => {
      const fullPath = path.join(sheetsDirectory, file.name);
      const raw = await fs.readFile(fullPath, "utf8");
      const parsed = matter(raw);
      const frontmatter = sheetFrontmatterSchema.parse(parsed.data);
      const fileSlug = file.name.replace(/\.md$/, "");

      if (frontmatter.slug !== fileSlug) {
        throw new Error(`Sheet slug mismatch: ${file.name} declares ${frontmatter.slug}`);
      }


      const body = parsed.content.trim();
      const html = body ? await markdownToHtml(body) : "";
      const excerpt = body ? excerptFromMarkdown(body) : "";
      return { ...frontmatter, body, html, excerpt } satisfies Sheet;
    })
  );

  return sheets.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt) || left.title.localeCompare(right.title));
}

export async function getSheetBySlug(slug: string): Promise<Sheet | null> {
  const sheets = await getAllSheets();
  return sheets.find((sheet) => sheet.slug === slug) ?? null;
}

export function toSheetSummary(sheet: Sheet): SheetSummary {
  return {
    title: sheet.title,
    slug: sheet.slug,
    type: sheet.type,
    summary: sheet.summary,
    instrument: sheet.instrument,
    tuning: sheet.tuning,
    key: sheet.key,
    capo: sheet.capo,
    bpm: sheet.bpm,
    featured: sheet.featured,
    publishedAt: sheet.publishedAt,
    updatedAt: sheet.updatedAt,
    cover: sheet.cover,
    pdf: sheet.pdf,
    preview: sheet.preview,
    images: sheet.images,
    bilibili: sheet.bilibili,
    rights: sheet.rights,
    excerpt: sheet.excerpt,
    hasVideo: Boolean(sheet.bilibili),
    hasPdf: Boolean(sheet.pdf),
    searchText: createSearchText(sheet)
  };
}

export async function getSheetSummaries(): Promise<SheetSummary[]> {
  const sheets = await getAllSheets();
  return sheets.map(toSheetSummary);
}

export interface SheetFacets {
  types: string[];
  tunings: string[];
}

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((left, right) => left.localeCompare(right));
}

export function buildSheetFacets(sheets: readonly SheetSummary[]): SheetFacets {
  return {
    types: uniqueSorted(sheets.map((sheet) => sheet.type)),
    tunings: uniqueSorted(sheets.map((sheet) => sheet.tuning))
  };
}
