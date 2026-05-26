import { Metadata } from "next";
import { TOOLS } from "@/lib/seo/toolMeta";
import ToolPageShell from "@/components/layout/ToolPageShell";
import PdfToWordClient from "./PdfToWordClient";

const tool = TOOLS["pdf-to-word"];

export const metadata: Metadata = { title: tool.title, description: tool.description };

export default function PdfToWordPage() {
  return (
    <ToolPageShell
      tool={tool}
      title="Convert PDF to Word"
      subtitle="Extract PDF content into editable DOCX files. Secure conversion with formatting preserved where possible."
      howToTitle="How to convert PDF to Word"
    >
      <PdfToWordClient tool={tool} />
    </ToolPageShell>
  );
}
