import { Metadata } from "next";
import { TOOLS } from "@/lib/seo/toolMeta";
import ToolPageShell from "@/components/layout/ToolPageShell";
import XlsxToCsvClient from "./XlsxToCsvClient";

const tool = TOOLS["xlsx-to-csv"];

export const metadata: Metadata = { title: tool.title, description: tool.description };

export default function XlsxToCsvPage() {
  return (
    <ToolPageShell
      tool={tool}
      title="Convert Excel XLSX to CSV"
      subtitle="Export any sheet from a workbook to CSV. Smart sheet picker for multi-tab files — all client-side."
      howToTitle="How to convert XLSX to CSV"
    >
      <XlsxToCsvClient tool={tool} />
    </ToolPageShell>
  );
}
