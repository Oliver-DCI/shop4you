'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link'; 
import ProductCard from './ProductCard';
import CategoryFilter from './CategoryFilter';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  brand: string | null;
  images: string[];
  stock: number;
  createdAt: Date;
  updatedAt: Date;
  sellerId: string;
}

interface HeroData {
  id: string;
  type: 'minimal' | 'dark' | 'split' | 'editorial';
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  bgImage: string;
  ctaText: string;
  ctaLink: string; 
}

interface LayoutRow {
  type: 'product_row' | 'hero_section' | 'flat_grid';
  categoryName?: string;
  products?: Product[];
  hero?: HeroData;
}

interface ShopClientViewProps {
  products: Product[];
  dynamicLayout: LayoutRow[];
  activeCategory: string | undefined;
  activeBrand: string | undefined;
  searchQuery: string | undefined;
  categories: string[];                        
  brandsByCategory: Record<string, string[]>;  
}

const slowFadeInUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1.3, ease: [0.215, 0.610, 0.355, 1.000] }
  }
};

export default function ShopClientView({
  dynamicLayout,
  activeCategory,
  categories,          
  brandsByCategory,    
}: ShopClientViewProps) {

  const renderCategoryHero = (hero: HeroData) => {
    return (
      <section className="relative overflow-hidden bg-zinc-950 rounded-none w-full h-[380px] mt-16 mb-6">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105 hover:scale-100"
          style={{ backgroundImage: `url(${hero.bgImage})` }}
        />
        <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />

        <div className="absolute inset-0 flex flex-col justify-center items-start px-6 sm:px-12 md:px-16 z-10 text-white text-left max-w-4xl">
          <motion.span 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={slowFadeInUp}
            className="text-xs uppercase tracking-widest text-zinc-300 font-mono mb-2 block"
          >
            {hero.tag}
          </motion.span>
          <motion.h2 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={slowFadeInUp}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter mb-2 uppercase"
          >
            {hero.title}
          </motion.h2>
          <motion.p 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={slowFadeInUp}
            className="text-base sm:text-lg text-zinc-200 font-light mb-5 max-w-xl"
          >
            {hero.subtitle}
          </motion.p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={slowFadeInUp}
          >
            <Link 
              href={hero.ctaLink || '/'} 
              className="inline-block bg-white text-black hover:bg-black hover:text-white font-medium text-xs uppercase tracking-widest px-6 py-3.5 transition-all duration-500 border border-white rounded-none select-none text-center"
            >
              {hero.ctaText}
            </Link>
          </motion.div>
        </div>
      </section>
    );
  };

  return (
    <div className="w-full bg-white pb-32">
      
      <div className="w-full border-b border-zinc-100 mb-8">
        <CategoryFilter 
          categories={categories} 
          brandsByCategory={brandsByCategory} 
        />
      </div>
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end border-b border-zinc-100 pb-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
            className="md:col-span-2 text-left"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-samsung-muted block mb-3">
              {activeCategory && activeCategory !== 'Produkte' ? activeCategory : 'E-Commerce Evolution'}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-5xl font-black tracking-tight text-zinc-900 leading-none uppercase mb-4">
              {activeCategory && activeCategory !== 'Produkte' ? `Explore ${activeCategory}` : 'SHOP4YOU PREMIUM'}
            </h1>
            <p className="text-sm sm:text-base text-samsung-muted font-light leading-relaxed max-w-xl">
              Sorgfältig ausgewählte High-End-Technologie, nahtlos integriert in deinen Alltag. Erlebe Performance auf einem völlig neuen Niveau.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.4 }}
            className="hidden md:flex flex-col items-end justify-bottom text-right h-full pb-1 font-mono text-[10px] tracking-[0.4em] text-samsung-muted uppercase select-none"
          >
            <div>EST. 2026 //</div>
            <div className="text-zinc-900 font-bold mt-1">CURATED TECH.</div>
          </motion.div>

        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {(dynamicLayout || []).map((row, rowIndex) => {
          
          if (row.type === 'hero_section' && row.hero) {
            return (
              <React.Fragment key={`hero-${rowIndex}`}>
                {renderCategoryHero(row.hero)}
              </React.Fragment>
            );
          }

          if (row.type === 'product_row' && row.products) {
            return (
              <div key={`row-${rowIndex}`} className="mb-20">
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={slowFadeInUp}
                  className="flex items-baseline justify-between mb-6 border-b border-zinc-100 pb-3"
                >
                  <h3 className="text-base font-bold tracking-tight text-zinc-900 uppercase">
                    {row.categoryName}
                  </h3>
                  <span className="text-[10px] font-mono text-samsung-muted tracking-widest">
                    JETZT ENTDECKEN
                  </span>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                  {row.products.map((product, pIndex) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, amount: 0.02 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: pIndex * 0.05, 
                        ease: "easeOut" 
                      }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          }

          if (row.type === 'flat_grid' && row.products) {
            return (
              <div key={`flat-${rowIndex}`} className="py-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                  {row.products.map((product, pIndex) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: pIndex * 0.03, 
                        ease: "easeOut" 
                      }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}