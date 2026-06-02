import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BilibiliEmbed } from "@/components/bilibili-embed";
import { buildBilibiliPlayerUrl } from "@/lib/bilibili";
import { bilibiliVideoSchema } from "@/lib/sheet-schema";

describe("buildBilibiliPlayerUrl", () => {
  it("builds a player URL from a valid BVID", () => {
    expect(buildBilibiliPlayerUrl({ bvid: "BV1B7411m7LV", page: 1, start: 0, title: "Demo" })).toBe(
      "https://player.bilibili.com/player.html?bvid=BV1B7411m7LV&p=1&t=0&autoplay=0&danmaku=0"
    );
  });

  it("includes page and start time", () => {
    const url = buildBilibiliPlayerUrl({ bvid: "BV1B7411m7LV", page: 2, start: 35, title: "Demo" });
    expect(url).toContain("p=2");
    expect(url).toContain("t=35");
  });

  it("always disables autoplay and danmaku", () => {
    const url = buildBilibiliPlayerUrl({ bvid: "BV1B7411m7LV", page: 1, start: 0, title: "Demo" });
    expect(url).toContain("autoplay=0");
    expect(url).toContain("danmaku=0");
  });

  it("rejects invalid BVID metadata through schema validation", () => {
    expect(() => bilibiliVideoSchema.parse({ bvid: "BVbad", page: 1, start: 0, title: "Demo" })).toThrow();
  });
});

describe("BilibiliEmbed", () => {
  it("labels the video region and iframe with the video title", () => {
    const html = renderToStaticMarkup(createElement(BilibiliEmbed, { video: { bvid: "BV1B7411m7LV", page: 1, start: 0, title: "Demo title" } }));

    expect(html).toContain("aria-labelledby=\"bilibili-BV1B7411m7LV-1-0-title\"");
    expect(html).toContain("id=\"bilibili-BV1B7411m7LV-1-0-title\"");
    expect(html).toContain("演示视频：Demo title");
    expect(html).toContain("title=\"Demo title\"");
    expect(html).toContain("loading=\"lazy\"");
    expect(html).toContain("referrerPolicy=\"strict-origin-when-cross-origin\"");
  });
});
