import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildSheetFacets, getSheetBySlug, getSheetSummaries } from "@/lib/content";

const realSongExpectations = [
  { slug: "haru-dorobou", title: "春泥棒", bvid: "BV1kzwpeaE4h", page: 1, pdf: "/assets/sheets/pdf/haru-dorobou.pdf" },
  { slug: "merry-christmas-mr-lawrence", title: "Merry Christmas, Mr.Lawrence", bvid: "BV1S64y1H7bq", page: 1, pdf: "/assets/sheets/pdf/merry-christmas-mr-lawrence.pdf" },
  { slug: "love-is-gone", title: "Love is Gone", bvid: "BV1KM4y1V7zJ", page: 1, pdf: "/assets/sheets/pdf/collapsing-world-creep-free-lucky-love-is-gone-wonderful-u.pdf" },
  { slug: "wonderful-u", title: "Wonderful U", bvid: "BV1ho4y1U7tK", page: 1, pdf: "/assets/sheets/pdf/collapsing-world-creep-free-lucky-love-is-gone-wonderful-u.pdf" },
  { slug: "monsters-love-you-3000", title: "Monsters | Love You 3000", bvid: "BV1pb4y1z7UU", page: 1, pdf: "/assets/sheets/pdf/monsters-way-back-home-chun-jiao-yu-zhi-ming-wan-feng.pdf" },
  { slug: "zui-tian-qing-ge", title: "最甜情歌", bvid: "BV1XL41fn7yR", page: 1, pdf: "/assets/sheets/pdf/xiang-yu-zui-tian-qing-ge-duan-xian-mood.pdf" },
  { slug: "mood", title: "Mood", bvid: "BV1WQ4y1f7fr", page: 1, pdf: "/assets/sheets/pdf/xiang-yu-zui-tian-qing-ge-duan-xian-mood.pdf" },
  { slug: "chun-jiao-yu-zhi-ming", title: "春娇与志明", bvid: "BV1YU4y1J7Af", page: 1, pdf: "/assets/sheets/pdf/monsters-way-back-home-chun-jiao-yu-zhi-ming-wan-feng.pdf" },
  { slug: "wan-feng", title: "晚风", bvid: "BV1154y1Y7Rn", page: 1, pdf: "/assets/sheets/pdf/monsters-way-back-home-chun-jiao-yu-zhi-ming-wan-feng.pdf" },
  { slug: "the-right-path", title: "The Right Path", bvid: "BV1Pt4y1v7Bb", page: 1, pdf: "/assets/sheets/pdf/the-right-path.pdf" },
  { slug: "yan-dai-xie-jie", title: "烟袋斜街", bvid: "BV1Pt4y1v7Bb", page: 3, pdf: "/assets/sheets/pdf/yan-dai-xie-jie.pdf" },
  { slug: "pure-imagination", title: "Pure imagination", bvid: "BV1Pt4y1v7Bb", page: 5, pdf: "/assets/sheets/pdf/pure-imagination.pdf" },
  { slug: "all-the-time", title: "All the time", bvid: "BV1Pt4y1v7Bb", page: 6, pdf: "/assets/sheets/pdf/can-we-kiss-forever-all-the-time-booty-music-take-me-hand.pdf" },
  { slug: "xiang-yu", title: "像鱼", bvid: "BV1Pt4y1v7Bb", page: 7, pdf: "/assets/sheets/pdf/xiang-yu-zui-tian-qing-ge-duan-xian-mood.pdf" },
  { slug: "duan-xian", title: "断线", bvid: "BV1Pt4y1v7Bb", page: 8, pdf: "/assets/sheets/pdf/xiang-yu-zui-tian-qing-ge-duan-xian-mood.pdf" },
  { slug: "last-reunion", title: "Last Reunion", bvid: "BV1Pt4y1v7Bb", page: 10, pdf: "/assets/sheets/pdf/last-reunion-san-ye-dong-jing-bu-tai-re.pdf" }
] as const;

describe("sheet content loader", () => {
  it("loads only PDF-backed sheets and allows empty Markdown bodies", async () => {
    const summaries = await getSheetSummaries();
    const slugs = summaries.map((sheet) => sheet.slug).sort();

    expect(summaries).toHaveLength(17);
    expect(slugs).toEqual(expect.arrayContaining([
      "warmup-open-chords",
      ...realSongExpectations.map((song) => song.slug)
    ]));
    expect(slugs).not.toEqual(expect.arrayContaining([
      "demo-with-bilibili",
      "fingerstyle-arp-01",
      "hybrid-picking-study",
      "minor-pentatonic-lick-01",
      "percussive-strum-basic"
    ]));
    expect(summaries.every((sheet) => sheet.hasPdf && sheet.pdf && sheet.preview?.endsWith(".png"))).toBe(true);

    const warmup = await getSheetBySlug("warmup-open-chords");
    expect(warmup?.body).toBe("");
    expect(warmup?.html).toBe("");
    expect(warmup?.excerpt).toBe("");
  });

  it("maps each real song to validated Bilibili metadata and an existing PDF asset", async () => {
    for (const expected of realSongExpectations) {
      const sheet = await getSheetBySlug(expected.slug);

      expect(sheet?.title).toBe(expected.title);
      expect(sheet?.bilibili).toMatchObject({ bvid: expected.bvid, page: expected.page, start: 0, title: expected.title });
      expect(sheet?.pdf).toBe(expected.pdf);
      expect(existsSync(path.join(process.cwd(), "public", expected.pdf.slice(1)))).toBe(true);
    }
  });

  it("keeps multi-song PDFs shared instead of duplicating attachment paths", async () => {
    const loveIsGone = await getSheetBySlug("love-is-gone");
    const wonderfulU = await getSheetBySlug("wonderful-u");
    const xiangYu = await getSheetBySlug("xiang-yu");
    const zuiTianQingGe = await getSheetBySlug("zui-tian-qing-ge");
    const duanXian = await getSheetBySlug("duan-xian");
    const mood = await getSheetBySlug("mood");
    const monsters = await getSheetBySlug("monsters-love-you-3000");
    const chunJiaoYuZhiMing = await getSheetBySlug("chun-jiao-yu-zhi-ming");
    const wanFeng = await getSheetBySlug("wan-feng");

    expect(loveIsGone?.pdf).toBe(wonderfulU?.pdf);
    expect(new Set([xiangYu?.pdf, zuiTianQingGe?.pdf, duanXian?.pdf, mood?.pdf])).toHaveLength(1);
    expect(new Set([monsters?.pdf, chunJiaoYuZhiMing?.pdf, wanFeng?.pdf])).toHaveLength(1);
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

  it("uses only simplified types and PNG previews", async () => {
    const summaries = await getSheetSummaries();

    expect(new Set(summaries.map((sheet) => sheet.type))).toEqual(new Set(["full-score", "lick"]));
    expect(summaries.every((sheet) => !("difficulty" in sheet) && !("tags" in sheet) && !("techniques" in sheet))).toBe(true);

    for (const expected of realSongExpectations) {
      const sheet = await getSheetBySlug(expected.slug);

      expect(sheet?.type).toBe("full-score");
      expect(sheet?.preview).toBe(expected.pdf.replace("/assets/sheets/pdf/", "/assets/sheets/previews/").replace(/\.pdf$/, ".png"));
    }
  });

  it("returns a detail sheet with empty body fields", async () => {
    const sheet = await getSheetBySlug("warmup-open-chords");

    expect(sheet?.html).toBe("");
    expect(sheet?.excerpt).toBe("");
    expect(sheet?.body).toBe("");
  });
});
