"use client";

import { useEffect, useState } from "react";
import DropZone from "@/components/ui/DropZone";
import ProgressBar from "@/components/ui/ProgressBar";
import DownloadButton from "@/components/ui/DownloadButton";
import ErrorBanner from "@/components/ui/ErrorBanner";
import { removeImageBackground } from "@/lib/tools/bgRemover";
import { ToolMeta } from "@/lib/seo/toolMeta";

interface BgRemoverClientProps {
  tool: ToolMeta;
}

export default function BgRemoverClient({ tool }: BgRemoverClientProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  
  const [processing, setProcessing] = useState(false);
  const [stepLabel, setStepLabel] = useState("Loading AI Engine...");
  const [progress, setProgress] = useState(0);

  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultName, setResultName] = useState("cutout.png");
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);

  const [sliderPosition, setSliderPosition] = useState(50);

  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [fileUrl, resultUrl]);

  const handleFilesAccepted = async (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    setError(null);
    setResultUrl(null);
    setProcessing(true);
    setProgress(5);
    setStepLabel("Loading AI Engine...");

    const inputUrl = URL.createObjectURL(selectedFile);
    setFileUrl(inputUrl);

    try {
      const result = await removeImageBackground(selectedFile, (step, percent) => {
        setProgress(percent);
        if (step === "fetch") {
          setStepLabel(`Downloading AI Model (${percent}%)...`);
        } else if (step === "onnx") {
          setStepLabel("Initializing AI Runtime...");
        } else {
          setStepLabel("Isolating Subject...");
        }
      });

      setResultUrl(result.url);
      setProcessing(false);

      const nameWithoutExt = selectedFile.name.substring(0, selectedFile.name.lastIndexOf("."));
      setResultName(`${nameWithoutExt || "cutout"}_nobg.png`);

    } catch (err: any) {
      setProcessing(false);
      setError({
        message: err.message || "Failed to remove background. Make sure WebAssembly is enabled in your browser.",
        code: "AI_PROCESSING_FAILED",
      });
    }
  };

  const handleFileRejected = (message: string, code: string) => {
    setError({ message, code });
  };

  const resetWorkspace = () => {
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);

    setFile(null);
    setFileUrl(null);
    setResultUrl(null);
    setProcessing(false);
    setProgress(0);
    setError(null);
    setSliderPosition(50);
  };

  return (
    <div className="space-y-6">
      {!file && !processing && (
        <DropZone
          allowedTypes={tool.allowedTypes}
          fileSizeCap={tool.fileSizeCap}
          onFilesAccepted={handleFilesAccepted}
          onFileRejected={handleFileRejected}
          label="drag & drop photo (JPG, PNG, WebP)"
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Visual Workspace (Slider Comparison / Preview) */}
          <div className="lg:col-span-2 space-y-4 flex flex-col items-center justify-center">
            {processing && (
              <div className="w-full p-8 rounded-xl bg-slate-900/20 border border-stone-900/15 space-y-4">
                <ProgressBar progress={progress} label={stepLabel} />
                <p className="text-xxs text-stone-500 text-center">
                  Note: The first run downloads a lightweight 7MB neural model. Subsequent runs are near instant.
                </p>
              </div>
            )}

            {!processing && fileUrl && (
              <div className="relative overflow-hidden w-full max-w-[450px] aspect-square rounded-2xl border border-stone-900/15 bg-slate-950/40 flex items-center justify-center">
                {resultUrl ? (
                  <>
                    {/* Checkered pattern background for transparency preview */}
                    <div 
                      className="absolute inset-0 opacity-15"
                      style={{
                        backgroundImage: "radial-gradient(#ffffff 20%, transparent 20%), radial-gradient(#ffffff 20%, transparent 20%)",
                        backgroundPosition: "0 0, 8px 8px",
                        backgroundSize: "16px 16px",
                      }}
                    />

                    {/* After Image underneath */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={resultUrl} alt="Background removed" className="absolute inset-0 w-full h-full object-contain p-2" />
                    
                    {/* Before Image on top, clipped */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={fileUrl} 
                      alt="Original" 
                      className="absolute inset-0 w-full h-full object-contain p-2 pointer-events-none" 
                      style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
                    />
                    
                    {/* Slider bar line */}
                    <div className="absolute inset-y-0 w-0.5 bg-white shadow-2xl pointer-events-none z-10" style={{ left: `${sliderPosition}%` }}>
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-900 font-bold shadow-xl border border-slate-200 text-xs">
                        ↔
                      </div>
                    </div>
                    
                    {/* Interactive transparent slider overlay */}
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      value={sliderPosition}
                      onChange={(e) => setSliderPosition(parseInt(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                    />
                  </>
                ) : (
                  // Original Preview before processing
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={fileUrl} alt="Preview" className="max-w-full rounded-lg object-contain max-h-[350px] p-2" />
                )}
              </div>
            )}
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            <div className="rounded-xl border border-stone-900/15 bg-slate-900/40 p-5 space-y-5">
              <h3 className="font-display font-bold text-stone-900 text-sm">Background Removal</h3>

              {resultUrl && (
                <div className="space-y-1 text-xs text-stone-600">
                  <p className="text-stone-900 font-semibold mb-2">Compare Result:</p>
                  <p><span className="text-primary font-semibold mr-1">&larr;</span> Left side: Original Image</p>
                  <p><span className="text-secondary font-semibold mr-1">&rarr;</span> Right side: Cutout Image</p>
                  <p className="mt-2 text-xxs text-primary font-medium">Use the visual slider to compare details.</p>
                </div>
              )}

              {/* File Info */}
              <div className="text-xs space-y-1.5 border-t border-stone-900/15 pt-4 text-stone-600">
                <p>
                  File: <strong className="text-slate-200">{file.name}</strong>
                </p>
                <p>
                  Size: <strong className="text-slate-200">{(file.size / 1024).toFixed(1)} KB</strong>
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {resultUrl && !processing && (
                  <DownloadButton fileUrl={resultUrl} fileName={resultName} label="Download Cutout" />
                )}

                <button
                  onClick={resetWorkspace}
                  disabled={processing}
                  className="w-full inline-flex h-11 items-center justify-center rounded-xl bg-stone-900/5 border border-stone-900/15 text-stone-700 hover:bg-stone-900/10 hover:text-stone-900 transition-all text-sm disabled:opacity-55 disabled:cursor-not-allowed"
                >
                  {resultUrl ? "Upload Another" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
