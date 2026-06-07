import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// 🎯 Stripe ohne feste apiVersion initialisieren, damit es sich automatisch anpasst
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, userId } = body;

    // Server-Log: So sehen wir exakt, was im Terminal ankommt
    console.log('--- STRIPE API ROUTE GESTARTET ---');
    console.log('Betrag empfangen:', amount);
    console.log('User-ID empfangen:', userId);
    console.log('Secret Key vorhanden?:', !!process.env.STRIPE_SECRET_KEY);

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Ungültiger Betrag.' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'Nicht autorisiert. Keine userId übergeben.' }, { status: 401 });
    }

    // Cent-Umrechnung
    const amountInCents = Math.round(amount * 100);

    // Intent erstellen
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: userId,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error: any) {
    // 🚨 Das hier druckt den ECHTEN Grund in dein Terminal (npm run dev)
    console.error('=== DETEKTIERTER STRIPE FEHLER ===');
    console.error('Fehlermeldung:', error?.message || error);
    console.error('Fehler-Objekt:', error);
    console.error('==================================');

    return NextResponse.json(
      { error: 'Interner Server-Fehler bei der Zahlungsinitiierung.', details: error.message },
      { status: 500 }
    );
  }
}