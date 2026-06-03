"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { TOOLS } from "@/lib/seo/toolMeta";
import ToolIcon from "@/components/ui/ToolIcon";
import { Search, Compass, ArrowRight, X } from "lucide-react";

type Category = "all" | "image" | "spreadsheet" | "document";

function ToolCatalogInner() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat === "image" || cat === "spreadsheet" || cat === "document") {
      setActiveCategory(cat);
    }
    const hashToCategory: Record<string, Category> = {
      images: "image",
      spreadsheets: "spreadsheet",
      documents: "document",
    };
    const hash = typeof window !== "undefined" ? window.location.hash.slice(1) : "";
    if (hashToCategory[hash]) {
      setActiveCategory(hashToCategory[hash]);
      setTimeout(() => {
        document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [searchParams]);

  const categories: { id: Category; name: string; count: number; sectionId?: string }[] = [
    { id: "all", name: "All Tools", count: Object.keys(TOOLS).length },
    {
      id: "image",
      name: "Images",
      count: Object.values(TOOLS).filter((t) => t.category === "image").length,
      sectionId: "images",
    },
    {
      id: "spreadsheet",
      name: "Spreadsheets",
      count: Object.values(TOOLS).filter((t) => t.category === "spreadsheet").length,
      sectionId: "spreadsheets",
    },
    {
      id: "document",
      name: "Documents",
      count: Object.values(TOOLS).filter((t) => t.category === "document").length,
      sectionId: "documents",
    },
  ];

  const filteredTools = Object.values(TOOLS).filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const badgeForCategory = (cat: string) => {
    if (cat === "image") return { label: "In-browser", class: "bg-emerald-50 text-emerald-700 border-emerald-200/60" };
    if (cat === "spreadsheet") return { label: "SheetJS", class: "bg-violet-50 text-violet-700 border-violet-200/60" };
    return { label: "Secure API", class: "bg-amber-50 text-amber-700 border-amber-200/60" };
  };

  return (
    <div className="w-full space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div
          className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-stone-900/5 border border-stone-900/10 backdrop-blur-sm"
          role="tablist"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-xl px-4 py-2.5 text-xs font-semibold tracking-wide transition-all duration-300 ${
                activeCategory === cat.id
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/15 scale-[1.02]"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-900/5"
              }`}
            >
              {cat.name}
              <span className="ml-1.5 opacity-60 font-normal">({cat.count})</span>
            </button>
          ))}
        </div>

        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools..."
            className="w-full rounded-xl border border-stone-900/10 bg-white/80 py-3 pl-10 pr-10 text-sm text-stone-900 placeholder-stone-400 focus:bg-white focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/10 shadow-sm transition-all duration-300"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-900 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool, index) => {
            const badge = badgeForCategory(tool.category);

            return (
              <div
                key={tool.slug}
                className="opacity-0-start animate-fade-in-up"
                style={{ animationDelay: `${Math.min(index * 60, 360)}ms` }}
              >
                <Link
                  href={`/tools/${tool.slug}`}
                  className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-stone-900/10 bg-white/70 p-6 backdrop-blur-sm transition-all duration-400 hover:-translate-y-1.5 hover:border-primary/25 hover:bg-white/90 hover:shadow-xl hover:shadow-primary/5 card-glow"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-5">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-900/5 border border-stone-900/10 group-hover:border-primary/30 group-hover:bg-primary/10 transition-all duration-300 group-hover:scale-110">
                        <ToolIcon
                          name={tool.icon}
                          className="h-6 w-6 text-stone-700 group-hover:text-primary transition-colors duration-300"
                        />
                      </span>
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${badge.class}`}
                      >
                        {badge.label}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-stone-900 group-hover:text-primary transition-colors duration-300">
                      {tool.name}
                    </h3>
                    <p className="mt-2 text-sm text-stone-600 leading-relaxed line-clamp-2">
                      {tool.description}
                    </p>
                  </div>

                  <div className="relative mt-6 flex items-center justify-between border-t border-stone-900/10 pt-4">
                    <span className="text-[11px] text-stone-500">
                      Max <strong className="text-stone-700">{tool.fileSizeCap}MB</strong>
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      Open
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-stone-900/15 bg-bg-card/20 animate-scale-in">
          <Compass className="h-12 w-12 text-slate-600 mb-4" />
          <h3 className="text-lg font-semibold text-stone-900">No tools found</h3>
          <p className="text-sm text-stone-600 mt-1 max-w-xs">
            Try a different search or category filter.
          </p>
        </div>
      )}

      {/* Anchor targets for header nav */}
      <div id="images" className="sr-only" aria-hidden />
      <div id="spreadsheets" className="sr-only" aria-hidden />
      <div id="documents" className="sr-only" aria-hidden />
    </div>
  );
}

export default function ToolCatalog() {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-stone-900/5" />}>
      <ToolCatalogInner />
    </Suspense>
  );
}
