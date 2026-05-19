import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white text-zinc-500 border-t border-zinc-200 mt-auto select-none rounded-none">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-xs">
          
          {/* Spalte 1: Brand */}
          <div className="flex flex-col gap-4 items-start text-left">
            <h3 className="text-xl font-normal tracking-widest uppercase text-black">
              SHOP<span className="font-light text-zinc-400">4YOU</span>
            </h3>
            <p className="text-zinc-400 leading-relaxed font-normal max-w-sm">
              Premium IT- und Tech-Plattform im Jahr {currentYear}. Reduzierte Ästhetik kombiniert mit kompromissloser Rechenleistung.
            </p>
          </div>

          {/* Spalte 2: Kategorien */}
          <div className="flex flex-col md:items-center text-left md:text-center gap-4">
            <div>
              <h4 className="font-medium uppercase tracking-widest text-black text-[11px] mb-4 flex items-center justify-start md:justify-center gap-2">
                ■ Hardware
              </h4>
              <ul className="space-y-3 font-normal text-zinc-400 text-left md:text-center">
                <li><a href="#produkte" className="hover:text-black transition-colors block">Notebooks & Laptops</a></li>
                <li><a href="#produkte" className="hover:text-black transition-colors block">Smartphones</a></li>
                <li><a href="#produkte" className="hover:text-black transition-colors block">Tablets & iPads</a></li>
              </ul>
            </div>
          </div>

          {/* Spalte 3: Support */}
          <div className="flex flex-col md:items-end text-left md:text-right gap-4">
            <div>
              <h4 className="font-medium uppercase tracking-widest text-black text-[11px] mb-4 flex items-center justify-start md:justify-end gap-2">
                ■ Legal
              </h4>
              <ul className="space-y-3 font-normal text-zinc-400 text-left md:text-right">
                <li><a href="#" className="hover:text-black transition-colors block">Impressum</a></li>
                <li><a href="#" className="hover:text-black transition-colors block">Datenschutz</a></li>
                <li><a href="#" className="hover:text-black transition-colors block">AGB & Widerruf</a></li>
              </ul>
            </div>
          </div>

        </div>

        <div className="w-full h-px bg-zinc-200 my-10" />

        {/* Copyright & Status */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-zinc-400 font-normal">
          <div>
            &copy; {currentYear} <span className="text-black font-medium">SHOP4YOU</span>. Alle Rechte vorbehalten.
          </div>
          
          {/* Status-Badge */}
          <div className="flex gap-2 items-center bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-none">
            <span className="w-1.5 h-1.5 bg-black" />
            <span className="text-black tracking-widest font-medium text-[9px] uppercase">Systems Online</span>
          </div>
        </div>

      </div>
    </footer>
  );
}