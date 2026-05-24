'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ImpressumPage() {
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
            Corporate Information // Legal Notice
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 uppercase">
            Impressum
          </h1>
        </div>

        {/* Content Matrix (Ein- oder zweispaltig lesbar, maximal 3xl Breite wie bei Datenschutz/AGB) */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl flex flex-col gap-12 text-xs leading-relaxed text-zinc-600 font-light"
        >
          <section className="flex flex-col gap-2">
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-samsung-muted">Angaben gemäß § 5 TMG</h3>
            <p className="font-medium text-zinc-900 text-sm uppercase tracking-wider">SHOP4YOU GmbH</p>
            <p className="mt-1">
              Premium Technology Division<br />
              Hardware-Allee 44<br />
              10117 Berlin
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-samsung-muted">Vertretung</h3>
            <p className="text-zinc-900 font-medium uppercase tracking-wider">Geschäftsführung</p>
            <p>J. Doe, M. Mustermann</p>
          </section>

          <section className="flex flex-col gap-2">
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-samsung-muted">Registereintrag</h3>
            <p className="text-zinc-900 font-medium uppercase tracking-wider">Handelsregister</p>
            <p>
              Registergericht: Amtsgericht Charlottenburg<br />
              Registernummer: HRB 999999 B
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-samsung-muted">Umsatzsteuer-ID</h3>
            <p className="text-zinc-900 font-medium uppercase tracking-wider">Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz</p>
            <p>DE 123456789</p>
          </section>

          <section className="border-t border-zinc-100 pt-8 flex flex-col gap-3">
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-samsung-muted">Streitbeilegung</h3>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="underline hover:text-black transition-colors font-medium">https://ec.europa.eu/consumers/odr</a>.
            </p>
            <p>
              Zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle sind wir nicht verpflichtet und nicht bereit.
            </p>
          </section>
        </motion.div>

      </div>
    </main>
  );
}