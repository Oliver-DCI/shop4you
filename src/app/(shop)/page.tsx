import React from 'react';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import ShopClientView from '@/components/shop/ShopClientView';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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

  // Dynamische Prisma-Where-Klausel auf dem Server aufbauen
  const whereClause: any = {};

  // 'Produkte' fängt den Standard-Zustand ab (wie im Header definiert)
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

  // Sortierungs-Strategie
  let orderByClause: any = { createdAt: 'desc' };

  if (activeSort === 'price_asc') {
    orderByClause = { price: 'asc' };
  } else if (activeSort === 'price_desc') {
    orderByClause = { price: 'desc' };
  } else if (activeSort === 'alpha_asc') {
    orderByClause = { title: 'asc' };
  }

  // Direkte, performante DB-Abfrage
  const products = await prisma.product.findMany({
    where: whereClause,
    orderBy: orderByClause,
  });

  // Reicht die serverseitig geladenen Daten direkt an die Animations-View weiter
  return (
    <ShopClientView 
      products={products}
      activeCategory={activeCategory}
      activeBrand={activeBrand}
      searchQuery={searchQuery}
    />
  );
}