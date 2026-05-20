import React from 'react';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { notFound } from 'next/navigation';
import Link from 'next/link'; // ✨ Next.js Link für blitzschnelles Umschalten ohne Hänger
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

  // Produkt direkt aus PostgreSQL holen
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
    return null; 
  }

  return (
    <div className="bg-white text-black min-h-screen relative overflow-hidden py-12 md:py-20 rounded-none selection:bg-black selection:text-white">
      
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Back-Link: Nutzt jetzt <Link> statt <a href> für echtes Next-Routing */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-normal uppercase tracking-widest text-zinc-400 hover:text-black transition-colors"
          >
            ◀ ZURÜCK ZUR ÜBERSICHT
          </Link>
        </div>

        {/* Das 2-Spalten Layout im rahmenlosen Studio-Look */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start bg-white p-0 rounded-none border-0">
          
          {/* Linke Seite: Bildergalerie */}
          <ProductImages images={product.images} title={product.title} />
          
          {/* Rechte Seite: Produkt-Details */}
          <ProductInfo product={product} />
          
        </div>
      </main>
    </div>
  );
}