# SrP-Sheet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build SrP-Sheet as a polished static Next.js guitar sheet example site with Markdown content, Bilibili embeds, client-side search/filter, and Cloudflare Workers Static Assets deployment.

**Architecture:** The site is a static-exported Next.js App Router project. Markdown sheet files are read and validated at build time, pages are generated statically, and only the sheet explorer runs client-side filtering. Wrangler deploys the generated `out/` directory as Workers Static Assets.

**Tech Stack:** Next.js, TypeScript, React, Tailwind CSS, Zod, gray-matter, remark/rehype, Vitest, Wrangler CLI, Cloudflare Workers Static Assets.

---

## File Structure To Create

```text
SrP-Sheet/
  app/
    about/page.tsx
    sheets/[slug]/page.tsx
    sheets/page.tsx
    globals.css
    layout.tsx
    not-found.tsx
    page.tsx
  components/
    bilibili-embed.tsx
    difficulty-badge.tsx
    filter-chip.tsx
    page-shell.tsx
    sheet-card.tsx
    sheet-explorer.tsx
    sheet-meta-grid.tsx
    site-footer.tsx
    site-header.tsx
  content/sheets/
    warmup-open-chords.md
    percussive-strum-basic.md
    fingerstyle-arp-01.md
    minor-pentatonic-lick-01.md
    hybrid-picking-study.md
    demo-with-bilibili.md
  lib/
    bilibili.ts
    content.ts
    markdown.ts
    related.ts
    search.ts
    sheet-schema.ts
    sort.ts
    utils.ts
  tests/
    bilibili.test.ts
    related.test.ts
    search.test.ts
    sheet-schema.test.ts
  docs/
  next.config.ts
  package.json
  postcss.config.mjs
  eslint.config.mjs
  tsconfig.json
  vitest.config.ts
  wrangler.jsonc
```

## Task 1: Scaffold Static Next.js Project

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `eslint.config.mjs`
- Create: `vitest.config.ts`
- Create: `wrangler.jsonc`
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Create: `app/page.tsx`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "srp-sheet",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start:static": "wrangler dev",
    "deploy": "wrangler deploy",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "clsx": "latest",
    "gray-matter": "latest",
    "next": "latest",
    "react": "latest",
    "react-dom": "latest",
    "rehype-stringify": "latest",
    "remark-gfm": "latest",
    "remark-parse": "latest",
    "remark-rehype": "latest",
    "unified": "latest",
    "zod": "latest"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "latest",
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "eslint": "latest",
    "eslint-config-next": "latest",
    "postcss": "latest",
    "tailwindcss": "latest",
    "typescript": "latest",
    "vitest": "latest",
    "wrangler": "latest"
  }
}
```

- [ ] **Step 2: Create `next.config.ts`**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Create PostCSS/ESLint/Vitest/Wrangler config files**

`postcss.config.mjs`:

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {}
  }
};

export default config;
```

`eslint.config.mjs`:

```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"])
]);

export default eslintConfig;
```

`vitest.config.ts`:

```ts
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"]
  },
  resolve: {
    alias: {
      "@": root
    }
  }
});
```

`wrangler.jsonc`:

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "srp-sheet",
  "compatibility_date": "2026-06-02",
  "assets": {
    "directory": "./out",
    "not_found_handling": "404-page"
  }
}
```

- [ ] **Step 5: Create minimal App Router files**

`app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display" });
const body = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "SrP-Sheet",
  description: "吉他谱例与演示视频分享站"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

`app/globals.css`:

```css
@import "tailwindcss";

:root {
  --paper: #f4ead8;
  --paper-soft: #fbf6ec;
  --ink: #1f211c;
  --ink-muted: #686257;
  --wood: #8a5634;
  --wood-dark: #4b2c1d;
  --brass: #b8852f;
  --sage: #6f7f63;
  --wine: #7a2f2f;
  --line: rgba(31, 33, 28, 0.16);
  --shadow-soft: 0 18px 50px rgba(43, 31, 20, 0.14);
  --shadow-tight: 0 8px 24px rgba(43, 31, 20, 0.18);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  min-height: 100vh;
  color: var(--ink);
  background:
    linear-gradient(rgba(31, 33, 28, 0.035) 1px, transparent 1px),
    radial-gradient(circle at 20% 10%, rgba(184, 133, 47, 0.18), transparent 32rem),
    var(--paper);
  background-size: 100% 32px, auto, auto;
  font-family: var(--font-body), sans-serif;
}

a {
  color: inherit;
}

:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--brass) 72%, white);
  outline-offset: 3px;
}

.font-display {
  font-family: var(--font-display), serif;
}

.font-body {
  font-family: var(--font-body), sans-serif;
}

.font-mono {
  font-family: var(--font-mono), monospace;
}

.sheet-prose pre {
  overflow-x: auto;
  border: 1px solid var(--line);
  border-radius: 18px;
  background:
    linear-gradient(rgba(31, 33, 28, 0.055) 1px, transparent 1px),
    #fffaf0;
  background-size: 100% 28px;
  padding: 1rem;
  font-family: var(--font-mono), monospace;
  box-shadow: var(--shadow-tight);
}
```

`app/page.tsx`:

```tsx
export default function HomePage() {
  return <main>SrP-Sheet</main>;
}
```

- [ ] **Step 6: Install dependencies**

Run: `pnpm install`

Expected: dependencies install successfully and a lockfile is created.

- [ ] **Step 7: Verify initial scaffold**

Run: `pnpm typecheck`

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add package.json pnpm-lock.yaml next.config.ts tsconfig.json postcss.config.mjs eslint.config.mjs vitest.config.ts wrangler.jsonc app
git commit -m "chore: scaffold SrP-Sheet static Next app"
```

## Task 2: Implement Content Schema and Tests

**Files:**
- Create: `lib/sheet-schema.ts`
- Create: `tests/sheet-schema.test.ts`

- [ ] **Step 1: Write failing schema tests**

`tests/sheet-schema.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { sheetFrontmatterSchema } from "@/lib/sheet-schema";

const validSheet = {
  title: "Minor Pentatonic Lick 01",
  slug: "minor-pentatonic-lick-01",
  type: "lick",
  source: "Original Study",
  summary: "A compact phrase for practicing slides and timing.",
  difficulty: "intermediate",
  instrument: "electric-guitar",
  tuning: "E Standard",
  key: "A minor",
  capo: null,
  bpm: 92,
  techniques: ["slide", "alternate-picking"],
  tags: ["pentatonic", "lead-guitar"],
  featured: true,
  publishedAt: "2026-06-02",
  updatedAt: "2026-06-02",
  cover: "/assets/sheets/minor-pentatonic-lick-01/cover.webp",
  pdf: "/assets/sheets/minor-pentatonic-lick-01/sheet.pdf",
  images: [{ src: "/assets/sheets/minor-pentatonic-lick-01/page-1.webp", alt: "Sheet page one" }],
  bilibili: { bvid: "BV1B7411m7LV", page: 1, start: 0, title: "Demo" },
  rights: "Original educational example."
};

describe("sheetFrontmatterSchema", () => {
  it("parses valid complete sheet metadata", () => {
    expect(sheetFrontmatterSchema.parse(validSheet).slug).toBe("minor-pentatonic-lick-01");
  });

  it("rejects missing required title", () => {
    const { title, ...withoutTitle } = validSheet;
    expect(() => sheetFrontmatterSchema.parse(withoutTitle)).toThrow();
  });

  it("rejects invalid slugs", () => {
    expect(() => sheetFrontmatterSchema.parse({ ...validSheet, slug: "Bad Slug" })).toThrow();
  });

  it("rejects updatedAt earlier than publishedAt", () => {
    expect(() => sheetFrontmatterSchema.parse({ ...validSheet, publishedAt: "2026-06-03", updatedAt: "2026-06-02" })).toThrow();
  });

  it("rejects invalid PDF paths", () => {
    expect(() => sheetFrontmatterSchema.parse({ ...validSheet, pdf: "https://example.com/sheet.pdf" })).toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/sheet-schema.test.ts`

Expected: FAIL because `lib/sheet-schema.ts` does not exist.

- [ ] **Step 3: Implement schema**

`lib/sheet-schema.ts`:

```ts
import { z } from "zod";

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const assetPath = z.string().regex(/^\/assets\/sheets\/.+/);
const pdfPath = z.string().regex(/^\/assets\/sheets\/.+\.pdf$/);
const kebabList = z.array(slug).min(1).transform((items) => Array.from(new Set(items)));

export const bilibiliVideoSchema = z.object({
  bvid: z.string().regex(/^BV[0-9A-Za-z]{10}$/),
  page: z.number().int().positive().default(1),
  start: z.number().int().nonnegative().default(0),
  title: z.string().min(1)
});

export const sheetImageSchema = z.object({
  src: assetPath,
  alt: z.string().min(1)
});

export const sheetFrontmatterSchema = z
  .object({
    title: z.string().min(1),
    slug,
    type: z.enum(["exercise", "riff", "lick", "song", "arrangement", "original"]),
    source: z.string().min(1).optional(),
    summary: z.string().min(1),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]),
    instrument: z.enum(["acoustic-guitar", "electric-guitar", "classical-guitar", "bass"]),
    tuning: z.string().min(1),
    key: z.string().min(1).optional(),
    capo: z.string().min(1).nullable().optional(),
    bpm: z.number().positive().optional(),
    techniques: kebabList,
    tags: kebabList,
    featured: z.boolean().default(false),
    publishedAt: dateString,
    updatedAt: dateString,
    cover: assetPath.optional(),
    pdf: pdfPath.optional(),
    images: z.array(sheetImageSchema).default([]),
    bilibili: bilibiliVideoSchema.optional(),
    rights: z.string().min(1)
  })
  .superRefine((sheet, ctx) => {
    if (sheet.updatedAt < sheet.publishedAt) {
      ctx.addIssue({ code: "custom", path: ["updatedAt"], message: "updatedAt must not be earlier than publishedAt" });
    }
  });

export type BilibiliVideo = z.infer<typeof bilibiliVideoSchema>;
export type SheetFrontmatter = z.infer<typeof sheetFrontmatterSchema>;
export type Difficulty = SheetFrontmatter["difficulty"];
export type SheetType = SheetFrontmatter["type"];
export type Instrument = SheetFrontmatter["instrument"];
export type SheetImage = z.infer<typeof sheetImageSchema>;

export interface Sheet extends SheetFrontmatter {
  body: string;
  html: string;
  excerpt: string;
}

export type SheetSummary = Omit<Sheet, "body" | "html"> & {
  hasVideo: boolean;
  hasPdf: boolean;
  searchText: string;
};
```

- [ ] **Step 4: Run schema tests**

Run: `pnpm test tests/sheet-schema.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/sheet-schema.ts tests/sheet-schema.test.ts
git commit -m "test: validate sheet metadata schema"
```

## Task 3: Implement Bilibili URL Builder and Tests

**Files:**
- Create: `lib/bilibili.ts`
- Create: `tests/bilibili.test.ts`
- Create: `components/bilibili-embed.tsx`

- [ ] **Step 1: Write failing tests**

`tests/bilibili.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildBilibiliPlayerUrl } from "@/lib/bilibili";

describe("buildBilibiliPlayerUrl", () => {
  it("builds a player URL from a valid BVID", () => {
    expect(buildBilibiliPlayerUrl({ bvid: "BV1B7411m7LV", page: 1, start: 0, title: "Demo" })).toBe(
      "https://player.bilibili.com/player.html?bvid=BV1B7411m7LV&p=1&t=0&autoplay=0&danmaku=0"
    );
  });

  it("includes page and start time", () => {
    const url = buildBilibiliPlayerUrl({ bvid: "BV1B7411m7LV", page: 2, start: 35, title: "Demo" });
    expect(url).toContain("p=2");
    expect(url).toContain("t=35");
  });

  it("always disables autoplay and danmaku", () => {
    const url = buildBilibiliPlayerUrl({ bvid: "BV1B7411m7LV", page: 1, start: 0, title: "Demo" });
    expect(url).toContain("autoplay=0");
    expect(url).toContain("danmaku=0");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/bilibili.test.ts`

Expected: FAIL because `lib/bilibili.ts` does not exist.

- [ ] **Step 3: Implement URL builder**

`lib/bilibili.ts`:

```ts
import type { BilibiliVideo } from "@/lib/sheet-schema";

export function buildBilibiliPlayerUrl(video: BilibiliVideo): string {
  const params = new URLSearchParams({
    bvid: video.bvid,
    p: String(video.page),
    t: String(video.start),
    autoplay: "0",
    danmaku: "0"
  });

  return `https://player.bilibili.com/player.html?${params.toString()}`;
}
```

- [ ] **Step 4: Implement embed component**

`components/bilibili-embed.tsx`:

```tsx
import { buildBilibiliPlayerUrl } from "@/lib/bilibili";
import type { BilibiliVideo } from "@/lib/sheet-schema";

interface BilibiliEmbedProps {
  video: BilibiliVideo;
}

export function BilibiliEmbed({ video }: BilibiliEmbedProps) {
  return (
    <section className="rounded-[28px] border border-[var(--line)] bg-[var(--paper-soft)] p-3 shadow-[var(--shadow-soft)]">
      <div className="mb-3 flex items-center justify-between gap-4 px-2 text-sm text-[var(--ink-muted)]">
        <span>演示视频</span>
        <span>Bilibili</span>
      </div>
      <div className="aspect-video overflow-hidden rounded-[22px] border border-[var(--line)] bg-black">
        <iframe
          src={buildBilibiliPlayerUrl(video)}
          title={video.title}
          loading="lazy"
          allow="fullscreen; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="h-full w-full"
        />
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Run Bilibili tests**

Run: `pnpm test tests/bilibili.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/bilibili.ts components/bilibili-embed.tsx tests/bilibili.test.ts
git commit -m "feat: add safe Bilibili embeds"
```

## Task 4: Implement Search and Related Logic

**Files:**
- Create: `lib/search.ts`
- Create: `lib/related.ts`
- Create: `lib/sort.ts`
- Create: `tests/search.test.ts`
- Create: `tests/related.test.ts`

- [ ] **Step 1: Write failing search tests**

`tests/search.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { filterSheets } from "@/lib/search";
import type { SheetSummary } from "@/lib/sheet-schema";

const sheets = [
  {
    title: "Open Chord Warmup",
    slug: "open-chord-warmup",
    type: "exercise",
    summary: "A beginner chord switching drill.",
    difficulty: "beginner",
    instrument: "acoustic-guitar",
    tuning: "E Standard",
    techniques: ["open-chords"],
    tags: ["warmup"],
    featured: false,
    publishedAt: "2026-06-02",
    updatedAt: "2026-06-02",
    images: [],
    rights: "Original.",
    excerpt: "Practice G C D changes.",
    hasVideo: false,
    hasPdf: true,
    searchText: "open chord warmup beginner warmup open-chords"
  },
  {
    title: "Pentatonic Slide Lick",
    slug: "pentatonic-slide-lick",
    type: "lick",
    summary: "A lead guitar phrase.",
    difficulty: "intermediate",
    instrument: "electric-guitar",
    tuning: "E Standard",
    techniques: ["slide"],
    tags: ["pentatonic"],
    featured: true,
    publishedAt: "2026-06-02",
    updatedAt: "2026-06-02",
    images: [],
    rights: "Original.",
    excerpt: "Slide into the target note.",
    hasVideo: true,
    hasPdf: false,
    searchText: "pentatonic slide lick lead guitar intermediate slide"
  }
] satisfies SheetSummary[];

describe("filterSheets", () => {
  it("matches title case-insensitively", () => {
    expect(filterSheets(sheets, { query: "PENTATONIC" }).map((sheet) => sheet.slug)).toEqual(["pentatonic-slide-lick"]);
  });

  it("matches tag or technique", () => {
    expect(filterSheets(sheets, { query: "open-chords" }).map((sheet) => sheet.slug)).toEqual(["open-chord-warmup"]);
  });

  it("filters by difficulty", () => {
    expect(filterSheets(sheets, { difficulties: ["beginner"] }).map((sheet) => sheet.slug)).toEqual(["open-chord-warmup"]);
  });

  it("combines search and filters", () => {
    expect(filterSheets(sheets, { query: "slide", difficulties: ["beginner"] })).toEqual([]);
  });
});
```

- [ ] **Step 2: Write failing related tests**

`tests/related.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getRelatedSheets } from "@/lib/related";
import type { SheetSummary } from "@/lib/sheet-schema";

function sheet(slug: string, tags: string[], techniques: string[]): SheetSummary {
  return {
    title: slug,
    slug,
    type: "lick",
    summary: slug,
    difficulty: "intermediate",
    instrument: "electric-guitar",
    tuning: "E Standard",
    techniques,
    tags,
    featured: false,
    publishedAt: "2026-06-02",
    updatedAt: "2026-06-02",
    images: [],
    rights: "Original.",
    excerpt: slug,
    hasVideo: false,
    hasPdf: false,
    searchText: `${slug} ${tags.join(" ")} ${techniques.join(" ")}`
  };
}

describe("getRelatedSheets", () => {
  it("excludes the current sheet and prefers shared tags", () => {
    const current = sheet("current", ["pentatonic"], ["slide"]);
    const result = getRelatedSheets(current, [current, sheet("shared", ["pentatonic"], ["bend"]), sheet("other", ["jazz"], ["chords"])], 2);
    expect(result.map((item) => item.slug)).toEqual(["shared", "other"]);
  });

  it("caps result count", () => {
    const current = sheet("current", ["a"], ["x"]);
    const result = getRelatedSheets(current, [current, sheet("one", ["a"], ["x"]), sheet("two", ["a"], ["x"])], 1);
    expect(result).toHaveLength(1);
  });
});
```

- [ ] **Step 3: Run tests to verify failure**

Run: `pnpm test tests/search.test.ts tests/related.test.ts`

Expected: FAIL because search and related modules do not exist.

- [ ] **Step 4: Implement search**

`lib/search.ts`:

```ts
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
```

`lib/sort.ts`:

```ts
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
```

- [ ] **Step 5: Implement related logic**

`lib/related.ts`:

```ts
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
```

- [ ] **Step 6: Run logic tests**

Run: `pnpm test tests/search.test.ts tests/related.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add lib/search.ts lib/sort.ts lib/related.ts tests/search.test.ts tests/related.test.ts
git commit -m "test: cover sheet search and related logic"
```

## Task 5: Implement Markdown Content Loading

**Files:**
- Create: `lib/markdown.ts`
- Create: `lib/content.ts`
- Create: `lib/utils.ts`
- Create: six files under `content/sheets/`

- [ ] **Step 1: Create utility helpers**

`lib/utils.ts`:

```ts
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
```

- [ ] **Step 2: Create Markdown renderer**

`lib/markdown.ts`:

```ts
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

export async function markdownToHtml(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeStringify)
    .process(markdown);

  return String(file);
}

export function excerptFromMarkdown(markdown: string, maxLength = 180): string {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`|\-[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return plain.length > maxLength ? `${plain.slice(0, maxLength - 1)}…` : plain;
}
```

- [ ] **Step 3: Create content loader**

`lib/content.ts`:

```ts
import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { excerptFromMarkdown, markdownToHtml } from "@/lib/markdown";
import { sheetFrontmatterSchema, type Sheet, type SheetSummary } from "@/lib/sheet-schema";

const sheetsDirectory = path.join(process.cwd(), "content", "sheets");

function createSearchText(sheet: Omit<Sheet, "searchText">): string {
  return [
    sheet.title,
    sheet.source,
    sheet.summary,
    sheet.type,
    sheet.difficulty,
    sheet.instrument,
    sheet.tuning,
    sheet.key,
    sheet.techniques.join(" "),
    sheet.tags.join(" "),
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

      if (!parsed.content.trim()) {
        throw new Error(`Sheet body is empty: ${file.name}`);
      }

      const html = await markdownToHtml(parsed.content);
      const excerpt = excerptFromMarkdown(parsed.content);
      return { ...frontmatter, body: parsed.content, html, excerpt } satisfies Sheet;
    })
  );

  return sheets.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt) || left.title.localeCompare(right.title));
}

export async function getSheetBySlug(slug: string): Promise<Sheet | null> {
  const sheets = await getAllSheets();
  return sheets.find((sheet) => sheet.slug === slug) ?? null;
}

export function toSheetSummary(sheet: Sheet): SheetSummary {
  const { body, html, ...summary } = sheet;
  return {
    ...summary,
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
  difficulties: string[];
  types: string[];
  tunings: string[];
  tags: string[];
  techniques: string[];
}

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((left, right) => left.localeCompare(right));
}

export function buildSheetFacets(sheets: readonly SheetSummary[]): SheetFacets {
  return {
    difficulties: uniqueSorted(sheets.map((sheet) => sheet.difficulty)),
    types: uniqueSorted(sheets.map((sheet) => sheet.type)),
    tunings: uniqueSorted(sheets.map((sheet) => sheet.tuning)),
    tags: uniqueSorted(sheets.flatMap((sheet) => sheet.tags)),
    techniques: uniqueSorted(sheets.flatMap((sheet) => sheet.techniques))
  };
}
```


- [ ] **Step 5: Add six seed Markdown sheets**

Create the six files listed in `docs/03-content-model.md`. Use original practice examples. At least one file must include:

```yaml
bilibili:
  bvid: "BV1B7411m7LV"
  page: 1
  start: 0
  title: "SrP-Sheet demo example"
```

Each Markdown body must include `## Playing Notes` and at least one fenced `tab` or `chords` code block.

- [ ] **Step 6: Verify content loads during build**

Run: `pnpm typecheck`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add lib/content.ts lib/markdown.ts lib/utils.ts content/sheets
git commit -m "feat: load validated Markdown sheet content"
```

## Task 6: Build Shared Visual Components

**Files:**
- Create: `components/page-shell.tsx`
- Create: `components/site-header.tsx`
- Create: `components/site-footer.tsx`
- Create: `components/difficulty-badge.tsx`
- Create: `components/filter-chip.tsx`
- Create: `components/sheet-card.tsx`
- Create: `components/sheet-meta-grid.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Implement page shell**

`components/page-shell.tsx`:

```tsx
export function PageShell({ children, className = "" }: Readonly<{ children: React.ReactNode; className?: string }>) {
  return <div className={`mx-auto w-full max-w-[1180px] px-5 sm:px-8 ${className}`}>{children}</div>;
}
```

- [ ] **Step 2: Implement header and footer**

`components/site-header.tsx`:

```tsx
import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(244,234,216,0.82)] backdrop-blur-xl">
      <PageShell className="flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight">
          SrP-Sheet
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-[var(--ink-muted)]">
          <Link className="hover:text-[var(--ink)]" href="/sheets/">谱例库</Link>
          <Link className="hover:text-[var(--ink)]" href="/about/">关于</Link>
        </nav>
      </PageShell>
    </header>
  );
}
```

`components/site-footer.tsx`:

```tsx
import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-[var(--line)] py-10 text-sm text-[var(--ink-muted)]">
      <PageShell className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p>© SrP-Sheet. Guitar sheet examples and demo notes.</p>
        <Link href="/about/" className="underline decoration-[var(--brass)] underline-offset-4">版权与联系说明</Link>
      </PageShell>
    </footer>
  );
}
```

- [ ] **Step 3: Wire header/footer in layout**

Modify `app/layout.tsx` body:

```tsx
<body>
  <SiteHeader />
  {children}
  <SiteFooter />
</body>
```

Also import:

```ts
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
```

- [ ] **Step 4: Implement badges, chips, cards, and meta grid**

Use `docs/05-page-and-component-spec.md` as the exact component contract. Keep components presentational and typed. `SheetCard` must link to `/sheets/${sheet.slug}/` and show difficulty, type, tuning, tags, video/PDF indicators.

- [ ] **Step 5: Verify components typecheck**

Run: `pnpm typecheck`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components app/layout.tsx
git commit -m "feat: add SrP-Sheet layout components"
```

## Task 7: Implement Pages

**Files:**
- Modify: `app/page.tsx`
- Create: `app/sheets/page.tsx`
- Create: `app/sheets/[slug]/page.tsx`
- Create: `app/about/page.tsx`
- Create: `app/not-found.tsx`

- [ ] **Step 1: Implement home page**

Use `getSheetSummaries()` to render featured and latest sheets. The hero must include the SrP-Sheet wordmark, CTA to `/sheets/`, CTA to `/about/`, and a paper/notation visual composition.

- [ ] **Step 2: Implement library page**

Server component:

```tsx
import { buildSheetFacets, getSheetSummaries } from "@/lib/content";
import { SheetExplorer } from "@/components/sheet-explorer";

export default async function SheetsPage() {
  const sheets = await getSheetSummaries();
  return <SheetExplorer sheets={sheets} facets={buildSheetFacets(sheets)} />;
}
```

- [ ] **Step 3: Implement sheet detail page static params**

`app/sheets/[slug]/page.tsx` must include:

```tsx
export async function generateStaticParams() {
  const sheets = await getAllSheets();
  return sheets.map((sheet) => ({ slug: sheet.slug }));
}
```

Then render metadata, Markdown HTML, attachments, Bilibili embed, and related sheets.

- [ ] **Step 4: Implement about page**

Include project purpose, content policy, rights/removal note, and future direction for original music and more demos.

- [ ] **Step 5: Implement 404 page**

Provide a designed page with a link back to `/sheets/`.

- [ ] **Step 6: Run build to catch static export issues**

Run: `pnpm build`

Expected: PASS and `out/` is created.

- [ ] **Step 7: Commit**

```bash
git add app
git commit -m "feat: add static SrP-Sheet pages"
```

## Task 8: Implement Client Sheet Explorer

**Files:**
- Create: `components/sheet-explorer.tsx`
- Modify: `components/filter-chip.tsx` if needed

- [ ] **Step 1: Implement client component**

`components/sheet-explorer.tsx` must start with:

```tsx
"use client";
```

It must maintain local state for query, active filters, and sort. Use `filterSheets()` and `sortSheets()` from `lib/`.

- [ ] **Step 2: Required UI controls**

Implement:

- Search input with label.
- Difficulty chips.
- Type chips.
- Technique/tag chips.
- Has video toggle.
- Has PDF toggle.
- Sort select.
- Result count.
- Reset button.
- Empty state.

- [ ] **Step 3: Keep behavior static**

Do not fetch from `/api`. Do not use server actions. All data must come through props from `app/sheets/page.tsx`.

- [ ] **Step 4: Run tests and typecheck**

Run: `pnpm test && pnpm typecheck`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/sheet-explorer.tsx components/filter-chip.tsx
git commit -m "feat: add static sheet explorer"
```

## Task 9: Final Styling Pass and Static Export Verification

**Files:**
- Modify: `app/globals.css`
- Modify: affected page/component files only as needed

- [ ] **Step 1: Apply final visual polish**

Use `docs/04-ui-design-system.md`. Ensure the site has:

- paper/studio background
- distinct hero composition
- designed cards
- designed filters
- readable sheet prose
- styled Bilibili frame
- responsive mobile layout
- visible focus states

- [ ] **Step 2: Run full verification**

Run:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm start:static
```

Expected:

- typecheck PASS
- lint PASS
- tests PASS
- build PASS
- Wrangler local preview serves `out/`

- [ ] **Step 3: Manual QA**

In Wrangler preview, verify:

- `/`
- `/sheets/`
- one non-video sheet detail
- video sheet detail
- `/about/`
- missing route 404

- [ ] **Step 4: Commit**

```bash
git add app components lib tests content next.config.ts wrangler.jsonc package.json pnpm-lock.yaml
git commit -m "feat: complete SrP-Sheet static release"
```

## Task 10: Deployment

**Files:**
- No source changes unless verification reveals a real bug.

- [ ] **Step 1: Login if required**

Run: `pnpm wrangler login`

Expected: Cloudflare authentication succeeds.

- [ ] **Step 2: Deploy**

Run: `pnpm deploy`

Expected: Wrangler deploys the `srp-sheet` Worker with static assets from `out/`.

- [ ] **Step 3: Verify deployed URL**

Open the deployed URL and repeat the manual QA from Task 9.

- [ ] **Step 4: Record deployment result**

Add the deployed URL and verification result to the final handoff message. Do not create a new documentation file unless the project owner asks for one.
