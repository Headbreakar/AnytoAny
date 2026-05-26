import { Metadata } from "next";
import { TOOLS } from "@/lib/seo/toolMeta";
import ToolPageShell from "@/components/layout/ToolPageShell";
import WordToPdfClient from "./WordToPdfClient";

const tool = TOOLS["word-to-pdf"];

export const metadata: Metadata = { title: tool.title, description: tool.description };

export default function WordToPdfPage() {
  return (
    <ToolPageShell
      tool={tool}
      title="Convert Word to PDF"
      subtitle="Turn DOCX documents into clean PDF files. Secure server processing with instant deletion after conversion."
      howToTitle="How to convert Word to PDF"
    >
      <WordToPdfClient tool={tool} />
    </ToolPageShell>
  );
}
