'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import ChatBot from '@/components/ChatBot';

export default function ShopGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || '';

  // 🎯 PRÜFUNG: Auf Admin- oder Seller-Dashboards wird der Chatbot komplett ausgeblendet.
  // Da der Account-Bereich unter '/account' läuft, blockiert diese Abfrage ihn dort NICHT.
  const isDashboard = pathname.startsWith('/admin') || pathname.startsWith('/seller');

  return (
    <>
      {/* Rendert die jeweilige Shop-Page */}
      {children}
      
      {/* Der Chatbot wird nur gerendert, wenn wir uns nicht auf einem Dashboard befinden */}
      {!isDashboard && <ChatBot />}
    </>
  );
}