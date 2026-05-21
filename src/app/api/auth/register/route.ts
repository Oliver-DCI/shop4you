// src/app/api/auth/register/route.ts
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
    const { firstName, lastName, email, password, role, street, zipCode, city } = body;

    // 1. Validierung: Pflichtfelder prüfen (Inklusive der neuen Adressfelder!)
    if (!email || !password || !firstName || !lastName || !street || !zipCode || !city) {
      return NextResponse.json(
        { error: 'Bitte fülle alle Pflichtfelder (inklusive vollständiger Adresse) aus.' }, 
        { status: 400 }
      );
    }

    // 2. E-Mail-Formatierung: Trimmen und Kleinschreibung erzwingen
    const formattedEmail = email.toLowerCase().trim();

    // 3. Eindeutigkeit prüfen: Existiert die E-Mail bereits?
    const existingUser = await prisma.user.findUnique({
      where: { email: formattedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Diese E-Mail-Adresse wird bereits im System verwendet.' }, 
        { status: 400 }
      );
    }

    // 4. Passwort-Hashing: Sicher verschlüsseln
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. User-Erstellung: Ab in die PostgreSQL-Datenbank!
    // 🎯 WICHTIG: Die Rolle muss exakt 'USER' (oder 'ADMIN') lauten, passend zum Prisma-Enum!
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: formattedEmail,
        password: hashedPassword,
        role: role === 'ADMIN' ? 'ADMIN' : 'USER', // Fallback auf standardmäßiges 'USER'
        street,
        zipCode,
        city,
      },
    });

    // 6. Passwort aus der Rückgabe entfernen, bevor wir antworten
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({ 
      success: true, 
      message: 'Konto erfolgreich im shop4you-System registriert.',
      user: userWithoutPassword 
    }, { status: 201 });

  } catch (error: any) {
    console.error('🔒 Register API Error:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler bei der Registrierung.', details: error.message }, 
      { status: 500 }
    );
  }
}