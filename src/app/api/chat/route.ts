import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const cleanMessage = message.toLowerCase().trim();

    // ----------------------------------------------------------------
    // 1. DYNAMISCHE STRUKTUR-ANTWORTEN (Bestellungen & Rechnungen)
    // ----------------------------------------------------------------
    if (
      cleanMessage.includes('rechnung') || 
      cleanMessage.includes('beleg') || 
      cleanMessage.includes('archiv') || 
      cleanMessage.includes('rechnungen')
    ) {
      return NextResponse.json({
        response: `DEINE RECHNUNGEN WERDEN DYNAMISCH ERSTELLT. 

DU KANNST SÄMTLICHE BUCHUNGSBELEGE JEDERZEIT IN DEINEM PERSÖNLICHEN ACCOUNT EINSEHEN UND ALS PDF HERUNTERLADEN.

🎯 DIREKT-LINK: /account/invoices`
      });
    }

    if (
      cleanMessage.includes('bestellung') || 
      cleanMessage.includes('order') || 
      cleanMessage.includes('gekauft')
    ) {
      return NextResponse.json({
        response: `DEINEN BESTELLSTATUS UND DEINE HISTORIE FINDEST DU IN DEINER KUNDEN-ÜBERSICHT.

🎯 DIREKT-LINK ZU DEN BESTELLUNGEN: /account/orders`
      });
    }

    if (cleanMessage.includes('profil') || cleanMessage.includes('adresse') || cleanMessage.includes('passwort')) {
      return NextResponse.json({
        response: `EINSTELLUNGEN ZU DEINEM KONTO KANNST DU IN DEINEN ACCOUNT-PANELS ANPASSEN:
        
■ PROFIL & ADRESSE: /account/profile
■ SICHERHEIT & PASSWORT: /account/security`
      });
    }

    // ----------------------------------------------------------------
    // 2. PRODUKT-SUCHE IN POSTGRESQL
    // ----------------------------------------------------------------
    const matchingProducts = await prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: cleanMessage, mode: 'insensitive' } },
          { description: { contains: containsPattern(cleanMessage), mode: 'insensitive' } },
          { category: { contains: cleanMessage, mode: 'insensitive' } }
        ]
      },
      take: 3
    });

    if (matchingProducts.length > 0) {
      let botResponse = `JA, WIR HABEN PASSENDE ARTIKEL IM SORTIMENT. HIER SIND UNSERE CORE-TREFFER:\n\n`;
      matchingProducts.forEach(p => {
        botResponse += `■ ${p.title.toUpperCase()} — ${p.price.toFixed(2)} €\n`;
      });
      botResponse += `\nSCHAU DIR DIESE ARTIKEL DIREKT AUF UNSERER STARTSEITE AN. KANN ICH DIR NOCH BEI ETWAS ANDEREM HELFEN?`;
      return NextResponse.json({ response: botResponse });
    } 

    // ----------------------------------------------------------------
    // 3. STATISCHE FAQ-MATRIX (Erweitert mit Synonymen)
    // ----------------------------------------------------------------
    
    // Begrüßung
    if (matchesAny(cleanMessage, ['hallo', 'hi', 'servus', 'moin', 'hey'])) {
      return NextResponse.json({
        response: "WILLKOMMEN BEI SHOP4YOU. ICH BIN BEREIT. WIE KANN ICH DEIN SHOPPING-ERLEBNIS HEUTE OPTIMIEREN?"
      });
    }

    // Versand & Lieferung
    if (matchesAny(cleanMessage, ['versand', 'lieferung', 'porto', 'fracht', 'dauer'])) {
      return NextResponse.json({
        response: "STANDARD-VERSAND ERFOLGT INNERHALB VON 24-48 STUNDEN. AB 50 € GELTENT FÜR DICH KOSTENFREIE LIEFERBEDINGUNGEN, DARUNTER FALLEN 4,95 € PORTO AN."
      });
    }

    // Rückgabe & Retoure
    if (matchesAny(cleanMessage, ['rückgabe', 'retoure', 'zurückschicken', 'umtausch', 'reklamation'])) {
      return NextResponse.json({
        response: "DU KANNST JEDEN ARTIKEL INNERHALB VON 14 TAGEN KOSTENLOS AN UNS ZURÜCKSENDEN. EIN RETOUREN-LABEL KANNST DU BEIM SUPPORT ANFORDERN."
      });
    }

    // Zahlungsmethoden
    if (matchesAny(cleanMessage, ['zahlung', 'bezahlen', 'kreditkarte', 'paypal', 'vorkasse'])) {
      return NextResponse.json({
        response: "WIR UNTERSTÜTZEN FOLGENDE RECHNERISCHE ZAHLUNGSARTEN: PAYPAL, KREDITKARTE (VISA/MASTERCARD) SOWIE DIREKTE VORKASSE BEIM CHECKOUT."
      });
    }

    // Support / Kontakt
    if (matchesAny(cleanMessage, ['kontakt', 'hilfe', 'support', 'telefon', 'email', 'mensch'])) {
      return NextResponse.json({
        response: "UNSER HUMAN-SUPPORT IST VON MO-FR 09:00 - 18:00 UHR ERREICHBAR. SCHREIBE UNS EINE E-MAIL AN: SUPPORT@SHOP4YOU.DE"
      });
    }

    // ----------------------------------------------------------------
    // 4. INTELLIGENTER FALLBACK (Zeige stattdessen verfügbare Kategorien)
    // ----------------------------------------------------------------
    const randomProducts = await prisma.product.findMany({ take: 2 });
    let fallbackResponse = `DEINE ANFRAGE ZU "${message.toUpperCase()}" ERGAB KEINE DIREKTEN DATENBANK-TREFFER.\n\nPROBIERE SUCHBEGRIFFE WIE "Versand", "Rechnung" ODER SUCH NACH PRODUKTEN.\n\nAKTUELL SEHR BELIEBT:\n`;
    
    randomProducts.forEach(p => {
      fallbackResponse += `■ ${p.title.toUpperCase()}\n`;
    });

    return NextResponse.json({ response: fallbackResponse });

  } catch (error) {
    console.error("CHAT_API_ERROR:", error);
    return NextResponse.json(
      { response: "CORE-SYSTEMFEHLER. ANFRAGE KONNTE NICHT VERARBEITET WERDEN." }, 
      { status: 500 }
    );
  }
}

// Kleine Hilfsfunktionen für saubereres Keyword-Matching
function matchesAny(text: string, keywords: string[]): boolean {
  return keywords.some(keyword => text.includes(keyword));
}

function containsPattern(text: string): string {
  return text;
}