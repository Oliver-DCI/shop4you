import { NextResponse } from 'next/server';
// 🎯 FIX 1: Nutze deine existierende, globale Prisma-Instanz!
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

    // 🎯 FIX 2: Rolle in Kleinbuchstaben umwandeln, damit der Vergleich unten bombensicher matched!
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
      // Wenn es weder admin noch seller ist (Case-Insensitive)
      return NextResponse.json({ error: '🚫 Zugriff verweigert. Keine Berechtigung für Bulk-Import.' }, { status: 401 });
    }

    // 🔄 Massen-Eintragung in PostgreSQL via Prisma transaction
    const createdProducts = await prisma.$transaction(
      products.map((prod) =>
        prisma.product.create({
          data: {
            title: prod.title,
            price: parseFloat(prod.price),
            category: prod.category,
            description: prod.description || '',
            brand: prod.brand || null,
            images: prod.images || ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
            sellerId: userId, 
          },
        })
      )
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