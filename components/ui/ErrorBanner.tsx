import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorBannerProps {
  message: string;
  code?: string;
  onRetry?: () => void;
}

export default function ErrorBanner({ message, code, onRetry }: ErrorBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-red-500/25 bg-red-950/30 p-6 backdrop-blur-md animate-scale-in">
      <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-red-400 to-red-600" />
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-red-500/10 blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/15 text-red-400 border border-red-500/20">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <div>
            <h4 className="font-display font-semibold text-stone-900">Something went wrong</h4>
            <p className="mt-1 text-sm text-red-200/80">{message}</p>
            {code && (
              <span className="mt-2 inline-block rounded-md bg-red-950/80 px-2 py-0.5 text-[10px] font-mono tracking-wider text-red-400 uppercase border border-red-500/20">
                {code}
              </span>
            )}
          </div>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500/15 px-5 py-2.5 text-sm font-semibold text-red-200 hover:bg-red-500/25 border border-red-500/25 transition-all duration-200 active:scale-[0.98] shrink-0"
          >
            <RotateCcw className="h-4 w-4" />
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
