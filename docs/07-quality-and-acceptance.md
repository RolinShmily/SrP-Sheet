# 07 Quality and Acceptance

## Acceptance Criteria

A development agent may call the first release complete only when all criteria below are met.

## Product Acceptance

- Home page communicates SrP-Sheet as a guitar sheet example and demo video site.
- Library page lists all seeded sheets.
- Library search finds sheets by title, summary, tag, technique, source, and excerpt.
- Library filters narrow results by difficulty, type, tuning, tags, techniques, video availability, and PDF availability.
- Each seeded sheet has a working detail page.
- A sheet with Bilibili metadata renders an embedded Bilibili player.
- About page includes project explanation and rights/removal contact language.
- Mobile layout is usable without horizontal page overflow.

## Technical Acceptance

- `next.config.*` sets `output: "export"`.
- Dynamic sheet route implements `generateStaticParams()`.
- No first-release code depends on a server runtime.
- Markdown content is validated with Zod at build time.
- Invalid frontmatter causes build/test failure, not silent UI fallback.
- Bilibili URLs are generated from validated metadata.
- Search/filter data is static and serializable.
- Wrangler config points to `./out`.

## Visual Acceptance

- Site uses the defined paper/studio visual direction.
- The interface does not look like a generic Tailwind starter.
- Sheet cards, filters, metadata badges, and Bilibili frames have designed states.
- Focus states are visible.
- Sheet/tab notation is readable.
- Color is not the only way to understand difficulty or active filter state.

## Required Commands

Run these before handoff:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm start:static
```

The final handoff must state which commands were run and whether they passed.

## Required Tests

Implement unit tests for these behaviors:

### `lib/bilibili.ts`

- Valid BVID generates expected player URL.
- Autoplay is disabled.
- Danmaku is disabled.
- Page and start time are included.
- Invalid BVID is rejected by schema validation.

### `lib/sheet-schema.ts`

- Valid complete sheet metadata parses.
- Missing required title fails.
- Invalid slug fails.
- `updatedAt` earlier than `publishedAt` fails.
- Invalid PDF path fails.

### `lib/search.ts`

- Search matches title.
- Search matches tag or technique.
- Search is case-insensitive.
- Difficulty filter returns only matching sheets.
- Combined search and filter narrows results.

### `lib/related.ts`

- Related sheets prefer shared tags/techniques.
- Current sheet is excluded.
- Result count is capped.

## Manual QA Script

After `pnpm start:static`:

1. Open `/`.
   - Verify hero, featured sheets, latest sheets, and navigation.
2. Open `/sheets/`.
   - Type a search term that should match one seeded sheet.
   - Toggle one difficulty filter.
   - Toggle one technique/tag filter.
   - Clear filters.
3. Open a sheet detail page.
   - Verify metadata and Markdown body render.
   - Verify notation/code block preserves alignment.
4. Open the seeded Bilibili demo sheet.
   - Verify iframe is visible, 16:9, titled, lazy-loaded, and not autoplaying.
5. Open `/about/`.
   - Verify rights/removal note exists.
6. Open a missing route.
   - Verify 404 page appears.

## Review Notes for Agents

Do not mark complete because `next dev` works. Static export and Wrangler preview are required. The project is intentionally static; adding runtime APIs to solve search, metadata, or embed rendering is a design violation.
