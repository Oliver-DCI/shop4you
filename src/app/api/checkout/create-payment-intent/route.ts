import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

// Stripe mit dem geheimen Schlüssel aus der .env initialisieren
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27' as any, // Nutzt die stabile API-Version deines SDKs
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, userId } = body;

    // Mindestvalidierung
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Ungültiger Betrag.' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'Nicht autorisiert. Keine userId übergeben.' }, { status: 401 });
    }

    // 🌟 WICHTIG: Euro in Cent umrechnen und runden, um JS-Fließkommafehler zu vermeiden
    const amountInCents = Math.round(amount * 100);

    // Erstelle einen Payment Intent bei Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'eur',
      // Automatische Zahlungsmethoden aktivieren (Kreditkarte, Klarna etc. direkt über Stripe)
      automatic_payment_methods: {
        enabled: true,
      },
      // Metadaten helfen dir später im Stripe-Dashboard, Zahlungen zuzuordnen
      metadata: {
        userId: userId,
      },
    });

    // Wir senden das client_secret zurück ans Frontend. 
    // Das Frontend nutzt dieses Secret, um das Kreditkarten-Eingabefeld sicher zu autorisieren.
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error: any) {
    console.error('Fehler beim Erstellen des Payment Intents:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler bei der Zahlungsinitiierung.', details: error.message },
      { status: 500 }
    );
  }
}