import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildSheetFacets, getSheetBySlug, getSheetSummaries } from "@/lib/content";

const realSongExpectations = [
  { slug: "all-the-time", title: "All the time", bvid: "BV1Pt4y1v7Bb", page: 6, pdf: "/assets/sheets/pdf/can-we-kiss-forever-all-the-time-booty-music-take-me-hand.pdf" },
  { slug: "booty-music", title: "Booty Music", pdf: "/assets/sheets/pdf/can-we-kiss-forever-all-the-time-booty-music-take-me-hand.pdf" },
  { slug: "can-we-kiss-forever", title: "Can We Kiss Forever", pdf: "/assets/sheets/pdf/can-we-kiss-forever-all-the-time-booty-music-take-me-hand.pdf" },
  { slug: "chun-jiao-yu-zhi-ming", title: "春娇与志明", bvid: "BV1YU4y1J7Af", page: 1, pdf: "/assets/sheets/pdf/monsters-way-back-home-chun-jiao-yu-zhi-ming-wan-feng.pdf" },
  { slug: "collapsing-world", title: "Collapsing World", pdf: "/assets/sheets/pdf/collapsing-world-creep-free-lucky-love-is-gone-wonderful-u.pdf" },
  { slug: "creep", title: "Creep", pdf: "/assets/sheets/pdf/collapsing-world-creep-free-lucky-love-is-gone-wonderful-u.pdf" },
  { slug: "dong-jing-bu-tai-re", title: "东京不太热", pdf: "/assets/sheets/pdf/last-reunion-san-ye-dong-jing-bu-tai-re.pdf" },
  { slug: "duan-xian", title: "断线", bvid: "BV1Pt4y1v7Bb", page: 8, pdf: "/assets/sheets/pdf/xiang-yu-zui-tian-qing-ge-duan-xian-mood.pdf" },
  { slug: "free-lucky", title: "Free Lucky", pdf: "/assets/sheets/pdf/collapsing-world-creep-free-lucky-love-is-gone-wonderful-u.pdf" },
  { slug: "haru-dorobou", title: "春泥棒", bvid: "BV1kzwpeaE4h", page: 1, pdf: "/assets/sheets/pdf/haru-dorobou.pdf" },
  { slug: "last-reunion", title: "Last Reunion", bvid: "BV1Pt4y1v7Bb", page: 10, pdf: "/assets/sheets/pdf/last-reunion-san-ye-dong-jing-bu-tai-re.pdf" },
  { slug: "love-is-gone", title: "Love is Gone", bvid: "BV1KM4y1V7zJ", page: 1, pdf: "/assets/sheets/pdf/collapsing-world-creep-free-lucky-love-is-gone-wonderful-u.pdf" },
  { slug: "merry-christmas-mr-lawrence", title: "Merry Christmas, Mr.Lawrence", bvid: "BV1S64y1H7bq", page: 1, pdf: "/assets/sheets/pdf/merry-christmas-mr-lawrence.pdf" },
  { slug: "monsters-love-you-3000", title: "Monsters | Love You 3000", bvid: "BV1pb4y1z7UU", page: 1, pdf: "/assets/sheets/pdf/monsters-way-back-home-chun-jiao-yu-zhi-ming-wan-feng.pdf" },
  { slug: "mood", title: "Mood", bvid: "BV1WQ4y1f7fr", page: 1, pdf: "/assets/sheets/pdf/xiang-yu-zui-tian-qing-ge-duan-xian-mood.pdf" },
  { slug: "pure-imagination", title: "Pure imagination", bvid: "BV1Pt4y1v7Bb", page: 5, pdf: "/assets/sheets/pdf/pure-imagination.pdf" },
  { slug: "san-ye", title: "三叶主题曲", pdf: "/assets/sheets/pdf/last-reunion-san-ye-dong-jing-bu-tai-re.pdf" },
  { slug: "take-me-hand", title: "Take Me Hand", pdf: "/assets/sheets/pdf/can-we-kiss-forever-all-the-time-booty-music-take-me-hand.pdf" },
  { slug: "the-right-path", title: "The Right Path", bvid: "BV1Pt4y1v7Bb", page: 1, pdf: "/assets/sheets/pdf/the-right-path.pdf" },
  { slug: "wan-feng", title: "晚风", bvid: "BV1154y1Y7Rn", page: 1, pdf: "/assets/sheets/pdf/monsters-way-back-home-chun-jiao-yu-zhi-ming-wan-feng.pdf" },
  { slug: "way-back-home", title: "Way Back Home", bvid: "BV15B4y147q8", page: 1, pdf: "/assets/sheets/pdf/monsters-way-back-home-chun-jiao-yu-zhi-ming-wan-feng.pdf" },
  { slug: "wonderful-u", title: "Wonderful U", bvid: "BV1ho4y1U7tK", page: 1, pdf: "/assets/sheets/pdf/collapsing-world-creep-free-lucky-love-is-gone-wonderful-u.pdf" },
  { slug: "xiang-yu", title: "像鱼", bvid: "BV1Pt4y1v7Bb", page: 7, pdf: "/assets/sheets/pdf/xiang-yu-zui-tian-qing-ge-duan-xian-mood.pdf" },
  { slug: "yan-dai-xie-jie", title: "烟袋斜街", bvid: "BV1Pt4y1v7Bb", page: 3, pdf: "/assets/sheets/pdf/yan-dai-xie-jie.pdf" },
  { slug: "zui-tian-qing-ge", title: "最甜情歌", bvid: "BV1XL411n7yR", page: 1, pdf: "/assets/sheets/pdf/xiang-yu-zui-tian-qing-ge-duan-xian-mood.pdf" }
] as const;

describe("sheet content loader", () => {
  it("loads only PDF-backed sheets and allows empty Markdown bodies", async () => {
    const summaries = await getSheetSummaries();
    const slugs = summaries.map((sheet) => sheet.slug).sort();

    expect(summaries).toHaveLength(realSongExpectations.length);
    expect(slugs).toEqual(expect.arrayContaining(realSongExpectations.map((song) => song.slug)));
    expect(slugs).not.toEqual(expect.arrayContaining([
      "demo-with-bilibili",
      "fingerstyle-arp-01",
      "hybrid-picking-study",
      "minor-pentatonic-lick-01",
      "percussive-strum-basic",
      "warmup-open-chords"
    ]));
    expect(summaries.every((sheet) => sheet.hasPdf && sheet.pdf && typeof sheet.preview === "string" && sheet.preview.endsWith(".png"))).toBe(true);
    expect(summaries.every((sheet) => !("source" in sheet) && !("updatedAt" in sheet))).toBe(true);

    const first = await getSheetBySlug("haru-dorobou");
    expect(first?.body).toBe("");
    expect(first?.html).toBe("");
    expect(first?.excerpt).toBe("");
  });

  it("maps each real song to validated Bilibili metadata and existing sheet assets", async () => {
    for (const expected of realSongExpectations) {
      const sheet = await getSheetBySlug(expected.slug);

      expect(sheet?.title).toBe(expected.title);
      if ("bvid" in expected) {
        expect(sheet?.bilibili).toMatchObject({ bvid: expected.bvid, page: expected.page, start: 0 });
        expect("title" in sheet!.bilibili!).toBe(false);
      } else {
        expect(sheet?.bilibili).toBeUndefined();
      }
      expect(sheet?.pdf).toBe(expected.pdf);
      expect(existsSync(path.join(process.cwd(), "public", expected.pdf.slice(1)))).toBe(true);
      expect(sheet?.preview).toBe(`/assets/sheets/previews/${expected.slug}.png`);
      expect(existsSync(path.join(process.cwd(), "public", sheet!.preview!.slice(1)))).toBe(true);
    }
  });

  it("keeps multi-song PDFs shared instead of duplicating attachment paths", async () => {
    const sheets = await Promise.all(realSongExpectations.map(({ slug }) => getSheetBySlug(slug)));
    const bySlug = new Map(sheets.map((sheet) => [sheet!.slug, sheet!]));

    expect(new Set(["love-is-gone", "wonderful-u", "collapsing-world", "creep", "free-lucky"].map((slug) => bySlug.get(slug)?.pdf))).toHaveLength(1);
    expect(new Set(["xiang-yu", "zui-tian-qing-ge", "duan-xian", "mood"].map((slug) => bySlug.get(slug)?.pdf))).toHaveLength(1);
    expect(new Set(["monsters-love-you-3000", "chun-jiao-yu-zhi-ming", "wan-feng", "way-back-home"].map((slug) => bySlug.get(slug)?.pdf))).toHaveLength(1);
    expect(new Set(["all-the-time", "can-we-kiss-forever", "booty-music", "take-me-hand"].map((slug) => bySlug.get(slug)?.pdf))).toHaveLength(1);
    expect(new Set(["last-reunion", "san-ye", "dong-jing-bu-tai-re"].map((slug) => bySlug.get(slug)?.pdf))).toHaveLength(1);
  });

  it("builds only simplified public facets", async () => {
    const facets = buildSheetFacets(await getSheetSummaries());

    expect(facets).toEqual({
      types: ["full-score", "lick"],
      tunings: ["E Standard"]
    });
    expect("difficulties" in facets).toBe(false);
    expect("tags" in facets).toBe(false);
    expect("techniques" in facets).toBe(false);
  });

  it("uses only simplified types and configured PNG previews", async () => {
    const summaries = await getSheetSummaries();

    expect(new Set(summaries.map((sheet) => sheet.type))).toEqual(new Set(["full-score", "lick"]));
    expect(summaries.every((sheet) => !("difficulty" in sheet) && !("tags" in sheet) && !("techniques" in sheet) && !("source" in sheet) && !("updatedAt" in sheet))).toBe(true);

    for (const expected of realSongExpectations) {
      const sheet = await getSheetBySlug(expected.slug);

      expect(["full-score", "lick"]).toContain(sheet?.type);
      expect(sheet?.preview).toBe(`/assets/sheets/previews/${expected.slug}.png`);
      expect(existsSync(path.join(process.cwd(), "public", sheet!.preview!.slice(1)))).toBe(true);
    }
  });

  it("returns a detail sheet with empty body fields", async () => {
    const sheet = await getSheetBySlug("haru-dorobou");

    expect(sheet?.html).toBe("");
    expect(sheet?.excerpt).toBe("");
    expect(sheet?.body).toBe("");
  });
});
