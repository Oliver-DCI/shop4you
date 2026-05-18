// src/app/api/products/bulk/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { products, role } = body; // Wir erwarten die Produkte und die Rolle des Absenders

    if (!products || !Array.isArray(products)) {
      return NextResponse.json({ error: 'Ungültiges Datenformat. Erwarte ein Array.' }, { status: 400 });
    }

    // 🛡️ Rollenbasierte Limitierung (Expert-Gatekeeper)
    if (role === 'admin') {
      if (products.length > 25) {
        return NextResponse.json({ error: '🛡️ Admin-Limit überschritten! Maximal 25 Produkte gleichzeitig erlaubt.' }, { status: 403 });
      }
    } else if (role === 'seller') {
      if (products.length > 5) {
        return NextResponse.json({ error: '💼 Seller-Limit überschritten! Als Verkäufer darfst du maximal 5 Produkte gleichzeitig importieren.' }, { status: 403 });
      }
    } else {
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
            // Falls Specs im JSON sind, mappen; falls dein Schema nur ein Image-Array hat, setzen wir ein Standardbild
            images: prod.images || ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
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