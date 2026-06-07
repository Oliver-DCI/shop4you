import React from 'react';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductImages from '@/components/ProductImages';
import ProductInfo from '@/components/ProductInfo';

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

  // 2. Highlights laden (Exakt 4 Stück statt 5, passend zum SHOP4YOU Grid)
  const highlights = await prisma.product.findMany({
    where: {
      NOT: { id: id }
    },
    take: 4,
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
      {/* Padding fluchtet perfekt auf sm und lg Screens mit dem Rest der App */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Zurück-Navigation */}
        <div className="mb-8">
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
          <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-samsung-muted font-normal mb-10">
            Unsere Empfehlungen
          </h3>
          
          {/* Grid auf einheitliches 4-Spalten-Layout umgestellt */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((p) => {
              const displayImage = p.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800';
              
              return (
                <Link 
                  href={`/product/${p.id}`} 
                  key={p.id} 
                  /* 🎯 DIREKT AUS DEINER PRODUCTCARD: Das identische Box-Layout */
                  className="group flex flex-col bg-white rounded-none border border-zinc-200 overflow-hidden transition-colors duration-200 max-h-[460px] hover:border-black cursor-pointer"
                >
                  {/* Bild mit harter Kante und integriertem Kategorie-Badge */}
                  <div className="relative aspect-square w-full bg-zinc-50 overflow-hidden border-b border-zinc-200">
                    <img 
                      src={displayImage} 
                      alt={p.title} 
                      className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-[filter] duration-300" 
                    />
                    {/* Kategorie-Badge */}
                    <span className="absolute top-0 left-0 bg-black text-white text-[9px] font-medium uppercase tracking-widest px-2 py-1 rounded-none z-20">
                      {p.category}
                    </span>
                  </div>

                  {/* Inhaltsblock mit Beschreibung */}
                  <div className="p-4 flex flex-col flex-1 justify-between gap-2 bg-white">
                    <div>
                      {/* Der Hersteller im edlen Studio-Look */}
                      <div className="text-[10px] font-mono tracking-widest text-samsung-muted uppercase mb-0.5">
                        {p.brand || 'Premium Brand'}
                      </div>

                      <h3 className="font-normal text-sm text-black tracking-wide group-hover:text-zinc-600 transition-colors line-clamp-1 uppercase">
                        {p.title}
                      </h3>
                      
                      {/* Produkt-Beschreibung (zweizeilig gecuttet) */}
                      <p className="text-xs text-samsung-muted line-clamp-2 mt-1 leading-relaxed font-normal">
                        {p.description || 'Keine Beschreibung verfügbar.'}
                      </p>
                    </div>

                    {/* Preiszeile mit dem interaktiven Pfeil-Button */}
                    <div className="flex items-center justify-between pt-3 border-t border-zinc-100 mt-auto">
                      <span className="text-sm font-normal text-black tracking-tight">
                        {p.price.toFixed(2)} €
                      </span>
                      {/* Der geniale interaktive Pfeil-Button aus deinem Design */}
                      <div className="h-6 w-6 rounded-none bg-zinc-50 border border-zinc-200 text-black flex items-center justify-center font-normal text-xs group-hover:bg-black group-hover:text-white group-hover:border-transparent transition-colors duration-200">
                        →
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

      </main>
    </div>
  );
}