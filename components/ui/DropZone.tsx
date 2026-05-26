"use client";

import React, { useRef, useState } from "react";
import { Upload, FileUp } from "lucide-react";

interface DropZoneProps {
  allowedTypes: string[];
  fileSizeCap: number;
  onFilesAccepted: (files: File[]) => void;
  onFileRejected: (errorMessage: string, errorCode: string) => void;
  label?: string;
  multiple?: boolean;
}

export default function DropZone({
  allowedTypes,
  fileSizeCap,
  onFilesAccepted,
  onFileRejected,
  label = "drag & drop files here",
  multiple = false,
}: DropZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const filesArray = Array.from(fileList);
    const acceptedFiles: File[] = [];

    for (const file of filesArray) {
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > fileSizeCap) {
        onFileRejected(
          `File "${file.name}" is too large (${fileSizeInMB.toFixed(1)}MB). Max size is ${fileSizeCap}MB.`,
          "FILE_TOO_LARGE"
        );
        return;
      }

      const isAllowed = allowedTypes.some((type) => {
        if (type.endsWith("/*")) {
          const category = type.split("/")[0];
          return file.type.startsWith(`${category}/`);
        }
        if (type.startsWith(".") && file.name.toLowerCase().endsWith(type.toLowerCase())) {
          return true;
        }
        return file.type === type;
      });

      const isSpreadsheetType = allowedTypes.some(
        (t) => t.includes("spreadsheet") || t.includes("excel") || t.includes("csv")
      );
      const extension = file.name.split(".").pop()?.toLowerCase();
      const isSpreadsheetExtension = ["xlsx", "xls", "csv"].includes(extension || "");

      if (!isAllowed && !(isSpreadsheetType && isSpreadsheetExtension)) {
        onFileRejected(
          `File "${file.name}" is not supported. Allowed formats: ${allowedTypes
            .map((t) =>
              t
                .replace(
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  ".xlsx"
                )
                .replace(
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  ".docx"
                )
                .replace("image/", "")
                .replace("text/csv", ".csv")
            )
            .join(", ")}`,
          "UNSUPPORTED_FORMAT"
        );
        return;
      }

      acceptedFiles.push(file);
      if (!multiple) break;
    }

    if (acceptedFiles.length > 0) {
      onFilesAccepted(acceptedFiles);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    processFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    processFiles(e.target.files);
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`group relative flex min-h-72 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-400 ${
        isDragActive
          ? "border-primary bg-primary/10 scale-[1.01] shadow-inner shadow-primary/10"
          : "border-white/10 bg-slate-900/30 hover:border-primary/40 hover:bg-slate-900/50 hover:shadow-xl hover:shadow-primary/5"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={allowedTypes.join(",")}
        onChange={handleChange}
        className="hidden"
      />

      <div
        className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border transition-all duration-400 ${
          isDragActive
            ? "scale-110 border-primary/40 bg-primary/20 text-primary"
            : "border-white/10 bg-white/5 text-slate-400 group-hover:scale-105 group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary"
        }`}
      >
        {isDragActive ? (
          <FileUp className="h-8 w-8 animate-bounce" />
        ) : (
          <Upload className="h-8 w-8" />
        )}
      </div>

      <p className="font-display text-lg font-semibold text-white tracking-wide">
        {isDragActive ? "Drop to upload" : "Click or " + label}
      </p>
      <p className="mt-2 text-sm text-slate-500">
        Maximum size:{" "}
        <span className="font-semibold text-slate-300">{fileSizeCap} MB</span>
      </p>

      <div
        className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-400 ${
          isDragActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
        style={{
          background:
            "radial-gradient(600px circle at 50% 50%, rgba(16,185,129,0.08), transparent 60%)",
        }}
      />
    </div>
  );
}
