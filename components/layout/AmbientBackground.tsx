export default function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.12),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_50%,rgba(139,92,246,0.08),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_30%_at_0%_80%,rgba(16,185,129,0.06),transparent)]" />

      {/* Animated orbs */}
      <div
        className="absolute -left-32 top-1/4 h-[420px] w-[420px] rounded-full bg-primary/10 blur-[100px] animate-float"
      />
      <div
        className="absolute -right-24 top-1/3 h-[380px] w-[380px] rounded-full bg-secondary/12 blur-[90px] animate-float-delayed"
      />
      <div
        className="absolute bottom-0 left-1/2 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-[80px] animate-glow"
      />

      {/* Grid */}
      <div className="absolute inset-0 mesh-grid opacity-60" />
    </div>
  );
}
