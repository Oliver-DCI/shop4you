import { NextResponse } from 'next/server';
// 🎯 Wir nutzen deine zentrale, globale Prisma-Instanz
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User-ID fehlt im Request.' }, { status: 400 });
    }

    // A: Zähle alle Live-Produkte, die dieser spezifische Seller besitzt
    const liveProductsCount = await prisma.product.count({
      where: { sellerId: userId }
    });

    // B: Berechne Umsatz und Verkäufe über die OrderItems
    // Zuerst holen wir alle Produkt-IDs, die diesem Seller gehören
    const myProducts = await prisma.product.findMany({
      where: { sellerId: userId },
      select: { id: true }
    });
    const myProductIds = myProducts.map(p => p.id);

    // Jetzt holen wir alle verkauften Posten aus der OrderItem-Tabelle für diese Produkte
    const salesData = await prisma.orderItem.findMany({
      where: { 
        productId: { in: myProductIds } 
      }
    });

    // Berechne die Summen (Stückzahl & Gesamtumsatz)
    const totalSalesCount = salesData.reduce((sum, item) => sum + item.quantity, 0);
    const totalRevenue = salesData.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

    return NextResponse.json({
      totalRevenue,
      totalSalesCount,
      liveProductsCount
    });
  } catch (error: any) {
    console.error('SELLER_STATS_API_ERROR:', error);
    return NextResponse.json({ 
      error: 'Fehler beim Laden der Händler-Statistiken', 
      details: error.message || String(error)
    }, { status: 500 });
  }
}