import { CheckCircle2 } from "lucide-react";
import DownloadButton from "@/components/ui/DownloadButton";

interface SuccessPanelProps {
  fileUrl: string;
  fileName: string;
  downloadLabel: string;
  title?: string;
  subtitle?: string;
  onReset: () => void;
  resetLabel?: string;
}

export default function SuccessPanel({
  fileUrl,
  fileName,
  downloadLabel,
  title = "Conversion complete",
  subtitle = "Your file is ready to download.",
  onReset,
  resetLabel = "Convert another",
}: SuccessPanelProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 border border-primary/20 text-center space-y-5 animate-scale-in">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 border border-primary/30">
        <CheckCircle2 className="h-7 w-7 text-primary" />
      </div>
      <div>
        <h4 className="font-display text-lg font-bold text-white">{title}</h4>
        <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
        <DownloadButton fileUrl={fileUrl} fileName={fileName} label={downloadLabel} />
        <button
          onClick={onReset}
          className="inline-flex h-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 px-6 font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200 text-sm w-full sm:w-auto"
        >
          {resetLabel}
        </button>
      </div>
    </div>
  );
}
