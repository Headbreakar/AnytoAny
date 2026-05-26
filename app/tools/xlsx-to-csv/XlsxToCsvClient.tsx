"use client";

import { useState } from "react";
import DropZone from "@/components/ui/DropZone";
import ProgressBar from "@/components/ui/ProgressBar";
import ErrorBanner from "@/components/ui/ErrorBanner";
import SuccessPanel from "@/components/ui/SuccessPanel";
import { getSheetNames, xlsxToCsv } from "@/lib/tools/spreadsheet";
import { ToolMeta } from "@/lib/seo/toolMeta";

interface XlsxToCsvClientProps {
  tool: ToolMeta;
}

export default function XlsxToCsvClient({ tool }: XlsxToCsvClientProps) {
  const [file, setFile] = useState<File | null>(null);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [csvUrl, setCsvUrl] = useState<string | null>(null);
  const [csvName, setCsvName] = useState("document.csv");
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);

  const handleFilesAccepted = async (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    setError(null);
    setCsvUrl(null);
    setConverting(true);
    setProgress(20);

    try {
      // Extract sheets first
      const sheets = await getSheetNames(selectedFile);
      setSheetNames(sheets);

      setConverting(false);

      if (sheets.length === 0) {
        throw new Error("No sheets found in Excel file.");
      } else if (sheets.length === 1) {
        // Just convert the single sheet immediately
        runConversion(selectedFile, sheets[0]);
      } else {
        // Show modal picker for multi-sheet workbooks
        setSelectedSheet(sheets[0]);
        setShowModal(true);
      }
    } catch (err: any) {
      setConverting(false);
      setError({
        message: err.message || "Failed to analyze Excel file.",
        code: "PARSE_FAILED",
      });
      setFile(null);
    }
  };

  const runConversion = async (targetFile: File, sheetName: string) => {
    setShowModal(false);
    setConverting(true);
    setProgress(40);

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? 90 : prev + 25));
      }, 60);

      const result = await xlsxToCsv(targetFile, sheetName);

      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        setConverting(false);
        setCsvUrl(result.url);
        
        // Output file name: originalName_sheetName.csv
        const originalName = targetFile.name.substring(0, targetFile.name.lastIndexOf("."));
        const sanitizedSheet = sheetName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
        setCsvName(`${originalName}_${sanitizedSheet}.csv`);
      }, 150);

    } catch (err: any) {
      setConverting(false);
      setError({
        message: err.message || "Conversion failed.",
        code: "CONVERSION_FAILED",
      });
    }
  };

  const handleFileRejected = (message: string, code: string) => {
    setError({ message, code });
  };

  const resetWorkspace = () => {
    if (csvUrl) URL.revokeObjectURL(csvUrl);
    setFile(null);
    setSheetNames([]);
    setSelectedSheet("");
    setShowModal(false);
    setCsvUrl(null);
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
          label="drag & drop Excel file (.xlsx)"
        />
      )}

      {error && (
        <ErrorBanner
          message={error.message}
          code={error.code}
          onRetry={file && selectedSheet ? () => runConversion(file, selectedSheet) : undefined}
        />
      )}

      {file && (
        <div className="space-y-6">
          {/* File details banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/40 border border-white/5">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📊</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">
                  {file.name}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {(file.size / 1024).toFixed(1)} KB • {sheetNames.length} sheet{sheetNames.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {!converting && !csvUrl && (
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
              <ProgressBar progress={progress} label="Converting Excel to CSV..." />
            </div>
          )}

          {/* Download block */}
          {csvUrl && !converting && (
            <SuccessPanel
              fileUrl={csvUrl}
              fileName={csvName}
              downloadLabel="Download CSV"
              title="Export complete"
              subtitle={`Sheet "${selectedSheet || sheetNames[0]}" converted successfully.`}
              onReset={resetWorkspace}
            />
          )}
        </div>
      )}

      {/* Sheet Picker Modal */}
      {showModal && file && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md glass-panel rounded-2xl p-6 shadow-2xl space-y-6 animate-scale-in border border-white/10">
            <div>
              <h3 className="font-display text-lg font-bold text-white">Select Worksheet</h3>
              <p className="text-xs text-slate-400 mt-1">
                Excel workbooks can contain multiple tables. Pick the sheet you want to export as a CSV:
              </p>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {sheetNames.map((sheet) => (
                <button
                  key={sheet}
                  onClick={() => setSelectedSheet(sheet)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                    selectedSheet === sheet
                      ? "border-primary bg-primary/10 text-primary font-bold"
                      : "border-white/5 bg-slate-950/40 text-slate-300 hover:border-white/10 hover:text-white"
                  }`}
                >
                  <span>📁 {sheet}</span>
                  {selectedSheet === sheet && <span className="text-primary font-bold">✓ Selected</span>}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => runConversion(file, selectedSheet)}
                className="flex-1 inline-flex h-10 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-secondary text-sm font-semibold text-white hover:opacity-95 transition-opacity"
              >
                Convert Sheet
              </button>
              <button
                onClick={resetWorkspace}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 px-4 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
