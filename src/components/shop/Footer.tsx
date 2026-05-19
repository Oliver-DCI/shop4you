// src/components/shop/Footer.tsx
import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    /* 🎨 Perfekte Farbsynchronität zum Header: Helles Milchglas mit feinem Schatten, komplett ohne Trennlinie */
    <footer className="w-full bg-white/60 backdrop-blur-xl text-zinc-600 relative overflow-hidden shadow-[0_-8px_32px_0_rgba(0,0,0,0.04)] mt-auto select-none">
      
      {/* 🌌 Sanfte, helle Hintergrund-Glows für subtile visuelle Tiefe */}
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        
        {/* ✨ Grid mit durchgehender, korrigierter Ausrichtung */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-xs">
          
          {/* Spalte 1: Brand & Message (Linksbündig) */}
          <div className="flex flex-col gap-4 items-start text-left">
            <h3 className="text-2xl font-black tracking-tighter uppercase transition-all select-none">
              {/* SHOP4YOU im zweifarbigen Blauverlauf genau wie im Header */}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 drop-shadow-[0_2px_8px_rgba(59,130,246,0.15)]">
                SHOP4YOU
              </span>
            </h3>
            <p className="text-zinc-400 leading-relaxed font-medium max-w-sm">
              Dein High-End IT- und Tech-Store im Jahr {currentYear}. Glasklares Design trifft auf kompromisslose Performance und modernste Hardware-Setups.
            </p>
          </div>

          {/* Spalte 2: IT-Kategorien (Zentriert) */}
          <div className="flex flex-col md:items-center text-left md:text-center gap-4">
            <div>
              <h4 className="font-bold uppercase tracking-widest text-zinc-800 text-[11px] mb-4 flex items-center justify-start md:justify-center gap-2">
                {/* Zweifarbiger kleiner Indikator-Punkt */}
                <span className="w-1.5 h-3 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-xs inline-block shadow-sm" />
                Hardware
              </h4>
              <ul className="space-y-3 font-semibold text-zinc-500 text-left md:text-center">
                <li><a href="#produkte" className="hover:text-blue-500 transition-colors block">Notebooks & Laptops</a></li>
                <li><a href="#produkte" className="hover:text-blue-500 transition-colors block">Smartphones</a></li>
                <li><a href="#produkte" className="hover:text-blue-500 transition-colors block">Tablets & iPads</a></li>
              </ul>
            </div>
          </div>

          {/* Spalte 3: Support (Rechtsbündig) */}
          <div className="flex flex-col md:items-end text-left md:text-right gap-4">
            <div>
              <h4 className="font-bold uppercase tracking-widest text-zinc-800 text-[11px] mb-4 flex items-center justify-start md:justify-end gap-2">
                <span className="w-1.5 h-3 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-xs inline-block shadow-sm" />
                Support
              </h4>
              <ul className="space-y-3 font-medium text-zinc-400 text-left md:text-right">
                <li><a href="#" className="hover:text-zinc-800 transition-colors block">Impressum</a></li>
                <li><a href="#" className="hover:text-zinc-800 transition-colors block">Datenschutz</a></li>
                <li><a href="#" className="hover:text-zinc-800 transition-colors block">AGB & Widerruf</a></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Untere Trennlinie (Dezent an helles Design angepasst) */}
        <div className="w-full h-px bg-zinc-200/60 my-10" />

        {/* 🎯 Perfekt zentrierte Copyright-Leiste */}
        <div className="flex flex-col items-center justify-center text-center gap-4 text-[10px] text-zinc-400 font-medium">
          <div>
            &copy; {currentYear} <span className="text-zinc-500 font-bold">SHOP4YOU</span>. Alle Rechte vorbehalten.
          </div>
          
          {/* Helles, gläsernes Status-Badge im harmonischen Look */}
          <div className="flex gap-2 items-center bg-white/80 border border-zinc-200 px-3 py-1.5 rounded-xl shadow-sm backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" />
            <span className="text-emerald-600 tracking-wider font-black text-[9px] uppercase">All Systems Operational</span>
          </div>
        </div>

      </div>
    </footer>
  );
}