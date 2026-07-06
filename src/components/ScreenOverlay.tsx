export function ScreenOverlay({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden
    >
      <div className="screen-scanlines absolute inset-0" />
      <div className="screen-grid absolute inset-0 opacity-[0.07]" />
      <div className="screen-vignette absolute inset-0" />
      <div className="screen-bezel absolute inset-0 rounded-[inherit]" />
    </div>
  );
}
