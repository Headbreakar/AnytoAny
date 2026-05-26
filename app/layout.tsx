import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AmbientBackground from "@/components/layout/AmbientBackground";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AnytoAny - Premium Online File Converter & Image Suite",
  description:
    "Free, high-performance online tool suite. Convert JPG to PNG, Excel to CSV, remove backgrounds, crop images, merge files, and more in-browser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased dark scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-bg-dark text-slate-100 font-sans relative">
        <AmbientBackground />
        <Header />
        <main className="flex-grow flex flex-col relative z-0">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
