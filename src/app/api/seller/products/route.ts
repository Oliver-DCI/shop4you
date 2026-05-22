import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 🔍 1. GET: Alle Produkte eines Händlers laden
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User-ID fehlt im Request.' }, { status: 400 });
    }

    // Holt alle Produkte aus PostgreSQL, die mit der sellerId des Users verknüpft sind
    const products = await prisma.product.findMany({
      where: { sellerId: userId },
      orderBy: { title: 'asc' } // Alphabetisch sortiert
    });

    return NextResponse.json(products);
  } catch (error: any) {
    console.error('SELLER_PRODUCTS_GET_ERROR:', error);
    return NextResponse.json({ 
      error: 'Fehler beim Laden der Händler-Produkte', 
      details: error.message || String(error)
    }, { status: 500 });
  }
}

// ❌ 2. DELETE: Einzelnen Artikel permanent aus der DB löschen
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');

    if (!productId) {
      return NextResponse.json({ error: 'Artikel-ID fehlt im Request.' }, { status: 400 });
    }

    // Löscht den Artikel direkt aus PostgreSQL über Prisma
    await prisma.product.delete({
      where: { 
        id: productId 
      }
    });

    return NextResponse.json({ message: 'Artikel erfolgreich gelöscht.' }, { status: 200 });
  } catch (error: any) {
    console.error('SELLER_PRODUCTS_DELETE_ERROR:', error);
    return NextResponse.json({ 
      error: 'Fehler beim Löschen des Artikels aus der Datenbank.', 
      details: error.message || String(error)
    }, { status: 500 });
  }
}