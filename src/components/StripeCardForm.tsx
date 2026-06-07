'use client';

import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface StripeCardFormProps {
  isSubmitting: boolean;
  setIsSubmitting: (val: boolean) => void;
  clientSecret: string;
  onSuccess: () => Promise<void>;
}

export default function StripeCardForm({ 
  isSubmitting, 
  setIsSubmitting, 
  clientSecret, 
  onSuccess 
}: StripeCardFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  // Diese Funktion wird über ein verknüpftes Event oder eine Referenz ausgelöst,
  // wenn das Hauptformular abgeschickt wird und die Methode "credit_card" ist.
  React.useEffect(() => {
    // Wir deklarieren den Handler als Standard-EventListener
    const handleTriggerPayment: EventListener = async (e) => {
      if (!stripe || !elements || !clientSecret || isSubmitting) return;

      setIsSubmitting(true);

      try {
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) throw new Error('Kreditkarten-Feld nicht gefunden.');

        // 💳 Die Zahlung direkt bei Stripe bestätigen
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
          },
        });

        if (error) {
          throw new Error(error.message || 'Zahlung fehlgeschlagen.');
        }

        if (paymentIntent && paymentIntent.status === 'succeeded') {
          // 🎉 Stripe-Zahlung war erfolgreich! Jetzt PostgreSQL-Bestellung triggern
          await onSuccess();
        }
      } catch (err: any) {
        console.error('Stripe Payment Fehler:', err);
        alert(err.message || 'Fehler bei der Kreditkarten-Verarbeitung.');
        setIsSubmitting(false);
      }
    };

    // Durch das direkte Übergeben ohne fehlerhaftes Casting (as Event) ist TS jetzt glücklich
    window.addEventListener('trigger-stripe-payment', handleTriggerPayment);
    return () => window.removeEventListener('trigger-stripe-payment', handleTriggerPayment);
  }, [stripe, elements, clientSecret, isSubmitting, setIsSubmitting, onSuccess]);

  return (
    <div className="mt-4 p-4 border border-zinc-200 bg-zinc-50 animate-fadeIn">
      <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest block mb-3">
        Kreditkartendetails eingeben
      </label>
      <div className="bg-white border border-zinc-200 p-3 h-11 flex items-center">
        <div className="w-full">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '13px',
                  color: '#000000',
                  fontFamily: 'monospace, sans-serif',
                  '::placeholder': {
                    color: '#a1a1aa',
                  },
                },
                invalid: {
                  color: '#f43f5e',
                },
              },
            }}
          />
        </div>
      </div>
      <p className="text-[9px] text-zinc-400 font-mono mt-2 uppercase tracking-tight">
        🔒 Deine Kartendaten werden direkt verschlüsselt an Stripe übertragen.
      </p>
    </div>
  );
}