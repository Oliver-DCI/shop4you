'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-auto select-text rounded-none flex flex-col">
      
      {/* OBERER BEREICH: Unser edles Zink-Grau (bg-zinc-50) */}
      <div className="w-full bg-zinc-50 border-t border-zinc-200 py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-8">
          
          {/* Logo & Slogan */}
          <div className="text-center">
            <span className="text-xl font-light tracking-[0.25em] uppercase text-black">
              {/* 🎯 KOSMETIK: text-zinc-400 -> text-samsung-muted */}
              SHOP<span className="text-samsung-muted font-extralight">4YOU</span>
            </span>
            {/* 🎯 KOSMETIK: text-zinc-400 -> text-samsung-muted */}
            <p className="text-[9px] text-samsung-muted tracking-[0.2em] uppercase mt-2 font-mono">
              Premium Hardware // Lineup {currentYear}
            </p>
          </div>

          {/* Clean Link-Leiste */}
          {/* 🎯 KOSMETIK: text-zinc-400 -> text-samsung-muted auf allen Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2.5 text-[11px] font-mono uppercase tracking-widest">
            <Link href="#produkte" className="text-samsung-muted hover:text-black transition-colors">
              Notebooks
            </Link>
            <Link href="#produkte" className="text-samsung-muted hover:text-black transition-colors">
              Smartphones
            </Link>
            <Link href="#produkte" className="text-samsung-muted hover:text-black transition-colors">
              TV
            </Link>
            <Link href="#produkte" className="text-samsung-muted hover:text-black transition-colors">
              AUDIO
            </Link>
            <div className="hidden sm:block w-px h-3 bg-zinc-200" />
            <Link href="/impressum" className="text-samsung-muted hover:text-black transition-colors">
              Kontakt
            </Link>
            <Link href="/impressum" className="text-samsung-muted hover:text-black transition-colors">
              Impressum
            </Link>
            <Link href="/datenschutz" className="text-samsung-muted hover:text-black transition-colors">
              Datenschutz
            </Link>
            <Link href="/agb" className="text-samsung-muted hover:text-black transition-colors">
              AGB
            </Link>
          </nav>

        </div>
      </div>

      {/* UNTERER BEREICH: Sauber und hell (bg-white) mit zentriertem Copyright */}
      <div className="w-full bg-white border-t border-zinc-200/60 py-6">
        <div className="max-w-[1400px] mx-auto px-4 text-center">
          {/* 🎯 KOSMETIK: text-zinc-400 -> text-samsung-muted */}
          <p className="text-[10px] text-samsung-muted font-mono tracking-wider">
            &copy; {currentYear} <span className="text-black font-light tracking-widest uppercase">SHOP4YOU</span>. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>

    </footer>
  );
}