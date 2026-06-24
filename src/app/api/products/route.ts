import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// 🔍 1. GET: Produkte abrufen (für Shop, Filter, Suche, etc.)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const brand = searchParams.get('brand');
    const sort = searchParams.get('sort');
    
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

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: orderByClause,
      take: limit
    });

    return NextResponse.json(products);
  } catch (error: any) {
    console.error('API Error in /api/products (GET):', error);
    return NextResponse.json({ error: 'Fehler beim Laden der Produkte' }, { status: 500 });
  }
}

// 🎯 2. PUT: Bestehendes Produkt aktualisieren (Quick-Edit für Händler & Admins)
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');

    if (!productId) {
      return NextResponse.json({ error: 'Artikel-ID fehlt im Request.' }, { status: 400 });
    }

    // Formulardaten aus dem Request-Body auslesen
    const body = await request.json();
    const { title, price, stock, category, brand, description, images } = body;

    // Artikel direkt in PostgreSQL über Prisma aktualisieren
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        title,
        price: parseFloat(price) || 0,
        stock: parseInt(stock) || 0,
        category,
        brand,
        description,
        images // Speichert das bereinigte String-Array direkt in der DB
      }
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error: any) {
    console.error('API Error in /api/products (PUT):', error);
    return NextResponse.json({ 
      error: 'Fehler beim Aktualisieren des Artikels in der Datenbank.',
      details: error.message || String(error)
    }, { status: 500 });
  }
}