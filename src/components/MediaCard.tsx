"use client";

import { useEffect, useRef, useState } from "react";
import { ParallaxCard } from "./ParallaxCard";
import { PlaceholderVisual } from "./PlaceholderVisual";

type MediaCardProps = {
  title: string;
  description: string;
  tags: string[];
  videoSrc?: string;
  posterSrc?: string;
  aspect?: "video" | "wide";
  linkUrl?: string;
  linkLabel?: string;
};

export function MediaCard({
  title,
  description,
  tags,
  videoSrc,
  posterSrc,
  aspect = "video",
  linkUrl,
  linkLabel = "View",
}: MediaCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasVideo, setHasVideo] = useState(false);
  const [hasPoster, setHasPoster] = useState(false);

  useEffect(() => {
    setHasVideo(false);
    setHasPoster(false);

    if (videoSrc) {
      const video = document.createElement("video");
      video.src = videoSrc;
      video.onloadeddata = () => setHasVideo(true);
      video.onerror = () => setHasVideo(false);
    }

    if (posterSrc) {
      const img = new Image();
      img.src = posterSrc;
      img.onload = () => setHasPoster(true);
      img.onerror = () => setHasPoster(false);
    }
  }, [videoSrc, posterSrc]);

  const showPoster = !hasVideo && hasPoster;

  return (
    <ParallaxCard className="group relative" depth={10}>
      <article className="shadow-depth overflow-hidden rounded-2xl border border-border bg-card/90 backdrop-blur-sm transition-[border-color,box-shadow] duration-300 group-hover:border-accent-violet/25 group-hover:shadow-depth-lg">
        <div
          className={`relative overflow-hidden bg-[#080810] ${
            aspect === "wide" ? "aspect-[21/9]" : "aspect-video"
          }`}
        >
          {hasVideo ? (
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src={videoSrc}
              poster={posterSrc}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : showPoster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={posterSrc}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <PlaceholderVisual label={title} />
          )}
          <div className="scanline absolute inset-0" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent opacity-80" />
        </div>

        <div className="space-y-3 p-5 md:p-6">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-lg font-medium tracking-tight text-foreground md:text-xl">
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-muted">{description}</p>
          {linkUrl && (
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-accent transition hover:text-[#00f0d4]"
            >
              {linkLabel}
              <span aria-hidden>↗</span>
            </a>
          )}
          {!hasVideo && !showPoster && (
            <p className="font-mono text-xs text-accent-ice/70">
              → public/assets/ に MP4 を配置すると表示されます
            </p>
          )}
        </div>
      </article>
    </ParallaxCard>
  );
}
