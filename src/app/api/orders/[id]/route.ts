import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Sicherstellen, dass params sowohl in älteren als auch in neueren Next.js Versionen korrekt aufgelöst wird
    const resolvedParams = 'then' in context.params ? await context.params : context.params;
    const orderId = resolvedParams.id;

    if (!orderId) {
      return NextResponse.json({ error: 'Keine Bestell-ID übergeben.' }, { status: 400 });
    }

    // Suche die Bestellung
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: `Bestellung ${orderId} nicht in DB gefunden.` }, { status: 404 });
    }

    // Datenstruktur für das Frontend aufbereiten
    const formattedOrder = {
      id: order.id,
      createdAt: new Date(order.createdAt).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      total: order.totalAmount,
      status: order.status || 'GELIEFERT',
      items: order.items.map((item: any) => ({
        id: item.id,
        title: item.title || item.name || `PRODUKT (ID: ${item.productId || 'UNBEKANNT'})`,
        quantity: item.quantity || 1,
        price: item.price || 0,
      })),
    };

    return NextResponse.json(formattedOrder);
  } catch (error: any) {
    console.error('CRITICAL_API_ORDER_ID_ERROR:', error);
    return NextResponse.json({ 
      error: 'Fehler im Server-Core',
      details: error.message || String(error)
    }, { status: 500 });
  }
}