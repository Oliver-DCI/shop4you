import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';

// 🛠️ 1. Cloudinary Konfiguration über Umgebungsvariablen
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 📁 Zielordner in Cloudinary für SHOP4YOU
const CLOUDINARY_FOLDER = 'shop4you/products';

// 📦 Deine 24 Premium-Produkte mit exakt 4 Unsplash-Links
const premiumProducts = [
  {
    title: 'MacBook Pro 16" M3 Max',
    description: 'Ultimative Rechenleistung für Entwickler und Kreative. 64GB Unified Memory, 2TB SSD.',
    price: 3999.99,
    category: 'Notebooks',
    brand: 'Apple',
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800',
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800'
    ]
  },
  {
    title: 'Galaxy Book4 Ultra',
    description: '3K AMOLED Touchscreen, Intel Core Ultra 9, NVIDIA RTX 4070. Perfekte Windows-Performance.',
    price: 2699.00,
    category: 'Notebooks',
    brand: 'Samsung',
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800',
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'
    ]
  },
  {
    title: 'ThinkPad X1 Carbon Gen 12',
    description: 'Das ultimative Business-Notebook. Ultraleichtes Carbon-Gehäuse, extrem lange Akkulaufzeit.',
    price: 2199.99,
    category: 'Notebooks',
    brand: 'Lenovo',
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800',
      'https://images.unsplash.com/photo-1602080858428-57174d9431cf?w=800',
      'https://images.unsplash.com/photo-1504707748692-419802cf939d?w=800',
      'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800'
    ]
  },
  {
    title: 'Dell XPS 14 OLED',
    description: 'Atemberaubendes rahmenloses OLED-Display, minimalistisches Aluminium-Design.',
    price: 1899.00,
    category: 'Notebooks',
    brand: 'Dell',
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800'
    ]
  },
  {
    title: 'Razer Blade 16',
    description: 'High-End Gaming-Notebook mit Dual-Mode Mini-LED Display und NVIDIA RTX 4090.',
    price: 3599.00,
    category: 'Notebooks',
    brand: 'Razer',
    stock: 5,
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'
    ]
  },
  {
    title: 'ROG Zephyrus G16 OLED',
    description: 'Ultradünnes Gaming- und Creator-Notebook. AMD Ryzen AI 9, 240Hz OLED-Panel.',
    price: 2499.00,
    category: 'Notebooks',
    brand: 'Asus',
    stock: 10,
    images: [
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800',
      'https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=800',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'
    ]
  },
  {
    title: 'HP Spectre x360 14',
    description: 'Luxuriöses 2-in-1 Convertible mit Intel Evo Plattform und brillanter 2.8K Kamera.',
    price: 1699.00,
    category: 'Notebooks',
    brand: 'HP',
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800',
      'https://images.unsplash.com/photo-1504707748692-419802cf939d?w=800',
      'https://images.unsplash.com/photo-1602080858428-57174d9431cf?w=800',
      'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800'
    ]
  },
  {
    title: 'Surface Laptop 7 Copilot+',
    description: 'Snapdragon X Elite Prozessor sorgt für bahnbrechende Akkulaufzeit und native Windows AI.',
    price: 1549.00,
    category: 'Notebooks',
    brand: 'Microsoft',
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800'
    ]
  },
  {
    title: 'iPhone 15 Pro Max',
    description: 'Titan-Gehäuse, A17 Pro Chip, 5x Tele-Kamera. Das Maß aller Dinge.',
    price: 1449.00,
    category: 'Smartphones',
    brand: 'Apple',
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
      'https://images.unsplash.com/photo-1565849553881-477123dee815?w=800',
      'https://images.unsplash.com/photo-1573148195900-7845dcb9b127?w=800'
    ]
  },
  {
    title: 'Galaxy S24 Ultra',
    description: 'Mit integriertem S-Pen, 200 MP Kamera und hochentwickelten Galaxy AI Features.',
    price: 1349.00,
    category: 'Smartphones',
    brand: 'Samsung',
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800',
      'https://images.unsplash.com/photo-1565728741225-21d6b5e04b2c?w=800',
      'https://images.unsplash.com/photo-1533228891704-8f5c75e8f42a?w=800'
    ]
  },
  {
    title: 'Google Pixel 8 Pro',
    description: 'Die beste Android-Kamera direkt von Google. Pure Ästhetik und smarte KI-Funktionen.',
    price: 999.00,
    category: 'Smartphones',
    brand: 'Google',
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800',
      'https://images.unsplash.com/photo-1551645121-d1034da75057?w=800',
      'https://images.unsplash.com/photo-1574755393849-623942496936?w=800',
      'https://images.unsplash.com/photo-1584438784894-089d6a128f3e?w=800'
    ]
  },
  {
    title: 'Xiaomi 14 Ultra',
    description: 'Leica Quad-Kamerasystem mit variabler Blende. Für professionelle Fotografie.',
    price: 1199.00,
    category: 'Smartphones',
    brand: 'Xiaomi',
    stock: 10,
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
      'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800',
      'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=800',
      'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=800'
    ]
  },
  {
    title: 'OnePlus 12 Black Edition',
    description: '100W SuperVOOC Schnellladen, Snapdragon 8 Gen 3 und exklusives Hasselblad-Kamerasystem.',
    price: 949.00,
    category: 'Smartphones',
    brand: 'OnePlus',
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800',
      'https://images.unsplash.com/photo-1565849553881-477123dee815?w=800',
      'https://images.unsplash.com/photo-1533228891704-8f5c75e8f42a?w=800',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800'
    ]
  },
  {
    title: 'Nothing Phone (2)',
    description: 'Einzigartiges transparentes Design mit interaktivem Glyph-Interface auf der Rückseite.',
    price: 649.00,
    category: 'Smartphones',
    brand: 'Nothing',
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
      'https://images.unsplash.com/photo-1574755393849-623942496936?w=800',
      'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=800',
      'https://images.unsplash.com/photo-1584438784894-089d6a128f3e?w=800'
    ]
  },
  {
    title: 'Sony Xperia 1 VI',
    description: 'Echtes optisches Zoom-Objektiv und OLED-Display im 19.5:9 Kinoformat für Cineasten.',
    price: 1299.00,
    category: 'Smartphones',
    brand: 'Sony',
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800',
      'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800',
      'https://images.unsplash.com/photo-1551645121-d1034da75057?w=800'
    ]
  },
  {
    title: 'iPhone 15 Studio Edition',
    description: 'Kompaktes Premium-Format mit mattem Glas-Finish und exzellenter Dual-Kamera.',
    price: 949.00,
    category: 'Smartphones',
    brand: 'Apple',
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
      'https://images.unsplash.com/photo-1573148195900-7845dcb9b127?w=800',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800'
    ]
  },
  {
    title: 'Neo QLED 8K 75"',
    description: 'Sensationelle 8K-Auflösung dank Quantum-Mini-LEDs. Ultradünnes Infinity Design.',
    price: 3499.00,
    category: 'TV',
    brand: 'Samsung',
    stock: 5,
    images: [
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
      'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800',
      'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800'
    ]
  },
  {
    title: 'OLED EVO G4 65"',
    description: 'Das hellste OLED-Display aller Zeiten mit Brightness Booster Max und perfektem Schwarz.',
    price: 2499.00,
    category: 'TV',
    brand: 'LG',
    stock: 9,
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
      'https://images.unsplash.com/photo-1511385348-a52b4a160dc2?w=800',
      'https://images.unsplash.com/photo-1589561253898-768105ca91a8?w=800',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800'
    ]
  },
  {
    title: 'BRAVIA XR OLED 65"',
    description: 'Acoustic Surface Audio+ verwandelt den gesamten Bildschirm in einen Premium-Lautsprecher.',
    price: 2199.00,
    category: 'TV',
    brand: 'Sony',
    stock: 7,
    images: [
      'https://images.unsplash.com/photo-1601944179066-297cbd3cdef3?w=800',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800',
      'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800'
    ]
  },
  {
    title: 'Ambilight OLED+ 55"',
    description: '4-seitiges Ambilight projiziert die Farben des Bildschirms nahtlos an deine Wand.',
    price: 1799.00,
    category: 'TV',
    brand: 'Philips',
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800',
      'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800',
      'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800'
    ]
  },
  {
    title: 'Sony WH-1000XM5',
    description: 'Marktführendes Noise Cancelling kombiniert mit brillantem High-Res Sound.',
    price: 329.00,
    category: 'Audio',
    brand: 'Sony',
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800',
      'https://images.unsplash.com/photo-1547119957-637f8679db1e?w=800',
      'https://images.unsplash.com/photo-1551645121-d1034da75057?w=800'
    ]
  },
  {
    title: 'QuietComfort Ultra',
    description: 'Immersives Audio und legendäre Geräuschunterdrückung für maximalen Fokus.',
    price: 379.00,
    category: 'Audio',
    brand: 'Bose',
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
      'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800',
      'https://images.unsplash.com/photo-1600541519463-fcd0c2d93514?w=800',
      'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800'
    ]
  },
  {
    title: 'AirPods Max Titanium',
    description: 'Design-Meisterwerk aus eloxiertem Aluminium mit sensationellem 3D-Audio.',
    price: 579.00,
    category: 'Audio',
    brand: 'Apple',
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=800',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800'
    ]
  },
  {
    title: 'Sennheiser HD 660S2',
    description: 'Offener, audiophiler Over-Ear Kopfhörer für detailreichen, natürlichen Klang auf Studio-Niveau.',
    price: 499.00,
    category: 'Audio',
    brand: 'Sennheiser',
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'
    ]
  },
];

async function runMigration() {
  console.log('🚀 Starte automatischen Bilder-Upload zu Cloudinary...');
  const migratedProducts: any[] = [];
  
  // Zähler für die Logs
  let totalImagesCount = premiumProducts.reduce((acc, p) => acc + p.images.length, 0);
  let processedImages = 0;

  for (const product of premiumProducts) {
    console.log(`\n📦 Verarbeite Artikel: "${product.title}"`);
    const newCloudinaryUrls: string[] = [];

    for (const imageUrl of product.images) {
      processedImages++;
      try {
        console.log(`   [${processedImages}/${totalImagesCount}] Lade Bild hoch...`);
        
        // ✨ Cloudinary Upload direkt per Remote-URL
        const uploadResult = await cloudinary.uploader.upload(imageUrl, {
          folder: CLOUDINARY_FOLDER,
          quality: 'auto',
          fetch_format: 'auto'
        });

        newCloudinaryUrls.push(uploadResult.secure_url);
      } catch (err) {
        console.error(`   ❌ Fehler beim Hochladen von ${imageUrl}:`, err);
        newCloudinaryUrls.push(imageUrl);
      }
    }

    migratedProducts.push({
      ...product,
      images: newCloudinaryUrls
    });
  }

  // 📝 Generiere den neuen Inhalt für die prisma/seed.ts
  const newSeedContent = `import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🔄 Bereinige alte Datenbank-Einträge...');
  await prisma.invoice.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('✅ Datenbank komplett geleert.');

  console.log('👑 Erstelle globalen Administrator mit vollständiger Adresse...');
  const hashedAdminPassword = await bcrypt.hash('admin', 10);

  const adminUser = await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'shop4you',
      email: 'admin@shop4you.de',
      password: hashedAdminPassword,
      role: 'ADMIN',
      street: 'Berliner Straße 100',
      zipCode: '63065',
      city: 'Offenbach am Main',
    },
  });

  console.log(\`✅ Administrator angelegt: \${adminUser.email}\`);
  console.log('🌱 Erstelle Premium-Produkte mit sicheren Cloudinary-Bildern...');

  const premiumProducts = ${JSON.stringify(migratedProducts, null, 4).replace(/"sellerId": ".*"/g, 'sellerId: adminUser.id')};

  // Injiziere die sellerId dynamisch beim Erstellen die Produkte
  for (const product of premiumProducts) {
    await prisma.product.create({
      data: {
        ...product,
        sellerId: adminUser.id
      },
    });
  }

  console.log(\`🎉 Seed erfolgreich! Admin hat Adresse & es wurden insgesamt \${premiumProducts.length} Premium-Artikel mit Cloudinary-Links eingepflegt.\`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
`;

  const seedPath = path.join(process.cwd(), 'prisma', 'seed.ts');
  fs.writeFileSync(seedPath, newSeedContent, 'utf-8');
  
  console.log('\n---');
  console.log(`✅ MIGRATION ERFOLGREICH! Alle Bilder liegen im Cloudinary Ordner: "${CLOUDINARY_FOLDER}".`);
  console.log(`📄 Die Datei "${seedPath}" wurde automatisch mit den neuen URLs aktualisiert.`);
}

runMigration().catch(console.error);