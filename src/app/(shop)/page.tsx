// src/app/(shop)/page.tsx
import React from 'react';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import Link from 'next/link';
import Image from 'next/image';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default async function HomePage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    // Durchgehend helles, sauberes Design
    <div className="bg-zinc-50 text-zinc-900 min-h-screen relative overflow-hidden selection:bg-blue-600 selection:text-white">
      
      {/* Edle, eiskalte Cyan- und Kobaltblauen Glow-Effekte im Hintergrund */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-cyan-400/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[700px] h-[700px] rounded-full bg-blue-500/10 blur-[150px] pointer-events-none" />

      {/* 1. HELLER HERO BEREICH (100% fokussiert auf shop4you) */}
      <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 border-b border-zinc-200/80 bg-white/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 mb-6 border border-blue-200/60 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Qualität & Innovation
          </span>
          
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight uppercase text-zinc-950">
            Alles für dein Projekt bei <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 drop-shadow-sm">
              shop4you.
            </span>
          </h1>
          
          <p className="mt-6 text-lg text-zinc-600 max-w-xl mx-auto font-medium leading-relaxed">
            Entdecke hochwertige Produkte, erstklassige Materialien und moderne Highlights für dein Zuhause und deinen Lifestyle.
          </p>
          
          <div className="mt-8 flex justify-center">
            <a href="#produkte" className="h-11 px-6 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all flex items-center shadow-md shadow-blue-600/10 hover:scale-102 duration-200 text-sm tracking-wide">
              PRODUKTE ANSEHEN
            </a>
          </div>
        </div>
      </section>

      {/* 2. PRODUKT BEREICH */}
      <main id="produkte" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        
        {/* Sektions-Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4 border-b border-zinc-200 pb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-950 flex items-center gap-2.5">
              <span className="w-1 h-7 bg-blue-600 rounded-full inline-block" />
              Unsere Produkt-Highlights
            </h2>
            <p className="text-zinc-500 text-sm mt-1 font-medium">
              Ausgewählte Artikel im modernen Kacheldesign.
            </p>
          </div>
          <span className="text-xs font-black tracking-wider text-zinc-500 bg-white border border-zinc-200 px-3 py-1.5 rounded-xl shadow-xs">
            {products.length} Artikel verfügbar
          </span>
        </div>

        {/* 🚀 Das saubere 4-Spalten-Grid für breite Bildschirme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const displayImage = product.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800';

            return (
              <Link 
                key={product.id} 
                href={`/product/${product.id}`}
                className="group flex flex-col bg-white/70 backdrop-blur-xl rounded-2xl border border-white/80 overflow-hidden hover:border-blue-500/30 hover:shadow-[0_15px_30px_rgba(37,99,235,0.06)] hover:-translate-y-0.5 transition-all duration-300 shadow-xs"
              >
                {/* Bild-Container */}
                <div className="relative aspect-square w-full bg-zinc-100 overflow-hidden border-b border-zinc-200/40">
                  <Image
                    src={displayImage}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-103"
                  />
                  {/* Kategorie-Badge */}
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-blue-600 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border border-zinc-200 shadow-xs z-20">
                    {product.category}
                  </span>
                </div>

                {/* Content-Bereich */}
                <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                  <div>
                    <h3 className="font-black text-base text-zinc-950 tracking-tight group-hover:text-blue-600 transition-colors line-clamp-1 uppercase">
                      {product.title}
                    </h3>
                    <p className="text-xs text-zinc-500 line-clamp-2 mt-1.5 leading-relaxed font-medium">
                      {product.description}
                    </p>
                  </div>

                  {/* Unterer Block: Preis & Button */}
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-100 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Preis</span>
                      <span className="text-base font-black text-zinc-950 group-hover:text-blue-600 transition-colors">
                        {product.price.toFixed(2)} €
                      </span>
                    </div>
                    {/* Diskreter blauer Pfeil */}
                    <div className="h-8 w-8 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent transition-all duration-200 flex items-center justify-center font-bold text-xs">
                      ➔
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </main>
    </div>
  );
}