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

interface PdfToWordClientProps {
  tool: ToolMeta;
}

export default function PdfToWordClient({ tool }: PdfToWordClientProps) {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [docxUrl, setDocxUrl] = useState<string | null>(null);
  const [docxName, setDocxName] = useState("document.docx");
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

      const response = await fetch("/api/convert/pdf-to-word", {
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

      const docxBlob = await response.blob();
      const url = URL.createObjectURL(docxBlob);
      setProgress(100);

      setTimeout(() => {
        setDocxUrl(url);
        setConverting(false);
        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf("."));
        setDocxName(`${nameWithoutExt || "document"}.docx`);
      }, 150);
    } catch (err: unknown) {
      clearInterval(progressInterval);
      setConverting(false);
      setError({
        message: err instanceof Error ? err.message : "Failed to convert PDF to Word.",
        code: "CONVERSION_FAILED",
      });
    }
  };

  const resetWorkspace = () => {
    if (docxUrl) URL.revokeObjectURL(docxUrl);
    setFile(null);
    setDocxUrl(null);
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
            setDocxUrl(null);
          }}
          onFileRejected={(message, code) => setError({ message, code })}
          label="drag & drop PDF document"
        />
      )}

      {error && (
        <ErrorBanner message={error.message} code={error.code} onRetry={file ? triggerConversion : undefined} />
      )}

      {file && (
        <div className="space-y-6 animate-fade-in">
          <FileCard
            file={file}
            onClear={!converting && !docxUrl ? resetWorkspace : undefined}
            icon={<FileText className="h-5 w-5" />}
          />
          {converting && (
            <div className="p-6 rounded-xl bg-slate-900/30 border border-white/5">
              <ProgressBar progress={progress} label="Converting via secure API..." />
            </div>
          )}
          {!converting && !docxUrl && (
            <PrimaryButton onClick={triggerConversion}>Convert to Word</PrimaryButton>
          )}
          {docxUrl && !converting && (
            <SuccessPanel
              fileUrl={docxUrl}
              fileName={docxName}
              downloadLabel="Download DOCX"
              title="Word document ready"
              subtitle="Your editable DOCX file is ready to download."
              onReset={resetWorkspace}
            />
          )}
        </div>
      )}
    </div>
  );
}
