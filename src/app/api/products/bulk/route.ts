import { NextResponse } from 'next/server';
// 🎯 Nutze deine existierende, globale Prisma-Instanz
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { products, role, userId } = body; 

    if (!products || !Array.isArray(products)) {
      return NextResponse.json({ error: 'Ungültiges Datenformat. Erwarte ein Array.' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'Fehlende Benutzer-Identifikation (userId).' }, { status: 400 });
    }

    // 🎯 Rolle in Kleinbuchstaben umwandeln für bombensicheren Match
    const cleanRole = (role || '').toLowerCase();

    // 🛡️ Rollenbasierte Limitierung
    if (cleanRole === 'admin') {
      if (products.length > 25) {
        return NextResponse.json({ error: '🛡️ Admin-Limit überschritten! Maximal 25 Produkte gleichzeitig erlaubt.' }, { status: 403 });
      }
    } else if (cleanRole === 'seller') {
      if (products.length > 5) {
        return NextResponse.json({ error: '💼 Seller-Limit überschritten! Als Verkäufer darfst du maximal 5 Produkte gleichzeitig importieren.' }, { status: 403 });
      }
    } else {
      return NextResponse.json({ error: '🚫 Zugriff verweigert. Keine Berechtigung für Bulk-Import.' }, { status: 401 });
    }

    // 🔄 Massen-Eintragung in PostgreSQL via Prisma transaction
    const createdProducts = await prisma.$transaction(
      products.map((prod) => {
        // Sicherstellen, dass images ein sauberes Array ist, falls im JSON ein String oder nichts übergeben wurde
        let finalImages: string[] = ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'];
        if (prod.images && Array.isArray(prod.images) && prod.images.length > 0) {
          finalImages = prod.images;
        } else if (typeof prod.images === 'string' && prod.images.trim() !== '') {
          finalImages = [prod.images];
        }

        return prisma.product.create({
          data: {
            title: prod.title,
            price: parseFloat(prod.price) || 0,
            category: prod.category,
            description: prod.description || '',
            brand: prod.brand || 'S4Y',
            images: finalImages, // 🎯 FIX: Validiertes Array wird jetzt sicher gespeichert
            
            // 🎯 FIX: Quantity (Menge) wird aus dem JSON gelesen und als Zahl konvertiert (Standard 1)
            quantity: prod.quantity ? parseInt(prod.quantity, 10) : 1, 
            
            // Wenn es ein Admin ist, loggen wir es optional separat, andernfalls wird die userId als sellerId gesetzt
            sellerId: userId, 
          },
        });
      })
    );

    return NextResponse.json({
      success: true,
      message: `${createdProducts.length} Artikel erfolgreich importiert.`,
      count: createdProducts.length
    }, { status: 201 });

  } catch (error: any) {
    console.error('Bulk Import Fehler:', error);
    return NextResponse.json({ error: 'Datenbankfehler beim Importieren.', details: error.message }, { status: 500 });
  }
}