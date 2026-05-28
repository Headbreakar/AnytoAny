"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import DropZone from "@/components/ui/DropZone";
import ProgressBar from "@/components/ui/ProgressBar";
import ErrorBanner from "@/components/ui/ErrorBanner";
import FileCard from "@/components/ui/FileCard";
import SuccessPanel from "@/components/ui/SuccessPanel";
import { convertImageFormat } from "@/lib/tools/format";
import { ToolMeta } from "@/lib/seo/toolMeta";

interface JpgToPngClientProps {
  tool: ToolMeta;
}

export default function JpgToPngClient({ tool }: JpgToPngClientProps) {
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
    setProgress(10);

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 20;
        });
      }, 80);

      const result = await convertImageFormat(selectedFile, "image/png");
      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        setConverting(false);
        setConvertedUrl(result.url);
        const nameWithoutExt = selectedFile.name.substring(0, selectedFile.name.lastIndexOf("."));
        setConvertedName(`${nameWithoutExt || "converted"}.png`);
      }, 200);
    } catch (err: unknown) {
      setConverting(false);
      setError({
        message: err instanceof Error ? err.message : "An unexpected error occurred during conversion.",
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
          label="drag & drop your JPG image"
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
              <ProgressBar progress={progress} label="Converting JPG to PNG..." />
            </div>
          )}
          {convertedUrl && !converting && (
            <SuccessPanel
              fileUrl={convertedUrl}
              fileName={convertedName}
              downloadLabel="Download PNG"
              onReset={resetWorkspace}
            />
          )}
        </div>
      )}
    </div>
  );
}
