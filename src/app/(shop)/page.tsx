import React from 'react';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import Image from 'next/image';
import ProductCard from '@/components/shop/ProductCard';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface HomePageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const activeCategory = params.category;
  const searchQuery = params.search;

  // Dynamische Prisma-Where-Klausel bauen
  const whereClause: any = {};

  if (activeCategory) {
    whereClause.category = activeCategory;
  }

  if (searchQuery) {
    whereClause.OR = [
      { title: { contains: searchQuery, mode: 'insensitive' } },
      { description: { contains: searchQuery, mode: 'insensitive' } },
      { category: { contains: searchQuery, mode: 'insensitive' } }
    ];
  }

  // Produkte aus DB holen mit kombinierter Filter- & Suchlogik
  const products = await prisma.product.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  });

  // Aufteilen der gefilterten Produkte für die Reihen
  const block1 = products.slice(0, 4);
  const block2 = products.slice(4, 10);
  const block3 = products.slice(10, 16);
  const block4 = products.slice(16);

  return (
    <div className="bg-white text-black min-h-screen relative overflow-hidden selection:bg-black selection:text-white rounded-none">
      
      {/* 1. MINIMALIST HERO SECTION */}
      <section className="relative pt-24 pb-20 border-b border-zinc-200 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-left relative z-10">
          <span className="inline-flex items-center gap-2 px-0 py-1 text-[11px] font-medium text-zinc-400 mb-4 uppercase tracking-widest">
            ● Lineup 2026
          </span>
          <h1 className="text-4xl sm:text-6xl font-normal tracking-tight leading-none uppercase text-black">
            Maximale Performance. <br />
            <span className="font-light text-zinc-400">Keine Kompromisse.</span>
          </h1>
          <p className="mt-6 text-xs sm:text-sm text-zinc-500 max-w-xl font-normal leading-relaxed">
            Entdecke zukunftsweisende Notebook-Architekturen, ultradünne Displays und State-of-the-Art Komponenten, reduziert auf das Wesentliche.
          </p>
        </div>
      </section>

      {/* HAUPTINHALT: Monochrom-Raster */}
      <main id="produkte" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 flex flex-col gap-20">
        
        {/* Status-Bar */}
        <div className="flex items-end justify-between border-b border-zinc-200 pb-4">
          <div>
            <h2 className="text-lg font-normal uppercase tracking-wider text-black">
              Verfügbare Hardware
            </h2>
            <p className="text-zinc-400 text-xs mt-1 font-normal">
              {activeCategory ? `Kategorie: ${activeCategory}` : 'Vollständiges Sortiment aus unserer Datenbank.'}
            </p>
          </div>
          <span className="text-[11px] font-medium tracking-widest text-black bg-zinc-100 border border-zinc-200 px-3 py-1.5 rounded-none uppercase">
            {products.length} Artikel
          </span>
        </div>

        {products.length === 0 && (
          <div className="text-center py-24 bg-zinc-50 border border-zinc-200 text-zinc-400 font-normal uppercase tracking-widest text-xs rounded-none">
            Keine Produkte in dieser Kategorie gefunden.
          </div>
        )}

        {/* 📦 MATRIZEN-BLOCK 1 */}
        {block1.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {block1.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* 🎬 TECH-BANNER 1: Die schwebende Tablet-Animation (Samsung-Look) */}
        <section className="w-full bg-zinc-950 p-10 lg:p-16 rounded-none border border-zinc-900 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 group">
          <div className="flex flex-col gap-5 max-w-xl relative z-10">
            <span className="text-zinc-400 font-medium text-[10px] tracking-widest uppercase bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-none self-start">
              Next-Gen Display-Tech
            </span>
            <h3 className="text-white text-2xl sm:text-4xl font-light uppercase tracking-tight leading-tight">
              Das neue Tab X12 Ultra. <br /><span className="text-zinc-500 font-normal">Dünner als ein Magazin.</span>
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm font-normal leading-relaxed">
              Erlebe kompromisslose Kontraste mit dem neuen Tandem-OLED Panel. Vollgepackt mit Prozessor-Power der nächsten Generation, optimiert für anspruchsvollste Workflows.
            </p>
            <div className="flex items-center gap-6 mt-2">
              <span className="text-white font-normal text-xl tracking-tight">Ab 799.00 €</span>
              <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest border border-zinc-800 px-3 py-1 rounded-none">Sofort verfügbar</span>
            </div>
          </div>

          {/* 📱 Das minimalistische Display-Visual */}
          <div className="relative w-64 h-44 sm:w-80 sm:h-52 shrink-0 bg-black border border-zinc-800 rounded-none shadow-2xl overflow-hidden flex items-center justify-center">
            {/* Display-Inhalt rein dunkel-monochrom gehalten */}
            <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900 to-zinc-800 opacity-60" />
            
            <div className="relative z-10 flex flex-col items-center gap-3 text-center">
              <div className="h-10 w-10 rounded-none bg-white/5 border border-white/10 flex items-center justify-center text-white text-xs">
                ▲
              </div>
              <span className="text-[10px] font-medium tracking-widest text-zinc-300 uppercase">AERO OS v4.2</span>
              <div className="w-24 h-[2px] bg-zinc-800 rounded-none overflow-hidden">
                <div className="w-2/3 h-full bg-white rounded-none" />
              </div>
            </div>
          </div>
        </section>

        {/* 📦 MATRIZEN-BLOCK 2 */}
        {block2.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {block2.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* 🎬 HIGH-END TECH-BANNER 2: Cinematic Focus */}
        <section className="w-full aspect-[21/9] sm:aspect-[32/10] rounded-none overflow-hidden relative border border-zinc-200 group">
          <Image 
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600" 
            alt="Silicon Innovation"
            fill
            className="object-cover object-center brightness-[0.25] contrast-[1.1] transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent flex flex-col justify-center px-8 sm:px-16 gap-4">
            <span className="text-zinc-400 font-medium text-[10px] tracking-widest uppercase bg-zinc-900/80 border border-zinc-800 px-3 py-1 rounded-none self-start">
              Pure Architecture
            </span>
            <h3 className="text-white text-xl sm:text-3xl font-light uppercase tracking-tight max-w-md leading-tight">
              4nm Silizium. <br /><span className="text-zinc-500 font-normal">Kühler Kopf bei Volllast.</span>
            </h3>
            <p className="text-zinc-400 text-xs max-w-sm font-normal hidden sm:block leading-relaxed">
              Dank hochentwickelter Vapor-Chamber-Kühlsysteme arbeiten unsere Notebooks hocheffizient, geräuschlos und dauerhaft performant.
            </p>
          </div>
        </section>

        {/* 📦 MATRIZEN-BLOCK 3 */}
        {block3.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {block3.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* 🎬 SERVICE & BANNER 3: Premium Trust */}
        <section className="w-full bg-white rounded-none p-10 border border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="flex items-start gap-5">
            <div className="text-xl p-3 bg-zinc-50 border border-zinc-200 rounded-none text-black hidden sm:block shrink-0">
              ■
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-black font-normal text-base uppercase tracking-wider">
                3 Jahre Premium-Garantie auf das gesamte Lineup
              </h3>
              <p className="text-zinc-500 text-xs font-normal max-w-2xl leading-relaxed">
                Zuverlässigkeit ist unser Versprechen. Profitiere von unserem Business-Austauschservice und direktem Experten-Support ohne Verzögerung.
              </p>
            </div>
          </div>
          <button className="bg-black text-white font-medium text-xs uppercase tracking-widest px-6 py-3.5 rounded-none hover:bg-zinc-900 transition-colors shrink-0 cursor-pointer">
            Garantie-Details
          </button>
        </section>

        {/* 📦 MATRIZEN-BLOCK 4 */}
        {block4.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {block4.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </main>
    </div>
  );
}