"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
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
  parallax?: boolean;
  parallaxDepth?: number;
};

function CardShell({
  parallax,
  parallaxDepth,
  children,
}: {
  parallax: boolean;
  parallaxDepth: number;
  children: ReactNode;
}) {
  if (parallax) {
    return (
      <ParallaxCard className="group relative" depth={parallaxDepth}>
        {children}
      </ParallaxCard>
    );
  }

  return <div className="group relative">{children}</div>;
}

export function MediaCard({
  title,
  description,
  tags,
  videoSrc,
  posterSrc,
  aspect = "video",
  linkUrl,
  linkLabel = "View",
  parallax = false,
  parallaxDepth = 6,
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
  const aspectClass = aspect === "wide" ? "aspect-[21/9]" : "aspect-video";

  const mediaInner = (
    <>
      {hasVideo ? (
        <video
          ref={videoRef}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
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
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />
      ) : (
        <PlaceholderVisual label={title} />
      )}
      <div className="scanline absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent opacity-80" />
    </>
  );

  return (
    <CardShell parallax={parallax} parallaxDepth={parallaxDepth}>
      <article className="shadow-depth overflow-hidden rounded-2xl border border-border bg-card/90 backdrop-blur-sm transition-[border-color,box-shadow] duration-300 group-hover:border-accent/30 group-hover:shadow-depth-lg">
        {linkUrl ? (
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`relative block overflow-hidden bg-[#080810] ${aspectClass} cursor-pointer`}
            aria-label={`${title}を開く`}
          >
            {mediaInner}
          </a>
        ) : (
          <div className={`relative overflow-hidden bg-[#080810] ${aspectClass}`}>
            {mediaInner}
          </div>
        )}

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
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-accent transition hover:text-accent-amber"
            >
              {linkLabel}
              <span aria-hidden>↗</span>
            </a>
          )}
          {!hasVideo && !showPoster && (
            <p className="font-mono text-xs text-accent-amber/70">
              → public/assets/ に MP4 を配置すると表示されます
            </p>
          )}
        </div>
      </article>
    </CardShell>
  );
}
