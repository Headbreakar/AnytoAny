import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { ToolMeta } from "@/lib/seo/toolMeta";
import RelatedTools from "@/components/layout/RelatedTools";
import HowToSchema from "@/components/seo/HowToSchema";
import ToolIcon from "@/components/ui/ToolIcon";

interface ToolPageShellProps {
  tool: ToolMeta;
  title: string;
  subtitle: string;
  howToTitle: string;
  children: React.ReactNode;
}

export default function ToolPageShell({
  tool,
  title,
  subtitle,
  howToTitle,
  children,
}: ToolPageShellProps) {
  const categoryLabel =
    tool.category === "image"
      ? "Browser · Canvas / AI"
      : tool.category === "spreadsheet"
        ? "Browser · SheetJS"
        : "Secure API";

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 sm:py-14">
      <HowToSchema name={tool.name} description={tool.description} steps={tool.howTo} />

      <Link
        href="/"
        className="opacity-0-start animate-fade-in inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors group mb-8"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 group-hover:border-primary/30 group-hover:bg-primary/10 transition-all duration-300">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        </span>
        Back to all tools
      </Link>

      <div className="space-y-10">
        <header className="opacity-0-start animate-fade-in-up delay-100 text-center sm:text-left space-y-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/25 px-3 py-1 text-xs font-semibold text-primary">
              <ToolIcon name={tool.icon} className="h-3.5 w-3.5" />
              {tool.name}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-medium text-slate-400">
              <Sparkles className="h-3 w-3 text-secondary" />
              {categoryLabel}
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        </header>

        <div className="opacity-0-start animate-fade-in-up delay-200 glass-panel rounded-2xl p-6 sm:p-8 card-glow">
          {children}
        </div>

        <section className="opacity-0-start animate-fade-in-up delay-300 section-glow pt-10 space-y-4">
          <h2 className="font-display text-xl font-bold text-white">{howToTitle}</h2>
          <ol className="space-y-3">
            {tool.howTo.map((step, idx) => (
              <li
                key={idx}
                className="flex gap-4 rounded-xl border border-white/5 bg-bg-card/30 p-4 text-sm text-slate-400 transition-colors hover:border-white/10 hover:bg-bg-card/50"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 text-xs font-bold text-primary border border-primary/20">
                  {idx + 1}
                </span>
                <span className="leading-relaxed pt-1">
                  <span className="text-white font-medium">
                    {step.includes(":") ? step.split(":")[0] + ":" : step}
                  </span>
                  {step.includes(":") ? step.split(":").slice(1).join(":") : ""}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section className="opacity-0-start animate-fade-in-up delay-400 space-y-5">
          <h2 className="font-display text-xl font-bold text-white text-center sm:text-left">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {tool.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="glass-panel glass-panel-hover rounded-xl p-5 space-y-2"
              >
                <h3 className="font-display font-semibold text-white text-sm">
                  {faq.question}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="opacity-0-start animate-fade-in-up delay-500">
          <RelatedTools currentSlug={tool.slug} category={tool.category} />
        </div>
      </div>
    </div>
  );
}
