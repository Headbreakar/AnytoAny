import { Metadata } from "next";
import { TOOLS } from "@/lib/seo/toolMeta";
import ToolPageShell from "@/components/layout/ToolPageShell";
import PngToSvgClient from "./PngToSvgClient";

const tool = TOOLS["png-to-svg"];

export const metadata: Metadata = { title: tool.title, description: tool.description };

export default function PngToSvgPage() {
  return (
    <ToolPageShell
      tool={tool}
      title="Convert PNG to SVG Online"
      subtitle="Vectorize raster PNG images into clean, scalable SVG paths. Fast, private, fully in-browser."
      howToTitle="How to convert PNG to SVG"
    >
      <PngToSvgClient tool={tool} />
    </ToolPageShell>
  );
}
