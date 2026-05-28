import { FileText, X } from "lucide-react";

interface FileCardProps {
  file: File;
  onClear?: () => void;
  icon?: React.ReactNode;
}

export default function FileCard({ file, onClear, icon }: FileCardProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/50 border border-stone-900/15 animate-fade-in">
      <div className="flex items-center gap-3 min-w-0">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
          {icon ?? <FileText className="h-5 w-5" />}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-stone-900 truncate max-w-xs sm:max-w-md">
            {file.name}
          </p>
          <p className="text-xs text-stone-500 mt-0.5">
            {(file.size / 1024).toFixed(1)} KB
          </p>
        </div>
      </div>
      {onClear && (
        <button
          onClick={onClear}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </button>
      )}
    </div>
  );
}
