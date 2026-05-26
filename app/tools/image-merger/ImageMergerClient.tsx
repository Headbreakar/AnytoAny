"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import DropZone from "@/components/ui/DropZone";
import ProgressBar from "@/components/ui/ProgressBar";
import DownloadButton from "@/components/ui/DownloadButton";
import ErrorBanner from "@/components/ui/ErrorBanner";
import { mergeImages } from "@/lib/tools/merger";
import { ToolMeta } from "@/lib/seo/toolMeta";

interface ImageMergerClientProps {
  tool: ToolMeta;
}

interface FileWithPreview {
  id: string;
  file: File;
  previewUrl: string;
}

export default function ImageMergerClient({ tool }: ImageMergerClientProps) {
  const [items, setItems] = useState<FileWithPreview[]>([]);
  const [direction, setDirection] = useState<"vertical" | "horizontal">("horizontal");
  const [borderWidth, setBorderWidth] = useState(10);
  const [borderColor, setBorderColor] = useState("#000000");

  const [merging, setMerging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mergedUrl, setMergedUrl] = useState<string | null>(null);
  const [mergedName, setMergedName] = useState("merged.png");
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);

  useEffect(() => {
    return () => {
      items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      if (mergedUrl) URL.revokeObjectURL(mergedUrl);
    };
  }, [items, mergedUrl]);

  const handleFilesAccepted = (acceptedFiles: File[]) => {
    setError(null);
    setMergedUrl(null);

    const newItems = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setItems((prev) => [...prev, ...newItems].slice(0, 10)); // Limit to 10 files
  };

  const handleFileRejected = (message: string, code: string) => {
    setError({ message, code });
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((item) => item.id !== id);
    });
    setMergedUrl(null);
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setItems(updated);
    setMergedUrl(null);
  };

  const triggerMerge = async () => {
    if (items.length < 2) {
      setError({
        message: "Please upload at least 2 images to stitch them together.",
        code: "INSUFFICIENT_FILES",
      });
      return;
    }
    setMerging(true);
    setProgress(20);
    setError(null);

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? 90 : prev + 30));
      }, 50);

      const files = items.map((item) => item.file);
      const result = await mergeImages(files, { direction, borderWidth, borderColor });

      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        setMergedUrl(result.url);
        setMerging(false);

        const firstFileName = files[0].name;
        const nameWithoutExt = firstFileName.substring(0, firstFileName.lastIndexOf("."));
        setMergedName(`${nameWithoutExt || "stitch"}_merged.png`);
      }, 150);

    } catch (err: any) {
      setMerging(false);
      setError({
        message: err.message || "An unexpected error occurred during image merging.",
        code: "MERGE_FAILED",
      });
    }
  };

  const resetWorkspace = () => {
    items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    if (mergedUrl) URL.revokeObjectURL(mergedUrl);
    setItems([]);
    setMergedUrl(null);
    setMerging(false);
    setProgress(0);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {items.length === 0 && !merging && (
        <DropZone
          allowedTypes={tool.allowedTypes}
          fileSizeCap={tool.fileSizeCap}
          onFilesAccepted={handleFilesAccepted}
          onFileRejected={handleFileRejected}
          label="drag & drop images to stitch (max 10 images)"
          multiple={true}
        />
      )}

      {error && (
        <ErrorBanner
          message={error.message}
          code={error.code}
          onRetry={items.length >= 2 ? triggerMerge : undefined}
        />
      )}

      {items.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main workspace (image listing and preview) */}
          <div className="lg:col-span-2 space-y-6">
            {mergedUrl ? (
              <div className="overflow-hidden rounded-xl border border-primary/25 bg-gradient-to-br from-primary/10 to-secondary/5 p-6 flex flex-col items-center gap-4 text-center animate-scale-in">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 border border-primary/30">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-white">Stitch complete</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Your merged image is ready.</p>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mergedUrl}
                  alt="Stitched output preview"
                  className="max-w-full rounded-lg border border-white/10 max-h-[350px] shadow-lg"
                />
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-white/5 gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
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

                    {!merging && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => moveItem(index, "up")}
                          disabled={index === 0}
                          className="p-1 rounded hover:bg-white/5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => moveItem(index, "down")}
                          disabled={index === items.length - 1}
                          className="p-1 rounded hover:bg-white/5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                          ▼
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 rounded hover:bg-red-500/10 text-slate-400 hover:text-red-400 ml-1"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Settings panel */}
          <div className="space-y-6">
            <div className="rounded-xl border border-white/5 bg-slate-900/40 p-5 space-y-5">
              <h3 className="font-display font-bold text-white text-sm">Stitch Settings</h3>

              {!mergedUrl && !merging && (
                <>
                  {/* Layout Orientation */}
                  <div className="space-y-2.5">
                    <label className="text-xs text-slate-400 font-semibold tracking-wide">Direction</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDirection("horizontal")}
                        className={`flex-1 rounded-lg py-2 px-3 text-xs font-semibold border transition-all ${
                          direction === "horizontal"
                            ? "bg-primary border-primary text-white"
                            : "bg-slate-950/60 border-white/5 text-slate-400 hover:text-white"
                        }`}
                      >
                        Horizontal ➡️
                      </button>
                      <button
                        onClick={() => setDirection("vertical")}
                        className={`flex-1 rounded-lg py-2 px-3 text-xs font-semibold border transition-all ${
                          direction === "vertical"
                            ? "bg-primary border-primary text-white"
                            : "bg-slate-950/60 border-white/5 text-slate-400 hover:text-white"
                        }`}
                      >
                        Vertical ⬇️
                      </button>
                    </div>
                  </div>

                  {/* Border Width */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-400">Border Spacing</span>
                      <span className="text-primary">{borderWidth}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={borderWidth}
                      onChange={(e) => setBorderWidth(parseInt(e.target.value))}
                      className="w-full accent-primary bg-slate-950 rounded-lg h-2"
                    />
                  </div>

                  {/* Border Color */}
                  <div className="space-y-2.5">
                    <label className="text-xs text-slate-400 font-semibold tracking-wide">Border Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={borderColor}
                        onChange={(e) => setBorderColor(e.target.value)}
                        className="h-9 w-9 rounded-lg border border-white/10 bg-transparent cursor-pointer"
                      />
                      <span className="text-xs font-mono text-slate-400 uppercase">{borderColor}</span>
                    </div>
                  </div>
                </>
              )}

              {/* Action Trigger */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                {items.length > 0 && !mergedUrl && !merging && (
                  <div className="flex justify-between text-xxs text-slate-500 mb-2">
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
                      className="text-primary hover:underline font-semibold"
                    >
                      + Add More Images
                    </button>
                    <span>{items.length}/10 Images</span>
                  </div>
                )}

                {merging && <ProgressBar progress={progress} label="Merging your images..." />}

                {!mergedUrl && !merging && (
                  <button
                    onClick={triggerMerge}
                    disabled={items.length < 2}
                    className="w-full inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-secondary font-semibold text-white hover:opacity-95 shadow-lg shadow-primary/10 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    🔗 Stitch Images
                  </button>
                )}

                {mergedUrl && !merging && (
                  <div className="space-y-3">
                    <DownloadButton fileUrl={mergedUrl} fileName={mergedName} label="Download Merged" />
                    <button
                      onClick={() => setMergedUrl(null)}
                      className="w-full inline-flex h-11 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all text-sm"
                    >
                      Adjust Stitch
                    </button>
                  </div>
                )}

                <button
                  onClick={resetWorkspace}
                  className="w-full inline-flex h-11 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-all text-sm"
                >
                  {mergedUrl ? "Start Over" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
