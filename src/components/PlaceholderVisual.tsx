"use client";

export function PlaceholderVisual({ label }: { label: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#06060e]">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 92, 154, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 210, 74, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          transform: "perspective(400px) rotateX(55deg) scale(2.2)",
          transformOrigin: "50% 100%",
        }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 51, 136, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 210, 74, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
          transform: "perspective(600px) rotateX(60deg) scale(1.8) translateY(10%)",
          transformOrigin: "50% 80%",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#04040a] to-transparent" />
      <div className="relative z-10 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent-amber/70">
          awaiting capture
        </p>
        <p className="mt-2 font-mono text-sm text-foreground/80">{label}</p>
        <div className="mx-auto mt-4 flex h-px w-20 overflow-hidden">
          <div className="h-full w-1/3 bg-accent-amber" />
          <div className="h-full w-1/3 bg-accent" />
          <div className="h-full w-1/3 bg-accent-magenta" />
        </div>
      </div>
    </div>
  );
}
