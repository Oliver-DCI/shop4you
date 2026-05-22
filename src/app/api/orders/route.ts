import { NextResponse } from 'next/server';
// 🎯 Wir importieren deine bereits existierende, globale Prisma-Instanz
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // TEST-MODUS: Alle Bestellungen abfragen
    const userOrders = await prisma.order.findMany({
      include: {
        // Falls dieser Beziehungsname in deinem schema.prisma anders heißt 
        // (z.B. orderItems), wirft uns der catch-Block gleich die exakte Meldung aus.
        items: true, 
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedOrders = userOrders.map((order) => ({
      id: order.id,
      createdAt: new Date(order.createdAt).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      total: order.totalAmount, // Mappt totalAmount auf total fürs Frontend
      status: order.status || 'GELIEFERT',
    }));

    return NextResponse.json(formattedOrders);
  } catch (error: any) {
    console.error('ORDERS_FETCH_ERROR:', error);
    // 🎯 Falls es knallt, sehen wir das Problem direkt als JSON im Browser
    return NextResponse.json({ 
      error: 'Fehler beim Laden der Bestellungen',
      details: error.message || String(error)
    }, { status: 500 });
  }
}