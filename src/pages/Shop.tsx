import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, ChevronDown, Search } from 'lucide-react';
import { PRODUCTS } from '../types';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'motion/react';

export default function Shop() {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get('cat') || 'all';
  
  const [category, setCategory] = useState(initialCat);
  const [priceRange, setPriceRange] = useState(3000);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesCat = category === 'all' || p.category === category;
      const matchesPrice = p.price <= priceRange;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesPrice && matchesSearch;
    });
  }, [category, priceRange, searchQuery]);

  const categories = [
    { id: 'all', name: 'الكل' },
    { id: 'men', name: 'رجالي' },
    { id: 'women', name: 'حريمي' },
    { id: 'new', name: 'وصلنا حديثاً' },
    { id: 'sale', name: 'العروض' },
  ];

  return (
    <div className="bg-black min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">المتجر <span className="text-gold">الملكي</span></h1>
            <p className="text-gray-500">تصفح أحدث صيحات الموضة من البرنس ستور</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="text" 
                placeholder="ابحث عن منتج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-gold/20 rounded-full py-3 pr-12 pl-6 text-white focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="bg-gold text-black p-3 rounded-full hover:bg-gold-dark transition-colors lg:hidden"
            >
              <Filter size={24} />
            </button>
          </div>
        </div>

        <div className="flex gap-12">
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-64 space-y-12">
            <div>
              <h3 className="text-white font-bold text-xl mb-6 border-r-4 border-gold pr-4">الأقسام</h3>
              <div className="flex flex-col gap-4">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`text-right py-2 px-4 rounded-lg transition-all ${
                      category === cat.id 
                        ? 'bg-gold text-black font-bold' 
                        : 'text-gray-400 hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold text-xl mb-6 border-r-4 border-gold pr-4">السعر</h3>
              <div className="px-2">
                <input 
                  type="range" 
                  min="0" 
                  max="3000" 
                  step="100"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-gold bg-zinc-800 h-1 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-4 text-gray-400 text-sm">
                  <span>3000 ج.م</span>
                  <span>0 ج.م</span>
                </div>
                <div className="mt-2 text-center text-gold font-bold">
                  حتى {priceRange} ج.م
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 p-6 rounded-2xl border border-gold/20">
              <h4 className="text-white font-bold mb-4">تحتاج مساعدة؟</h4>
              <p className="text-gray-500 text-xs mb-4">فريقنا متاح دائماً لمساعدتك في اختيار المقاس المناسب.</p>
              <button className="text-gold text-sm font-bold underline">تواصل معنا</button>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-40">
                <div className="inline-block p-8 bg-zinc-900 rounded-full mb-8">
                  <Search size={64} className="text-gold/20" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">لم نجد أي منتجات</h3>
                <p className="text-gray-500">جرب تغيير كلمات البحث أو الفلاتر</p>
                <button 
                  onClick={() => {
                    setCategory('all');
                    setSearchQuery('');
                    setPriceRange(3000);
                  }}
                  className="mt-8 text-gold font-bold underline"
                >
                  إعادة ضبط الفلاتر
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-zinc-950 rounded-t-[3rem] p-8 z-[110] border-t border-gold/30 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] pb-safe"
            >
              <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-8" />
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-white">تصفية النتائج</h3>
                <button onClick={() => setIsFilterOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                  <X size={28} />
                </button>
              </div>

              <div className="space-y-10">
                <div>
                  <h4 className="text-gold font-bold mb-6 text-lg">الأقسام</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`py-4 rounded-2xl border-2 transition-all font-bold text-sm ${
                          category === cat.id 
                            ? 'bg-gold border-gold text-black' 
                            : 'border-zinc-900 bg-zinc-900/50 text-gray-400'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-gold font-bold text-lg">السعر الأقصى</h4>
                    <span className="text-white font-black">{priceRange} ج.م</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="3000" 
                    step="100"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-gold bg-zinc-900 h-3 rounded-full appearance-none cursor-pointer"
                  />
                </div>

                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full gold-gradient text-black font-black py-5 rounded-2xl text-xl shadow-xl active:scale-95 transition-transform mt-4"
                >
                  تطبيق الفلاتر
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
