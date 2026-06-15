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
  const hashedAdminPassword = await bcrypt.hash('LogS4Y2026', 10);

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

  console.log('👤 Erstelle Kunde (Michael Mint)...');
  const hashedCustomerPassword = await bcrypt.hash('MichMint321', 10);
  const customerUser = await prisma.user.create({
    data: {
      firstName: 'Michael',
      lastName: 'Mint',
      email: 'mm@gmx.de',
      password: hashedCustomerPassword,
      role: 'USER',
      street: 'Im Traum 1',
      zipCode: '60311',
      city: 'Frankfurt am Main',
    },
  });
  console.log(`✅ Kunde angelegt: ${customerUser.email}`);

  console.log('🏬 Erstelle Verkäufer (Sabiene Meier)...');
  const hashedSellerPassword = await bcrypt.hash('Sabse2026', 10);
  const sellerUser = await prisma.user.create({
    data: {
      firstName: 'Sabiene',
      lastName: 'Meier',
      email: 'sabse@gmx.de',
      password: hashedSellerPassword,
      role: 'SELLER',
      street: 'Im Flow 101',
      zipCode: '21079',
      city: 'Hamburg',
    },
  });
  console.log(`✅ Verkäufer angelegt: ${sellerUser.email}`);

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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781508990/shop4you/products/vk8q3n8zcataxjrfgojq.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781508991/shop4you/products/kxfrnfr5fo6ljp35jizc.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781508992/shop4you/products/a9wfudzwqjdrzgngppw6.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781508994/shop4you/products/wzakw7bo7a1krmsunhrm.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781508995/shop4you/products/mp4cwscycpdovhg2brhd.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781508997/shop4you/products/rbapah2uwlhklqskxqpv.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781508998/shop4you/products/sgxpslposf7huxmktkvk.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781508999/shop4you/products/pkv1wnqzeoqdlixe688s.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509000/shop4you/products/qy1ivxsed401czd3y5aw.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509011/shop4you/products/rxcai6gp5x8urkkw1dq2.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509010/shop4you/products/jcsktrjbawajnn5cxnev.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509011/shop4you/products/rxcai6gp5x8urkkw1dq2.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509012/shop4you/products/daokv6eznte4aqu9ge9f.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509013/shop4you/products/vas5talmekm9c76rktvc.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509014/shop4you/products/zmnpia1gxvrhdil3djwj.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509015/shop4you/products/qs3qjwhpqcxye3z5ltq4.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509016/shop4you/products/acl8bzjpp4b4qzhcgcy3.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509018/shop4you/products/nsw6lcjmqklctvddltzb.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509019/shop4you/products/yhjo148s0bsvmxqfsvt3.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509020/shop4you/products/du9v9hrgqocjogszxydi.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509021/shop4you/products/k5hs11odxddqvdeykvyl.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509022/shop4you/products/inguvflaun1vnpgcofdx.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509023/shop4you/products/vbahvpxrfgzr7ckws5e6.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509024/shop4you/products/wd4o9ejsvhylrjt6rsl7.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509025/shop4you/products/gtwr7zfg5qp4jibwwo9j.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509026/shop4you/products/ydkdq9moafluaaznzqif.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509025/shop4you/products/gtwr7zfg5qp4jibwwo9j.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509028/shop4you/products/c5xly1kndzlwupvsfkkl.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509029/shop4you/products/qjwjjcl48b701zeofaru.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509030/shop4you/products/fck0rrvfjrpvnemslue8.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509032/shop4you/products/o1ivpg0udzdvi33g9smr.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509035/shop4you/products/dpanucleptporgjxntei.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509036/shop4you/products/rwv4guqut5ctno5qfj0q.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509037/shop4you/products/dp8qn21d6kezmchpn3ta.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509040/shop4you/products/f7ouxopmqtvjxk3zt1so.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509039/shop4you/products/kvst0sobzutigmjimw1l.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509040/shop4you/products/f7ouxopmqtvjxk3zt1so.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509040/shop4you/products/swwk0akarfsp9vspb239.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509055/shop4you/products/lap0iwgxmx32npn7ywna.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509040/shop4you/products/f7ouxopmqtvjxk3zt1so.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509043/shop4you/products/xwwqbzgw9cqldmwaq5zb.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509055/shop4you/products/lap0iwgxmx32npn7ywna.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509048/shop4you/products/b7vq8u2ju4rpqlgkv5q7.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509055/shop4you/products/lap0iwgxmx32npn7ywna.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509049/shop4you/products/ghc5qvsqyynblq3kccxi.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509050/shop4you/products/ss7vqaeuxtxvrttdakua.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509051/shop4you/products/zwszbuzbrbavbzjxuyva.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509052/shop4you/products/zvttbqdcjnkt6rnxxvzd.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509053/shop4you/products/ygbxrtbhlg5t44jvc8v1.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509055/shop4you/products/lap0iwgxmx32npn7ywna.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509061/shop4you/products/elrnnygdirhz7oyqirue.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509055/shop4you/products/lap0iwgxmx32npn7ywna.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509056/shop4you/products/dvtmxquku2sxmvv9hlp7.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509057/shop4you/products/qo9yws95mifyylta8qnh.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509058/shop4you/products/asm4q38o5fbrrr7aw1is.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509061/shop4you/products/elrnnygdirhz7oyqirue.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509060/shop4you/products/dclutnbilhd5twsjxdy0.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509061/shop4you/products/elrnnygdirhz7oyqirue.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509062/shop4you/products/qedaijratk5mpmivkszs.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509061/shop4you/products/elrnnygdirhz7oyqirue.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509064/shop4you/products/lejecsx2sudprb2kccgt.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509064/shop4you/products/e8gpft7zkif5zaxvcweo.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509066/shop4you/products/xftu187braqwj2zil65b.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509066/shop4you/products/s0w6iufcw7nsjvg2qwgj.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509067/shop4you/products/qkqpcxwwbhzfqdvynuk8.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509069/shop4you/products/j8qhjdgutiwivufdp9i4.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509070/shop4you/products/tlp6zk5kkdwli9fk9egd.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509071/shop4you/products/glyc8oclk0owksw0kytr.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509072/shop4you/products/awzkfjvindb5norhgqy3.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509073/shop4you/products/itomfe90xwptk0p0nc7h.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509074/shop4you/products/csmrilxip6q59q6didt9.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509075/shop4you/products/blp1jrjlywmubg6cdytr.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509067/shop4you/products/qkqpcxwwbhzfqdvynuk8.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509079/shop4you/products/fsfhqn60h0zpdz41qoji.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509080/shop4you/products/jooz7pz82kicie42brvk.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509081/shop4you/products/pffezpqbjscyolo1ofp0.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509082/shop4you/products/vilewv1bjwdtdsubp4rx.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509083/shop4you/products/uaj1lsaeahqrr04guxpk.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509084/shop4you/products/u8oot457wqvllxxalf9p.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509085/shop4you/products/ayqzlevjryabwxqpsqoz.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509087/shop4you/products/ispn7wqbjc0owvomvmjs.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509087/shop4you/products/kdnjcequh9swkw5e7kea.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509088/shop4you/products/btl7yy3qtxqtea0khyrs.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509090/shop4you/products/mivbdox1z8dzmx9okzp2.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509090/shop4you/products/mivbdox1z8dzmx9okzp2.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509091/shop4you/products/mekll8myw1x2ifmspzkw.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509090/shop4you/products/mivbdox1z8dzmx9okzp2.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509093/shop4you/products/k8mkjbsmeyhwbuqyyjx9.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509094/shop4you/products/h270lkhie3vet4q5dcun.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509095/shop4you/products/jsdoflzopjyp6eoq4fgf.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509096/shop4you/products/prufrtiiyrch47kysjdl.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509097/shop4you/products/unpnlcuabjja4xz1ihuv.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509098/shop4you/products/kywtyyautv2tkv2nljda.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509099/shop4you/products/w7adura2btyq2ti3p6eb.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509100/shop4you/products/mvmmvn19xeuc805oey97.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1781509101/shop4you/products/p42vbwgwgfcgbks22mu8.jpg"
        ]
    }
];

  // Injiziere die sellerId dynamisch beim Erstellen die Produkte
  for (const product of premiumProducts) {
    await prisma.product.create({
      data: {
        ...product,
        sellerId: adminUser.id
      },
    });
  }

  console.log(`🎉 Seed erfolgreich! Admin, Kunde & Verkäufer wurden angelegt. Insgesamt wurden ${premiumProducts.length} Premium-Artikel dem Admin zugeordnet.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });