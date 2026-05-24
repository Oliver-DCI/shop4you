'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DatenschutzPage() {
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
            Privacy Policy // Security Standards
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 uppercase">
            Datenschutzerklärung
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
            <h3 className="text-[11px] font-mono uppercase tracking-widest text-zinc-900 font-bold">1. Datenschutz auf einen glance</h3>
            <p>
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h3 className="text-[11px] font-mono uppercase tracking-widest text-zinc-900 font-bold">2. Datenerfassung auf unserer Website</h3>
            <p>
              Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen. Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie in ein Kontaktformular oder bei der Registrierung eingeben.
            </p>
            <p>
              Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie diese Website betreten.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h3 className="text-[11px] font-mono uppercase tracking-widest text-zinc-900 font-bold">3. TLS- bzw. SSL-Verschlüsselung</h3>
            <p>
              Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte, wie zum Beispiel Bestellungen oder Anfragen, die Sie an uns als Seitenbetreiber senden, eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://“ auf „https://“ wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h3 className="text-[11px] font-mono uppercase tracking-widest text-zinc-900 font-bold">4. Auskunft, Löschung und Berichtigung</h3>
            <p>
              Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung und ggf. ein Recht auf Berichtigung oder Löschung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema personenbezogene Daten können Sie sich jederzeit unter der im Impressum angegebenen Adresse an uns wenden.
            </p>
          </section>
        </motion.div>

      </div>
    </main>
  );
}