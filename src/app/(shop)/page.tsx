// src/app/(shop)/page.tsx
import React from 'react';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import Image from 'next/image';
import ProductCard from '@/components/shop/ProductCard';
import CategoryFilter from '@/components/shop/CategoryFilter'; // ✨ Neu importiert

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface HomePageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const activeCategory = params.category;

  // 1. Alle einzigartigen Kategorien für die Filterleiste holen (bleibt immer vollständig)
  const allProductsForCategories = await prisma.product.findMany({ select: { category: true } });
  const categories = ['Alle Hardware', ...Array.from(new Set(allProductsForCategories.map(p => p.category)))];

  // 2. Produkte dynamisch filtern basierend auf der URL
  const products = await prisma.product.findMany({
    where: activeCategory ? { category: activeCategory } : {},
    orderBy: { createdAt: 'desc' },
  });

  // Aufteilen der gefilterten Produkte für die Reihen
  const firstRowProducts = products.slice(0, 4);
  const secondRowProducts = products.slice(4, 8);

  return (
    <div className="bg-zinc-50 text-zinc-900 min-h-screen relative overflow-hidden selection:bg-blue-600 selection:text-white">
      
      {/* Ambient-Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-cyan-400/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[700px] h-[700px] rounded-full bg-blue-500/5 blur-[150px] pointer-events-none" />

      {/* 1. HELLER HERO BEREICH */}
      <section className="relative pt-16 pb-12 lg:pt-24 lg:pb-16 border-b border-zinc-200/60 bg-white/40 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 mb-4 border border-blue-200/50 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Next-Gen Computing & Tech
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none uppercase text-zinc-950">
            High-End Hardware bei <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500">
              shop4you.
            </span>
          </h1>
          <p className="mt-4 text-sm text-zinc-500 max-w-lg mx-auto font-medium leading-relaxed">
            Entdecke ultimative Performance. Erstklassige Hardware, perfekt abgestimmt auf deinen digitalen Lifestyle.
          </p>
        </div>
      </section>

      {/* 2. PRODUKT-MATRIX & HIGHLIGHT-BANNER */}
      <main id="produkte" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 flex flex-col gap-12">
        
        {/* Sektions-Header & Filterleiste */}
        <div className="border-b border-zinc-200 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-zinc-950 flex items-center gap-2">
                <span className="w-1 h-5 bg-blue-600 rounded-full inline-block" />
                Unsere Tech-Highlights
              </h2>
              <p className="text-zinc-400 text-xs mt-0.5 font-medium">
                {activeCategory ? `Gefiltert nach: ${activeCategory}` : 'Präzise sortierte Premium-Geräte im großzügigen 4-Spalten-Layout.'}
              </p>
            </div>
            <span className="text-[10px] font-bold tracking-wider text-zinc-400 bg-white border border-zinc-200 px-2.5 py-1 rounded-lg shadow-xs">
              {products.length} Modelle {activeCategory ? 'in dieser Kategorie' : 'verfügbar'}
            </span>
          </div>

          {/* ✨ Funktionale Filterleiste */}
          <CategoryFilter categories={categories} />
        </div>

        {/* Wenn in einer Kategorie gar keine Produkte sind */}
        {products.length === 0 && (
          <div className="text-center py-12 bg-white/50 backdrop-blur-md rounded-2xl border border-zinc-200 text-zinc-500 font-medium text-sm">
            Keine Produkte in dieser Kategorie gefunden.
          </div>
        )}

        {/* REIHE 1 */}
        {firstRowProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {firstRowProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* HERO-BANNER 1 */}
        <section className="w-full aspect-[21/9] sm:aspect-[32/10] rounded-2xl overflow-hidden relative border border-blue-500/20 shadow-md">
          <Image 
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600" 
            alt="Tech Innovation Banner"
            fill
            className="object-cover object-center brightness-[0.35] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/80 via-transparent to-transparent flex flex-col justify-center px-6 sm:px-12 gap-2">
            <span className="text-cyan-400 font-black text-[9px] tracking-widest uppercase bg-cyan-950/50 border border-cyan-500/30 px-2 py-0.5 rounded-md self-start">
              LIVE FROM THE LAB
            </span>
            <h3 className="text-white text-lg sm:text-2xl font-black uppercase tracking-tight max-w-md leading-tight">
              Kompakt. Lautlos. <br />Grenzenlos effizient.
            </h3>
            <p className="text-blue-200/70 text-xs max-w-xs font-medium hidden sm:block">
              Erlebe die lüfterlose Prozessorarchitektur der nächsten Generation im AeroBook Air 14.
            </p>
          </div>
        </section>

        {/* REIHE 2 */}
        {secondRowProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {secondRowProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* HERO-BANNER 2 */}
        <section className="w-full bg-gradient-to-r from-zinc-900 to-zinc-950 rounded-2xl p-6 sm:p-8 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-xs">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col gap-1">
            <h3 className="text-white font-black text-sm sm:text-base uppercase tracking-tight">
              🛡️ 3 JAHRE PREMIUM-GARANTIE AUF ALLES
            </h3>
            <p className="text-zinc-400 text-xs font-medium max-w-xl">
              Weil wir an die Langlebigkeit unserer Hardware glauben. Inklusive 24/7 Express-Austauschservice und persönlichem Support für all deine Projekte.
            </p>
          </div>
          <button className="bg-white text-zinc-950 font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl hover:bg-zinc-100 transition-all shrink-0">
            Mehr erfahren
          </button>
        </section>

      </main>
    </div>
  );
}