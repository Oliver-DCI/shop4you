import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Nutzt deinen zentralen Prisma-Client

export async function GET() {
  try {
    // 🎯 Wir holen absolut alle User aus der Datenbank
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Optionale Filterung direkt hier oder Übergabe des gesamten Arrays
    // Das Frontend kann dann .filter(u => u.role === 'USER') o.ä. machen
    return NextResponse.json(allUsers, { status: 200 });
  } catch (error: any) {
    console.error('[API_ADMIN_USERS_GET_ERROR]:', error);
    return NextResponse.json(
      { message: 'Fehler beim Laden der Benutzer-Datenbank.', details: error.message },
      { status: 500 }
    );
  }
}