// src/components/shop/Header.tsx
'use client';

import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/70 backdrop-blur-xl">
      {/* Maximale Breite erhöht (max-w-[1400px]) für den breiten High-End-Look */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* 💻 Das Brand-Logo mit fließendem Farbverlauf */}
        <Link href="/" className="text-xl font-black tracking-tighter uppercase transition-opacity hover:opacity-90">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 drop-shadow-xs">
            SHOP4YOU
          </span>
          <span className="text-blue-600 font-serif lowercase">.</span>
        </Link>

        {/* Suchleiste (Breit angelegt, vorbereitet auf die toom-Logik) */}
        <div className="flex-1 max-w-xl hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Suchen Sie nach High-End Laptops, Tablets, Smartphones..."
              className="w-full h-10 pl-4 pr-10 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs font-medium placeholder-zinc-400 focus:outline-hidden focus:border-blue-500/50 focus:bg-white focus:shadow-[0_0_15px_rgba(37,99,235,0.05)] transition-all"
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs pointer-events-none opacity-60">
              🔍
            </div>
          </div>
        </div>

        {/* Rechte Service-Navigation */}
        <div className="flex items-center gap-6">
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-zinc-500">
            <Link href="#produkte" className="hover:text-blue-600 transition-colors">Notebooks</Link>
            <Link href="#produkte" className="hover:text-blue-600 transition-colors">Smartphones</Link>
            <Link href="#produkte" className="hover:text-blue-600 transition-colors">Tablets</Link>
          </nav>

          <div className="h-4 w-px bg-zinc-200 hidden lg:block" />

          <button className="text-xs font-bold uppercase tracking-wider text-zinc-600 hover:text-blue-600 transition-colors">
            Mein Konto
          </button>
          
          {/* High-Tech Warenkorb Button */}
          <button className="relative h-10 w-10 flex items-center justify-center rounded-xl border border-zinc-200 hover:border-blue-500/30 hover:bg-blue-50/30 bg-white transition-all shadow-xs group">
            <span className="text-sm group-hover:scale-110 transition-transform">🛒</span>
            <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[9px] font-black h-4 w-4 rounded-md flex items-center justify-center border border-white shadow-xs">
              0
            </span>
          </button>
        </div>

      </div>
    </header>
  );
}