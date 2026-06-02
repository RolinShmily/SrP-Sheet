# 01 Product Requirements

## Scope

SrP-Sheet first release is a static resource site for guitar sheet examples and a small number of demonstration videos.

## User Stories

### Visitor

- As a visitor, I can see featured sheet examples on the home page so I know what the site offers.
- As a visitor, I can browse all sheet examples in one library page.
- As a visitor, I can filter sheets by difficulty, type, tuning, technique, and tag.
- As a visitor, I can search sheets by title, artist/source, summary, tags, techniques, and body excerpt.
- As a visitor, I can open a sheet detail page and read playing metadata, notes, and the sheet body.
- As a visitor, I can watch a Bilibili demo video embedded on a sheet detail page when one exists.
- As a visitor, I can distinguish beginner, intermediate, and advanced sheets quickly.
- As a visitor, I can access the site on desktop and mobile.

### Site Owner

- As the owner, I can add a new sheet by adding a Markdown file under `content/sheets/`.
- As the owner, I can attach a PDF or image by putting files under `public/assets/sheets/<slug>/` and referencing them in frontmatter.
- As the owner, I can add a Bilibili demo by adding a `bilibili` object to frontmatter.
- As the owner, I get build-time validation errors if sheet metadata is invalid.

## Functional Requirements

### Home Page

- Show a high-impact hero section with the SrP-Sheet identity.
- Show featured sheets.
- Show latest sheets.
- Show quick browsing links for difficulty and technique.
- Show a short explanation of what the site is and is not.

### Sheet Library Page

- Render all published sheets.
- Provide text search.
- Provide filters:
  - difficulty
  - sheet type
  - tuning
  - tags
  - techniques
  - has video
  - has PDF
- Provide deterministic sorting:
  - newest first
  - title A-Z
  - difficulty order
- Do not require a network request after the page loads.

### Sheet Detail Page

- Render one statically generated page per sheet.
- Show title, source/artist, summary, difficulty, type, key, tuning, capo, bpm, tags, and techniques.
- Render Markdown body as readable sheet content.
- Style chord/tab blocks distinctly.
- Render PDF/image links when present.
- Render Bilibili iframe when metadata exists.
- Show related sheets based on overlapping tags, techniques, type, or difficulty.

### Tags and Categories

- Provide tag-based or category-based navigation if the implementation cost is low after the main library is complete.
- The core requirement is that library filters work; separate tag pages are secondary.

### About Page

- Explain the site purpose.
- Explain how sheets are organized.
- Include contact/removal notice for rights concerns.

## Content Requirements

Seed the project with at least six realistic sample sheets:

1. A beginner chord progression example.
2. A beginner strumming pattern example.
3. An intermediate fingerstyle fragment.
4. An intermediate riff or lick.
5. An advanced technique example.
6. A sheet with a Bilibili demo embed.

Samples must be clearly marked as examples or original practice material unless the owner provides real authorized song content.

## Copyright and Rights Requirement

Because guitar sheets can involve copyrighted music, the first release must avoid positioning itself as an unauthorized download archive. Prefer original exercises, public-domain material, authorized arrangements, or short educational examples. Include a removal/contact note on the About page.

## Performance Requirements

- Static export only.
- No server round trip required for search/filter.
- Bilibili iframe must be lazy-loaded.
- Images must use static assets and explicit dimensions where practical.
- Avoid large client bundles. Only the library explorer should need client-side JavaScript.

## Accessibility Requirements

- Keyboard navigable filters and cards.
- Visible focus states.
- Semantic headings.
- Iframe title text for Bilibili embeds.
- Sufficient contrast for text and tags.
- No information conveyed by color alone.

## Browser Support

Support current stable versions of Chromium, Firefox, and Edge. Mobile layout must work on common phone widths.
