import React from 'react';
import Link from 'next/link';
import AccountSidebar from '@/components/shop/account/AccountSidebar';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-12 flex-1">
      {/* Linke Navigation (bleibt unberührt an Ort und Stelle) */}
      <AccountSidebar />
      
      {/* Rechte Spalte: Enthält jetzt den Button UND die Content-Box */}
      <div className="flex-1 flex flex-col gap-4">
        
        {/* 🎯 HIER GEHÖRT ER HIN: Sauber ausgerichtet über der Content-Box */}
        <div>
          <Link 
            href="/" 
            className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 hover:text-black transition-colors inline-flex items-center gap-2"
          >
            ◀ Zurück zum Shop
          </Link>
        </div>

        {/* Die eigentliche Content-Box */}
        <div className="flex-1 bg-white border border-zinc-100 p-8 md:p-10 rounded-none shadow-sm text-black">
          {children}
        </div>
        
      </div>
    </div>
  );
}