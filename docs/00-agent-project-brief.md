# 00 Agent Project Brief

## Project Name

SrP-Sheet

## One-line Description

A designed, static Next.js site for sharing guitar sheet examples and a small set of embedded Bilibili demo videos.

## Product Positioning

SrP-Sheet is not a social platform and not a full music portfolio in its first release. It is a focused resource site for curated guitar sheet examples: searchable, readable, visually distinctive, and easy for the owner to maintain by adding Markdown files.

The site should feel like a small editorial music studio: part sheet archive, part practice notebook, part demo shelf.

## Primary Use Cases

1. A visitor browses guitar sheet examples by difficulty, tuning, tag, or technique.
2. A visitor searches for a specific phrase, song, riff, exercise, or tag.
3. A visitor opens a sheet detail page, reads metadata and playing notes, then studies the tab/chord content.
4. A visitor watches an embedded Bilibili demo video when available.
5. The site owner adds a new sheet by creating a Markdown file and optionally adding static assets.

## First Release Outcome

A development agent must create a complete static site that can be built with `next build`, produces an `out/` directory, and can be served/deployed by Wrangler to Cloudflare Workers Static Assets.

## Non-goals

- No account system.
- No user submissions.
- No comments.
- No backend CMS.
- No database.
- No server-side personalization.
- No paid downloads.
- No full music publishing platform.

## Success Criteria

The first release is successful when:

- The site has a polished visual identity rather than a generic template look.
- Sheet content is managed through Markdown files with validated metadata.
- Every sheet page is statically generated.
- Search and filters work without a server.
- Bilibili embeds are safe, lazy-loaded, and generated from validated metadata.
- Wrangler can serve the generated `out/` directory locally and deploy it to Cloudflare Workers.
