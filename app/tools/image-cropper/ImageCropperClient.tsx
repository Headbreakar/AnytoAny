"use client";

import { useEffect, useRef, useState } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

import DropZone from "@/components/ui/DropZone";
import ProgressBar from "@/components/ui/ProgressBar";
import DownloadButton from "@/components/ui/DownloadButton";
import ErrorBanner from "@/components/ui/ErrorBanner";
import { getCroppedBlob } from "@/lib/tools/cropper";
import { ToolMeta } from "@/lib/seo/toolMeta";

interface ImageCropperClientProps {
  tool: ToolMeta;
}

const RATIOS = [
  { label: "Free Crop", value: NaN },
  { label: "1:1 Square", value: 1 },
  { label: "16:9 Widescreen", value: 16 / 9 },
  { label: "4:3 Standard", value: 4 / 3 },
  { label: "9:16 Portrait", value: 9 / 16 },
];

export default function ImageCropperClient({ tool }: ImageCropperClientProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number>(NaN);
  const [cropper, setCropper] = useState<Cropper | null>(null);
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);
  const [croppedName, setCroppedName] = useState("");
  const [cropping, setCropping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);

  const imageRef = useRef<HTMLImageElement>(null);

  // Initialize CropperJS on the image ref
  useEffect(() => {
    if (!fileUrl || !imageRef.current) return;

    // Destroy existing instance before creating a new one
    if (cropper) {
      cropper.destroy();
    }

    const instance = new Cropper(imageRef.current, {
      aspectRatio: aspectRatio,
      viewMode: 1,
      dragMode: "move",
      autoCropArea: 0.8,
      background: false,
      responsive: true,
      checkOrientation: false,
    });

    setCropper(instance);

    return () => {
      instance.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileUrl, aspectRatio]);

  const handleFilesAccepted = (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    setError(null);
    setCroppedUrl(null);

    const url = URL.createObjectURL(selectedFile);
    setFileUrl(url);
  };

  const handleFileRejected = (message: string, code: string) => {
    setError({ message, code });
  };

  const triggerCrop = async () => {
    if (!cropper || !file) return;
    setCropping(true);
    setProgress(20);

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? 90 : prev + 30));
      }, 50);

      const mimeType = file.type || "image/png";
      const extension = mimeType.split("/")[1] || "png";
      
      const result = await getCroppedBlob(cropper, mimeType);

      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        setCroppedUrl(result.url);
        setCropping(false);
        
        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf("."));
        setCroppedName(`${nameWithoutExt || "cropped"}_cropped.${extension}`);
      }, 150);

    } catch (err: any) {
      setCropping(false);
      setError({
        message: err.message || "Failed to crop image.",
        code: "CROP_FAILED",
      });
    }
  };

  const resetWorkspace = () => {
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    if (croppedUrl) URL.revokeObjectURL(croppedUrl);
    if (cropper) cropper.destroy();

    setFile(null);
    setFileUrl(null);
    setCropper(null);
    setCroppedUrl(null);
    setAspectRatio(NaN);
    setCropping(false);
    setProgress(0);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {!file && (
        <DropZone
          allowedTypes={tool.allowedTypes}
          fileSizeCap={tool.fileSizeCap}
          onFilesAccepted={handleFilesAccepted}
          onFileRejected={handleFileRejected}
          label="drag & drop an image to crop"
        />
      )}

      {error && (
        <ErrorBanner
          message={error.message}
          code={error.code}
          onRetry={file ? triggerCrop : undefined}
        />
      )}

      {file && fileUrl && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cropper Window */}
          <div className="lg:col-span-2 space-y-4">
            <div className="overflow-hidden rounded-xl border border-white/5 bg-slate-950/40 p-2 max-h-[500px] flex items-center justify-center">
              {!croppedUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  ref={imageRef}
                  src={fileUrl}
                  alt="Source file to crop"
                  className="max-w-full block max-h-[450px]"
                />
              ) : (
                <div className="text-center p-6 space-y-4">
                  <p className="text-xs text-slate-400">Cropped Result Preview</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={croppedUrl}
                    alt="Cropped output"
                    className="max-w-full rounded-lg border border-white/10 max-h-[350px] shadow-lg"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            <div className="rounded-xl border border-white/5 bg-slate-900/40 p-5 space-y-5">
              <h3 className="font-display font-bold text-white text-sm">Crop Configurations</h3>

              {/* Ratios selector */}
              {!croppedUrl && !cropping && (
                <div className="space-y-2.5">
                  <label className="text-xs text-slate-400 font-semibold tracking-wide">Aspect Ratio</label>
                  <div className="grid grid-cols-2 gap-2">
                    {RATIOS.map((ratio) => (
                      <button
                        key={ratio.label}
                        onClick={() => setAspectRatio(ratio.value)}
                        className={`rounded-lg py-2 px-3 text-xs font-semibold border transition-all ${
                          (isNaN(aspectRatio) && isNaN(ratio.value)) || aspectRatio === ratio.value
                            ? "bg-primary border-primary text-white shadow-md shadow-primary/10"
                            : "bg-slate-950/60 border-white/5 text-slate-400 hover:text-white hover:border-white/10"
                        }`}
                      >
                        {ratio.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* File Info */}
              <div className="text-xs space-y-1.5 border-t border-white/5 pt-4 text-slate-400">
                <p>
                  File: <strong className="text-slate-200">{file.name}</strong>
                </p>
                <p>
                  Size: <strong className="text-slate-200">{(file.size / 1024).toFixed(1)} KB</strong>
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {cropping && <ProgressBar progress={progress} label="Cropping your image..." />}

                {!croppedUrl && !cropping && (
                  <button
                    onClick={triggerCrop}
                    className="w-full inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-secondary font-semibold text-white hover:opacity-95 shadow-lg shadow-primary/10 active:scale-98 transition-all"
                  >
                    Crop Image
                  </button>
                )}

                {croppedUrl && !cropping && (
                  <div className="space-y-3">
                    <DownloadButton fileUrl={croppedUrl} fileName={croppedName} label="Download Crop" />
                    <button
                      onClick={() => setCroppedUrl(null)}
                      className="w-full inline-flex h-11 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all text-sm"
                    >
                      Adjust Crop
                    </button>
                  </div>
                )}

                <button
                  onClick={resetWorkspace}
                  className="w-full inline-flex h-11 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-all text-sm"
                >
                  {croppedUrl ? "Upload Another" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
