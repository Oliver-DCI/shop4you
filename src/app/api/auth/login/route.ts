import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Zentrale Instanz
import bcrypt from 'bcrypt';

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

    const formattedEmail = email.toLowerCase().trim();

    // 2. User-Suche: Existiert die E-Mail-Adresse in unserer Datenbank?
    const user = await prisma.user.findUnique({
      where: { email: formattedEmail },
    });

    if (!user) {
      // 🎯 TERMINAL-LOGGING: Zeigt dir im VS-Code Terminal sofort, ob die Mail falsch ist
      console.log(`❌ LOGIN-FAILED: E-Mail [${formattedEmail}] existiert nicht in der Datenbank.`);
      
      return NextResponse.json(
        { error: 'Ungültige Anmeldedaten. Bitte überprüfe deine Eingaben.' }, 
        { status: 401 }
      );
    }

    // 3. Passwort-Vergleich: Stimmt das Passwort mit dem DB-Hash überein?
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // 🎯 TERMINAL-LOGGING: Zeigt dir im VS-Code Terminal, ob das Passwort falsch eingegeben wurde
      console.log(`❌ LOGIN-FAILED: Passwort für [${formattedEmail}] stimmt nicht mit dem Hash überein.`);
      
      return NextResponse.json(
        { error: 'Ungültige Anmeldedaten. Bitte überprüfe deine Eingaben.' }, 
        { status: 401 }
      );
    }

    // 🎯 ERFOLGS-LOGGING: Bestätigung im Terminal
    console.log(`✅ LOGIN-SUCCESS: User [${formattedEmail}] erfolgreich eingeloggt.`);

    // 4. Erfolg: Wir senden alle User-Daten (OHNE das Passwort!) zurück an die App
    return NextResponse.json({
      success: true,
      message: 'Authentifizierung erfolgreich.',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
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