import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 🔍 1. GET: Absolut alle Produkte inklusive Seller-Informationen laden
export async function GET() {
  try {
    // 🎯 ÄNDERUNG: Wir inkludieren die Händlerdaten (seller) zu jedem Produkt
    const products = await prisma.product.findMany({
      include: {
        seller: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
          }
        }
      },
      orderBy: { title: 'asc' }
    });

    // 🎯 ÄNDERUNG: Daten so formatieren, wie es dein aktualisierter ProductsTab erwartet
    const formattedProducts = products.map((product) => {
      // Wenn der Ersteller ein Admin ist, labeln wir ihn direkt, ansonsten Name zusammensetzen
      const isSystemAdmin = product.seller.role === 'ADMIN';
      const sellerName = isSystemAdmin 
        ? null // Führt im Frontend automatisch zum schwarzen "⚙️ Admin"-Badge
        : `${product.seller.firstName} ${product.seller.lastName}`.trim();

      return {
        id: product.id,
        title: product.title,
        price: product.price,
        category: product.category,
        brand: product.brand,
        stock: product.stock,
        images: product.images,
        sellerName: sellerName, // 🎯 Wird an das stateful Frontend übergeben
      };
    });

    return NextResponse.json(formattedProducts);
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