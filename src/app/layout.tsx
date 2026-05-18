// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import CartDrawer from "@/components/shop/CartDrawer"; // ✨ Neu importiert
import { CartProvider } from '@/store/cartStore'; // ✨ useCart entfernt (Server Component benötigt nur den Provider)

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "shop4you - Next-Gen Commerce",
  description: "Der modernste E-Commerce Store im Jahr 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-950" suppressHydrationWarning>
        <CartProvider>
          {/* Globaler Header oben */}
          <Header />
          
          {/* Hauptinhalt füllt den restlichen Platz flexibel aus */}
          <div className="flex-1">
            {children}
          </div>
          
          {/* Globaler Footer unten */}
          <Footer />

          {/* ✨ Der von rechts hereinfliegende Warenkorb */}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}