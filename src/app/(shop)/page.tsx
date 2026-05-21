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
  ctaLink: string; // 🎯 NEU: Der Link für den Button
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
    whereClause.brand = activeBrand;
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

  // 1. SCHRITT: Alle Produkte laden
  const allProducts = await prisma.product.findMany({
    where: whereClause,
    orderBy: orderByClause,
  });

  // 2. SCHRITT: Dynamische Filterdaten live aus der PostgreSQL generieren
  const filterRawData = await prisma.product.findMany({
    select: { category: true, brand: true },
  });

  const categoriesSet = new Set<string>();
  const brandsByCategory: Record<string, Set<string>> = {};

  filterRawData.forEach((p) => {
    if (p.category) {
      categoriesSet.add(p.category);
      
      if (!brandsByCategory[p.category]) {
        brandsByCategory[p.category] = new Set();
      }
      if (p.brand) {
        brandsByCategory[p.category].add(p.brand);
      }
    }
  });

  // Definiert deine gewünschte Premium-Reihenfolge
  const preferredOrder = ['Notebooks', 'Smartphones', 'TV', 'Audio', 'Zubehör'];

  // Sortiert das DB-Set nach deiner Wunsch-Reihenfolge statt alphabetisch
  const sortedCategories = Array.from(categoriesSet).sort((a, b) => {
    const indexA = preferredOrder.indexOf(a);
    const indexB = preferredOrder.indexOf(b);
    
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    
    return indexA - indexB;
  });

  const categories = ['Produkte', ...sortedCategories];
  const finalBrandsByCategory: Record<string, string[]> = {};
  
  Object.keys(brandsByCategory).forEach((cat) => {
    finalBrandsByCategory[cat] = Array.from(brandsByCategory[cat]).sort();
  });

  // 🎯 HIER WURDEN DIE DIRETEN LINKS HINZUGEFÜGT
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
      ctaLink: '/?category=Notebooks',
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
      ctaLink: '/?category=Smartphones',
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
      ctaLink: '/?category=TV',
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
      ctaLink: '/?category=Audio',
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
      ctaLink: '/?category=Zubehör',
    },
  };

  let dynamicLayout: any[] = [];
  const isPureHome = (!activeCategory || activeCategory === 'Produkte') && !searchQuery && !activeSort && !activeBrand;

  if (isPureHome) {
    sortedCategories.forEach((cat) => {
      const catProducts = allProducts.filter(p => p.category === cat).slice(0, 8);
      
      if (catProducts.length > 0) {
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
      categories={categories}
      brandsByCategory={finalBrandsByCategory}
    />
  );
}