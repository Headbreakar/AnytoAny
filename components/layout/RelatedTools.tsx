import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TOOLS } from "@/lib/seo/toolMeta";
import ToolIcon from "@/components/ui/ToolIcon";

interface RelatedToolsProps {
  currentSlug: string;
  category: "image" | "spreadsheet" | "document";
}

export default function RelatedTools({ currentSlug, category }: RelatedToolsProps) {
  const related = Object.values(TOOLS)
    .filter((t) => t.category === category && t.slug !== currentSlug)
    .slice(0, 3);

  if (related.length < 3) {
    const extra = Object.values(TOOLS)
      .filter((t) => t.slug !== currentSlug && !related.includes(t))
      .slice(0, 3 - related.length);
    related.push(...extra);
  }

  return (
    <section className="border-t border-stone-900/15 pt-12">
      <h2 className="font-display text-2xl font-bold text-stone-900 mb-6">Related tools</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {related.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="group glass-panel glass-panel-hover rounded-2xl p-5 card-glow"
          >
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-900/5 border border-stone-900/15 group-hover:border-primary/30 group-hover:bg-primary/10 transition-all duration-300">
                <ToolIcon
                  name={tool.icon}
                  className="h-5 w-5 text-stone-600 group-hover:text-primary transition-colors"
                />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-display font-semibold text-stone-900 text-sm group-hover:text-primary transition-colors truncate">
                  {tool.name}
                </h3>
                <p className="mt-0.5 text-xs text-stone-500 line-clamp-1">{tool.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
