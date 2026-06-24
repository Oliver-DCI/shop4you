'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SellerCategoryChart from '@/components/seller/SellerCategoryChart';
import SellerImportBox from '@/components/seller/SellerImportBox';
import ProductPreviewGrid from '@/components/seller/ProductPreviewGrid';
import SellerProductsTab from '@/components/seller/SellerProductsTab'; // 🎯 NEU: Importieren

interface SellerStats {
  totalRevenue: number;
  totalSalesCount: number;
  liveProductsCount: number;
}

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  brand?: string;
  images?: string[];
  createdAt?: string;
  stock?: number;
}

type TabType = 'ANALYTICS' | 'IMPORT' | 'PRODUCTS';

export default function SellerDashboardPage() {
  const router = useRouter();
  const [isSeller, setIsSeller] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('ANALYTICS');

  const [stats, setStats] = useState<SellerStats>({ totalRevenue: 0, totalSalesCount: 0, liveProductsCount: 0 });
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [chartData, setChartData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  const [loadedProducts, setLoadedProducts] = useState<any[] | null>(null);
  const [isCardPreviewActive, setIsCardPreviewActive] = useState(false);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('shop4you_user') || '{}');
    const userRoleNormalized = (currentUser.role || '').toUpperCase();
    const userId = currentUser.id;

    if (userRoleNormalized !== 'SELLER' && userRoleNormalized !== 'ADMIN' && currentUser.firstName !== 'Admin') {
      router.push('/');
      return;
    }
    
    setIsSeller(true);

    async function fetchDashboardData() {
      try {
        const statsRes = await fetch(`/api/seller/stats?userId=${userId}`);
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        const productsRes = await fetch(`/api/seller/products?userId=${userId}`);
        if (productsRes.ok) {
          const productsData: Product[] = await productsRes.json();
          setMyProducts(productsData);

          if (productsData.length > 0) {
            const monthlyDistribution = new Array(12).fill(0);
            productsData.forEach((product, index) => {
              const month = product.createdAt 
                ? new Date(product.createdAt).getMonth() 
                : (index % 12); 
              monthlyDistribution[month] += 1;
            });

            const maxVal = Math.max(...monthlyDistribution);
            const scaledData = monthlyDistribution.map(val => 
              maxVal > 0 ? Math.round((val / maxVal) * 95) : 10
            );
            setChartData(scaledData);
          } else {
            setChartData([15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15]);
          }
        }
      } catch (err) {
        console.error("Fehler beim Abrufen der Live-Daten:", err);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchDashboardData();
    }
  }, [router, refreshTrigger]);

  const handleRemoveFromPreviewGrid = (index: number) => {
    if (!loadedProducts) return;
    const filtered = loadedProducts.filter((_, i) => i !== index);
    setLoadedProducts(filtered.length > 0 ? filtered : null);
    if (filtered.length === 0) setIsCardPreviewActive(false);
  };

  if (loading) {
    return (
      <div className="p-20 text-center font-mono text-xs uppercase tracking-widest text-zinc-400 bg-white min-h-screen">
        Synchronisiere Live-Datenbank...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black relative overflow-hidden rounded-none selection:bg-black selection:text-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10 flex flex-col gap-8 relative z-10">
        
        {/* Header */}
        <div className="border-b border-zinc-200 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[9px] font-medium uppercase tracking-widest bg-zinc-100 text-zinc-600 border border-zinc-200 px-2.5 py-1 font-mono">
              shop4you // Händler-Zentrale
            </span>
            <h1 className="text-xl font-normal uppercase tracking-widest mt-3 text-black font-mono">
              Seller Dashboard
            </h1>
          </div>
          <button onClick={() => router.push('/')} className="bg-white border border-zinc-200 hover:border-black text-black font-mono text-xs uppercase tracking-widest px-5 py-3 transition-colors cursor-pointer">
            ← Zum Shop
          </button>
        </div>

        {/* Haupt-Layout: Linke Navigation und rechter Bereich */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* LINKES SEITEN-MENÜ */}
          <div className="lg:col-span-1 flex flex-col border border-zinc-200 bg-white font-mono text-xs sticky top-24">
            <div className="p-4 border-b border-zinc-200 bg-zinc-50 text-[10px] font-bold tracking-wider uppercase text-zinc-400">
              Navigation // Menu
            </div>
            
            <button
              onClick={() => setActiveTab('ANALYTICS')}
              className={`w-full text-left px-4 py-3.5 border-b border-zinc-100 transition-colors uppercase tracking-wider font-medium cursor-pointer ${
                activeTab === 'ANALYTICS' ? 'bg-black text-white font-bold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-black'
              }`}
            >
              [📊] Analytics & Charts
            </button>
            
            <button
              onClick={() => setActiveTab('PRODUCTS')}
              className={`w-full text-left px-4 py-3.5 border-b border-zinc-100 transition-colors uppercase tracking-wider font-medium cursor-pointer ${
                activeTab === 'PRODUCTS' ? 'bg-black text-white font-bold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-black'
              }`}
            >
              [📦] Produkte im System
            </button>

            <button
              onClick={() => setActiveTab('IMPORT')}
              className={`w-full text-left px-4 py-3.5 transition-colors uppercase tracking-wider font-medium cursor-pointer ${
                activeTab === 'IMPORT' ? 'bg-black text-white font-bold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-black'
              }`}
            >
              [📥] Datenimport (JSON)
            </button>
          </div>

          {/* RECHTER ARBEITSBEREICH */}
          <div className="lg:col-span-3 flex flex-col gap-8">
            
            {/* Statistiken */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              <div className="bg-white border border-zinc-200 p-4 flex flex-col gap-1 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-black" />
                <p className="text-[9px] text-zinc-400 font-medium uppercase tracking-widest font-mono">Gesamtumsatz</p>
                <p className="text-xl font-mono text-black mt-0.5">{stats.totalRevenue.toFixed(2)} €</p>
              </div>
              <div className="bg-white border border-zinc-200 p-4 flex flex-col gap-1 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-black" />
                <p className="text-[9px] text-zinc-400 font-medium uppercase tracking-widest font-mono">Verkaufte Artikel</p>
                <p className="text-xl font-mono text-black mt-0.5">{stats.totalSalesCount} Stk.</p>
              </div>
              <div className="bg-white border border-zinc-200 p-4 flex flex-col gap-1 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-zinc-300" />
                <p className="text-[9px] text-zinc-400 font-medium uppercase tracking-widest font-mono">Deine Angebote</p>
                <p className="text-xl font-mono text-black mt-0.5">{stats.liveProductsCount} / Active</p>
              </div>
            </div>

            {/* TAB-INHALTE */}
            {activeTab === 'ANALYTICS' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-in fade-in duration-200 xl:items-stretch xl:-mr-[8px]">
                <div className="xl:col-span-2 bg-white border border-zinc-200 p-6 flex flex-col justify-between min-h-[320px]">
                  <div className="border-b border-zinc-100 pb-3">
                    <h3 className="text-[10px] font-medium uppercase tracking-widest text-black font-mono">📊 Live Sales Volatility (2026)</h3>
                  </div>
                  <div className="flex-1 w-full flex items-end gap-2 pt-6 relative border-b border-zinc-200 bg-zinc-50 px-2 pb-1 h-44 mt-4">
                    {chartData.map((height, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative z-10 h-full justify-end">
                        <div style={{ height: `${height}%` }} className="w-full bg-zinc-300 group-hover:bg-black transition-all duration-500 ease-out" />
                        <span className="text-[8px] text-zinc-400 font-mono uppercase mt-1.5">
                          {['Jan', 'Feb', 'Mrz', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="xl:col-span-1 w-full">
                  <SellerCategoryChart products={myProducts} />
                </div>
              </div>
            )}

            {activeTab === 'IMPORT' && (
              <div className="w-full flex flex-col gap-8 animate-in fade-in duration-200">
                <SellerImportBox 
                  onImportSuccess={() => setRefreshTrigger(prev => prev + 1)}
                  isCardPreviewActive={isCardPreviewActive}
                  setIsCardPreviewActive={setIsCardPreviewActive}
                  loadedProducts={loadedProducts}
                  setLoadedProducts={setLoadedProducts}
                />
                {isCardPreviewActive && loadedProducts && (
                  <ProductPreviewGrid 
                    products={loadedProducts}
                    onRemoveItem={handleRemoveFromPreviewGrid}
                  />
                )}
              </div>
            )}

            {/* 🎯 KORREKTUR: Der PRODUCTS Tab nutzt jetzt die ausgelagerte Komponente im vollen Layout-Umfang */}
            {activeTab === 'PRODUCTS' && (
              <div className="bg-white border border-zinc-200 p-6 animate-in fade-in duration-200 w-full">
                <SellerProductsTab 
                  products={myProducts} 
                  onRefresh={() => setRefreshTrigger(prev => prev + 1)} 
                />
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}