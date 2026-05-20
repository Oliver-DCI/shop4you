import React from 'react';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import ShopClientView from '@/components/shop/ShopClientView';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface HeroSection {
  id: string;
  type: 'minimal' | 'dark' | 'split' | 'editorial';
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  bgImage: string;
  ctaText: string;
}

interface HomePageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    brand?: string;
    sort?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const activeCategory = params.category;
  const searchQuery = params.search;
  const activeBrand = params.brand;
  const activeSort = params.sort;

  const whereClause: any = {};

  if (activeCategory && activeCategory !== 'Produkte') {
    whereClause.category = activeCategory;
  }

  if (activeBrand) {
    whereClause.OR = [
      { title: { contains: activeBrand, mode: 'insensitive' } },
      { description: { contains: activeBrand, mode: 'insensitive' } }
    ];
  }

  if (searchQuery) {
    const searchConditions = [
      { title: { contains: searchQuery, mode: 'insensitive' } },
      { description: { contains: searchQuery, mode: 'insensitive' } },
      { category: { contains: searchQuery, mode: 'insensitive' } }
    ];
    
    if (whereClause.OR) {
      whereClause.AND = [
        { OR: whereClause.OR },
        { OR: searchConditions }
      ];
      delete whereClause.OR;
    } else {
      whereClause.OR = searchConditions;
    }
  }

  let orderByClause: any = { price: 'desc' };

  if (activeSort === 'price_asc') {
    orderByClause = { price: 'asc' };
  } else if (activeSort === 'price_desc') {
    orderByClause = { price: 'desc' };
  } else if (activeSort === 'alpha_asc') {
    orderByClause = { title: 'asc' };
  } else if (activeSort === 'createdAt_desc') {
    orderByClause = { createdAt: 'desc' };
  }

  const allProducts = await prisma.product.findMany({
    where: whereClause,
    orderBy: orderByClause,
  });

  // 👑 ALLE 5 HEROS FÜR DIE KATEGORIEN (Inklusive Zubehör!)
  const heroMap: Record<string, HeroSection> = {
    'Notebooks': {
      id: 'hero-notebooks',
      type: 'dark',
      tag: 'Kreativität ohne Limits',
      title: 'QUANTUM SERIE',
      subtitle: 'Die Evolution des Arbeitens.',
      description: 'Erlebe rohe Performance verpackt in ultra-präzisem, matt-schwarzem Aluminium. Gemacht für Architekten des Codes und Pioniere des Designs.',
      bgImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1800',
      ctaText: 'Jetzt konfigurieren',
    },
    'Smartphones': {
      id: 'hero-smartphones',
      type: 'minimal',
      tag: 'Militärstandard trifft Ästhetik',
      title: 'TITAN SHIELD',
      subtitle: 'Unzerstörbar. Unaufhaltsam.',
      description: 'Hauchdünnes Titangehäuse gepaart mit einem unzerkratzbaren Saphirglas-Display. Intelligente KI, die deine Absichten erkennt.',
      bgImage: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1800',
      ctaText: 'Entdecken',
    },
    'TV': {
      id: 'hero-tv',
      type: 'split',
      tag: 'Kino, neu definiert',
      title: 'NEO QLED 8K',
      subtitle: 'Reine Realität. In jedem Pixel.',
      description: 'Licht und Schatten in absoluter Perfektion. Quantum-Mini-LEDs erzeugen Kontraste, die du so noch nie erlebt hast.',
      bgImage: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1800',
      ctaText: 'Größen vergleichen',
    },
    'Audio': {
      id: 'hero-audio',
      type: 'editorial',
      tag: 'Reiner Akustischer Luxus',
      title: 'SOUNDAURA AIR',
      subtitle: 'Stille war noch nie so intensiv.',
      description: 'Hybrides Active Noise Cancelling blendet die Welt komplett aus. Jede Nuance deiner Musik wird spürbar.',
      bgImage: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1800',
      ctaText: 'Probehören',
    },
    'Zubehör': {
      id: 'hero-accessories',
      type: 'minimal',
      tag: 'Perfektionierung deines Setups',
      title: 'ESSENTIAL GEAR',
      subtitle: 'Das unsichtbare Rückgrat deiner Produktivität.',
      description: 'Ergonomische Tools, ultraschnelle Konnektivität und intelligentes Power-Management. Jedes Teil ein Meisterwerk im Detail.',
      bgImage: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=1800',
      ctaText: 'Setup erweitern',
    },
  };

  let dynamicLayout: any[] = [];
  const isPureHome = (!activeCategory || activeCategory === 'Produkte') && !searchQuery && !activeSort && !activeBrand;

  if (isPureHome) {
    const categoriesOrder = ['Notebooks', 'Smartphones', 'TV', 'Audio', 'Zubehör'];
    
    categoriesOrder.forEach((cat) => {
      const catProducts = allProducts.filter(p => p.category === cat).slice(0, 4);
      
      if (catProducts.length > 0) {
        // Jeder Block wird mit seinem passenden Hero eingeleitet
        if (heroMap[cat]) {
          dynamicLayout.push({
            type: 'hero_section',
            hero: heroMap[cat]
          });
        }

        dynamicLayout.push({
          type: 'product_row',
          categoryName: cat,
          products: catProducts
        });
      }
    });
  } else {
    // Wenn eine Kategorie aktiv ist, rückt deren Hero an die Spitze
    if (activeCategory && heroMap[activeCategory] && !searchQuery && !activeBrand) {
      dynamicLayout.push({
        type: 'hero_section',
        hero: heroMap[activeCategory]
      });
    }

    dynamicLayout.push({
      type: 'flat_grid',
      products: allProducts
    });
  }

  return (
    <ShopClientView 
      products={allProducts}
      dynamicLayout={dynamicLayout}
      activeCategory={activeCategory}
      activeBrand={activeBrand}
      searchQuery={searchQuery}
    />
  );
}