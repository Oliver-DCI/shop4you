import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 🔍 1. GET: Absolut alle Produkte aus der PostgreSQL laden (für den Admin)
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { title: 'asc' }
    });
    return NextResponse.json(products);
  } catch (error: any) {
    console.error('ADMIN_PRODUCTS_GET_ERROR:', error);
    return NextResponse.json({ 
      error: 'Fehler beim Laden des globalen Produkt-Katalogs', 
      details: error.message 
    }, { status: 500 });
  }
}

// ❌ 2. DELETE: Jeden beliebigen Artikel permanent aus dem System entfernen
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');

    if (!productId) {
      return NextResponse.json({ error: 'Artikel-ID fehlt im Request.' }, { status: 400 });
    }

    // Abhängigkeiten (Warenkorb/Bestellposten) entfernen, um Foreign-Key-Fehler zu vermeiden
    await prisma.orderItem.deleteMany({
      where: { productId: productId }
    });

    // Jetzt das Produkt löschen
    await prisma.product.delete({
      where: { id: productId }
    });

    return NextResponse.json({ message: 'Artikel erfolgreich vom System gelöscht.' }, { status: 200 });
  } catch (error: any) {
    console.error('ADMIN_PRODUCTS_DELETE_ERROR:', error);
    return NextResponse.json({ 
      error: 'Fehler beim Löschen des Artikels aus der Datenbank.', 
      details: error.message 
    }, { status: 500 });
  }
}