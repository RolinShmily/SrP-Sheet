import { z } from "zod";

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const assetPath = z.string().regex(/^\/assets\/sheets\/.+/);
const pdfPath = z.string().regex(/^\/assets\/sheets\/.+\.pdf$/);
const previewPath = z.string().regex(/^\/assets\/sheets\/.+\.(?:png|jpg|jpeg|webp)$/);

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
    type: z.enum(["lick", "full-score"]),
    summary: z.string().min(1),
    instrument: z.enum(["acoustic-guitar", "electric-guitar", "classical-guitar", "bass"]),
    tuning: z.string().min(1),
    key: z.string().min(1).optional(),
    capo: z.string().min(1).nullable().optional(),
    bpm: z.number().positive().optional(),
    featured: z.boolean().default(false),
    publishedAt: dateString,
    updatedAt: dateString,
    cover: assetPath.optional(),
    pdf: pdfPath.optional(),
    preview: previewPath.optional(),
    images: z.array(sheetImageSchema).default([]),
    bilibili: bilibiliVideoSchema.optional(),
    rights: z.string().min(1)
  })
  .strict()
  .transform((sheet) => sheet)
  .superRefine((sheet, ctx) => {
    if (sheet.updatedAt < sheet.publishedAt) {
      ctx.addIssue({ code: "custom", path: ["updatedAt"], message: "updatedAt must not be earlier than publishedAt" });
    }
  });

export type BilibiliVideo = z.infer<typeof bilibiliVideoSchema>;
export type SheetFrontmatter = z.infer<typeof sheetFrontmatterSchema>;
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
