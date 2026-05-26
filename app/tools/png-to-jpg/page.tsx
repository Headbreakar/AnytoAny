import { Metadata } from "next";
import { TOOLS } from "@/lib/seo/toolMeta";
import ToolPageShell from "@/components/layout/ToolPageShell";
import PngToJpgClient from "./PngToJpgClient";

const tool = TOOLS["png-to-jpg"];

export const metadata: Metadata = { title: tool.title, description: tool.description };

export default function PngToJpgPage() {
  return (
    <ToolPageShell
      tool={tool}
      title="Convert PNG to JPG Online"
      subtitle="Turn PNG images into JPG with a clean white background for transparency. Fast, private, in-browser."
      howToTitle="How to convert PNG to JPG"
    >
      <PngToJpgClient tool={tool} />
    </ToolPageShell>
  );
}
