import { PrismaClient } from '@prisma/client';
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

  console.log(`✅ Administrator angelegt: ${adminUser.email}`);
  console.log('🌱 Erstelle Premium-Produkte mit sicheren Cloudinary-Bildern...');

  const premiumProducts = [
    {
        "title": "MacBook Pro 16\" M3 Max",
        "description": "Ultimative Rechenleistung für Entwickler und Kreative. 64GB Unified Memory, 2TB SSD.",
        "price": 3999.99,
        "category": "Notebooks",
        "brand": "Apple",
        "stock": 12,
        "images": [
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277469/shop4you/products/d2l3n1xdqmryn7jslnxn.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277470/shop4you/products/fl2953ce4l9ln6kdjelj.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277472/shop4you/products/xxq6m5zqdk3fdugowkdu.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277473/shop4you/products/ib9xslzli89gzecebujo.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277474/shop4you/products/vlrk7sqx95c7rbqhstr6.jpg"
        ]
    },
    {
        "title": "Galaxy Book4 Ultra",
        "description": "3K AMOLED Touchscreen, Intel Core Ultra 9, NVIDIA RTX 4070. Perfekte Windows-Performance.",
        "price": 2699,
        "category": "Notebooks",
        "brand": "Samsung",
        "stock": 8,
        "images": [
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277475/shop4you/products/nxaqdcxz4seoh8lsjklv.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277477/shop4you/products/huuwonihttbgelnnazzh.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277478/shop4you/products/d1irazsd1ow3yvbhv26e.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277479/shop4you/products/rbmpxp33rw4uq9y7bd1n.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277480/shop4you/products/wwmwjyqdrkveyfyephsd.jpg"
        ]
    },
    {
        "title": "ThinkPad X1 Carbon Gen 12",
        "description": "Das ultimative Business-Notebook. Ultraleichtes Carbon-Gehäuse, extrem lange Akkulaufzeit.",
        "price": 2199.99,
        "category": "Notebooks",
        "brand": "Lenovo",
        "stock": 15,
        "images": [
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277482/shop4you/products/asmqyg8ux5rbyyhxwvkc.jpg",
            "https://images.unsplash.com/photo-1602080858428-57174d9431cf?w=800",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277484/shop4you/products/q6vfqfjqsdxhv5qr1li5.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277485/shop4you/products/dg44apnowhagy5gntdsn.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277486/shop4you/products/n6caccog6ainmef6ea1z.jpg"
        ]
    },
    {
        "title": "Dell XPS 14 OLED",
        "description": "Atemberaubendes rahmenloses OLED-Display, minimalistisches Aluminium-Design.",
        "price": 1899,
        "category": "Notebooks",
        "brand": "Dell",
        "stock": 20,
        "images": [
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277488/shop4you/products/a3nf7q7h3exfq4a0yavn.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277489/shop4you/products/nuhbfkd5jqhlwuykpkox.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277491/shop4you/products/ccubtbyulstheq3ezbib.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277492/shop4you/products/wof9kyxnyemwyetliaep.jpg",
            "https://images.unsplash.com/photo-1552831344-f914f56f383f?w=800"
        ]
    },
    {
        "title": "Razer Blade 16",
        "description": "High-End Gaming-Notebook mit Dual-Mode Mini-LED Display und NVIDIA RTX 4090.",
        "price": 3599,
        "category": "Notebooks",
        "brand": "Razer",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277494/shop4you/products/jdczngcnyzvysczyuuvh.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277496/shop4you/products/ry4yiwi4ap83qi2ibmwh.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277497/shop4you/products/g45qohmlkkwp3gxt6t4k.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277498/shop4you/products/vp4koytfwplhbkdpremc.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277499/shop4you/products/reblguvhll8yuytjsefv.jpg"
        ]
    },
    {
        "title": "ROG Zephyrus G16 OLED",
        "description": "Ultradünnes Gaming- und Creator-Notebook. AMD Ryzen AI 9, 240Hz OLED-Panel.",
        "price": 2499,
        "category": "Notebooks",
        "brand": "Asus",
        "stock": 10,
        "images": [
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277501/shop4you/products/z5amfcrn53ygqu3aiplj.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277502/shop4you/products/gbjr89e3hrrxefjylhu1.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277503/shop4you/products/l9o7d0jyva2xg1kdacxl.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277504/shop4you/products/dj99pinxhyfzzg9o8yo4.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277506/shop4you/products/beog7bdlfvnyzqzwesmc.jpg"
        ]
    },
    {
        "title": "HP Spectre x360 14",
        "description": "Luxuriöses 2-in-1 Convertible mit Intel Evo Plattform und brillanter 2.8K Kamera.",
        "price": 1699,
        "category": "Notebooks",
        "brand": "HP",
        "stock": 14,
        "images": [
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277507/shop4you/products/oecsyvssdrxqth8rosot.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277508/shop4you/products/jrq8my8s8awf0isy4edl.jpg",
            "https://images.unsplash.com/photo-1602080858428-57174d9431cf?w=800",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277509/shop4you/products/fibbaizvyncfnkwxxc2q.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277510/shop4you/products/nsnyhsezwwth2sj4fu7o.jpg"
        ]
    },
    {
        "title": "Surface Laptop 7 Copilot+",
        "description": "Snapdragon X Elite Prozessor sorgt für bahnbrechende Akkulaufzeit und native Windows AI.",
        "price": 1549,
        "category": "Notebooks",
        "brand": "Microsoft",
        "stock": 18,
        "images": [
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277511/shop4you/products/qmxztvsrwqoywzjtzcnk.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277512/shop4you/products/bzr775nfrgr8gfml8aku.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277514/shop4you/products/hqasv9xn4mdaf3blvzxf.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277515/shop4you/products/okbyzmjztbhhzuovpkpq.jpg",
            "https://images.unsplash.com/photo-1552831344-f914f56f383f?w=800"
        ]
    },
    {
        "title": "iPhone 15 Pro Max",
        "description": "Titan-Gehäuse, A17 Pro Chip, 5x Tele-Kamera. Das Maß aller Dinge.",
        "price": 1449,
        "category": "Smartphones",
        "brand": "Apple",
        "stock": 25,
        "images": [
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277517/shop4you/products/fsfbdxtirwta8vrqwdbj.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277518/shop4you/products/lgelulrvs7aoje5dtjhd.jpg",
            "https://images.unsplash.com/photo-1565849553881-477123dee815?w=800",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277520/shop4you/products/llgx3mlw5m5h33vztkrw.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277521/shop4you/products/jnjzlmfpqi0lrxsrfpws.jpg"
        ]
    },
    {
        "title": "Galaxy S24 Ultra",
        "description": "Mit integriertem S-Pen, 200 MP Kamera und hochentwickelten Galaxy AI Features.",
        "price": 1349,
        "category": "Smartphones",
        "brand": "Samsung",
        "stock": 30,
        "images": [
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277523/shop4you/products/q0swu3myzzdknkzulgyz.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277524/shop4you/products/h1rdybuomnk6ufriqseq.jpg",
            "https://images.unsplash.com/photo-1565728741225-21d6b5e04b2c?w=800",
            "https://images.unsplash.com/photo-1533228891704-8f5c75e8f42a?w=800",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277527/shop4you/products/kjhbh59p2l4nq8sfhoir.jpg"
        ]
    },
    {
        "title": "Google Pixel 8 Pro",
        "description": "Die beste Android-Kamera direkt von Google. Pure Ästhetik und smarte KI-Funktionen.",
        "price": 999,
        "category": "Smartphones",
        "brand": "Google",
        "stock": 14,
        "images": [
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277528/shop4you/products/rqxz4jlcewcnappgwz2i.jpg",
            "https://images.unsplash.com/photo-1551645121-d1034da75057?w=800",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277530/shop4you/products/mle7jpzvqgycixk8mkfa.jpg",
            "https://images.unsplash.com/photo-1584438784894-089d6a128f3e?w=800",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277531/shop4you/products/mlawo5yh0mczxuliloul.jpg"
        ]
    },
    {
        "title": "Xiaomi 14 Ultra",
        "description": "Leica Quad-Kamerasystem mit variabler Blende. Für professionelle Fotografie.",
        "price": 1199,
        "category": "Smartphones",
        "brand": "Xiaomi",
        "stock": 10,
        "images": [
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277533/shop4you/products/ax60wjhd3osvrs947ikp.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277534/shop4you/products/yf1zyybqmilnch0vkt24.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277535/shop4you/products/ixhcjcnbhzmvtgjabces.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277536/shop4you/products/n1fkqq6u27iihtscnvyc.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277537/shop4you/products/j9c1bdytizp7isuab3ey.jpg"
        ]
    },
    {
        "title": "OnePlus 12 Black Edition",
        "description": "100W SuperVOOC Schnellladen, Snapdragon 8 Gen 3 und exklusives Hasselblad-Kamerasystem.",
        "price": 949,
        "category": "Smartphones",
        "brand": "OnePlus",
        "stock": 12,
        "images": [
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277538/shop4you/products/qab0bnkc3cfwtsktrdyz.jpg",
            "https://images.unsplash.com/photo-1565849553881-477123dee815?w=800",
            "https://images.unsplash.com/photo-1533228891704-8f5c75e8f42a?w=800",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277540/shop4you/products/wp3koac2jdepr40jdbru.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277541/shop4you/products/hui9qy0758quk63oukxp.jpg"
        ]
    },
    {
        "title": "Nothing Phone (2)",
        "description": "Einzigartiges transparentes Design mit interaktivem Glyph-Interface auf der Rückseite.",
        "price": 649,
        "category": "Smartphones",
        "brand": "Nothing",
        "stock": 20,
        "images": [
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277542/shop4you/products/pa2ukelbgiwptcfxdg4n.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277544/shop4you/products/ci8krcy4dz3k3f8zrx2j.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277545/shop4you/products/njjw9nqtggggreufnney.jpg",
            "https://images.unsplash.com/photo-1584438784894-089d6a128f3e?w=800",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277546/shop4you/products/n8mgvztv7ql4wqipzntc.jpg"
        ]
    },
    {
        "title": "Sony Xperia 1 VI",
        "description": "Echtes optisches Zoom-Objektiv und OLED-Display im 19.5:9 Kinoformat für Cineasten.",
        "price": 1299,
        "category": "Smartphones",
        "brand": "Sony",
        "stock": 8,
        "images": [
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277547/shop4you/products/xljokgzifdloruvwi40z.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277549/shop4you/products/rle0qdlckeog9nzaovtt.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277550/shop4you/products/sqjpxqrcpksz9qdyoy7v.jpg",
            "https://images.unsplash.com/photo-1551645121-d1034da75057?w=800",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277551/shop4you/products/qa7jejusbdnfkx1tyxww.jpg"
        ]
    },
    {
        "title": "iPhone 15 Studio Edition",
        "description": "Kompaktes Premium-Format mit mattem Glas-Finish und exzellenter Dual-Kamera.",
        "price": 949,
        "category": "Smartphones",
        "brand": "Apple",
        "stock": 15,
        "images": [
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277553/shop4you/products/xwyozaffvxmzwmwzvebx.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277554/shop4you/products/sv9ti83if43pfhujabif.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277555/shop4you/products/dzyaya5zjx6zqoapawws.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277556/shop4you/products/hsehilsvuwfqdcybnail.jpg",
            "https://images.unsplash.com/photo-1565849553881-477123dee815?w=800"
        ]
    },
    {
        "title": "Neo QLED 8K 75\"",
        "description": "Sensationelle 8K-Auflösung dank Quantum-Mini-LEDs. Ultradünnes Infinity Design.",
        "price": 3499,
        "category": "TV",
        "brand": "Samsung",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277558/shop4you/products/ypfass3epzttgqqfky9h.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277559/shop4you/products/exbhnepsrztssfjwhubp.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277560/shop4you/products/wk7e0qaqjif0jr2pbd1c.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277561/shop4you/products/gjo9rryshpa7zilonplr.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277563/shop4you/products/w8gqozxc6x3xxmbvfht8.jpg"
        ]
    },
    {
        "title": "OLED EVO G4 65\"",
        "description": "Das hellste OLED-Display aller Zeiten mit Brightness Booster Max und perfektem Schwarz.",
        "price": 2499,
        "category": "TV",
        "brand": "LG",
        "stock": 9,
        "images": [
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277564/shop4you/products/uo60bj82scwvo0enh8ez.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277565/shop4you/products/toodca0bvkkbelafegrc.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277566/shop4you/products/pwo2rc6hgligmhqud6gy.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277567/shop4you/products/t6mwxb0curjai4il9a5s.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277568/shop4you/products/gahagx3t8g9rpdncqsli.jpg"
        ]
    },
    {
        "title": "BRAVIA XR OLED 65\"",
        "description": "Acoustic Surface Audio+ verwandelt den gesamten Bildschirm in einen Premium-Lautsprecher.",
        "price": 2199,
        "category": "TV",
        "brand": "Sony",
        "stock": 7,
        "images": [
            "https://images.unsplash.com/photo-1601944179066-297cbd3cdef3?w=800",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277570/shop4you/products/fkrqzlwz4c982elcdx8z.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277571/shop4you/products/klzpj0idlw1pvuhjrt4o.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277572/shop4you/products/s4az8xhos42o5ai3h2nz.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277574/shop4you/products/cfcobtwdtgbgmhyqcnrd.jpg"
        ]
    },
    {
        "title": "Ambilight OLED+ 55\"",
        "description": "4-seitiges Ambilight projiziert die Farben des Bildschirms nahtlos an deine Wand.",
        "price": 1799,
        "category": "TV",
        "brand": "Philips",
        "stock": 12,
        "images": [
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277575/shop4you/products/ru4gj767z0y3nvqfrvj6.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277577/shop4you/products/tz6afs5sultgu5jah32n.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277578/shop4you/products/ldas6xr2dawtyef0fylo.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277580/shop4you/products/mgqvvs9cnlrloywh8xl8.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277582/shop4you/products/euqt5kvphcbnd1xn1nbu.jpg"
        ]
    },
    {
        "title": "Sony WH-1000XM5",
        "description": "Marktführendes Noise Cancelling kombiniert mit brillantem High-Res Sound.",
        "price": 329,
        "category": "Audio",
        "brand": "Sony",
        "stock": 45,
        "images": [
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277583/shop4you/products/crul9x6bdq732m0ripto.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277584/shop4you/products/pydiw6n2knoqwatuswta.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277585/shop4you/products/w4dkpeze78edvbpvsair.jpg",
            "https://images.unsplash.com/photo-1551645121-d1034da75057?w=800",
            "https://images.unsplash.com/photo-1524143180608-61f1241f0a2a?w=800"
        ]
    },
    {
        "title": "QuietComfort Ultra",
        "description": "Immersives Audio und legendäre Geräuschunterdrückung für maximalen Fokus.",
        "price": 379,
        "category": "Audio",
        "brand": "Bose",
        "stock": 30,
        "images": [
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277587/shop4you/products/yzvidrq4smz4hfj5yipw.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277588/shop4you/products/qxkpzxrkou0yvdii6fkf.jpg",
            "https://images.unsplash.com/photo-1600541519463-fcd0c2d93514?w=800",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277590/shop4you/products/uraiaosyfzm9woq7387r.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277591/shop4you/products/kde5sfpshjuuh6d9uapt.jpg"
        ]
    },
    {
        "title": "AirPods Max Titanium",
        "description": "Design-Meisterwerk aus eloxiertem Aluminium mit sensationellem 3D-Audio.",
        "price": 579,
        "category": "Audio",
        "brand": "Apple",
        "stock": 18,
        "images": [
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277592/shop4you/products/zmagqhfdohktnio6ucwy.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277593/shop4you/products/lufkufxlkgyshkxpdliw.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277595/shop4you/products/wsae8daee6godmjar4ut.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277596/shop4you/products/chy8a02xina4mhr43pjb.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277597/shop4you/products/mikkhgyflmsuz3kluzlf.jpg"
        ]
    },
    {
        "title": "Sennheiser HD 660S2",
        "description": "Offener, audiophiler Over-Ear Kopfhörer für detailreichen, natürlichen Klang auf Studio-Niveau.",
        "price": 499,
        "category": "Audio",
        "brand": "Sennheiser",
        "stock": 15,
        "images": [
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277598/shop4you/products/bbbu10gtuw9sezedmqa3.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277599/shop4you/products/r9jtkqmcm9tz9lj3wzr1.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277600/shop4you/products/u5blhranes1vftlkmjfe.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277601/shop4you/products/a4th7vss4x4icp1ptewp.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277602/shop4you/products/azonjyfcuv2jjg45lwud.jpg"
        ]
    },
    {
        "title": "MX Master 3S Ergonomic",
        "description": "Die ultimative ergonomische Maus für Entwickler und Designer. Nahezu lautlose Klicks.",
        "price": 99.99,
        "category": "Zubehör",
        "brand": "Logitech",
        "stock": 50,
        "images": [
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277603/shop4you/products/fgz6c2ilsm48c6lov6qn.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277605/shop4you/products/eyjumdmwkuk3mfvdxxv2.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277607/shop4you/products/kqngbyh4zdm8pmtg4tek.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277609/shop4you/products/v0jai99vmpvrbxmggxy4.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277611/shop4you/products/mco8alqepionu06fu8bo.jpg"
        ]
    },
    {
        "title": "BlackWidow V4 Pro mechanical",
        "description": "Mechanische Gaming-Tastatur mit Green Switches, Makro-Tasten und immersiver Chroma RGB.",
        "price": 249.99,
        "category": "Zubehör",
        "brand": "Razer",
        "stock": 22,
        "images": [
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277612/shop4you/products/rkp7eba337gm1js7b7up.jpg",
            "https://images.unsplash.com/photo-1625842268584-8f3290462a3c?w=800",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277614/shop4you/products/kh7tmkcfecs3qtsybw9h.jpg",
            "https://images.unsplash.com/photo-1625492922105-591d447bf92e?w=800",
            "https://images.unsplash.com/photo-1563297007-06a5b83936e9?w=800"
        ]
    },
    {
        "title": "Prime 20.000mAh Powerbank",
        "description": "200W Ausgangsleistung lädt Laptops und Smartphones parallel in Rekordzeit.",
        "price": 129.99,
        "category": "Zubehör",
        "brand": "Anker",
        "stock": 40,
        "images": [
            "https://images.unsplash.com/photo-1609592424085-f6df5417ec65?w=800",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277618/shop4you/products/yypqlbsttw8xglxsgj2s.jpg",
            "https://images.unsplash.com/photo-1600541519463-fcd0c2d93514?w=800",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277619/shop4you/products/tptdw64o5khhi14fh88z.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277620/shop4you/products/terclmds2ftrcnkee285.jpg"
        ]
    },
    {
        "title": "Virtuoso RGB Wireless Headset",
        "description": "High-Fidelity Gaming-Headset mit Broadcast-Mikrofon und edlem Aluminium-Finish.",
        "price": 199,
        "category": "Zubehör",
        "brand": "Corsair",
        "stock": 15,
        "images": [
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277621/shop4you/products/vghmvehcmhkwbvimd6t1.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277623/shop4you/products/zremuye0dvrxuu52xoxw.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277624/shop4you/products/mnriehb3m2nrdj5zfa4a.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277625/shop4you/products/ea81lo0whwwtldpzplwr.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781277626/shop4you/products/hkfxrithspfqnxlquwyz.jpg"
        ]
    }
];

  // Injiziere die sellerId dynamisch beim Erstellen der Produkte
  for (const product of premiumProducts) {
    await prisma.product.create({
      data: {
        ...product,
        sellerId: adminUser.id
      },
    });
  }

  console.log(`🎉 Seed erfolgreich! Admin hat Adresse & es wurden insgesamt ${premiumProducts.length} Premium-Artikel mit Cloudinary-Links eingepflegt.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
