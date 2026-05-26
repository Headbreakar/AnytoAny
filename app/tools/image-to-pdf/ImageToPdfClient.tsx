"use client";

import { useEffect, useState } from "react";
import DropZone from "@/components/ui/DropZone";
import ProgressBar from "@/components/ui/ProgressBar";
import ErrorBanner from "@/components/ui/ErrorBanner";
import SuccessPanel from "@/components/ui/SuccessPanel";
import { imagesToPdf } from "@/lib/tools/imageToPdf";
import { ToolMeta } from "@/lib/seo/toolMeta";

interface ImageToPdfClientProps {
  tool: ToolMeta;
}

interface FileWithPreview {
  id: string;
  file: File;
  previewUrl: string;
}

export default function ImageToPdfClient({ tool }: ImageToPdfClientProps) {
  const [items, setItems] = useState<FileWithPreview[]>([]);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfName, setPdfName] = useState("document.pdf");
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [items, pdfUrl]);

  const handleFilesAccepted = (acceptedFiles: File[]) => {
    setError(null);
    setPdfUrl(null);

    const newItems = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setItems((prev) => [...prev, ...newItems]);
  };

  const handleFileRejected = (message: string, code: string) => {
    setError({ message, code });
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
    setPdfUrl(null);
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setItems(updated);
    setPdfUrl(null);
  };

  const generatePdf = async () => {
    if (items.length === 0) return;
    setConverting(true);
    setProgress(0);
    setError(null);

    try {
      const files = items.map((item) => item.file);
      const result = await imagesToPdf(files, (p) => setProgress(p));
      
      setPdfUrl(result.url);
      setConverting(false);

      // Guess name based on first file
      const firstFileName = files[0].name;
      const nameWithoutExt = firstFileName.substring(0, firstFileName.lastIndexOf("."));
      setPdfName(`${nameWithoutExt || "document"}_compiled.pdf`);
    } catch (err: any) {
      setConverting(false);
      setError({
        message: err.message || "An unexpected error occurred during PDF generation.",
        code: "CONVERSION_FAILED",
      });
    }
  };

  const resetWorkspace = () => {
    items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setItems([]);
    setPdfUrl(null);
    setConverting(false);
    setProgress(0);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone shown if no files or if we want to add more (via button) */}
      {items.length === 0 && !converting && (
        <DropZone
          allowedTypes={tool.allowedTypes}
          fileSizeCap={tool.fileSizeCap}
          onFilesAccepted={handleFilesAccepted}
          onFileRejected={handleFileRejected}
          label="drag & drop images here (JPG, PNG, WebP)"
          multiple={true}
        />
      )}

      {error && (
        <ErrorBanner
          message={error.message}
          code={error.code}
          onRetry={items.length > 0 ? generatePdf : undefined}
        />
      )}

      {/* Workspace Area with list of files */}
      {items.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-white text-base">
              Selected Images ({items.length})
            </h3>
            {!converting && !pdfUrl && (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.multiple = true;
                    input.accept = tool.allowedTypes.join(",");
                    input.onchange = (e: any) => {
                      if (e.target.files) handleFilesAccepted(Array.from(e.target.files));
                    };
                    input.click();
                  }}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  + Add Images
                </button>
                <button
                  onClick={resetWorkspace}
                  className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* List of images */}
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-white/5 gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Image Thumbnail */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.previewUrl}
                    alt="Preview"
                    className="h-12 w-12 rounded-lg object-cover bg-slate-800 border border-white/10 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate max-w-xs sm:max-w-md">
                      {item.file.name}
                    </p>
                    <p className="text-xxs text-slate-400 mt-0.5">
                      {(item.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>

                {/* Ordering & Delete Buttons */}
                {!converting && !pdfUrl && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => moveItem(index, "up")}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-white/5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Move Up"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveItem(index, "down")}
                      disabled={index === items.length - 1}
                      className="p-1 rounded hover:bg-white/5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Move Down"
                    >
                      ▼
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 rounded hover:bg-red-500/10 text-slate-400 hover:text-red-400 ml-1"
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Trigger */}
          {!converting && !pdfUrl && (
            <button
              onClick={generatePdf}
              className="w-full inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-secondary font-semibold text-white hover:opacity-95 shadow-lg shadow-primary/10 active:scale-98 transition-all"
            >
              Generate PDF ({items.length} image{items.length > 1 ? "s" : ""})
            </button>
          )}

          {/* Converting progress */}
          {converting && (
            <div className="p-6 rounded-xl bg-slate-900/20 border border-white/5">
              <ProgressBar progress={progress} label="Compiling images to PDF..." />
            </div>
          )}

          {/* Result download screen */}
          {pdfUrl && !converting && (
            <SuccessPanel
              fileUrl={pdfUrl}
              fileName={pdfName}
              downloadLabel="Download PDF"
              title="PDF compiled"
              subtitle={`Merged ${items.length} image${items.length > 1 ? "s" : ""} into one document.`}
              onReset={resetWorkspace}
              resetLabel="Start over"
            />
          )}
        </div>
      )}
    </div>
  );
}
