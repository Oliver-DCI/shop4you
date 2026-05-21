// src/app/api/checkout/route.ts
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
    const { userId, totalAmount, paymentMethod, items, shippingAddress } = body;

    // Validierung der Mindestdaten
    if (!userId || !items || items.length === 0) {
      return NextResponse.json({ error: 'Ungültige Bestelldaten.' }, { status: 400 });
    }

    // ⚡ Eine Prisma-Transaktion garantiert atomare Sicherheit in PostgreSQL
    const result = await prisma.$transaction(async (tx) => {
      
      let shippingAddressId: string | null = null;

      // 1. Wenn eine abweichende Lieferadresse mitgegeben wurde, lege sie an
      if (shippingAddress) {
        const newShipping = await tx.shippingAddress.create({
          data: {
            firstName: shippingAddress.firstName,
            lastName: shippingAddress.lastName,
            street: shippingAddress.street,
            zip: shippingAddress.zip,
            city: shippingAddress.city,
          }
        });
        shippingAddressId = newShipping.id;
      }

      // 2. Erstelle die Hauptbestellung (Order)
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          paymentMethod,
          status: 'PENDING',
          // Verknüpfe die eben erstellte ShippingAddress falls vorhanden
          shippingAddressId: shippingAddressId, 
        }
      });

      // 🎯 NEU: Automatische Rechnungs-Erstellung
      await tx.invoice.create({
        data: {
          orderId: newOrder.id,
          // Einfache Generierung: INV- + Timestamp (kannst du später durch ein besseres System ersetzen)
          invoiceNumber: `INV-${Date.now()}` 
        }
      });

      // 3. Erstelle die Bestellpositionen (OrderItems) und aktualisiere den Lagerbestand (Stock)
      for (const item of items) {
        // Position anlegen
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }
        });

        // Lagerbestand abziehen (Prisma decrement)
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      return newOrder;
    });

    return NextResponse.json({ success: true, order: result }, { status: 201 });

  } catch (error) {
    console.error('Fehler in der Checkout API-Route:', error);
    return NextResponse.json({ error: 'Interner Server-Fehler beim Verarbeiten der Bestellung.' }, { status: 500 });
  }
}