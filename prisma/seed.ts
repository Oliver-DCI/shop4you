// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🔄 Bereinige alte Produktdaten...');
  await prisma.product.deleteMany({});
  console.log('✅ Datenbank geleert.');

  console.log('🌱 Erstelle 8 neue IT-Testartikel (2 Zeilen à 4 Karten)...');

  const itProducts = [
    {
      title: 'QuantumBook Pro 16',
      description: 'High-End Workstation mit M3 Ultra Architektur, 64 GB Unified Memory und einem atemberaubenden 120Hz Mini-LED Display für Entwickler und Creator.',
      price: 2499.00,
      category: 'Notebooks',
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800',
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800'
      ]
    },
    {
      title: 'NovaPhone 17 Ultra',
      description: 'Das Smartphone der Zukunft mit Titan-Gehäuse, holografischem Display-Modus und einem 200 Megapixel Periskop-Kamerasystem für Kinoreife Aufnahmen.',
      price: 1249.00,
      category: 'Smartphones',
      images: [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
        'https://images.unsplash.com/photo-1565849553881-477123dee815?w=800',
        'https://images.unsplash.com/photo-1573148195900-7845dcb9b127?w=800'
      ]
    },
    {
      title: 'TabSlate Air 13 OLED',
      description: 'Ultradünnes Premium-Tablet mit brillantem Tandem-OLED Display. Perfekt für digitale Zeichnungen, Office-Arbeiten unterwegs und grenzenloses Entertainment.',
      price: 949.00,
      category: 'Tablets',
      images: [
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
        'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800',
        'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800'
      ]
    },
    {
      title: 'AeroBook Air 14',
      description: 'Federleichtes Gehäuse aus recyceltem Aluminium gepaart mit lüfterloser Performance und einer Akkulaufzeit von bis zu 22 Stunden. Der ideale Begleiter fürs Studium.',
      price: 1099.00,
      category: 'Notebooks',
      images: [
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800',
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800',
        'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800'
      ]
    },
    {
      title: 'Apex Display 32" 4K',
      description: 'Professioneller 32-Zoll Hardware-kalibrierter Monitor mit Nano-Textur-Glas, Thunderbolt 4 Hub und integrierter Studio-Webcam für maximale Produktivität.',
      price: 1599.00,
      category: 'Zubehör',
      images: [
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800',
        'https://images.unsplash.com/photo-1547119957-637f8679db1e?w=800',
        'https://images.unsplash.com/photo-1551645121-d1034da75057?w=800'
      ]
    },
    {
      title: 'CoreLink Docking Station',
      description: 'Die ultimative Schaltzentrale für deinen Schreibtisch. Verbinde bis zu drei 4K-Monitore, lade dein Notebook mit 100W Power Delivery und nutze 10 Gbit Ethernet.',
      price: 249.00,
      category: 'Zubehör',
      images: [
        'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800',
        'https://images.unsplash.com/photo-1600541519463-fcd0c2d93514?w=800',
        'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800'
      ]
    },
    {
      title: 'MatrixPhone 17 Pro',
      description: 'Kompakte Power in der Handfläche. Ein extrem helles Display, superschnelles Laden per Induktion und smarte KI-Features, die deinen Alltag revolutionieren.',
      price: 899.00,
      category: 'Smartphones',
      images: [
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800',
        'https://images.unsplash.com/photo-1565728741225-21d6b5e04b2c?w=800',
        'https://images.unsplash.com/photo-1533228891704-8f5c75e8f42a?w=800'
      ]
    },
    {
      title: 'TabSlate Pro Mini',
      description: 'Klein, handlich, kompromisslos schnell. Das 8.7-Zoll Kraftpaket unterstützt präzise Stylus-Eingaben und passt perfekt in jede Tasche für Notizen und Skizzen.',
      price: 549.00,
      category: 'Tablets',
      images: [
        'https://images.unsplash.com/photo-1511385348-a52b4a160dc2?w=800',
        'https://images.unsplash.com/photo-1589561253898-768105ca91a8?w=800',
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800'
      ]
    }
  ];

  for (const product of itProducts) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('🎉 Seed erfolgreich! 8 IT-Artikel wurden eingepflegt.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });