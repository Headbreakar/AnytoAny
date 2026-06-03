"use client";

import { useState } from "react";
import { Download, Check } from "lucide-react";

interface DownloadButtonProps {
  fileUrl: string | null;
  fileName: string;
  label?: string;
}

export default function DownloadButton({
  fileUrl,
  fileName,
  label = "Download File",
}: DownloadButtonProps) {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    if (!fileUrl) return;

    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  if (!fileUrl) return null;

  return (
    <button
      onClick={handleDownload}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 font-semibold text-white transition-all duration-300 active:scale-[0.97] shadow-lg min-w-[180px] ${
        downloaded
          ? "bg-emerald-600 shadow-emerald-500/25"
          : "btn-shimmer bg-gradient-to-r from-primary to-secondary hover:shadow-primary/30 hover:shadow-xl"
      }`}
    >
      {downloaded ? (
        <>
          <Check className="h-5 w-5" />
          Saved!
        </>
      ) : (
        <>
          <Download className="h-5 w-5" />
          {label}
        </>
      )}
    </button>
  );
}
