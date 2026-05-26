import { Metadata } from "next";
import { TOOLS } from "@/lib/seo/toolMeta";
import ToolPageShell from "@/components/layout/ToolPageShell";
import BgRemoverClient from "./BgRemoverClient";

const tool = TOOLS["background-remover"];

export const metadata: Metadata = { title: tool.title, description: tool.description };

export default function BackgroundRemoverPage() {
  return (
    <ToolPageShell
      tool={tool}
      title="AI Background Remover"
      subtitle="Remove image backgrounds in seconds using in-browser AI. No uploads — WASM runs locally on your device."
      howToTitle="How to remove backgrounds"
    >
      <BgRemoverClient tool={tool} />
    </ToolPageShell>
  );
}
