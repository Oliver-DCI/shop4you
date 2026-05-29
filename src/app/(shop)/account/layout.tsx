import React from 'react';
import Link from 'next/link';
import AccountSidebar from '@/components/shop/account/AccountSidebar';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-12 flex-1">
      
      {/* Linke Spalte: Enthält jetzt den globalen Zurück-Link und die Sidebar */}
      <div className="flex flex-col gap-4 md:w-64">
        <div>
          <Link 
            href="/" 
            className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 hover:text-black transition-colors inline-flex items-center gap-2"
          >
            ◀ Zurück zum Shop
          </Link>
        </div>
        <AccountSidebar />
      </div>
      
      {/* Rechte Spalte: Die reine, saubere Content-Box */}
      <div className="flex-1 bg-white border border-zinc-100 p-8 md:p-10 rounded-none shadow-sm text-black">
        {children}
      </div>

    </div>
  );
}