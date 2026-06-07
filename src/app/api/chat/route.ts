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
    if (!message) return NextResponse.json({ response: "BITTE GEB EINE NACHRICHT EIN." }, { status: 400 });

    const cleanMessage = message.toLowerCase().trim();

    // ----------------------------------------------------------------
    // 1. DYNAMISCHE STRUKTUR-ANTWORTEN (Account-Hinweise)
    // ----------------------------------------------------------------
    if (matchesAny(cleanMessage, ['rechnung', 'beleg', 'archiv', 'rechnungen'])) {
      return NextResponse.json({
        response: `DEINE RECHNUNGEN WERDEN DYNAMISCH ERSTELLT.\n\nDU KANNST SÄMTLICHE BUCHUNGSBELEGE JEDERZEIT IN DEINEM ACCOUNT EINSEHEN UND ALS PDF HERUNTERLADEN.`
      });
    }

    if (matchesAny(cleanMessage, ['bestellung', 'order', 'gekauft', 'historie', 'status'])) {
      return NextResponse.json({
        response: `DEINEN BESTELLSTATUS UND DEINE HISTORIE FINDEST DU IN DEINER KUNDEN-ÜBERSICHT IM ACCOUNT-MENU.`
      });
    }

    if (matchesAny(cleanMessage, ['profil', 'adresse', 'passwort', 'einstellungen', 'konto'])) {
      return NextResponse.json({
        response: `EINSTELLUNGEN ZU DEINEM KONTO KANNST DU DIREKT IN DEINEM PROFIL-PANEL ANPASSEN.`
      });
    }

    // ----------------------------------------------------------------
    // 2. SORTIMENT-TRIGGER: REPRÄSENTATIVE KATEGORIE-VORSCHLÄGE (MAX 5)
    // ----------------------------------------------------------------
    if (matchesAny(cleanMessage, ['welche artikel', 'welche produkte', 'sortiment', 'shop', 'katalog', 'alles', 'alle artikel'])) {
      const allProducts = await prisma.product.findMany();
      
      // Clevere Gruppierung: Wir merken uns, welche Kategorien wir schon haben
      const seenCategories = new Set<string>();
      const uniqueCategoryProducts: any[] = [];

      for (const p of allProducts) {
        const cat = p.category || 'Allgemein';
        if (!seenCategories.has(cat)) {
          seenCategories.add(cat);
          uniqueCategoryProducts.push(p);
        }
        if (uniqueCategoryProducts.length >= 5) break; // Exakt 5 Vorschläge absichern
      }

      if (uniqueCategoryProducts.length > 0) {
        let botResponse = `HIER IST EIN AUSZUG UNSERES UTILITY-SORTIMENTS (JEWEILS EIN TOP-ARTIKEL PRO KATEGORIE):\n\n`;
        uniqueCategoryProducts.forEach(p => {
          const categoryName = p.category ? p.category.toUpperCase() : 'ALLGEMEIN';
          botResponse += `■ [${categoryName}] — ${p.title.toUpperCase()} (${p.price.toFixed(2)} €)\n`;
        });
        botResponse += `\nNUTZE DIE SUCHE IM SHOP, UM DIE ARTIKEL DIREKT IN DEINEN WARENKORB ZU LEGEN.`;
        return NextResponse.json({ response: botResponse });
      }
    }

    // ----------------------------------------------------------------
    // 3. GEZIELTE PRODUKT-SUCHE IN POSTGRESQL (EINZELTREFFER OHNE LINKS)
    // ----------------------------------------------------------------
    const isGeneric = matchesAny(cleanMessage, ['hallo', 'hi', 'danke', 'tschüss', 'support']);
    let matchingProducts: any[] = [];

    if (!isGeneric && cleanMessage.length > 2) {
      matchingProducts = await prisma.product.findMany({
        where: {
          OR: [
            { title: { contains: cleanMessage, mode: 'insensitive' } },
            { category: { contains: cleanMessage, mode: 'insensitive' } }
          ]
        },
        take: 3
      });
    }

    if (matchingProducts.length > 0) {
      let botResponse = `JA! FOLGENDE ARTIKEL PASSEN ZU DEINER SUCHE:\n\n`;
      matchingProducts.forEach(p => {
        botResponse += `■ ${p.title.toUpperCase()} — ${p.price.toFixed(2)} €\n`;
      });
      return NextResponse.json({ response: botResponse });
    } 

    // ----------------------------------------------------------------
    // 4. STATISCHE FAQ-MATRIX (Synonyme)
    // ----------------------------------------------------------------
    if (matchesAny(cleanMessage, ['hallo', 'hi', 'servus', 'moin', 'hey', 'guten tag'])) {
      return NextResponse.json({
        response: "WILLKOMMEN BEI SHOP4YOU. DER CORE-ASSISTENT IST ONLINE. WIE KANN ICH DEIN SHOPPING-ERLEBNIS HEUTE OPTIMIEREN?"
      });
    }

    if (matchesAny(cleanMessage, ['danke', 'vielen dank', 'super', 'perfekt'])) {
      return NextResponse.json({
        response: "SEHR GERNE! DAS CORE-SYSTEM STEHT DIR JEDERZEIT ZUR VERFÜGUNG. KANN ICH NOCH ETWAS FÜR DICH TUN?"
      });
    }

    if (matchesAny(cleanMessage, ['versand', 'lieferung', 'porto', 'fracht', 'dauer', 'abholen'])) {
      return NextResponse.json({
        response: "STANDARD-VERSAND ERFOLGT INNERHALB VON 24-48 STUNDEN NACH ZAHLUNGSEINGANG. AB 50.00 € WARENWERT IST DER VERSAND FÜR DICH KOSTENLOS (DARUNTER PAUSCHAL 4,95 €)."
      });
    }

    if (matchesAny(cleanMessage, ['rückgabe', 'retoure', 'zurückschicken', 'umtausch', 'reklamation', 'kaputt'])) {
      return NextResponse.json({
        response: "RETROUREN-RICHTLINIE: DU KANNST JEDEN ARTIKEL INNERHALB VON 14 TAGEN KOSTENLOS ZURÜCKSENDEN. MAILE UNS EINFACH AN SUPPORT@SHOP4YOU.DE FÜR EIN GRATIS RETOUREN-LABEL."
      });
    }

    if (matchesAny(cleanMessage, ['zahlung', 'bezahlen', 'kreditkarte', 'paypal', 'vorkasse', 'stripe'])) {
      return NextResponse.json({
        response: "WIR UNTERSTÜTZEN ZWEI RECHNERISCHE SICHERE ZAHLUNGSARTEN:\n1. PAYPAL EXPRESS\n2. STRIPE CREDIT CARD (DIREKTE VERARBEITUNG IN UNSEREM CHECKOUT)"
      });
    }

    if (matchesAny(cleanMessage, ['kontakt', 'hilfe', 'support', 'telefon', 'email', 'mensch', 'mitarbeiter'])) {
      return NextResponse.json({
        response: "UNSER HUMAN-SUPPORT IST VON MO-FR 09:00 - 18:00 UHR ERREICHBAR.\n\n📧 E-MAIL: SUPPORT@SHOP4YOU.DE\n📞 TELEFON: +49 (0) 123 456789"
      });
    }

    // ----------------------------------------------------------------
    // 5. INTELLIGENTER FALLBACK (OHNE LINKS)
    // ----------------------------------------------------------------
    const randomProducts = await prisma.product.findMany({ take: 2 });
    let fallbackResponse = `ANFRAGE ZU "${message.toUpperCase()}" ERGAB KEINE DIREKTEN TREFFER.\n\nPROBIERE SUCHBEGRIFFE WIE: "Versand", "Zahlung" ODER NENNE EINE KATEGORIE.\n\nUNSERE AKTUELLEN EMPFEHLUNGEN:\n\n`;
    
    randomProducts.forEach(p => {
      fallbackResponse += `■ ${p.title.toUpperCase()} (${p.price.toFixed(2)} €)\n`;
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

function matchesAny(text: string, keywords: string[]): boolean {
  return keywords.some(keyword => text.includes(keyword));
}