'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function KontaktPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Edler, künstlicher Delay für die Premium-UX beim Senden
    await new Promise((resolve) => setTimeout(resolve, 1200));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <main className="w-full bg-white min-h-screen pt-32 pb-24 select-text">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button & Header Sektion */}
        <div className="border-b border-zinc-100 pb-12 mb-16">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-samsung-muted hover:text-black transition-colors mb-8 group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform duration-200">←</span> 
            Zurück zum Shop
          </Link>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-samsung-muted block mb-3">
            Direct Support Hub // Message Service
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 uppercase">
            Kontaktieren Sie Uns
          </h1>
        </div>

        {/* 2-Spalten-Layout wie bei den anderen Premium-Seiten */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Linke Spalte: Info-Text & Direkte Kanäle (Spans 5/12) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 flex flex-col gap-8 text-xs text-zinc-600 leading-relaxed"
          >
            <div>
              <h3 className="text-[10px] font-mono uppercase tracking-widest text-samsung-muted mb-2">Premium Support</h3>
              <p className="text-zinc-900 font-medium text-sm uppercase tracking-wider mb-2">SHOP4YOU Customer Care</p>
              <p>
                Hast du Fragen zu deiner Bestellung, technischen Spezifikationen unserer Hardware oder benötigst du eine individuelle Beratung? Unser Expertenteam steht dir jederzeit zur Verfügung.
              </p>
            </div>

            <div className="flex flex-col gap-4 font-mono text-[11px] uppercase tracking-widest pt-4 border-t border-zinc-100">
              <div className="flex justify-between border-b border-zinc-200/60 pb-2">
                <span className="text-samsung-muted">E-Mail Support</span>
                <span className="text-zinc-900 font-medium select-all">support@shop4you.de</span>
              </div>
              <div className="flex justify-between border-b border-zinc-200/60 pb-2">
                <span className="text-samsung-muted">Zentrale Berlin</span>
                <span className="text-zinc-900 font-medium">+49 (0) 30 1234567</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-samsung-muted">Service-Zeiten</span>
                <span className="text-zinc-900 font-medium">Mo - Fr // 09:00 - 18:00</span>
              </div>
            </div>
          </motion.div>

          {/* Rechte Spalte: Das interaktive Kontaktformular (Spans 7/12) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-7 bg-zinc-50 border border-zinc-100 p-8 sm:p-12"
          >
            <div className="mb-8">
              <h2 className="text-base font-bold uppercase tracking-tight text-zinc-900 mb-1">Direct Message</h2>
              <p className="text-[11px] font-mono uppercase text-samsung-muted tracking-wider">Alle Felder sind Pflichtfelder.</p>
            </div>

            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center"
              >
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 block mb-2">● Transmission Complete</span>
                <p className="text-sm font-bold uppercase text-zinc-900">Vielen Dank für deine Nachricht.</p>
                <p className="text-xs text-samsung-muted mt-2 max-w-sm mx-auto font-light">Wir haben deine Anfrage erhalten und melden uns innerhalb von 24 Stunden bei dir.</p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 text-[10px] font-mono uppercase tracking-widest underline text-zinc-900 hover:text-samsung-muted transition-colors cursor-pointer"
                >
                  Weitere Nachricht senden
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                
                {/* Feld 1: Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-samsung-muted">Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white border border-zinc-200 rounded-none px-4 py-3 text-xs uppercase tracking-wider text-zinc-900 focus:outline-none focus:border-black transition-colors"
                    placeholder="DEIN NAME"
                  />
                </div>

                {/* Feld 2: E-Mail */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-samsung-muted">E-Mail Adresse</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white border border-zinc-200 rounded-none px-4 py-3 text-xs text-zinc-900 focus:outline-none focus:border-black transition-colors"
                    placeholder="name@domain.com"
                  />
                </div>

                {/* Feld 3: Text */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-samsung-muted">Ihre Nachricht</label>
                  <textarea 
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-white border border-zinc-200 rounded-none px-4 py-3 text-xs text-zinc-900 focus:outline-none focus:border-black transition-colors resize-none"
                    placeholder="WIE KÖNNEN WIR DIR HELFEN?"
                  />
                </div>

                {/* Sende-Button */}
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-black text-white hover:bg-zinc-900 font-medium text-xs uppercase tracking-widest py-4 transition-all duration-300 rounded-none disabled:bg-samsung-muted cursor-pointer text-center"
                >
                  {isSubmitting ? 'SENDING...' : 'NACHRICHT SENDEN'}
                </button>
              </form>
            )}
          </motion.div>

        </div>

      </div>
    </main>
  );
}