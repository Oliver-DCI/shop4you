import React from 'react';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductImages from '@/components/shop/ProductImages';
import ProductInfo from '@/components/shop/ProductInfo';

// Prisma Setup
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  
  // 1. Aktuelles Produkt laden
  const product = await prisma.product.findUnique({ where: { id } });

  // 2. Highlights laden (5 Stück, exklusive dem aktuellen Produkt)
  const highlights = await prisma.product.findMany({
    where: {
      NOT: { id: id }
    },
    take: 5,
    orderBy: {
      createdAt: 'desc'
    }
  });

  if (!product) {
    notFound();
    return null; 
  }

  return (
    <div className="bg-white text-black min-h-screen py-12 md:py-20 rounded-none selection:bg-black selection:text-white">
      {/* 🎯 FIX: Padding fluchtet jetzt perfekt auf sm und lg Screens mit dem Rest der App */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Zurück-Navigation */}
        <div className="mb-8">
          {/* 🎯 KOSMETIK: text-zinc-400 -> text-samsung-muted */}
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-normal uppercase tracking-widest text-samsung-muted hover:text-black transition-colors">
            ◀ ZURÜCK ZUR ÜBERSICHT
          </Link>
        </div>

        {/* Haupt-Grid: Bild & Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
          <ProductImages images={product.images} title={product.title} />
          <ProductInfo product={product} />
        </div>

        {/* Dynamischer Bereich: Unsere Empfehlungen */}
        <section className="mt-24 border-t border-zinc-100 pt-16">
          {/* 🎯 KOSMETIK: text-zinc-400 -> text-samsung-muted */}
          <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-samsung-muted font-normal mb-10">
            Unsere Empfehlungen
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {highlights.map((p) => (
              <Link href={`/product/${p.id}`} key={p.id} className="group cursor-pointer">
                <div className="aspect-square bg-zinc-50 mb-3 border border-zinc-100 overflow-hidden relative">
                   {/* 🎯 FIX: Bild startet in Schwarz-Weiß (grayscale) und wechselt beim Hover in Farbe */}
                   <img 
                     src={p.images[0]} 
                     alt={p.title} 
                     className="w-full h-full object-cover grayscale hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out" 
                   />
                </div>
                {/* 🎯 KOSMETIK: text-zinc-400 -> text-samsung-muted */}
                <div className="text-[10px] uppercase font-mono tracking-wider text-samsung-muted mb-1">
                  {p.category}
                </div>
                <div className="text-xs font-bold uppercase truncate">{p.title}</div>
                <div className="text-xs font-normal text-zinc-900 mt-1">
                  {p.price.toFixed(2)} €
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}