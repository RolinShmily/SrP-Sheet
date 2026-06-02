import { buildBilibiliPlayerUrl } from "@/lib/bilibili";
import type { BilibiliVideo } from "@/lib/sheet-schema";

interface BilibiliEmbedProps {
  video: BilibiliVideo;
}

export function BilibiliEmbed({ video }: BilibiliEmbedProps) {
  const titleId = `bilibili-${video.bvid}-${video.page}-${video.start}-title`;

  return (
    <section aria-labelledby={titleId} className="rounded-[28px] border border-[var(--line)] bg-[var(--paper-soft)] p-3 shadow-[var(--shadow-soft)]">
      <div className="mb-3 flex items-center justify-between gap-4 px-2 text-sm text-[var(--ink-muted)]">
        <span id={titleId}>演示视频：{video.title}</span>
        <span>Bilibili</span>
      </div>
      <div className="aspect-video overflow-hidden rounded-[22px] border border-[var(--line)] bg-black">
        <iframe
          src={buildBilibiliPlayerUrl(video)}
          title={video.title}
          loading="lazy"
          allow="fullscreen; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="h-full w-full"
        />
      </div>
    </section>
  );
}
