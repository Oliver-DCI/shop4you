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

    // 1. Suche in der PostgreSQL-Datenbank, ob ein Produkt zum Text passt
    const matchingProducts = await prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: cleanMessage, mode: 'insensitive' } },
          { description: { contains: cleanMessage, mode: 'insensitive' } },
          { category: { contains: cleanMessage, mode: 'insensitive' } }
        ]
      },
      take: 3 // Maximal 3 Produkte vorschlagen
    });

    // 2. Dynamische Antwortgenerierung basierend auf dem Fund
    let botResponse = "";

    if (matchingProducts.length > 0) {
      botResponse = `JA, WIR HABEN PASSENDE ARTIKEL IM SORTIMENT. HIER SIND UNSERE CORE-TREFFER:\n\n`;
      matchingProducts.forEach(p => {
        botResponse += `■ ${p.title.toUpperCase()} — ${p.price.toFixed(2)} €\n`;
      });
      botResponse += `\nDU FINDEST DIESE DIREKT IN UNSERER ÜBERSICHT. KANN ICH DIR ZU EINEM DIESER PRODUKTE NOCH DETAILS NENNEN?`;
    } 
    // Standard-Antworten für allgemeine Fragen
    else if (cleanMessage.includes('hallo') || cleanMessage.includes('hi')) {
      botResponse = "WILLKOMMEN BEI SHOP4YOU. ICH BIN BEREIT. WIE KANN ICH DEIN SHOPPING-ERLEBNIS HEUTE OPTIMIEREN?";
    } else if (cleanMessage.includes('versand') || cleanMessage.includes('lieferung')) {
      botResponse = "STANDARD-VERSAND ERFOLGT INNERHALB VON 24-48 STUNDEN. AB 50 € LIEFERN WIR KOSTENFREI.";
    } else {
      // Fallback, wenn der Bot nichts findet
      botResponse = `DEINE ANFRAGE ZU "${message.toUpperCase()}" WURDE ANALYSIERT. AKTUELL FÜHREN WIR KEINE DIREKTEN TREFFER IN DIESER KATEGORIE. SCHAU DIR GERNE UNSERE ANDEREN PREMIUM-ARTIKEL AUF DER STARTSEITE AN.`;
    }

    return NextResponse.json({ response: botResponse });

  } catch (error) {
    console.error("CHAT_API_ERROR:", error);
    return NextResponse.json(
      { response: "CORE-SYSTEMFEHLER. ANFRAGE KONNTE NICHT VERARBEITET WERDEN." }, 
      { status: 500 }
    );
  }
}