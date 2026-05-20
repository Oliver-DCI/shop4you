'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import ProductCard from '@/components/shop/ProductCard';

// Typensicherer Blueprint für das gestaffelte Hereingleiten der Karten
const fadeInVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: [0.215, 0.610, 0.355, 1.000]
    }
  }
};

interface ShopClientViewProps {
  products: any[];
  activeCategory?: string;
  activeBrand?: string;
  searchQuery?: string;
}

export default function ShopClientView({ 
  products, 
  activeCategory, 
  activeBrand, 
  searchQuery 
}: ShopClientViewProps) {
  
  // Real-time Erkennung von Scroll-Bewegungen für die Skalierung der Hero-Sektion
  const { scrollY } = useScroll();
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.92]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  const isFiltered = Boolean(activeCategory && activeCategory !== 'Produkte' || activeBrand || searchQuery);

  // Segmentierung der Live-Daten für die asymmetrische Samsung-Szenenarchitektur
  const block1 = products.slice(0, 4);
  const block2 = products.slice(4, 10);
  const block3 = products.slice(10, 16);
  const block4 = products.slice(16);

  return (
    <div className="bg-white text-black min-h-screen relative overflow-hidden selection:bg-black selection:text-white rounded-none">
      
      {/* 1. HERO MAIN STAGE (Verschwindet im Fokus-Filtermodus lautlos) */}
      {!isFiltered && (
        <motion.section 
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="relative pt-24 pb-20 border-b border-zinc-200 bg-white origin-center"
        >
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
        </motion.section>
      )}

      {/* PRODUKT-LANDSCHAFT */}
      <main id="produkte" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 flex flex-col gap-16">
        
        {/* Status-Bar */}
        <div className="flex items-end justify-between border-b border-zinc-200 pb-4">
          <div>
            <h2 className="text-lg font-normal uppercase tracking-wider text-black">
              {isFiltered ? 'Suchergebnisse' : 'Verfügbare Hardware'}
            </h2>
            <p className="text-zinc-400 text-xs mt-1 font-mono uppercase tracking-wider">
              {activeCategory ? `Kategorie: ${activeCategory}` : 'Gesamtes Sortiment'}
              {activeBrand ? ` // Hersteller: ${activeBrand}` : ''}
            </p>
          </div>
          <span className="text-[11px] font-medium tracking-widest text-black bg-zinc-100 border border-zinc-200 px-3 py-1.5 rounded-none uppercase">
            {products.length} Artikel
          </span>
        </div>

        {products.length === 0 && (
          <div className="text-center py-24 bg-zinc-50 border border-zinc-200 text-zinc-400 font-normal uppercase tracking-widest text-xs rounded-none">
            Keine Produkte mit den ausgewählten Kriterien gefunden.
          </div>
        )}

        {/* 📦 MATRIZEN-BLOCK 1 */}
        {block1.length > 0 && (
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12"
          >
            {block1.map((product) => (
              <motion.div key={product.id} variants={fadeInVariant}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* 🎬 HIGH-TECH BANNER 1 (OLED Cinematic) */}
        {!isFiltered && block2.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="w-full bg-zinc-950 p-10 lg:p-16 rounded-none border border-zinc-900 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 group"
          >
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
            </div>

            <div className="relative w-64 h-44 sm:w-80 sm:h-52 shrink-0 bg-black border border-zinc-800 rounded-none shadow-2xl overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900 to-zinc-800 opacity-60" />
              <div className="relative z-10 flex flex-col items-center gap-3 text-center">
                <div className="h-10 w-10 rounded-none bg-white/5 border border-white/10 flex items-center justify-center text-white text-xs">▲</div>
                <span className="text-[10px] font-medium tracking-widest text-zinc-300 uppercase">AERO OS v4.2</span>
              </div>
            </div>
          </motion.section>
        )}

        {/* 📦 MATRIZEN-BLOCK 2 */}
        {block2.length > 0 && (
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12"
          >
            {block2.map((product) => (
              <motion.div key={product.id} variants={fadeInVariant}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* 🎬 HIGH-END TECH-BANNER 2 (Silicon Architecture) */}
        {!isFiltered && block3.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full aspect-[21/9] sm:aspect-[32/10] rounded-none overflow-hidden relative border border-zinc-200 group"
          >
            <Image 
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600" 
              alt="Silicon Innovation"
              fill
              className="object-cover object-center brightness-[0.25] contrast-[1.1]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent flex flex-col justify-center px-8 sm:px-16 gap-4">
              <span className="text-zinc-400 font-medium text-[10px] tracking-widest uppercase bg-zinc-900/80 border border-zinc-800 px-3 py-1 rounded-none self-start">
                Pure Architecture
              </span>
              <h3 className="text-white text-xl sm:text-3xl font-light uppercase tracking-tight max-w-md leading-tight">
                4nm Silizium. <br /><span className="text-zinc-500 font-normal">Kühler Kopf bei Volllast.</span>
              </h3>
            </div>
          </motion.section>
        )}

        {/* 📦 MATRIZEN-BLOCK 3 */}
        {block3.length > 0 && (
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12"
          >
            {block3.map((product) => (
              <motion.div key={product.id} variants={fadeInVariant}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* 🎬 DYNAMISCHER ASYMMETRISCHER ZWISCHEN-BLOCK (Wechselt zu dünner Linie bei aktivem Filter) */}
        <div className={`w-full transition-colors duration-300 ${isFiltered ? 'h-px bg-zinc-200' : 'bg-zinc-50 p-10 border border-zinc-200'}`}>
          {!isFiltered ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
              <div className="flex items-start gap-5">
                <div className="text-xl p-3 bg-white border border-zinc-200 rounded-none text-black hidden sm:block shrink-0">■</div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-black font-normal text-base uppercase tracking-wider">3 Jahre Premium-Garantie auf das gesamte Lineup</h3>
                  <p className="text-zinc-500 text-xs font-normal max-w-2xl leading-relaxed">
                    Zuverlässigkeit ist unser Versprechen. Profitiere von unserem Business-Austauschservice und direktem Experten-Support ohne Verzögerung.
                  </p>
                </div>
              </div>
              <button className="bg-black text-white font-medium text-xs uppercase tracking-widest px-6 py-3.5 rounded-none hover:bg-zinc-900 transition-colors shrink-0 cursor-pointer">
                Garantie-Details
              </button>
            </div>
          ) : null}
        </div>

        {/* 📦 MATRIZEN-BLOCK 4 */}
        {block4.length > 0 && (
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12"
          >
            {block4.map((product) => (
              <motion.div key={product.id} variants={fadeInVariant}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}

      </main>
    </div>
  );
}