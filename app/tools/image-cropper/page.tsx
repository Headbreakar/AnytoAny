import { Metadata } from "next";
import { TOOLS } from "@/lib/seo/toolMeta";
import ToolPageShell from "@/components/layout/ToolPageShell";
import ImageCropperClient from "./ImageCropperClient";

const tool = TOOLS["image-cropper"];

export const metadata: Metadata = { title: tool.title, description: tool.description };

export default function ImageCropperPage() {
  return (
    <ToolPageShell
      tool={tool}
      title="Crop Image Online"
      subtitle="Crop and resize with preset aspect ratios — 1:1, 16:9, 4:3, and more. Real-time preview in your browser."
      howToTitle="How to crop an image"
    >
      <ImageCropperClient tool={tool} />
    </ToolPageShell>
  );
}
