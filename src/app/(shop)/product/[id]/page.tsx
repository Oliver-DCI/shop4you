// src/app/(shop)/product/[id]/page.tsx
import React from 'react';
import ProductImages from '@/components/shop/ProductImages';
import ProductInfo from '@/components/shop/ProductInfo';

// Temporäre Mockdaten für den visuellen Aufbau (2026 Style)
const MOCK_PRODUCT = {
  id: '1',
  title: 'Futuristic Cyber Sneakers 2026',
  description: 'Erlebe den Komfort der nächsten Generation mit adaptiver Dämpfung und recycelten Materialien. Perfekt für den urbanen Lifestyle.',
  price: 189.99,
  images: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', // Platzhalter-Bilder
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800'
  ],
  category: 'Footwear',
  stock: 12
};

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Später: const product = await prisma.product.findUnique({ where: { id: params.id } });
  const product = MOCK_PRODUCT; 

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        
        {/* Linke Seite: Moderne Bildergalerie */}
        <ProductImages images={product.images} title={product.title} />
        
        {/* Rechte Seite: Produkt-Details & interaktive Elemente */}
        <ProductInfo product={product} />
        
      </div>
    </main>
  );
}