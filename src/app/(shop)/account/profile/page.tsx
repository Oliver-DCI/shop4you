import React from 'react';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import AccountSidebar from '@/components/shop/account/AccountSidebar';
import ProfileForm from '@/components/shop/account/ProfileForm';

// Initialisierung deines Datenbank-Pools
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default async function ProfilePage() {
  // 💡 HINWEIS: Ersetze das hier später durch deine echte Session-Abfrage!
  // Aktuell holen wir zum Testen einfach den ersten User aus deiner DB.
  const user = await prisma.user.findFirst();

  if (!user) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-center uppercase tracking-widest text-xs text-zinc-400">
        Kein Benutzerprofil gefunden. Bitte logge dich ein.
      </div>
    );
  }

  // Formatierung für TypeScript absichern
  const safeUser = {
    id: user.id,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    role: user.role || 'customer',
    street: (user as any).street || '',
    zipCode: (user as any).zipCode || '',
    city: (user as any).city || '',
  };

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      <main className="max-w-[1400px] mx-auto px-4 py-16">
        
        {/* Header-Titel im Studio-Design */}
        <div className="mb-12 border-b border-zinc-100 pb-8">
          <h1 className="text-2xl font-normal uppercase tracking-widest">Konto-Einstellungen</h1>
          <p className="text-zinc-400 text-[10px] mt-2 uppercase tracking-widest">
            Verwalte deine persönlichen Daten, Adressen und Bestellungen
          </p>
        </div>

        {/* Zweispaltiges Dashboard-Layout */}
        <div className="flex flex-col md:flex-row gap-16">
          {/* Linke Seite: Navigation */}
          <AccountSidebar />

          {/* Rechte Seite: Formular */}
          <div className="flex-1">
            <ProfileForm user={safeUser} />
          </div>
        </div>

      </main>
    </div>
  );
}