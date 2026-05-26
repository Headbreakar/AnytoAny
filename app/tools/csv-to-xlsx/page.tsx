import { Metadata } from "next";
import { TOOLS } from "@/lib/seo/toolMeta";
import ToolPageShell from "@/components/layout/ToolPageShell";
import CsvToXlsxClient from "./CsvToXlsxClient";

const tool = TOOLS["csv-to-xlsx"];

export const metadata: Metadata = { title: tool.title, description: tool.description };

export default function CsvToXlsxPage() {
  return (
    <ToolPageShell
      tool={tool}
      title="Convert CSV to Excel XLSX"
      subtitle="Turn raw CSV files into formatted Excel spreadsheets instantly. Your data never leaves the browser."
      howToTitle="How to convert CSV to Excel"
    >
      <CsvToXlsxClient tool={tool} />
    </ToolPageShell>
  );
}
