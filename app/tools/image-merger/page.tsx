import { Metadata } from "next";
import { TOOLS } from "@/lib/seo/toolMeta";
import ToolPageShell from "@/components/layout/ToolPageShell";
import ImageMergerClient from "./ImageMergerClient";

const tool = TOOLS["image-merger"];

export const metadata: Metadata = { title: tool.title, description: tool.description };

export default function ImageMergerPage() {
  return (
    <ToolPageShell
      tool={tool}
      title="Merge Images Online"
      subtitle="Stitch photos vertically or horizontally with custom borders and background colors. Up to 10 images."
      howToTitle="How to merge images"
    >
      <ImageMergerClient tool={tool} />
    </ToolPageShell>
  );
}
