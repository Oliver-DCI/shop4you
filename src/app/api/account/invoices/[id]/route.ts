import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { generateInvoicePDF } from '@/lib/pdf-generator';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// 🎯 Typdefinition für Next.js 15+: params ist ein Promise!
interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: Request,
  context: RouteContext // Nutzen des korrekten Next.js 15 Typings
) {
  try {
    // ➔ HIER IST DER FIX: params wird per await aufgelöst, bevor wir auf '.id' zugreifen
    const resolvedParams = await context.params;
    let orderId = resolvedParams?.id;

    // 🎯 FALLBACK-LOGIK: Falls die ID nicht aus den params kam, holen wir sie direkt aus dem URL-Pfad
    if (!orderId) {
      const url = new URL(request.url);
      const pathSegments = url.pathname.split('/');
      orderId = pathSegments[pathSegments.length - 1]; // Holt das letzte Segment der URL
    }

    // Falls immer noch leer, brechen wir ab
    if (!orderId || orderId === 'invoices') {
      return NextResponse.json({ error: 'Keine gültige Bestell-ID in der URL gefunden.' }, { status: 400 });
    }

    // 1. Hole die Bestellung aus der DB
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        invoice: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: `Bestellung mit ID ${orderId} nicht gefunden.` }, { status: 404 });
    }

    // Sicherheits-Fallbacks für die PDF-Generierung
    const safeOrderData = {
      id: order.id || 'UNBEKANNT',
      totalAmount: typeof order.totalAmount === 'number' ? order.totalAmount : Number(order.totalAmount) || 0,
      paymentMethod: order.paymentMethod || 'Rechnung',
      createdAt: order.createdAt ? new Date(order.createdAt).toISOString() : new Date().toISOString(),
    };

    // 2. Generiere das PDF-Blob
    let pdfBlob;
    try {
      pdfBlob = await generateInvoicePDF(safeOrderData);
    } catch (pdfError: any) {
      console.error('CRITICAL: Fehler direkt im PDF-Generator:', pdfError);
      return NextResponse.json({ 
        error: 'Der PDF-Renderer ist abgestürzt.', 
        details: pdfError.message || pdfError 
      }, { status: 500 });
    }

    // 3. Konvertiere in ArrayBuffer
    const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());

    // 4. Sende das PDF zurück
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