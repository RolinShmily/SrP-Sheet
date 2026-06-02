# 04 UI Design System

## Design Direction

SrP-Sheet should feel like a refined guitar practice desk: warm paper, dark ink, brass markers, wood shadows, and editorial layout. The interface should be calm enough for reading sheet content, but memorable enough that it does not look like a default SaaS template.

Design phrase:

> Editorial sheet archive meets late-night guitar studio.

## Visual Principles

1. **Readable first**: sheet and tab content must be comfortable to read.
2. **Designed, not decorated**: visual details must support the music/archive identity.
3. **Texture over gradients**: use paper grain, ruled-line motifs, thin borders, and layered cards instead of generic gradient blobs.
4. **Strong hierarchy**: page titles, metadata, filters, and sheet notation must be visually distinct.
5. **Small moments of craft**: hover states, focus rings, section dividers, and badges should feel intentional.

## Palette

Use CSS variables in `app/globals.css`.

```css
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
```

### Usage

- Page background: `--paper` with subtle grain/ruled-line overlay.
- Main content surfaces: `--paper-soft`.
- Primary text: `--ink`.
- Secondary text: `--ink-muted`.
- Primary accent: `--wood`.
- Highlight accent: `--brass`.
- Difficulty colors:
  - beginner: sage
  - intermediate: brass
  - advanced: wine

## Typography

Avoid generic default UI typography. Use locally configured Google fonts or self-hosted fonts.

Recommended pairing:

- Display: `Fraunces` or `Instrument Serif`
- Body/UI: `Source Serif 4` or `IBM Plex Sans`
- Notation/code: `JetBrains Mono` or `Fragment Mono`

Implementation recommendation:

- Use `next/font/google` if acceptable for build-time font fetching.
- If the agent needs offline reliability, self-host fonts under `public/assets/fonts/`.

Type scale:

```text
Hero title: clamp(3.2rem, 9vw, 7.5rem)
Page title: clamp(2.4rem, 6vw, 5rem)
Section title: 1.5rem - 2rem
Card title: 1.125rem - 1.5rem
Body: 1rem - 1.125rem
Metadata: 0.8rem - 0.95rem
Notation: 0.92rem - 1rem monospace
```

## Layout Language

### Global Shell

- Max content width: 1180px.
- Wide hero sections may use full viewport width with centered inner content.
- Use asymmetric grid on desktop: e.g. hero copy on left, stacked sheet cards / notation preview on right.
- Use generous vertical spacing between major sections.
- Mobile layout must collapse to a single readable column.

### Background Treatment

Create a subtle sheet-paper background:

```css
body {
  background:
    linear-gradient(rgba(31, 33, 28, 0.035) 1px, transparent 1px),
    radial-gradient(circle at 20% 10%, rgba(184, 133, 47, 0.18), transparent 32rem),
    var(--paper);
  background-size: 100% 32px, auto, auto;
}
```

Add a low-opacity grain pseudo-element if implemented carefully. Do not use large image assets just for noise.

## Component Style Notes

### Header

- Sticky or fixed-on-scroll is optional.
- Use thin borders and warm translucent background.
- Navigation should be small, precise, and editorial.
- Active link indicator can be a brass underline or small chord-dot marker.

### Hero

Must have a memorable visual element:

- Oversized `SrP-Sheet` wordmark.
- A tilted sheet card showing fake notation lines.
- Small floating metadata labels like `E Standard`, `Bilibili Demo`, `Fingerstyle`.
- Use controlled asymmetry.

### Sheet Cards

Cards should feel like small annotated paper slips:

- Slight off-white background.
- Thin ink border.
- Top metadata row.
- Difficulty badge.
- Tags as small stamped labels.
- Hover: lift slightly, deepen shadow, brass corner marker appears.

### Sheet Detail

Sheet detail must prioritize reading:

- Title block with metadata grid.
- Sticky side index is optional on desktop.
- Markdown content should use strong typography and spacing.
- Tab/code blocks should look like notation paper: monospace, ruled background, rounded border, horizontal overflow.

### Filters

Filters should feel tactile, like studio labels:

- Toggle chips with border and subtle pressed state.
- Clear active state.
- Keyboard focus ring visible.

### Bilibili Embed

- Use a designed frame instead of dropping an iframe raw into the page.
- Maintain 16:9 aspect ratio.
- Label the frame as `演示视频` or content-specific title.
- Lazy load iframe.
- Do not autoplay.
- Disable danmaku by default using query parameter where possible.

## Motion

Use restraint:

- Page load: subtle staggered fade/slide for hero and cards.
- Hover: transform and shadow on cards.
- Filter changes: avoid heavy animation; quick opacity/position transitions are enough.
- Respect `prefers-reduced-motion`.

Example:

```css
@media (prefers-reduced-motion: no-preference) {
  .reveal {
    animation: reveal-up 560ms cubic-bezier(.2,.8,.2,1) both;
  }

  @keyframes reveal-up {
    from { opacity: 0; transform: translateY(14px); }
    to { opacity: 1; transform: translateY(0); }
  }
}
```

## Accessibility Requirements

- Contrast must be checked for all badges and chips.
- Focus state must be visible on links, buttons, cards, and filter controls.
- Cards that navigate should use real links, not clickable divs.
- Iframes must have descriptive `title` attributes.
- Decorative visual notation must be `aria-hidden="true"`.

## Things To Avoid

- Purple-blue gradient hero.
- Generic white cards on gray background.
- Default `Inter`-only SaaS look.
- Overloaded animations.
- Small low-contrast text in sheet body.
- Raw iframes without a styled container.
