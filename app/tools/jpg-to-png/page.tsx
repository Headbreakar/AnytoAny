import { Metadata } from "next";
import { TOOLS } from "@/lib/seo/toolMeta";
import ToolPageShell from "@/components/layout/ToolPageShell";
import JpgToPngClient from "./JpgToPngClient";

const tool = TOOLS["jpg-to-png"];

export const metadata: Metadata = {
  title: tool.title,
  description: tool.description,
};

export default function JpgToPngPage() {
  return (
    <ToolPageShell
      tool={tool}
      title="Convert JPG to PNG Online"
      subtitle="Convert JPEG images to high-quality PNG format. 100% private — processed entirely in your browser."
      howToTitle="How to convert JPG to PNG"
    >
      <JpgToPngClient tool={tool} />
    </ToolPageShell>
  );
}
