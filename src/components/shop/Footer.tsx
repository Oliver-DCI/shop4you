// src/components/shop/Footer.tsx
import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    /* 🎨 Absolute Farbsynchronität zum Header: bg-zinc-900/90 mit exakt gleichem Charakter */
    <footer className="w-full bg-zinc-900/90 text-zinc-400 relative overflow-hidden border-t border-zinc-800/50 mt-auto select-none">
      
      {/* 🌌 Tiefen-Glows für die edle Cyber-Atmosphäre */}
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        
        {/* ✨ Grid mit durchgehender, korrigierter Ausrichtung */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-xs">
          
          {/* Spalte 1: Brand & Message (Linksbündig) */}
          <div className="flex flex-col gap-4 items-start text-left">
            <h3 className="text-2xl font-black tracking-tighter uppercase transition-all select-none">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.25)]">
                SHOP4YOU
              </span>
            </h3>
            <p className="text-zinc-500 leading-relaxed font-medium max-w-sm">
              Dein High-End IT- und Tech-Store im Jahr {currentYear}. Glasklares Design trifft auf kompromisslose Performance und modernste Hardware-Setups.
            </p>
          </div>

          {/* Spalte 2: IT-Kategorien (Zentriert) */}
          <div className="flex flex-col md:items-center text-left md:text-center gap-4">
            <div>
              <h4 className="font-bold uppercase tracking-widest text-zinc-200 text-[11px] mb-4 flex items-center justify-start md:justify-center gap-2">
                <span className="w-1.5 h-3 bg-blue-500 rounded-xs inline-block shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                Hardware
              </h4>
              <ul className="space-y-3 font-semibold text-zinc-400 text-left md:text-center">
                <li><a href="#produkte" className="hover:text-blue-400 transition-colors block">Notebooks & Laptops</a></li>
                <li><a href="#produkte" className="hover:text-blue-400 transition-colors block">Smartphones</a></li>
                <li><a href="#produkte" className="hover:text-blue-400 transition-colors block">Tablets & iPads</a></li>
              </ul>
            </div>
          </div>

          {/* Spalte 3: Support (Rechtsbündig) */}
          <div className="flex flex-col md:items-end text-left md:text-right gap-4">
            <div>
              <h4 className="font-bold uppercase tracking-widest text-zinc-200 text-[11px] mb-4 flex items-center justify-start md:justify-end gap-2">
                <span className="w-1.5 h-3 bg-cyan-400 rounded-xs inline-block shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                Support
              </h4>
              <ul className="space-y-3 font-medium text-zinc-500 text-left md:text-right">
                <li><a href="#" className="hover:text-zinc-300 transition-colors block">Impressum</a></li>
                <li><a href="#" className="hover:text-zinc-300 transition-colors block">Datenschutz</a></li>
                <li><a href="#" className="hover:text-zinc-300 transition-colors block">AGB & Widerruf</a></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Untere Trennlinie */}
        <div className="w-full h-px bg-zinc-800/50 my-10" />

        {/* 🎯 Perfekt zentrierte Copyright-Leiste */}
        <div className="flex flex-col items-center justify-center text-center gap-4 text-[10px] text-zinc-500 font-medium">
          <div>
            &copy; {currentYear} <span className="text-zinc-400 font-bold">SHOP4YOU</span>. Alle Rechte vorbehalten.
          </div>
          
          {/* Dunkles, gläsernes Cyber-Status-Badge (Ebenfalls zentriert) */}
          <div className="flex gap-2 items-center bg-zinc-950/40 border border-zinc-800/80 px-3 py-1.5 rounded-xl shadow-inner backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse" />
            <span className="text-cyan-400 tracking-wider font-black text-[9px] uppercase">All Systems Operational</span>
          </div>
        </div>

      </div>
    </footer>
  );
}