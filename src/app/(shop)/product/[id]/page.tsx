// src/app/(shop)/product/[id]/page.tsx
import React from 'react';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { notFound } from 'next/navigation';
import ProductImages from '@/components/shop/ProductImages';
import ProductInfo from '@/components/shop/ProductInfo';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  // 100% Datenbank-Fokus: Wir holen das Produkt direkt aus PostgreSQL
  const product = await prisma.product.findUnique({
    where: { id },
  });

  // Wenn das Produkt nicht existiert, triggern wir die 404-Page
  if (!product) {
    notFound();
    return null; 
  }

  return (
    <div className="bg-zinc-50 text-zinc-900 min-h-screen relative overflow-hidden py-12 md:py-20">
      
      {/* Ambient-Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-cyan-400/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Back-Link */}
        <div className="mb-8">
          <a href="/#produkte" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-blue-600 transition-colors group">
            <span className="group-hover:-translate-x-0.5 transition-transform">◀</span> Zurück zur Übersicht
          </a>
        </div>

        {/* Das edle 2-Spalten Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start bg-white/40 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/80 shadow-xs">
          
          {/* Linke Seite: Bildergalerie (erhält jetzt das dynamische Array mit 5 Bildern) */}
          <ProductImages images={product.images} title={product.title} />
          
          {/* Rechte Seite: Produkt-Details */}
          <ProductInfo product={product} />
          
        </div>
      </main>
    </div>
  );
}