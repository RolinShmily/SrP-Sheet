# 06 Deployment and Ops

## Deployment Target

SrP-Sheet deploys to Cloudflare Workers Static Assets using Wrangler CLI. It does not use Cloudflare Pages for the first release.

Cloudflare Workers Static Assets uploads the static files from the configured assets directory. For this project, the directory is Next.js static export output: `out/`.

## Required Configuration

Create `wrangler.jsonc` in project root:

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

Notes:

- `main` is intentionally omitted because first release is assets-only.
- `not_found_handling: "404-page"` is correct for a static multi-page site.
- Do not use `single-page-application`; this is not an SPA shell.
- If a future Worker script is added, configure `main` and route asset handling deliberately.

## Build Flow

```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm start:static
pnpm deploy
```

Expected build behavior:

- `pnpm build` runs `next build`.
- Because `output: "export"` is configured, Next.js writes static files to `out/`.
- `pnpm start:static` serves the Worker/static assets locally through Wrangler.
- `pnpm deploy` deploys to Cloudflare.

## Package Scripts

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

## Local Development Modes

### Next development server

Use for UI iteration:

```bash
pnpm dev
```

This runs the Next development server. It is not proof that static export and Cloudflare serving work.

### Static Worker preview

Use after build:

```bash
pnpm build
pnpm start:static
```

This validates the actual deployment shape: generated `out/` assets served by Wrangler.

## Environment Variables

No runtime environment variables are required for the first release.

Do not introduce secrets or API keys for Bilibili embeds. Bilibili iframe embeds use public `bvid` metadata.

## Routes and 404 Behavior

With `trailingSlash: true`, generated pages should be available as:

```text
out/index.html
out/sheets/index.html
out/sheets/<slug>/index.html
out/about/index.html
out/404.html
```

Cloudflare should serve a 404 page when a path does not map to an asset.

## Deployment Checklist

Before deploy:

- `pnpm typecheck` passes.
- `pnpm lint` passes.
- `pnpm test` passes.
- `pnpm build` passes and creates `out/`.
- `pnpm start:static` serves home, library, at least one sheet detail, about, and 404 behavior.
- Bilibili iframe loads on the sample sheet with demo metadata.
- Search/filter works in the static preview.

## Common Failure Modes

### Dynamic route fails during export

Cause: `[slug]` route missing `generateStaticParams()`.

Fix: return every sheet slug from `getAllSheets()`.

### Image optimization error

Cause: using `next/image` without static export-compatible image config.

Fix: configure `images.unoptimized: true` or use plain `<img>`.

### Wrangler serves 404 for valid routes

Cause: missing trailing slash, wrong `out/` shape, or `wrangler.jsonc` points to wrong directory.

Fix: use `trailingSlash: true`, rebuild, and verify `assets.directory` is `./out`.

### Search works in dev but not after export

Cause: search depends on a runtime API or non-serializable data.

Fix: pass static serialized summaries into the client component or generate a static JSON file at build time.
