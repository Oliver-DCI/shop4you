import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Fehlende Benutzer-Identifikation (userId).' }, { status: 400 });
    }

    // Wir führen das in einer Transaktion aus, damit entweder alles oder nichts gelöscht wird
    await prisma.$transaction(async (tx) => {
      // 1. Zuerst alle Produkte des Sellers löschen (falls vorhanden)
      await tx.product.deleteMany({
        where: {
          sellerId: userId,
        },
      });

      // 2. Jetzt den User selbst löschen
      await tx.user.delete({
        where: {
          id: userId,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Konto und alle zugehörigen Daten wurden erfolgreich gelöscht.',
    }, { status: 200 });

  } catch (error: any) {
    console.error('Account Delete API Fehler:', error);
    return NextResponse.json({ 
      error: 'Datenbankfehler beim Löschen des Accounts.', 
      details: error.message 
    }, { status: 500 });
  }
}