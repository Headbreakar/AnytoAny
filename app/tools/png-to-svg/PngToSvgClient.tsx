"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import DropZone from "@/components/ui/DropZone";
import ProgressBar from "@/components/ui/ProgressBar";
import ErrorBanner from "@/components/ui/ErrorBanner";
import FileCard from "@/components/ui/FileCard";
import SuccessPanel from "@/components/ui/SuccessPanel";
import { convertPngToSvg } from "@/lib/tools/svgConverter";
import { ToolMeta } from "@/lib/seo/toolMeta";

interface PngToSvgClientProps {
  tool: ToolMeta;
}

export default function PngToSvgClient({ tool }: PngToSvgClientProps) {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [convertedName, setConvertedName] = useState("");
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);

  const handleFilesAccepted = async (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    setError(null);
    setConvertedUrl(null);
    setConverting(true);
    setProgress(15);

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 85) {
            clearInterval(progressInterval);
            return 85;
          }
          return prev + 15;
        });
      }, 150);

      const result = await convertPngToSvg(selectedFile);
      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        setConverting(false);
        setConvertedUrl(result.url);
        const nameWithoutExt = selectedFile.name.substring(0, selectedFile.name.lastIndexOf("."));
        setConvertedName(`${nameWithoutExt || "vector"}.svg`);
      }, 200);
    } catch (err: unknown) {
      setConverting(false);
      setError({
        message: err instanceof Error ? err.message : "Vector tracing failed.",
        code: "CONVERSION_FAILED",
      });
    }
  };

  const resetWorkspace = () => {
    if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    setFile(null);
    setConvertedUrl(null);
    setConverting(false);
    setProgress(0);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {!file && !converting && (
        <DropZone
          allowedTypes={tool.allowedTypes}
          fileSizeCap={tool.fileSizeCap}
          onFilesAccepted={handleFilesAccepted}
          onFileRejected={(message, code) => setError({ message, code })}
          label="drag & drop your PNG image to vectorize"
        />
      )}

      {error && (
        <ErrorBanner
          message={error.message}
          code={error.code}
          onRetry={file ? () => handleFilesAccepted([file]) : undefined}
        />
      )}

      {file && (
        <div className="space-y-6 animate-fade-in">
          <FileCard file={file} onClear={!converting && !convertedUrl ? resetWorkspace : undefined} icon={<ImageIcon className="h-5 w-5" />} />
          {converting && (
            <div className="p-6 rounded-xl bg-slate-900/30 border border-stone-900/15">
              <ProgressBar progress={progress} label="Tracing vector paths & generating SVG..." />
            </div>
          )}
          {convertedUrl && !converting && (
            <SuccessPanel
              fileUrl={convertedUrl}
              fileName={convertedName}
              downloadLabel="Download SVG Vector"
              onReset={resetWorkspace}
            />
          )}
        </div>
      )}
    </div>
  );
}
