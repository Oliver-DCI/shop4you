// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from '@/context/cartContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "shop4you | Premium Tech Showcase",
  description: "Minimalistischer High-End E-Commerce Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      data-scroll-behavior="smooth" /* 🎯 FIX: Verhindert das unkontrollierte Springen bei Routenwechseln und behebt die Next.js-Warnung */
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased selection:bg-black selection:text-white`}
    >
      <body className="min-h-full flex flex-col bg-white text-black rounded-none" suppressHydrationWarning>
        <CartProvider>
          {/* Globaler Header (wird im eckigen Samsung-Stil rendern) */}
          <Header />
          
          {/* Hauptinhalt nimmt die volle Breite ohne störende Abrundungen */}
          <main className="flex-1 w-full flex flex-col">
            {children}
          </main>
          
          {/* Globaler Footer */}
          <Footer />

          {/* Warenkorb-Drawer */}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}