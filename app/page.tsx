import ToolCatalog from "@/components/ui/ToolCatalog";
import { Shield, Zap, Sparkles, Lock, Cpu, Globe } from "lucide-react";

export default function Home() {
  const faqs = [
    {
      q: "How does AnytoAny convert files so quickly?",
      a: "AnytoAny uses client-side technologies like HTML5 Canvas, WebAssembly, and in-browser AI. Conversion runs on your device, so there is no upload queue or server wait time for most tools.",
    },
    {
      q: "Are my files safe and private?",
      a: "For image and spreadsheet tools, files never leave your computer. Document conversions (Word/PDF) are sent over HTTPS, processed in memory, and not stored.",
    },
    {
      q: "Is there a limit on conversions?",
      a: "Local tools are unlimited. Cloud document APIs are rate-limited to 20 operations per hour per IP to prevent abuse.",
    },
    {
      q: "Does it work on mobile?",
      a: "Yes. AnytoAny is fully responsive on phones, tablets, and desktops — no app install required.",
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Absolute Privacy",
      desc: "Most tools process files entirely in your browser. Your data stays on your device.",
      accent: "text-primary",
      glow: "from-primary/20",
    },
    {
      icon: Zap,
      title: "Instant Results",
      desc: "No upload queues. Drop a file, convert, and download in seconds.",
      accent: "text-secondary",
      glow: "from-secondary/20",
    },
    {
      icon: Sparkles,
      title: "Premium Features",
      desc: "AI background removal, multi-sheet Excel export, image merging — all free.",
      accent: "text-primary",
      glow: "from-primary/20",
    },
  ];

  const stats = [
    { value: "10+", label: "Free tools" },
    { value: "80%", label: "Client-side" },
    { value: "0", label: "Sign-up required" },
  ];

  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero */}
      <section className="relative w-full px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28 max-w-7xl mx-auto">
        <div className="text-center space-y-8 max-w-3xl mx-auto">
          <div className="opacity-0-start animate-fade-in inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Free · Private · No install
          </div>

          <h1 className="opacity-0-start animate-fade-in-up delay-100 font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-white">
            Convert anything to{" "}
            <span className="text-gradient">any format</span>
          </h1>

          <p className="opacity-0-start animate-fade-in-up delay-200 text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
            The ultimate browser-based suite for file conversion and image editing.
            Fast, private, and professional — right in your tab.
          </p>

          <div className="opacity-0-start animate-fade-in-up delay-300 flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-2">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-2xl sm:text-3xl font-black text-white">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="opacity-0-start animate-fade-in-up delay-400 flex flex-wrap justify-center gap-3 pt-2">
            {[
              { icon: Lock, text: "Local processing" },
              { icon: Cpu, text: "WASM-powered AI" },
              { icon: Globe, text: "Works everywhere" },
            ].map((badge) => (
              <span
                key={badge.text}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-slate-400"
              >
                <badge.icon className="h-3.5 w-3.5 text-primary/80" />
                {badge.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Tool catalog */}
      <section
        id="tools"
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 section-glow pt-4"
      >
        <div className="opacity-0-start animate-fade-in-up delay-300 mb-10 text-center sm:text-left">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Choose your tool
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Search, filter by category, and launch in one click.
          </p>
        </div>
        <ToolCatalog />
      </section>

      {/* Benefits */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 section-glow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((item, i) => (
            <div
              key={item.title}
              className={`opacity-0-start animate-fade-in-up ${["delay-100", "delay-200", "delay-300"][i]} glass-panel glass-panel-hover rounded-2xl p-7 space-y-4 card-glow`}
            >
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.glow} to-transparent border border-white/10`}
              >
                <item.icon className={`h-6 w-6 ${item.accent}`} />
              </div>
              <h3 className="font-display font-bold text-white text-lg">{item.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 section-glow pt-4">
        <div className="text-center space-y-3 mb-10">
          <h2 className="font-display text-3xl font-bold text-white">
            Frequently asked questions
          </h2>
          <p className="text-sm text-slate-400">
            Everything you need to know about privacy and performance.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="glass-panel glass-panel-hover rounded-2xl p-6 space-y-2 card-glow"
            >
              <h3 className="font-display font-semibold text-white text-base">{faq.q}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
