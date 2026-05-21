import React from 'react';
import AccountSidebar from '@/components/shop/account/AccountSidebar';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-12 flex-1">
      {/* Linke Navigation */}
      <AccountSidebar />
      
      {/* Rechte Content-Box */}
      <div className="flex-1 bg-white border border-zinc-100 p-8 md:p-10 rounded-none shadow-sm">
        {children}
      </div>
    </div>
  );
}