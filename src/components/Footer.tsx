'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Kleine Helper-Funktion für butterweiches Scrollen ohne Seiten-Zucken
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    // Nur scrollen, wenn wir bereits auf der Startseite ("/" oder "") sind
    if (window.location.pathname === '/' || window.location.pathname === '') {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Fallback: Falls die ID exakt mit Sonderzeichen generiert wurde (z.B. "tvvideo")
        const alternativeElement = document.getElementById(id.replace(/[^a-z0-9]/g, ''));
        if (alternativeElement) {
          alternativeElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
    // Wenn wir auf einer Unterseite sind, lassen wir das Standard-Link-Verhalten (href="/#id") arbeiten!
  };

  return (
    <footer className="w-full mt-auto select-text rounded-none flex flex-col">
      
      {/* OBERER BEREICH: Unser edles Zink-Grau (bg-zinc-50) */}
      <div className="w-full bg-zinc-50 border-t border-zinc-200 py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-8">
          
          {/* Logo & Slogan */}
          <div className="text-center">
            <span className="text-xl font-light tracking-[0.25em] uppercase text-black">
              SHOP<span className="text-samsung-muted font-extralight">[4]YOU</span>
            </span>
            <p className="text-[9px] text-samsung-muted tracking-[0.2em] uppercase mt-2 font-mono">
              Premium Hardware // Lineup {currentYear}
            </p>
          </div>

          {/* Clean Link-Leiste */}
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2.5 text-[11px] font-mono uppercase tracking-widest">
            
            {/* 🎯 Anchor-Links scrollen intern, daher scroll={false} damit die Page nicht springt */}
            <Link 
              href="/#notebooks" 
              scroll={false}
              onClick={(e) => handleScroll(e, 'notebooks')}
              className="text-samsung-muted hover:text-black transition-colors"
            >
              Notebooks
            </Link>
            
            <Link 
              href="/#smartphones" 
              scroll={false}
              onClick={(e) => handleScroll(e, 'smartphones')}
              className="text-samsung-muted hover:text-black transition-colors"
            >
              Smartphones
            </Link>
            
            <Link 
              href="/#tv" 
              scroll={false}
              onClick={(e) => handleScroll(e, 'tv')}
              className="text-samsung-muted hover:text-black transition-colors"
            >
              TV
            </Link>
            
            <Link 
              href="/#audio" 
              scroll={false}
              onClick={(e) => handleScroll(e, 'audio')}
              className="text-samsung-muted hover:text-black transition-colors"
            >
              AUDIO
            </Link>
            
            <div className="hidden sm:block w-px h-3 bg-zinc-200" />
            
            {/* 🎯 ECHTE UNTERSEITEN: Erhalten scroll={true}, damit die neue Seite oben startet, wechseln jetzt sofort */}
            <Link 
              href="/kontakt" 
              scroll={true}
              className="text-samsung-muted hover:text-black transition-colors"
            >
              Kontakt
            </Link>
            
            <Link 
              href="/impressum" 
              scroll={true}
              className="text-samsung-muted hover:text-black transition-colors"
            >
              Impressum
            </Link>
            
            <Link 
              href="/datenschutz" 
              scroll={true}
              className="text-samsung-muted hover:text-black transition-colors"
            >
              Datenschutz
            </Link>
            
            <Link 
              href="/agb" 
              scroll={true}
              className="text-samsung-muted hover:text-black transition-colors"
            >
              AGB
            </Link>
          </nav>

        </div>
      </div>

      {/* UNTERER BEREICH: Sauber und hell (bg-white) mit zentriertem Copyright */}
      <div className="w-full bg-white border-t border-zinc-200/60 py-6">
        <div className="max-w-[1400px] mx-auto px-4 text-center">
          <p className="text-[10px] text-samsung-muted font-mono tracking-wider">
            &copy; {currentYear} <span className="text-s font-light tracking-[0.25em] uppercase text-black">
              SHOP<span className="text-samsung-muted font-extralight">[4]YOU</span>
            </span>. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>

    </footer>
  );
}