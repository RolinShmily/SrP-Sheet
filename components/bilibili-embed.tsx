import { buildBilibiliPlayerUrl } from "@/lib/bilibili";
import type { BilibiliVideo } from "@/lib/sheet-schema";

interface BilibiliEmbedProps {
  video: BilibiliVideo;
}

export function BilibiliEmbed({ video }: BilibiliEmbedProps) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-[var(--line)] bg-black shadow-[var(--shadow-soft)]">
      <div className="aspect-video">
        <iframe
          src={buildBilibiliPlayerUrl(video)}
          title={`Bilibili player ${video.bvid}`}
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
