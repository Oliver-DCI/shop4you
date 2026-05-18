'use client';

export default function ProductInfo({ product }: { product: any }) {
  
  const handleAddToCart = () => {
    // Das verknüpfen wir gleich mit Zustand!
    alert(`${product.title} wurde dem Warenkorb hinzugefügt!`);
  };

  return (
    <div className="flex flex-col justify-between py-2">
      <div>
        <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">{product.category}</span>
        <h1 className="text-4xl font-bold tracking-tight mt-2 text-zinc-950 dark:text-zinc-50">{product.title}</h1>
        
        <p className="text-2xl font-medium mt-4 text-zinc-900 dark:text-zinc-100">
          {product.price.toFixed(2)} €
        </p>
        
        <hr className="my-6 border-zinc-200 dark:border-zinc-800" />
        
        <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {product.description}
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        {/* Verfügbarkeits-Indikator (Modern & Dezent) */}
        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
          <span className="h-2 w-2 rounded-full bg-green-600 dark:bg-green-400 animate-pulse" />
          {product.stock} Stück auf Lager – Sofort lieferbar
        </div>

        {/* 2026 High-End Button */}
        <button 
          onClick={handleAddToCart}
          className="w-full bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-medium py-4 px-6 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg hover:shadow-xl"
        >
          In den Warenkorb legen
        </button>
      </div>
    </div>
  );
}