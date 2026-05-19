'use client';

import React from 'react';
import { useCart } from '@/context/cartContext';
import AccountSidebar from '@/components/shop/account/AccountSidebar';
import ProfileForm from '@/components/shop/account/ProfileForm';

// 1. Wir definieren hier lokal exakt, welche Felder ein User-Profil haben kann
interface ExtendedUser {
  id: string | number;
  firstName: string;
  lastName?: string;
  email?: string;
  role: 'customer' | 'seller' | 'admin';
  street?: string;
  zipCode?: string;
  city?: string;
}

export default function ProfilePage() {
  const { user } = useCart();

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-4">
        <div className="text-xs uppercase tracking-widest text-zinc-400">
          Kein aktives Benutzerprofil gefunden.
        </div>
        <a 
          href="/login" 
          className="text-[10px] bg-black text-white px-4 py-2 uppercase tracking-widest hover:bg-zinc-900 transition-colors"
        >
          Zum Login
        </a>
      </div>
    );
  }

  // 2. 🎯 Hier casten wir den User sicher als "ExtendedUser". 
  // Das beruhigt TypeScript sofort für alle Felder!
  const extendedUser = user as ExtendedUser;

  const safeUser = {
    id: extendedUser.id || '',
    firstName: extendedUser.firstName || '',
    lastName: extendedUser.lastName || '',
    email: extendedUser.email || '',
    role: extendedUser.role || 'customer',
    street: extendedUser.street || '',
    zipCode: extendedUser.zipCode || '',
    city: extendedUser.city || '',
  };

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      <main className="max-w-[1400px] mx-auto px-4 py-16">
        
        {/* Header-Titel */}
        <div className="mb-12 border-b border-zinc-100 pb-8">
          <h1 className="text-2xl font-normal uppercase tracking-widest">Konto-Einstellungen</h1>
          <p className="text-zinc-400 text-[10px] mt-2 uppercase tracking-widest">
            Verwalte deine persönlichen Daten, Adressen und Bestellungen
          </p>
        </div>

        {/* Zweispaltiges Layout */}
        <div className="flex flex-col md:flex-row gap-16">
          <AccountSidebar />

          <div className="flex-1">
            <ProfileForm user={safeUser} />
          </div>
        </div>

      </main>
    </div>
  );
}