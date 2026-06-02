# 03 Content Model

## Overview

All sheet examples are Markdown files under `content/sheets/`. Each file has frontmatter validated at build time and a Markdown body rendered into the detail page.

The content model is intentionally small. It supports guitar sheet examples, short practice studies, riffs, chord progressions, and demo videos without becoming a full CMS.

## File Naming

Use kebab-case file names matching the slug:

```text
content/sheets/minor-pentatonic-lick-01.md
```

The frontmatter `slug` must match the file name without `.md`.

## Sheet Frontmatter

```yaml
title: "Minor Pentatonic Lick 01"
slug: "minor-pentatonic-lick-01"
type: "lick"
source: "Original Study"
summary: "A compact A minor pentatonic phrase for practicing slides and timing."
difficulty: "intermediate"
instrument: "electric-guitar"
tuning: "E Standard"
key: "A minor"
capo: null
bpm: 92
techniques:
  - "slide"
  - "alternate-picking"
tags:
  - "pentatonic"
  - "lead-guitar"
featured: true
publishedAt: "2026-06-02"
updatedAt: "2026-06-02"
cover: "/assets/sheets/minor-pentatonic-lick-01/cover.webp"
pdf: "/assets/sheets/minor-pentatonic-lick-01/sheet.pdf"
images:
  - src: "/assets/sheets/minor-pentatonic-lick-01/page-1.webp"
    alt: "Minor pentatonic lick sheet page one"
bilibili:
  bvid: "BV1B7411m7LV"
  page: 1
  start: 0
  title: "Minor Pentatonic Lick 01 demo"
rights: "Original educational example by site owner."
```

## Required Fields

- `title`: display title
- `slug`: route slug, kebab-case
- `type`: one of `exercise`, `riff`, `lick`, `song`, `arrangement`, `original`
- `summary`: one-sentence summary
- `difficulty`: one of `beginner`, `intermediate`, `advanced`
- `instrument`: one of `acoustic-guitar`, `electric-guitar`, `classical-guitar`, `bass`
- `tuning`: human-readable tuning label
- `techniques`: non-empty string array
- `tags`: non-empty string array
- `publishedAt`: ISO date string
- `updatedAt`: ISO date string
- `rights`: short rights/license note

## Optional Fields

- `source`: artist, source, or study origin
- `key`: musical key
- `capo`: string or null
- `bpm`: positive number
- `featured`: boolean, default false
- `cover`: static image path
- `pdf`: static PDF path
- `images`: array of `{ src, alt }`
- `bilibili`: validated video metadata

## TypeScript Shape

```ts
export type SheetType =
  | "exercise"
  | "riff"
  | "lick"
  | "song"
  | "arrangement"
  | "original";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type Instrument =
  | "acoustic-guitar"
  | "electric-guitar"
  | "classical-guitar"
  | "bass";

export interface BilibiliVideo {
  bvid: string;
  page: number;
  start: number;
  title: string;
}

export interface SheetImage {
  src: string;
  alt: string;
}

export interface Sheet {
  title: string;
  slug: string;
  type: SheetType;
  source?: string;
  summary: string;
  difficulty: Difficulty;
  instrument: Instrument;
  tuning: string;
  key?: string;
  capo?: string | null;
  bpm?: number;
  techniques: string[];
  tags: string[];
  featured: boolean;
  publishedAt: string;
  updatedAt: string;
  cover?: string;
  pdf?: string;
  images: SheetImage[];
  bilibili?: BilibiliVideo;
  rights: string;
  body: string;
  excerpt: string;
}
```

## Body Format

Use Markdown body for explanation and sheet notation.

Recommended structure:

```md
## Playing Notes

Keep the right hand relaxed and count sixteenth notes out loud before increasing speed.

## Chord Movement

| Bar | Chord | Note |
| --- | --- | --- |
| 1 | Am | Root position |
| 2 | G | Keep common finger |

## Sheet

```tab
e|-------------------------|
B|-------------------------|
G|-------5-7b9r7-5---------|
D|---5-7-----------7-5-----|
A|-7-------------------7---|
E|-------------------------|
```
```

## Validation Rules

- `slug` must be lowercase kebab-case.
- `publishedAt` and `updatedAt` must be valid dates.
- `updatedAt` must not be earlier than `publishedAt`.
- `techniques` and `tags` must be deduplicated and lowercase kebab-case.
- If `pdf` is present, it must start with `/assets/sheets/` and end with `.pdf`.
- If `cover` or image `src` is present, it must start with `/assets/sheets/`.
- If `bilibili` is present, `bvid` must match `^BV[0-9A-Za-z]{10}$`.
- Markdown body must not be empty.

## Search Index Fields

The client-side search index should include:

- title
- source
- summary
- type
- difficulty
- instrument
- tuning
- key
- techniques
- tags
- excerpt

Do not include full rendered HTML in the search index. Use a short plain-text excerpt derived from the Markdown body.

## Seed Content Guidance

Seed sheets should be original practice examples, not copyrighted full-song transcriptions. Use realistic musical terminology, but keep examples short enough to avoid rights ambiguity.
