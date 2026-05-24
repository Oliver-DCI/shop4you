'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AgbPage() {
  return (
    <main className="w-full bg-white min-h-screen pt-32 pb-24 select-text">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button & Header */}
        <div className="border-b border-zinc-100 pb-12 mb-16">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-samsung-muted hover:text-black transition-colors mb-8 group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform duration-200">←</span> 
            Zurück zum Shop
          </Link>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-samsung-muted block mb-3">
            Terms & Conditions // Customer Agreement
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 uppercase">
            Allgemeine Geschäftsbedingungen
          </h1>
        </div>

        {/* Content Matrix */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="max-w-3xl flex flex-col gap-12 text-xs text-zinc-600 leading-relaxed font-light"
        >
          <section className="flex flex-col gap-3">
            <h3 className="text-[11px] font-mono uppercase tracking-widest text-zinc-900 font-bold">1. Geltungsbereich</h3>
            <p>
              Für alle Geschäftsbeziehungen zwischen der SHOP4YOU GmbH und dem Kunden gelten ausschließlich die nachfolgenden Allgemeinen Geschäftsbedingungen in ihrer zum Zeitpunkt der Bestellung gültigen Fassung. Abweichende Bedingungen des Kunden werden nicht anerkannt, es sei denn, die SHOP4YOU GmbH stimmt ihrer Geltung ausdrücklich schriftlich zu.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h3 className="text-[11px] font-mono uppercase tracking-widest text-zinc-900 font-bold">2. Vertragsschluss</h3>
            <p>
              Die Präsentation der Waren im Online-Shop stellt kein rechtlich bindendes Angebot, sondern einen unverbindlichen Online-Katalog dar. Durch Anklicken des Buttons „Zahlungspflichtig bestellen“ gibt der Kunde eine verbindliche Bestellung der im Warenkorb enthaltenen Waren ab. Die Bestätigung des Zugangs der Bestellung erfolgt zusammen mit der Annahme der Bestellung unmittelbar nach dem Absenden durch eine automatisierte E-Mail. Mit dieser E-Mail-Bestätigung ist der Kaufvertrag zustande gekommen.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h3 className="text-[11px] font-mono uppercase tracking-widest text-zinc-900 font-bold">3. Preise, Versandkosten und Zahlung</h3>
            <p>
              Alle angegebenen Preise sind Endpreise in Euro und enthalten die gesetzliche deutsche Mehrwertsteuer. Es gelten die Preise zum Zeitpunkt der Bestellung. Anfallende Versandkosten werden im Bestellprozess gesondert ausgewiesen. Die zur Verfügung stehenden Zahlungsarten (z. B. Kreditkarte, PayPal, Sofortüberweisung) werden dem Kunden vor Beginn des Bestellvorgangs angezeigt.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h3 className="text-[11px] font-mono uppercase tracking-widest text-zinc-900 font-bold">4. Eigentumsvorbehalt</h3>
            <p>
              Die gelieferte Ware bleibt bis zur vollständigen Bezahlung aller gegen den Kunden bestehenden Ansprüche aus dem Kaufvertrag im Eigentum der SHOP4YOU GmbH.
            </p>
          </section>
        </motion.div>

      </div>
    </main>
  );
}