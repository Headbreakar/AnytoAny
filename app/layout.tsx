import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AmbientBackground from "@/components/layout/AmbientBackground";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AnytoAny - Premium Online File Converter & Image Suite",
  description:
    "Free, high-performance online tool suite. Convert JPG to PNG, Excel to CSV, remove backgrounds, crop images, merge files, and more in-browser.",
  icons: {
    icon: [
      { url: '/favicon_io/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon_io/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: [
      { url: '/favicon_io/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  manifest: '/favicon_io/site.webmanifest'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${playfair.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-bg-dark text-stone-900 font-sans relative">
        <AmbientBackground />
        <Header />
        <main className="flex-grow flex flex-col relative z-0">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
