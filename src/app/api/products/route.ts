import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const brand = searchParams.get('brand');
    const sort = searchParams.get('sort');
    
    // Paginierung vorbereiten (Optional, aber bereit für die Zukunft)
    const limit = parseInt(searchParams.get('limit') || '100'); 
    
    const whereClause: any = {};

    if (category && category !== 'Produkte') {
      whereClause.category = category;
    }

    if (brand) {
      whereClause.brand = brand;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } }
      ];
    }

    let orderByClause: any = { price: 'desc' };
    if (sort === 'price_asc') {
      orderByClause = { price: 'asc' };
    } else if (sort === 'price_desc') {
      orderByClause = { price: 'desc' };
    } else if (sort === 'alpha_asc') {
      orderByClause = { title: 'asc' };
    } else if (sort === 'createdAt_desc') {
      orderByClause = { createdAt: 'desc' };
    }

    // Produkte aus PostgreSQL abrufen
    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: orderByClause,
      take: limit
    });

    return NextResponse.json(products);
  } catch (error: any) {
    console.error('API Error in /api/products:', error);
    return NextResponse.json({ error: 'Fehler beim Laden der Produkte' }, { status: 500 });
  }
}