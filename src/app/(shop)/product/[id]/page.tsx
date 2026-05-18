// src/app/(shop)/product/[id]/page.tsx
import React from 'react';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { notFound } from 'next/navigation'; // ✨ KORREKTUR 1: Richtiger Next.js Import
import ProductImages from '@/components/shop/ProductImages';
import ProductInfo from '@/components/shop/ProductInfo';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const MOCK_PRODUCT = {
  id: '1',
  title: 'QuantumBook Pro 16 Preview',
  description: 'Erlebe den Komfort der nächsten Generation mit adaptiver Dämpfung und recycelten Materialien. Perfekt für den urbanen Lifestyle.',
  price: 2499.00,
  images: [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800'
  ],
  category: 'Notebooks',
  stock: 12
};

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  let product = null;

  if (id === '1') {
    product = MOCK_PRODUCT;
  } else {
    product = await prisma.product.findUnique({
      where: { id },
    });
  }

  // ✨ KORREKTUR 2 & 3: Wenn kein Produkt da ist, werfen wir notFound().
  // Um TypeScript absolut zu garantieren, dass "product" danach NIEMALS null ist,
  // nutzen wir zusätzlich ein explizites "return", damit der Compiler weiß: Hier bricht der Code ab!
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

        {/* Das 2-Spalten Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start bg-white/40 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/80 shadow-xs">
          
          {/* Linke Seite: Bildergalerie */}
          <ProductImages images={product.images} title={product.title} />
          
          {/* Rechte Seite: Produkt-Details – Garantiert nicht null! */}
          <ProductInfo product={product} />
          
        </div>
      </main>
    </div>
  );
}