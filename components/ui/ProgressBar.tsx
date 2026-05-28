interface ProgressBarProps {
  progress: number;
  label?: string;
}

export default function ProgressBar({ progress, label }: ProgressBarProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-stone-700">{label || "Processing..."}</span>
        <span className="font-bold tabular-nums text-primary">{Math.round(clampedProgress)}%</span>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-800/80 border border-stone-900/15">
        <div
          className="relative h-full rounded-full bg-gradient-to-r from-primary via-emerald-400 to-secondary transition-all duration-500 ease-out progress-shine overflow-hidden"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}
