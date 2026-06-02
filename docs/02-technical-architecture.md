# 02 Technical Architecture

## Chosen Stack

- Next.js App Router
- TypeScript
- React Server Components for static page rendering
- Client Components only for interactive search/filter UI
- Tailwind CSS plus CSS variables for styling
- Markdown content files parsed at build time
- Zod for frontmatter validation
- Vitest for unit tests
- Cloudflare Workers Static Assets for deployment
- Wrangler CLI as the deployment source of truth

## Why Next.js Static Export

Next.js static export matches this project because every first-release page can be computed at build time. The site gains route-based HTML, good SEO, React component structure, and client-side navigation without requiring a Node.js server.

Required config:

```ts
// next.config.ts
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

`trailingSlash: true` is recommended for static hosts because `/sheets/example/` maps cleanly to `/sheets/example/index.html`.

`images.unoptimized: true` is required if using `next/image` with local static export and no image optimization service. Plain `<img>` is also acceptable for this project.

## Static Export Constraints

Do not use Next.js features that require a server runtime:

- Server Actions
- cookies
- dynamic route params without `generateStaticParams()`
- ISR
- route handlers that depend on incoming `Request`
- rewrites
- redirects
- custom headers
- middleware/proxy
- default image optimization

Allowed:

- Server Components that read local files during build.
- Static `GET` route handlers that generate files at build time, if the route does not inspect a request.
- Client Components for search/filter state.

## Recommended Directory Structure

```text
SrP-Sheet/
  app/
    layout.tsx
    page.tsx
    globals.css
    about/
      page.tsx
    sheets/
      page.tsx
      [slug]/
        page.tsx
    not-found.tsx
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
  content/
    sheets/
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
  public/
    assets/
      brand/
      sheets/
        demo-with-bilibili/
  tests/
    bilibili.test.ts
    sheet-schema.test.ts
    related.test.ts
    search.test.ts
  docs/
  next.config.ts
  package.json
  postcss.config.mjs
  eslint.config.mjs
  tsconfig.json
  vitest.config.ts
  wrangler.jsonc
```

## Data Flow

1. Markdown files live in `content/sheets/`.
2. `lib/content.ts` reads Markdown files during build.
3. `lib/sheet-schema.ts` validates frontmatter with Zod.
4. `lib/markdown.ts` converts Markdown body to sanitized HTML or React-rendered content.
5. `app/sheets/[slug]/page.tsx` uses `generateStaticParams()` and renders each sheet page.
6. `app/sheets/page.tsx` reads all sheet summaries and passes serializable data to `components/sheet-explorer.tsx`.
7. `sheet-explorer.tsx` performs search/filter/sort in the browser.
8. `next build` emits static HTML and assets to `out/`.
9. Wrangler uploads `out/` through Workers Static Assets.

## Content Loader Contract

`getAllSheets()` must return all valid sheets sorted by `updatedAt` descending unless another explicit sort is requested.

`getSheetBySlug(slug)` must return one valid sheet or `null`.

`getSheetSummaries()` must return only serializable data needed by list/search UI. Do not pass rendered HTML to the explorer.

## Markdown Rendering

Markdown body should support:

- headings
- paragraphs
- links
- unordered and ordered lists
- blockquotes
- fenced code blocks
- GitHub-flavored tables
- chord/tab code blocks with language `chords`, `tab`, or `tabs`

Do not allow arbitrary raw HTML in content. If a future implementation allows HTML, sanitize it strictly.

## Bilibili Embed Contract

Do not store raw iframe HTML in content. Store metadata:

```yaml
bilibili:
  bvid: "BV1B7411m7LV"
  page: 1
  start: 0
  title: "演示视频"
```

The helper must produce:

```text
https://player.bilibili.com/player.html?bvid=<bvid>&p=<page>&t=<start>&autoplay=0&danmaku=0
```

`bvid` must match `^BV[0-9A-Za-z]{10}$`. `page` must be a positive integer. `start` must be a non-negative integer.

## Cloudflare Workers Deployment Shape

Use Workers Static Assets, not Cloudflare Pages.

Recommended `wrangler.jsonc`:

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

A Worker script is not required for the first release. If a later release adds API endpoints, add `main` and an `ASSETS` binding deliberately rather than mixing server behavior into the static release.

## Package Scripts

Recommended scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start:static": "wrangler dev",
    "deploy": "wrangler deploy",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

Run `pnpm build` before `pnpm start:static` because Wrangler serves the generated `out/` assets.
