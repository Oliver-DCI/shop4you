// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import CartDrawer from "@/components/shop/CartDrawer";
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
      {/* ✨ FIX: bg-white und text-zinc-950 als Standard für den Shop gesetzt. suppressHydrationWarning bleibt aktiv. */}
      <body className="min-h-full flex flex-col bg-white text-zinc-950" suppressHydrationWarning>
        <CartProvider>
          {/* Globaler Header oben (Passt sich dank seiner Klassen perfekt an) */}
          <Header />
          
          {/* ✨ FIX: Hintergrund-Zwang entfernt, damit Pages (wie Login) ihr eigenes n8n-Theme entfalten können */}
          <main className="flex-1 w-full">
            {children}
          </main>
          
          {/* Globaler Footer unten */}
          <Footer />

          {/* Der von rechts hereinfliegende Warenkorb */}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}