import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    // 1. Hole alle User aus der DB, die die Rolle "SELLER" haben
    const sellersFromDb = await prisma.user.findMany({
      where: {
        role: 'SELLER',
      },
      include: {
        // Wir nehmen an, dass die Relation zu den Produkten im User-Schema "products" heißt
        products: true, 
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 2. Transformiere die Daten in das Format, das deine SellersTab-Komponente erwartet
    const formattedSellers = sellersFromDb.map((seller) => {
      // Berechnung des Gesamtumsatzes (Beispiel: Summe aller Preise der Händler-Produkte)
      // Falls du bereits eine Order/Invoice-Verknüpfung hast, kann das später verfeinert werden
      const revenue = seller.products.reduce((sum, product) => sum + (product.price * 0.15), 0); // Platzhalter-Logik für Umsatz/Gebühren

      return {
        id: seller.id,
        name: `${seller.firstName} ${seller.lastName}`.trim() || 'Unbekannter Händler',
        itemsCount: seller.products.length, // Zählt die gelisteten Artikel
        revenue: Math.round(revenue), // Rundet den Umsatz für die Anzeige
        status: 'Aktiv', // Standard-Status (kann später durch ein DB-Feld wie sellerStatus ersetzt werden)
      };
    });

    return NextResponse.json(formattedSellers, { status: 200 });
  } catch (error) {
    console.error('[API_ADMIN_SELLERS_GET_ERROR]:', error);
    return NextResponse.json(
      { message: 'Interner Serverfehler beim Laden der Händler.' },
      { status: 500 }
    );
  } finally {
    // Verbindung nicht trennen, wenn der Edge-/Serverless-Verbindungs-Pool aktiv bleiben soll
  }
}