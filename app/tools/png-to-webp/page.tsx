import { Metadata } from "next";
import { TOOLS } from "@/lib/seo/toolMeta";
import ToolPageShell from "@/components/layout/ToolPageShell";
import PngToWebpClient from "./PngToWebpClient";

const tool = TOOLS["png-to-webp"];

export const metadata: Metadata = { title: tool.title, description: tool.description };

export default function PngToWebpPage() {
  return (
    <ToolPageShell
      tool={tool}
      title="Convert PNG to WebP Online"
      subtitle="Convert PNG images into optimized, lightweight WebP files while preserving transparency. Fast, private, in-browser."
      howToTitle="How to convert PNG to WebP"
    >
      <PngToWebpClient tool={tool} />
    </ToolPageShell>
  );
}
