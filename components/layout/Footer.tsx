import Link from "next/link";
import { Shield, Zap } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full border-t border-stone-900/15 bg-white/50 backdrop-blur-sm mt-auto">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white font-bold text-sm shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                A
              </span>
              <span className="font-display text-lg font-bold text-stone-900">
                Anyto<span className="text-primary">Any</span>
              </span>
            </Link>
            <p className="text-sm text-stone-600 max-w-sm leading-relaxed">
              Fast, private file conversions and image tools — most processing happens right in your browser.
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-stone-500">
              <span className="inline-flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-primary" />
                Privacy-first
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-secondary" />
                Instant results
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-display text-xs font-semibold text-stone-900 tracking-widest uppercase mb-4">
              Conversions
            </h3>
            <ul className="space-y-2.5 text-sm text-stone-600">
              {[
                ["JPG to PNG", "/tools/jpg-to-png"],
                ["PNG to JPG", "/tools/png-to-jpg"],
                ["Image to PDF", "/tools/image-to-pdf"],
                ["XLSX to CSV", "/tools/xlsx-to-csv"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-stone-900 transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-xs font-semibold text-stone-900 tracking-widest uppercase mb-4">
              Creative Suite
            </h3>
            <ul className="space-y-2.5 text-sm text-stone-600">
              {[
                ["Background Remover", "/tools/background-remover"],
                ["Image Cropper", "/tools/image-cropper"],
                ["Image Merger", "/tools/image-merger"],
                ["Word to PDF", "/tools/word-to-pdf"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-stone-900 transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-900/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>&copy; {currentYear} AnytoAny. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-stone-900 transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-stone-900 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
