import { Metadata } from "next";
import { TOOLS } from "@/lib/seo/toolMeta";
import ToolPageShell from "@/components/layout/ToolPageShell";
import ImageToPdfClient from "./ImageToPdfClient";

const tool = TOOLS["image-to-pdf"];

export const metadata: Metadata = { title: tool.title, description: tool.description };

export default function ImageToPdfPage() {
  return (
    <ToolPageShell
      tool={tool}
      title="Convert Images to PDF"
      subtitle="Combine JPG, PNG, or WebP images into a single PDF. Multi-page support, fully in your browser."
      howToTitle="How to convert images to PDF"
    >
      <ImageToPdfClient tool={tool} />
    </ToolPageShell>
  );
}
