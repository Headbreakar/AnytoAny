"use client";

import { useState } from "react";
import DropZone from "@/components/ui/DropZone";
import ProgressBar from "@/components/ui/ProgressBar";
import ErrorBanner from "@/components/ui/ErrorBanner";
import SuccessPanel from "@/components/ui/SuccessPanel";
import { csvToXlsx } from "@/lib/tools/spreadsheet";
import { ToolMeta } from "@/lib/seo/toolMeta";

interface CsvToXlsxClientProps {
  tool: ToolMeta;
}

export default function CsvToXlsxClient({ tool }: CsvToXlsxClientProps) {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [xlsxUrl, setXlsxUrl] = useState<string | null>(null);
  const [xlsxName, setXlsxName] = useState("document.xlsx");
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);

  const handleFilesAccepted = async (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    setError(null);
    setXlsxUrl(null);
    setConverting(true);
    setProgress(15);

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 25;
        });
      }, 70);

      const result = await csvToXlsx(selectedFile);

      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        setConverting(false);
        setXlsxUrl(result.url);

        const nameWithoutExt = selectedFile.name.substring(0, selectedFile.name.lastIndexOf("."));
        setXlsxName(`${nameWithoutExt || "spreadsheet"}.xlsx`);
      }, 200);

    } catch (err: any) {
      setConverting(false);
      setError({
        message: err.message || "Failed to convert CSV to XLSX.",
        code: "CONVERSION_FAILED",
      });
    }
  };

  const handleFileRejected = (message: string, code: string) => {
    setError({ message, code });
  };

  const resetWorkspace = () => {
    if (xlsxUrl) URL.revokeObjectURL(xlsxUrl);
    setFile(null);
    setXlsxUrl(null);
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
          onFileRejected={handleFileRejected}
          label="drag & drop CSV file (.csv)"
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
        <div className="space-y-6">
          {/* File details panel */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/40 border border-white/5">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📈</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">
                  {file.name}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>

            {!converting && !xlsxUrl && (
              <button
                onClick={resetWorkspace}
                className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Clear File
              </button>
            )}
          </div>

          {/* Converting progress */}
          {converting && (
            <div className="p-6 rounded-xl bg-slate-900/20 border border-white/5">
              <ProgressBar progress={progress} label="Converting CSV to Excel workbook..." />
            </div>
          )}

          {/* Result download screen */}
          {xlsxUrl && !converting && (
            <SuccessPanel
              fileUrl={xlsxUrl}
              fileName={xlsxName}
              downloadLabel="Download Excel"
              onReset={resetWorkspace}
            />
          )}
        </div>
      )}
    </div>
  );
}
