"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import DropZone from "@/components/ui/DropZone";
import ProgressBar from "@/components/ui/ProgressBar";
import ErrorBanner from "@/components/ui/ErrorBanner";
import FileCard from "@/components/ui/FileCard";
import SuccessPanel from "@/components/ui/SuccessPanel";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { ToolMeta } from "@/lib/seo/toolMeta";

interface WordToPdfClientProps {
  tool: ToolMeta;
}

export default function WordToPdfClient({ tool }: WordToPdfClientProps) {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfName, setPdfName] = useState("document.pdf");
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);

  const triggerConversion = async () => {
    if (!file) return;
    setConverting(true);
    setProgress(10);
    setError(null);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 90 : prev + 15));
    }, 150);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/convert/word-to-pdf", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        let errorData = { error: "An error occurred during document conversion." };
        try {
          errorData = await response.json();
        } catch {
          /* ignore */
        }
        throw new Error(errorData.error || "Server failed to process conversion.");
      }

      const pdfBlob = await response.blob();
      const url = URL.createObjectURL(pdfBlob);
      setProgress(100);

      setTimeout(() => {
        setPdfUrl(url);
        setConverting(false);
        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf("."));
        setPdfName(`${nameWithoutExt || "document"}.pdf`);
      }, 150);
    } catch (err: unknown) {
      clearInterval(progressInterval);
      setConverting(false);
      setError({
        message: err instanceof Error ? err.message : "Failed to convert Word document to PDF.",
        code: "CONVERSION_FAILED",
      });
    }
  };

  const resetWorkspace = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setFile(null);
    setPdfUrl(null);
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
          onFilesAccepted={(files) => {
            setFile(files[0]);
            setError(null);
            setPdfUrl(null);
          }}
          onFileRejected={(message, code) => setError({ message, code })}
          label="drag & drop Word document (.docx)"
        />
      )}

      {error && (
        <ErrorBanner message={error.message} code={error.code} onRetry={file ? triggerConversion : undefined} />
      )}

      {file && (
        <div className="space-y-6 animate-fade-in">
          <FileCard
            file={file}
            onClear={!converting && !pdfUrl ? resetWorkspace : undefined}
            icon={<FileText className="h-5 w-5" />}
          />

          {converting && (
            <div className="p-6 rounded-xl bg-slate-900/30 border border-stone-900/15">
              <ProgressBar progress={progress} label="Converting via secure API..." />
            </div>
          )}

          {!converting && !pdfUrl && (
            <PrimaryButton onClick={triggerConversion}>Convert to PDF</PrimaryButton>
          )}

          {pdfUrl && !converting && (
            <SuccessPanel
              fileUrl={pdfUrl}
              fileName={pdfName}
              downloadLabel="Download PDF"
              title="PDF ready"
              onReset={resetWorkspace}
            />
          )}
        </div>
      )}
    </div>
  );
}
