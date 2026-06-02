import type { BilibiliVideo } from "@/lib/sheet-schema";

export function buildBilibiliPlayerUrl(video: BilibiliVideo): string {
  const params = new URLSearchParams({
    bvid: video.bvid,
    p: String(video.page),
    t: String(video.start),
    autoplay: "0",
    danmaku: "0"
  });

  return `https://player.bilibili.com/player.html?${params.toString()}`;
}
