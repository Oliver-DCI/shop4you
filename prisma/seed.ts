// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcrypt'; // ✨ Für das sichere Hashen des Admin-Passworts

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🔄 Bereinige alte Datenbank-Einträge...');
  // Zuerst Produkte, dann User löschen, um Fremdschlüssel-Konflikte zu vermeiden
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('✅ Datenbank komplett geleert.');

  // ==========================================
  // 👑 1. ADMIN USER SEEDING
  // ==========================================
  console.log('👑 Erstelle globalen Administrator...');
  
  // Passwort 'admin' sicher mit 10 Salts hashen
  const hashedAdminPassword = await bcrypt.hash('admin', 10);

  const adminUser = await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'shop4you',
      email: 'admin@shop4you.de',
      password: hashedAdminPassword,
      role: 'admin', // Ermöglicht den Zutritt zur Admin-Zentrale
      street: 'Zentralstraße 1',
      zipCode: '10115',
      city: 'Berlin',
    },
  });

  console.log(`✅ Administrator angelegt: ${adminUser.email}`);

  // ==========================================
  // 🌱 2. PREMIUM IT- & TECH-PRODUKTE SEEDING
  // ==========================================
  console.log('🌱 Erstelle 20 Premium IT- & Tech-Produkte (jeweils mit 5 Bildern)...');

  const premiumProducts = [
    // --- NOTEBOOKS / LAPTOPS ---
    {
      title: 'QuantumBook Pro 16',
      description: 'High-End Workstation mit M3 Ultra Architektur, 64 GB Unified Memory und einem atemberaubenden 120Hz Mini-LED Display für Entwickler und Creator.',
      price: 2499.00,
      category: 'Notebooks',
      stock: 15,
      sellerId: adminUser.id, // Verknüpft die Produkte direkt mit dem Admin als Verkäufer
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800',
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800',
        'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800',
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800'
      ]
    },
    {
      title: 'AeroBook Air 14',
      description: 'Federleichtes Gehäuse aus recyceltem Aluminium gepaart mit lüfterloser Performance und einer Akkulaufzeit von bis zu 22 Stunden. Der ideale Begleiter fürs Studium.',
      price: 1099.00,
      category: 'Notebooks',
      stock: 25,
      sellerId: adminUser.id,
      images: [
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800',
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800',
        'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800',
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
        'https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=800'
      ]
    },
    {
      title: 'Zenith Creator 15',
      description: 'Ausgestattet mit dedizierter Next-Gen Grafik und Farb-kalibriertem 4K-Bildschirm. Entwickelt für 3D-Compositing, Videoschnitt und kompromissloses Rendering.',
      price: 1899.00,
      category: 'Notebooks',
      stock: 8,
      sellerId: adminUser.id,
      images: [
        'https://images.unsplash.com/photo-1602080858428-57174d9431cf?w=800',
        'https://images.unsplash.com/photo-1504707748692-419802cf939d?w=800',
        'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800',
        'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800',
        'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800'
      ]
    },
    {
      title: 'Viper Edge 17 Pro',
      description: 'Ein Biest von einem Gaming-Laptop. Mechanische Tastatur, flüssigmetall-gekühltes System und 360Hz Bildwiederholrate für E-Sports auf absolutem Profi-Niveau.',
      price: 2799.00,
      category: 'Notebooks',
      stock: 12,
      sellerId: adminUser.id,
      images: [
        'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800',
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
        'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
        'https://images.unsplash.com/photo-1552831344-f914f56f383f?w=800',
        'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=800'
      ]
    },
    {
      title: 'CloudBook Element 13',
      description: 'Kompakt, minimalistisch und zu 100% optimiert für Cloud-Working und Web-Apps. Ausdauernder Akku in einem robusten Polycarbonat-Gehäuse.',
      price: 449.00,
      category: 'Notebooks',
      stock: 50,
      sellerId: adminUser.id,
      images: [
        'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800',
        'https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=800',
        'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800',
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'
      ]
    },

    // --- SMARTPHONES / HANDYS ---
    {
      title: 'NovaPhone 17 Ultra',
      description: 'Das Smartphone der Zukunft mit Titan-Gehäuse, holografischem Display-Modus und einem 200 Megapixel Periskop-Kamerasystem für Kinoreife Aufnahmen.',
      price: 1249.00,
      category: 'Smartphones',
      stock: 20,
      sellerId: adminUser.id,
      images: [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
        'https://images.unsplash.com/photo-1565849553881-477123dee815?w=800',
        'https://images.unsplash.com/photo-1573148195900-7845dcb9b127?w=800',
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800',
        'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800'
      ]
    },
    {
      title: 'MatrixPhone 17 Pro',
      description: 'Kompakte Power in der Handfläche. Ein extrem helles Display, superschnelles Laden per Induktion und smarte KI-Features, die deinen Alltag revolutionieren.',
      price: 899.00,
      category: 'Smartphones',
      stock: 30,
      sellerId: adminUser.id,
      images: [
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800',
        'https://images.unsplash.com/photo-1565728741225-21d6b5e04b2c?w=800',
        'https://images.unsplash.com/photo-1533228891704-8f5c75e8f42a?w=800',
        'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800',
        'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800'
      ]
    },
    {
      title: 'Aura Fold X3',
      description: 'Das faltbare Display-Wunder. Nutze es geschlossen als schlankes Smartphone und entfalte es zu einem vollwertigen 8-Zoll Tablet für Multitasking ohne Limits.',
      price: 1799.00,
      category: 'Smartphones',
      stock: 5,
      sellerId: adminUser.id,
      images: [
        'https://images.unsplash.com/photo-1551645121-d1034da75057?w=800',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
        'https://images.unsplash.com/photo-1574755393849-623942496936?w=800',
        'https://images.unsplash.com/photo-1584438784894-089d6a128f3e?w=800',
        'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=800'
      ]
    },
    {
      title: 'Pulse Neon Lite',
      description: 'Perfekt für die junge Generation. Farbwechselnde Rückseite aus Spezialglas, starker Akku und ein flüssiges 90Hz Display zum Spitzenpreis.',
      price: 349.00,
      category: 'Smartphones',
      stock: 40,
      sellerId: adminUser.id,
      images: [
        'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800',
        'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=800',
        'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=800',
        'https://images.unsplash.com/photo-1565630916779-e303be97b6f5?w=800',
        'https://images.unsplash.com/photo-1570155316226-4b702214838e?w=800'
      ]
    },
    {
      title: 'Titan Shield Rock',
      description: 'Das ultimative Outdoor-Handy. Stoßfest nach Militärstandard, komplett wasserdicht und mit einer integrierten Wärmebildkamera für härteste Einsätze.',
      price: 649.00,
      category: 'Smartphones',
      stock: 10,
      sellerId: adminUser.id,
      images: [
        'https://images.unsplash.com/photo-1584438784894-089d6a128f3e?w=800',
        'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=800',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800',
        'https://images.unsplash.com/photo-1565849553881-477123dee815?w=800'
      ]
    },

    // --- TABLETS ---
    {
      title: 'TabSlate Air 13 OLED',
      description: 'Ultradünnes Premium-Tablet mit brillantem Tandem-OLED Display. Perfekt für digitale Zeichnungen, Office-Arbeiten unterwegs und grenzenloses Entertainment.',
      price: 949.00,
      category: 'Tablets',
      stock: 14,
      sellerId: adminUser.id,
      images: [
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
        'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800',
        'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800',
        'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800',
        'https://images.unsplash.com/photo-1527698266440-12104e498b76?w=800'
      ]
    },
    {
      title: 'TabSlate Pro Mini',
      description: 'Klein, handlich, kompromisslos schnell. Das 8.7-Zoll Kraftpaket unterstützt präzise Stylus-Eingaben und passt perfekt in jede Tasche für Notizen und Skizzen.',
      price: 549.00,
      category: 'Tablets',
      stock: 18,
      sellerId: adminUser.id,
      images: [
        'https://images.unsplash.com/photo-1511385348-a52b4a160dc2?w=800',
        'https://images.unsplash.com/photo-1589561253898-768105ca91a8?w=800',
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
        'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800',
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800'
      ]
    },
    {
      title: 'Cortex Note E-Ink',
      description: 'Augenschonendes E-Ink Schreibtablet. Fühlt sich an wie echtes Papier. Ideal für Autoren, Studenten und endlose Skizzen ohne Akkusorgen für Wochen.',
      price: 399.00,
      category: 'Tablets',
      stock: 22,
      sellerId: adminUser.id,
      images: [
        'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800',
        'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800',
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
        'https://images.unsplash.com/photo-1511385348-a52b4a160dc2?w=800',
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800'
      ]
    },
    {
      title: 'Nexus Canvas 14 144Hz',
      description: 'Das ultimative Tablet für Designer. 100% DCI-P3 Farbraumabdeckung, Null Eingabeverzögerung und magnetische Halterung für professionelle Studioarbeit.',
      price: 1199.00,
      category: 'Tablets',
      stock: 7,
      sellerId: adminUser.id,
      images: [
        'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800',
        'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800',
        'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800',
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
        'https://images.unsplash.com/photo-1511385348-a52b4a160dc2?w=800'
      ]
    },
    {
      title: 'EduTab Smart 10',
      description: 'Robustes, kindersicheres Tablet für die digitale Bildung. Inklusive Lernsoftware, digitalem Stift und bruchsicherer Schutzhülle.',
      price: 249.00,
      category: 'Tablets',
      stock: 40,
      sellerId: adminUser.id,
      images: [
        'https://images.unsplash.com/photo-1527698266440-12104e498b76?w=800',
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
        'https://images.unsplash.com/photo-1511385348-a52b4a160dc2?w=800',
        'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800',
        'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800'
      ]
    },

    // --- ACCESSORIES / ZUBEHÖR ---
    {
      title: 'Apex Display 32" 4K',
      description: 'Professioneller 32-Zoll Hardware-kalibrierter Monitor mit Nano-Textur-Glas, Thunderbolt 4 Hub und integrierter Studio-Webcam für maximale Produktivität.',
      price: 1599.00,
      category: 'Zubehör',
      stock: 10,
      sellerId: adminUser.id,
      images: [
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800',
        'https://images.unsplash.com/photo-1547119957-637f8679db1e?w=800',
        'https://images.unsplash.com/photo-1551645121-d1034da75057?w=800',
        'https://images.unsplash.com/photo-1524143180608-61f1241f0a2a?w=800',
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800'
      ]
    },
    {
      title: 'CoreLink Docking Station',
      description: 'Die ultimative Schaltzentrale für deinen Schreibtisch. Verbinde bis zu drei 4K-Monitore, lade dein Notebook mit 100W Power Delivery und nutze 10 Gbit Ethernet.',
      price: 249.00,
      category: 'Zubehör',
      stock: 35,
      sellerId: adminUser.id,
      images: [
        'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800',
        'https://images.unsplash.com/photo-1600541519463-fcd0c2d93514?w=800',
        'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800',
        'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800',
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800'
      ]
    },
    {
      title: 'SoundAura ANC Pods',
      description: 'Audiophile In-Ear-Kopfhörer mit hybridem Active Noise Cancelling, Spatial Audio Tracking und einer kombinierten Akkulaufzeit von grandiosen 40 Stunden.',
      price: 199.00,
      category: 'Zubehör',
      stock: 60,
      sellerId: adminUser.id,
      images: [
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800'
      ]
    },
    {
      title: 'CyberKeys Mechanical Pro',
      description: 'Flache, mechanische Tastatur mit hot-swappable Schaltern, edlem Aluminium-Gehäuse und vollgradig anpassbarer RGB-Hintergrundbeleuchtung.',
      price: 149.00,
      category: 'Zubehör',
      stock: 25,
      sellerId: adminUser.id,
      images: [
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
        'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800',
        'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800',
        'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=800',
        'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800'
      ]
    },
    {
      title: 'ApexGlide Wireless Mouse',
      description: 'Ergonomische High-End Funkmaus mit optischen Switches, PixArt Pixelsensor und stufenlos anpassbarem Daumenrad für flüssige Workflows.',
      price: 119.00,
      category: 'Zubehör',
      stock: 45,
      sellerId: adminUser.id,
      images: [
        'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800',
        'https://images.unsplash.com/photo-1625842268584-8f3290462a3c?w=800',
        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800',
        'https://images.unsplash.com/photo-1625492922105-591d447bf92e?w=800',
        'https://images.unsplash.com/photo-1563297007-06a5b83936e9?w=800'
      ]
    }
  ];

  for (const product of premiumProducts) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('🎉 Seed erfolgreich! Admin & 20 erstklassige Tech-Artikel eingepflegt.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });