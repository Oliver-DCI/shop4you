// src/app/(shop)/page.tsx
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
    search?: string; // ✨ Suchparameter hinzugefügt
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const activeCategory = params.category;
  const searchQuery = params.search; // ✨ Suchbegriff auslesen

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
    <div className="bg-zinc-50 text-zinc-900 min-h-screen relative overflow-hidden selection:bg-blue-600 selection:text-white">
      
      {/* Ambient-Glows... (Rest bleibt exakt gleich wie vorher!) */}
      <div className="absolute top-[-5%] left-[-5%] w-[800px] h-[800px] rounded-full bg-cyan-400/10 blur-[140px] pointer-events-none animate-pulse duration-5000" />
      <div className="absolute top-[30%] right-[-10%] w-[900px] h-[900px] rounded-full bg-blue-500/5 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[700px] h-[700px] rounded-full bg-indigo-500/5 blur-[130px] pointer-events-none" />

      {/* 1. DIGITAL HERO SECTION */}
      <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-20 border-b border-zinc-200/60 bg-white/40 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-blue-50 text-blue-600 mb-6 border border-blue-200/50 shadow-xs uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
            2026 Hardware Matrix Online
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter leading-none uppercase text-zinc-950">
            Maximale Performance. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600">
              Keine Kompromisse.
            </span>
          </h1>
          <p className="mt-5 text-sm sm:text-base text-zinc-500 max-w-xl mx-auto font-medium leading-relaxed">
            Entdecke unsere komplette Datenbank aus High-End Notebooks, ultradünnen Tablets und State-of-the-Art Komponenten.
          </p>
        </div>
      </section>

      {/* HAUPTINHALT: Volle Power im 4er-Raster */}
      <main id="produkte" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 flex flex-col gap-16">
        
        {/* Status-Bar */}
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-zinc-950 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-blue-600 rounded-full inline-block" />
              Gefundene Hardware
            </h2>
            <p className="text-zinc-400 text-xs mt-0.5 font-medium">
              {activeCategory ? `Kategorie: ${activeCategory}` : 'Vollständiges Sortiment aus unserer Core-Database.'}
            </p>
          </div>
          <span className="text-xs font-black tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-xl">
            {products.length} Artikel geladen
          </span>
        </div>

        {products.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-zinc-200 text-zinc-400 font-bold uppercase tracking-wider text-xs">
            Keine Produkte in dieser Kategorie gefunden.
          </div>
        )}

        {/* 📦 MATRIZEN-BLOCK 1 */}
        {block1.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {block1.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* 🎬 INTERAKTIVES HERO-BANNER 1: Die schwebende Tablet-Animation */}
        <section className="w-full bg-gradient-to-br from-zinc-900 via-zinc-950 to-blue-950 rounded-3xl p-8 lg:p-12 border border-zinc-800 relative overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(37,99,235,0.1),transparent)]" />
          
          <div className="flex flex-col gap-4 max-w-xl relative z-10">
            <span className="text-cyan-400 font-black text-[9px] tracking-widest uppercase bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-md self-start">
              Next-Gen Display-Tech
            </span>
            <h3 className="text-white text-2xl sm:text-4xl font-black uppercase tracking-tight leading-none">
              Das neue Tab X12 Ultra. <br />Dünner als ein Magazin.
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium leading-relaxed">
              Erlebe kinoreife Kontraste mit dem 144Hz Ultra-OLED Panel. Vollgepackt mit Desktop-Power, optimiert für kreative Workflows von morgen.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-white font-black text-xl">Ab 799.00 €</span>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest border border-zinc-800 px-2.5 py-1 rounded-lg">Sofort verfügbar</span>
            </div>
          </div>

          {/* 📱 Das animierte Visual: Virtuelles Tablet-Mockup */}
          <div className="relative w-64 h-44 sm:w-80 sm:h-52 shrink-0 bg-zinc-900 border-4 border-zinc-800 rounded-2xl shadow-2xl overflow-hidden shadow-blue-500/10 transition-transform duration-700 group-hover:scale-105 group-hover:rotate-[-1deg] flex items-center justify-center">
            {/* Innerer Display-Inhalt mit CSS-Lichteffekt */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900 via-purple-900 to-blue-600 animate-pulse duration-3000" />
            <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] group-hover:animate-shine" />
            
            {/* Animierte Grafikelemente auf dem "Tablet-Display" */}
            <div className="relative z-10 flex flex-col items-center gap-2 text-center">
              <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-black text-white text-xs animate-bounce">
                ⚡
              </div>
              <span className="text-[10px] font-black tracking-widest text-cyan-300 uppercase">AERO OS v4.2</span>
              <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-cyan-400 rounded-full animate-infinite-scroll" />
              </div>
            </div>
          </div>
        </section>

        {/* 📦 MATRIZEN-BLOCK 2 */}
        {block2.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {block2.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* 🎬 HIGH-END TECH-BANNER 2: Cinematic Focus */}
        <section className="w-full aspect-[21/9] sm:aspect-[32/10] rounded-3xl overflow-hidden relative border border-blue-500/20 shadow-lg group">
          <Image 
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600" 
            alt="Silicon Innovation"
            fill
            className="object-cover object-center brightness-[0.3] contrast-[1.1] group-hover:scale-102 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-transparent to-transparent flex flex-col justify-center px-8 sm:px-16 gap-3">
            <span className="text-blue-400 font-black text-[9px] tracking-widest uppercase bg-blue-950/60 border border-blue-500/30 px-2.5 py-1 rounded-md self-start">
              Pure Architecture
            </span>
            <h3 className="text-white text-xl sm:text-3xl font-black uppercase tracking-tight max-w-md leading-tight">
              4nm Silizium. <br />Kühler Kopf bei Volllast.
            </h3>
            <p className="text-zinc-400 text-xs max-w-sm font-medium hidden sm:block leading-relaxed">
              Unsere neuen Notebooks laufen dank revolutionärer Thermal-Vapor-Chamber absolut lautlos und drosseln niemals die Leistung.
            </p>
          </div>
        </section>

        {/* 📦 MATRIZEN-BLOCK 3 */}
        {block3.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {block3.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* 🎬 SERVICE & BANNER 3: Premium Trust */}
        <section className="w-full bg-white rounded-3xl p-8 border border-zinc-200/80 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-xs">
          <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-start gap-4">
            <div className="text-2xl p-3 bg-blue-50 border border-blue-100 rounded-2xl text-blue-600 hidden sm:block shrink-0">
              🛡️
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-zinc-950 font-black text-base uppercase tracking-tight">
                3 Jahre Premium-Garantie auf das gesamte Lineup
              </h3>
              <p className="text-zinc-500 text-xs font-medium max-w-2xl leading-relaxed">
                Weil Langlebigkeit bei uns Standard ist. Profitiere von unserem 24/7 Vor-Ort-Austauschservice und direktem Hardware-Support ohne lange Wartezeiten.
              </p>
            </div>
          </div>
          <button className="bg-zinc-950 text-white font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl hover:bg-zinc-800 active:scale-[0.98] transition-all shrink-0 shadow-sm">
            Garantie-Details
          </button>
        </section>

        {/* 📦 MATRIZEN-BLOCK 4 */}
        {block4.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {block4.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </main>
    </div>
  );
}