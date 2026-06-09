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

  
  console.log('🏪 Erstelle Test-Verkäufer...');
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


  console.log('👤 Erstelle Test-Kunden...');
  const hashedCustomerPassword = await bcrypt.hash('MichMint321', 10);
  const customerUser = await prisma.user.create({
    data: {
      firstName: 'Michael',
      lastName: 'Mint',
      email: 'mm@gmx.de',
      password: hashedCustomerPassword,
      role: 'USER', // Falls deine Rolle im Schema anders heißt (z.B. CUSTOMER), hier anpassen
      street: 'Im Traum 1',
      zipCode: '60311',
      city: 'Frankfurt am Main',
    },
  });
  console.log(`✅ Kunde angelegt: ${customerUser.email}`);


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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992386/shop4you/products/pk3xlbvydqqeqwvx3ktt.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992387/shop4you/products/j8jo8dxvmvuzsi8arlg5.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992388/shop4you/products/fh1itxgwi2dwsagqstow.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992391/shop4you/products/pwpluocne5tyiznoydmk.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992392/shop4you/products/cpsdqoy62euzwlfjquwy.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992393/shop4you/products/uunyypvbltqww8jwfgql.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992394/shop4you/products/awkkx0vs8xkcvq8mvevm.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992395/shop4you/products/sdn7cna1dwubdxqkagvw.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992396/shop4you/products/axbbsovtmi0blhfhhrwo.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992397/shop4you/products/uveqgstgdvmvbyi9dio3.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992398/shop4you/products/xhalilrtdzjkjmeiw8v3.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992401/shop4you/products/qgfz8tynkxyrki1wb2x7.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992400/shop4you/products/qejbszs4kxlff025sqqt.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992401/shop4you/products/qgfz8tynkxyrki1wb2x7.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992402/shop4you/products/qok8aauuxfv02anmt268.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992403/shop4you/products/wdd2b2dbgna9udgbjgbt.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992404/shop4you/products/ntiuyyeskvgsxlyjhs9b.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992406/shop4you/products/wjmghiprq82pwtskgfne.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992407/shop4you/products/thxtpvvkgxri9ygejgum.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992402/shop4you/products/qok8aauuxfv02anmt268.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992408/shop4you/products/dendwzd9dvqy84tv8rvy.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992410/shop4you/products/bbeoowkld7ioey61xjdz.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992411/shop4you/products/bykoylgb94ef5xx2ymar.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992412/shop4you/products/syx7xnv9bisdps8z4msy.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992414/shop4you/products/tnxuvezvqryvgxmz0fdx.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992416/shop4you/products/wtjmazwvv4zc1whnsyuo.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992417/shop4you/products/d70k4zhaaee1m8o2jco3.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992418/shop4you/products/rv6f23efxmkarrao9yr4.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992419/shop4you/products/w9ov6cqwufolrhezrbyo.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992420/shop4you/products/pbw2rlqkpxjzmuxcvfga.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992421/shop4you/products/of1hh8wezuhli1ftmoll.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992422/shop4you/products/bn4xqvmmxbbpur0qnwv6.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992420/shop4you/products/pbw2rlqkpxjzmuxcvfga.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992424/shop4you/products/pbw9icuyw4dlczrbka5o.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992425/shop4you/products/vfi060shelf4xubajks2.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992426/shop4you/products/xybtzcnslc9vhvg5mwzf.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992427/shop4you/products/olxwm6mehmk7wvepsw4j.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992428/shop4you/products/jv8rhoirxvdgouoyxk0q.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992429/shop4you/products/xmlasgs1asnbntw8zxyz.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992424/shop4you/products/pbw9icuyw4dlczrbka5o.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992431/shop4you/products/najjkk2cdnki71urj9gg.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992432/shop4you/products/rdafz74jofitd4hfyejb.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992435/shop4you/products/trzi12hdfkyyqx6qgkjw.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992434/shop4you/products/gjdpz2gomqvi2oelv8ha.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992435/shop4you/products/trzi12hdfkyyqx6qgkjw.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992436/shop4you/products/bjzs3yfso4ykpawmjovp.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992437/shop4you/products/qgawzblwjdr59zm6dzxg.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992439/shop4you/products/jtzk054ccn6pjlf2vziq.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992437/shop4you/products/qgawzblwjdr59zm6dzxg.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992439/jtzk054ccn6pjlf2vziq.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992440/shop4you/products/amvt1bhqgfkky8nwvr0z.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992444/shop4you/products/admgcbh8xb2azoedqysn.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992442/shop4you/products/errdnlqkmdd7wkxxirai.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992440/shop4you/products/amvt1bhqgfkky8nwvr0z.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992444/shop4you/products/admgcbh8xb2azoedqysn.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992445/shop4you/products/uxrzcvpnckwsknoav1we.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992446/shop4you/products/m1bn5g0wamyybolccbjn.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992447/shop4you/products/n7o6dijzxnevejftro1p.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992448/shop4you/products/ua87nhwa4vpys08eabkj.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992449/shop4you/products/xekpq259gcobie68ihko.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992451/shop4you/products/mncmk96ag2wnqtporpsd.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992452/shop4you/products/pxs4uja2mcozqqknarug.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992454/shop4you/products/pl2zygcv0ftcjfqpdnpk.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992452/shop4you/products/pxs4uja2mcozqqknarug.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992454/shop4you/products/pl2zygcv0ftcjfqpdnpk.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992455/shop4you/products/jnuq9b9mv3tzxjj6uenr.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992456/shop4you/products/nue0elga7bh8zmbfwhx5.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992458/shop4you/products/nsmg1elylxtu2cqgzw3o.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992454/shop4you/products/pl2zygcv0ftcjfqpdnpk.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992459/shop4you/products/ftvagsxnbyhrncthtzio.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992460/shop4you/products/ndzlad1mt6zero4rl5zj.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992461/shop4you/products/wz7orobxewbbv5pf2rjx.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992463/shop4you/products/fbnmcvbjdqxl7hj8gsow.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992460/shop4you/products/ndzlad1mt6zero4rl5zj.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992464/shop4you/products/mex9s2wc4wjoqhtpoafa.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992467/shop4you/products/a2yplq8agzoww3y10pxa.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992466/shop4you/products/lvjg30tel0envotztk1i.jpg", 
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992468/shop4you/products/wqpxxhx1pasns3pfwv49.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992469/shop4you/products/wykcdla2ou7xnuufc7jg.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992467/shop4you/products/a2yplq8agzoww3y10pxa.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992471/shop4you/products/oyvqreu7jzsoxk5soiv2.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992472/shop4you/products/cusxarf8a6tikcsqiqtm.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992473/shop4you/products/paf04qqczdvbhznbiqi3.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992474/shop4you/products/ufxovpzaiwmfe5zriqtm.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992475/shop4you/products/hannvj3l8pqazkdn885s.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992476/shop4you/products/s9krdf97bfrtp0zvqk5h.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992478/shop4you/products/glybcntofol4o6oaz91b.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992479/shop4you/products/ih348be3xiw8bjewlcep.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992480/shop4you/products/khlnkjj4evptbflmutoz.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992481/shop4you/products/q3lfqkmmscnystw9bsb5.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992485/shop4you/products/izr0jjfomta1unf4y3xr.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992482/shop4you/products/vta6n78snup4d4rghspo.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992484/shop4you/products/jm1uscny7vstymrfgglj.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992485/shop4you/products/izr0jjfomta1unf4y3xr.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992486/shop4you/products/kygxnn4zu1unhbm92y7v.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992487/shop4you/products/jigybhdtrubhcrbvquow.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992489/shop4you/products/dmaflhbr1qerb6c0ysio.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992490/shop4you/products/kzqjlbmjdyvgwed7zx07.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992491/shop4you/products/rxumoxjj36zj8nxkzsnh.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992492/shop4you/products/dw1i3suzhsecwr2jckbv.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992494/shop4you/products/bttab0cb09vztdnetecc.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992496/shop4you/products/aie1gazshb598lnlrzga.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992497/shop4you/products/wdjrcimd2kl3nyhavqno.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992494/shop4you/products/bttab0cb09vztdnetecc.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992494/shop4you/products/bttab0cb09vztdnetecc.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992499/shop4you/products/ql69kmkurlciobmbmhqo.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992500/shop4you/products/a4fj4qn1kexvcmsrnwy2.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992499/shop4you/products/ql69kmkurlciobmbmhqo.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992502/shop4you/products/zenwngiisieidq9lbzz4.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992503/shop4you/products/xm4avznppeasjd7y4i8n.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992504/shop4you/products/qiramxqe9korjlsy1x04.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992505/shop4you/products/jboulwm9xjbvb2mqbuev.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992507/shop4you/products/ilpatjknj8gjnhh9hjud.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992508/shop4you/products/pvibfcmgye4uvee1u1ed.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992509/shop4you/products/zeeebj1brvkrhh5v8jyq.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992510/shop4you/products/yb4pmjvzsetm88fvyx9z.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992511/shop4you/products/ng1z6nnwnjolcvgosl4d.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992512/shop4you/products/bxqvlq4mewiqpeai9dr8.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992513/shop4you/products/f6ozg7zo3qgg1pcdv2lh.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992514/shop4you/products/hzqyxmfsxcvq2hrpvqtk.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992515/shop4you/products/lh5ug2ran3zbtaow7s60.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992516/shop4you/products/lcxqv7agpsjzxlkug9gd.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992517/shop4you/products/ymcub5fvj3jegcfg8paz.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992518/shop4you/products/g5khnaaqrjp0o7bvqmfg.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992520/shop4you/products/o6xdqjvbnmuu19jfibq0.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992521/shop4you/products/e9bnnpfxmfk69quqkkcj.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992520/shop4you/products/o6xdqjvbnmuu19jfibq0.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992523/shop4you/products/ryca5dbtajgg2kl4ayxz.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992518/shop4you/products/g5khnaaqrjp0o7bvqmfg.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992521/shop4you/products/e9bnnpfxmfk69quqkkcj.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992518/shop4you/products/g5khnaaqrjp0o7bvqmfg.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992526/shop4you/products/rfaryrsw5ltfnud4q97w.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992528/shop4you/products/llfdh7rvu64okkcvjrjt.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992527/shop4you/products/jr5iywa8zynoqdo2p3ne.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992528/shop4you/products/llfdh7rvu64okkcvjrjt.jpg"
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
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992530/shop4you/products/z5hwegctqd5ar8jmpoak.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992531/shop4you/products/ploz8icln9kin8orldry.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992532/shop4you/products/jueyqm8iwybp5pech3tr.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992533/shop4you/products/mi7ebkfkoccjo2bdj8kh.jpg",
            "https://res.cloudinary.com/dwxj4vo97/image/upload/v1780992534/shop4you/products/dxpx7lzrsigqiqdqxr4a.jpg"
        ]
    }
  ];

  // Injiziere die sellerId von Sabiene Meier (sellerUser.id) beim Erstellen der Produkte
  for (const product of premiumProducts) {
    await prisma.product.create({
      data: {
        ...product,
        sellerId: sellerUser.id,
      },
    });
  }

  console.log(`🎉 Seed erfolgreich! Es wurden alle Rollen (Admin, Kunde, Verkäufer) angelegt und ${premiumProducts.length} Artikel mit Cloudinary-Links eingepflegt.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });