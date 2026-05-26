"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Image, FileSpreadsheet, FileText } from "lucide-react";

const navItems = [
  { href: "/#images", label: "Image Tools", icon: Image },
  { href: "/#spreadsheets", label: "Spreadsheets", icon: FileSpreadsheet },
  { href: "/#documents", label: "Documents", icon: FileText },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-bg-dark/60 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white font-bold text-lg shadow-lg shadow-primary/25 transition-all duration-300 group-hover:scale-105 group-hover:shadow-primary/40">
              <span className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              A
            </span>
            <span className="font-display text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors duration-300">
              Anyto<span className="text-gradient">Any</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                <item.icon className="h-4 w-4 opacity-60" />
                {item.label}
              </Link>
            ))}
            <Link
              href="/#tools"
              className="ml-2 inline-flex h-9 items-center justify-center rounded-lg bg-gradient-to-r from-primary/90 to-secondary/90 px-4 text-xs font-semibold text-white shadow-md shadow-primary/20 hover:shadow-primary/30 hover:opacity-95 transition-all duration-300 active:scale-[0.98]"
            >
              All Tools
            </Link>
          </nav>

          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2.5 text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
            aria-expanded={isOpen}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-white/5 bg-bg-dark/95 backdrop-blur-xl animate-slide-down">
          <nav className="space-y-1 px-3 py-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                <item.icon className="h-4 w-4 text-primary/70" />
                {item.label}
              </Link>
            ))}
            <Link
              href="/#tools"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center rounded-xl mt-2 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary to-secondary"
            >
              Browse All Tools
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
