// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

// Verbindung zur PostgreSQL-Datenbank über den Supabase-Connection-String
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Validierung: Wurden alle erforderlichen Felder abgeschickt?
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Bitte E-Mail-Adresse und Passwort vollständig angeben.' }, 
        { status: 400 }
      );
    }

    // 2. User-Suche: Existiert die E-Mail-Adresse in unserer Datenbank?
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }, // Sicher gegen Tippfehler bei Groß-/Kleinschreibung
    });

    if (!user) {
      // Sicherheits-Best-Practice: Keine genaue Auskunft darüber geben, ob die E-Mail oder das Passwort falsch war
      return NextResponse.json(
        { error: 'Ungültige Anmeldedaten. Bitte überprüfe deine Eingaben.' }, 
        { status: 401 }
      );
    }

    // 3. Passwort-Vergleich: Stimmt das eingegebene Passwort mit dem verschlüsselten DB-Hash überein?
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Ungültige Anmeldedaten. Bitte überprüfe deine Eingaben.' }, 
        { status: 401 }
      );
    }

    // 4. Erfolg: Wir senden die User-Daten (OHNE das Passwort!) zurück an die App
    return NextResponse.json({
      success: true,
      message: 'Authentifizierung erfolgreich.',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        // Falls du die Adresse für Rechnungen im Frontend brauchst, senden wir sie direkt mit:
        street: user.street,
        zipCode: user.zipCode,
        city: user.city
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error('🔒 Login API Error:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler bei der Authentifizierung.', details: error.message }, 
      { status: 500 }
    );
  }
}