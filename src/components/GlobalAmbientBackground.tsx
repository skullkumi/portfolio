export function GlobalAmbientBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="ambient-css-bg absolute inset-0" />
      <div className="absolute inset-0 bg-[#04040a]/60" />
    </div>
  );
}
