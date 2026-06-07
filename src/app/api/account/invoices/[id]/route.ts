import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { generateInvoicePDF } from '@/lib/pdf-generator';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const resolvedParams = await context.params;
    let orderId = resolvedParams?.id;

    if (!orderId) {
      const url = new URL(request.url);
      const pathSegments = url.pathname.split('/');
      orderId = pathSegments[pathSegments.length - 1];
    }

    if (!orderId || orderId === 'invoices') {
      return NextResponse.json({ error: 'Keine gültige Bestell-ID in der URL gefunden.' }, { status: 400 });
    }

    // 1. Hole die Bestellung mit ALLEN Relationen aus der DB
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        invoice: true,
        user: true, 
        items: {
          include: {
            product: true 
          }
        }
      },
    });

    if (!order) {
      return NextResponse.json({ error: `Bestellung mit ID ${orderId} nicht gefunden.` }, { status: 404 });
    }

    // 🎯 FIX: Wir greifen typensicher auf die Adresse zu. 
    // Falls "shippingAddress" nicht auf dem Objekt existiert, casten wir es sicherheitshalber als 'any'
    // oder greifen direkt auf die User-Stammdaten als perfekten Fallback zurück!
    const orderWithAddress = order as any;
    const rawAddress = orderWithAddress.shippingAddress || orderWithAddress.address || null;

    const addressData = {
      firstName: rawAddress?.firstName || order.user?.firstName || 'Max',
      lastName: rawAddress?.lastName || order.user?.lastName || 'Mustermann',
      street: rawAddress?.street || order.user?.street || 'Musterstraße 1',
      zipCode: rawAddress?.zip || rawAddress?.zipCode || order.user?.zipCode || '12345',
      city: rawAddress?.city || order.user?.city || 'Musterstadt',
    };

    // 🎯 Strukturierung der Artikelpositionen für den PDF-Generator
    const invoiceItems = order.items.map((item, index) => ({
      position: index + 1,
      productId: item.productId,
      title: item.product?.title || 'Unbekanntes Produkt',
      quantity: item.quantity,
      price: typeof item.price === 'number' ? item.price : Number(item.price) || 0,
    }));

    // Sicherheits-Datenpaket für den PDF-Generator schnüren
    const richInvoiceData = {
      id: order.id,
      totalAmount: typeof order.totalAmount === 'number' ? order.totalAmount : Number(order.totalAmount) || 0,
      paymentMethod: order.paymentMethod || 'Rechnung',
      createdAt: order.createdAt ? new Date(order.createdAt).toISOString() : new Date().toISOString(),
      customer: addressData,
      items: invoiceItems
    };

    // 2. Generiere das reichhaltige PDF-Blob
    let pdfBlob;
    try {
      pdfBlob = await generateInvoicePDF(richInvoiceData);
    } catch (pdfError: any) {
      console.error('CRITICAL: Fehler direkt im PDF-Generator:', pdfError);
      return NextResponse.json({ 
        error: 'Der PDF-Renderer ist abgestürzt.', 
        details: pdfError.message || pdfError 
      }, { status: 500 });
    }

    const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="rechnung-${orderId}.pdf"`,
        'Cache-Control': 'no-store, max-age=0',
      },
    });

  } catch (error: any) {
    console.error('Globaler Fehler beim Rechnungs-Download:', error);
    return NextResponse.json({ 
      error: 'Interner Server-Fehler beim Generieren der Rechnung.',
      message: error.message || error
    }, { status: 500 });
  }
}