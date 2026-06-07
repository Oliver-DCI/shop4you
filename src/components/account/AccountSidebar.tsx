'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AccountSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Persönliches Profil', href: '/account/profile', icon: '👤' },
    { name: 'Meine Bestellungen', href: '/account/orders', icon: '📦' },
    { name: 'Rechnungsarchiv', href: '/account/invoices', icon: '📄' },
    { name: 'Sicherheit', href: '/account/security', icon: '🔒' },
  ];

  return (
    <aside className="w-full md:w-64 flex flex-col gap-1 shrink-0">
      <p className="text-[10px] font-medium text-samsung-muted uppercase tracking-widest mb-4 px-2">
        Konto-Einstellungen
      </p>
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest transition-colors rounded-none border ${
              isActive 
                ? 'bg-black text-white border-black' 
                : 'bg-white text-samsung-muted border-transparent hover:border-zinc-200 hover:text-black'
            }`}
          >
            <span className="text-sm opacity-70">{item.icon}</span>
            {item.name}
          </Link>
        );
      })}
    </aside>
  );
}