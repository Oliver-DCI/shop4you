// src/components/shop/Footer.tsx
import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gradient-to-br from-blue-50/80 via-cyan-50/40 to-white text-zinc-700 relative overflow-hidden border-t border-blue-100/80 mt-auto backdrop-blur-md">
      
      {/* 🌌 Sanfter, strahlender Cyan-Glow im Hintergrund */}
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-cyan-300/20 blur-[90px] pointer-events-none" />
      <div className="absolute top-[-10%] left-[-5%] w-[300px] h-[300px] rounded-full bg-blue-300/15 blur-[70px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-sm">
          
          {/* Spalte 1: Brand & Message */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-black tracking-tighter uppercase">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 drop-shadow-xs">
                SHOP4YOU
              </span>
              <span className="text-blue-600 font-serif lowercase">.</span>
            </h3>
            <p className="text-zinc-500 leading-relaxed font-medium text-xs max-w-sm">
              Dein High-End IT- und Tech-Store im Jahr {currentYear}. Glasklares Design trifft auf kompromisslose Performance und modernste Hardware-Setups.
            </p>
          </div>

          {/* Spalte 2: IT-Kategorien */}
          <div>
            <h4 className="font-bold uppercase tracking-widest text-zinc-900 text-xs mb-4 flex items-center gap-2">
              <span className="w-1.5 h-3 bg-blue-600 rounded-xs inline-block shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
              Hardware
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-zinc-600">
              <li><a href="#produkte" className="hover:text-blue-600 transition-colors">Notebooks & Laptops</a></li>
              <li><a href="#produkte" className="hover:text-blue-600 transition-colors">Smartphones</a></li>
              <li><a href="#produkte" className="hover:text-blue-600 transition-colors">Tablets & iPads</a></li>
            </ul>
          </div>

          {/* Spalte 3: Rechtliches & Service */}
          <div>
            <h4 className="font-bold uppercase tracking-widest text-zinc-900 text-xs mb-4 flex items-center gap-2">
              <span className="w-1.5 h-3 bg-cyan-500 rounded-xs inline-block shadow-[0_0_8px_rgba(6,182,212,0.4)]" />
              Support
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-500 font-medium">
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Impressum</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Datenschutz</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">AGB & Widerruf</a></li>
            </ul>
          </div>

        </div>

        {/* Untere Copyright-Leiste */}
        <div className="border-t border-blue-200/40 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500 font-medium">
          <div>
            &copy; {currentYear} SHOP4YOU. Alle Rechte vorbehalten.
          </div>
          
          {/* Helles, gläsernes Status-Badge */}
          <div className="flex gap-2 items-center bg-white/80 border border-blue-200/50 px-3 py-1.5 rounded-xl shadow-xs backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-blue-600 tracking-wider font-bold text-[10px]">ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}