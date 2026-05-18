// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import CartDrawer from "@/components/shop/CartDrawer";
import { CartProvider } from '@/store/cartStore';

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
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100" suppressHydrationWarning>
        <CartProvider>
          {/* Globaler Header oben */}
          <Header />
          
          {/* 🔐 Hauptinhalt als mattes Element deklariert */}
          <main className="flex-1 bg-zinc-950 w-full">
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