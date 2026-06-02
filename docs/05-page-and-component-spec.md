# 05 Page and Component Spec

## Route Map

```text
/                 Home
/sheets/          Sheet library
/sheets/[slug]/   Sheet detail
/about/           About and rights/contact note
```

Optional later routes:

```text
/tags/[tag]/
/techniques/[technique]/
/videos/
```

Do not implement optional routes until the required routes are complete.

## Shared Components

### `SiteHeader`

Purpose: top navigation and site identity.

Props: none.

Requirements:

- Link logo/wordmark to `/`.
- Links: `谱例库`, `关于`.
- Highlight active section if simple to implement without server runtime.
- Mobile layout must not overflow.

### `SiteFooter`

Purpose: footer navigation and rights notice.

Requirements:

- Include project name.
- Include short rights/removal contact notice.
- Link to `/about/`.

### `PageShell`

Purpose: shared layout wrapper for max width and section spacing.

Requirements:

- Accept children.
- Provide consistent horizontal padding.

### `SheetCard`

Purpose: display a sheet summary in home and library lists.

Props:

```ts
interface SheetCardProps {
  sheet: SheetSummary;
  featured?: boolean;
}
```

Requirements:

- Use a real `Link` to `/sheets/${sheet.slug}/`.
- Show title, source, summary, difficulty, type, tuning, tags, and has-video/has-pdf indicators.
- Must be keyboard focusable through the link.
- Must not make the entire card a button.

### `DifficultyBadge`

Purpose: consistent difficulty rendering.

Props:

```ts
interface DifficultyBadgeProps {
  difficulty: "beginner" | "intermediate" | "advanced";
}
```

Labels:

- beginner: 入门
- intermediate: 进阶
- advanced: 高阶

### `BilibiliEmbed`

Purpose: safely render a Bilibili demo iframe.

Props:

```ts
interface BilibiliEmbedProps {
  video: BilibiliVideo;
}
```

Requirements:

- Use `buildBilibiliPlayerUrl(video)` from `lib/bilibili.ts`.
- Render a 16:9 responsive wrapper.
- Use `loading="lazy"`.
- Use `allowFullScreen`.
- Set `referrerPolicy="strict-origin-when-cross-origin"`.
- Set `title` to video title.
- Do not autoplay.

### `SheetExplorer`

Purpose: interactive client-side search/filter/sort for `/sheets/`.

Props:

```ts
interface SheetExplorerProps {
  sheets: SheetSummary[];
  facets: SheetFacets;
}
```

Requirements:

- Must be a Client Component.
- Search input filters by indexed text.
- Filter chips can toggle multiple tags/techniques.
- Difficulty/type/tuning filters can be single or multi-select; choose the simpler implementation and document it in code comments only if needed.
- Sort options: newest, title, difficulty.
- Show empty-state text when no sheets match.
- Do not fetch data from a server.

## Page Details

### Home: `app/page.tsx`

Sections:

1. Hero
   - Big SrP-Sheet wordmark/title.
   - One-sentence purpose.
   - Primary CTA to `/sheets/`.
   - Secondary CTA to `/about/`.
   - Visual sheet-card/notation composition.

2. Featured Sheets
   - 3 featured sheets if available.
   - Fallback to latest 3 sheets.

3. Latest Updates
   - Latest 4-6 sheets.

4. Browse Lanes
   - Links or chips for beginner/intermediate/advanced and selected techniques.

5. Video Highlight
   - Show one sheet with Bilibili metadata if available.
   - Link to sheet detail; do not embed the video on home unless it remains lightweight.

### Library: `app/sheets/page.tsx`

Server side:

- Load all sheet summaries.
- Derive facets from content.
- Pass summaries and facets to `SheetExplorer`.

Client side:

- Render search/filter/sort controls.
- Render result count.
- Render `SheetCard` grid/list.

### Detail: `app/sheets/[slug]/page.tsx`

Static generation:

```ts
export async function generateStaticParams() {
  const sheets = await getAllSheets();
  return sheets.map((sheet) => ({ slug: sheet.slug }));
}
```

Page requirements:

- Call `getSheetBySlug(params.slug)`.
- Call `notFound()` if missing.
- Render metadata grid.
- Render Markdown body.
- Render Bilibili video if present.
- Render attachments if present.
- Render related sheets.

Metadata:

- Implement `generateMetadata()` from sheet title and summary.
- Use static data only.

### About: `app/about/page.tsx`

Sections:

- What SrP-Sheet is.
- How content is selected.
- Rights/removal notice.
- Future direction: original music and more demo videos.

## Markdown Styling

Use a wrapper class such as `.sheet-prose`.

Requirements:

- Headings have strong spacing and editorial type.
- Links are underlined or accented.
- Tables are horizontally scrollable on mobile.
- Code/tab blocks preserve whitespace.
- `tab`, `tabs`, and `chords` code fences receive a notation-specific style.

## Empty and Error States

- No matching search results: show a designed empty state with clear reset action.
- Missing sheet slug: render Next `notFound()`.
- Invalid content: fail the build through Zod validation, not runtime UI fallback.
