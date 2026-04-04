import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Heart, Share2, Star, ShieldCheck, Truck, RotateCcw, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import { PRODUCTS, Product } from '../types';
import { useCart } from '../CartContext';
import { cn } from '../lib/utils';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const found = PRODUCTS.find((p) => p.id === id);
    if (found) {
      setProduct(found);
      setSelectedSize(found.sizes[0]);
    }
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) return <div className="h-screen bg-black flex items-center justify-center text-white">جاري التحميل...</div>;

  const handleAddToCart = () => {
    addToCart(product, selectedSize);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 3000);
  };

  const relatedProducts = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="bg-black pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
          {/* Images */}
          <div className="space-y-6">
            {/* Desktop Main Image / Mobile Swipeable Gallery */}
            <div className="relative group">
              <div 
                ref={scrollRef}
                className="flex lg:block overflow-x-auto lg:overflow-visible snap-x snap-mandatory no-scrollbar scroll-smooth"
                onScroll={(e) => {
                  const target = e.target as HTMLDivElement;
                  const index = Math.round(target.scrollLeft / target.clientWidth);
                  if (window.innerWidth < 1024) setActiveImage(index);
                }}
              >
                {[product.image, product.image, product.image, product.image].map((img, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="min-w-full lg:min-w-0 snap-center aspect-[3/4] rounded-[2rem] overflow-hidden border border-gold/20 relative"
                  >
                    <img 
                      src={img} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {product.isLimited && i === 0 && (
                      <div className="absolute top-6 right-6 bg-red-600 text-white font-black px-6 py-2 rounded-full text-sm uppercase tracking-widest shadow-xl">
                        إصدار محدود
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Mobile Indicators */}
              <div className="flex lg:hidden justify-center gap-2 mt-4">
                {[0, 1, 2, 3].map((i) => (
                  <div 
                    key={i}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      activeImage === i ? "bg-gold w-6" : "bg-zinc-800"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Desktop Thumbnails */}
            <div className="hidden lg:grid grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <button 
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-gold' : 'border-transparent opacity-50'}`}
                >
                  <img src={product.image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-gold mb-4">
              <Sparkles size={16} />
              <span className="text-sm font-bold tracking-widest uppercase">مجموعة الإبداع</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-8">
              <span className="text-4xl font-black text-gold">{product.price} ج.م</span>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <span className="text-gray-500 text-sm mr-2">(124 تقييم)</span>
              </div>
            </div>

            <p className="text-gray-400 text-lg leading-relaxed mb-10">
              {product.description}
            </p>

            <div className="space-y-8 mb-12">
              {/* Size Selection */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-white font-bold">اختر المقاس</h4>
                  <button className="text-gold text-sm underline">جدول المقاسات</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-14 h-14 rounded-xl border-2 font-bold transition-all flex items-center justify-center ${
                        selectedSize === size 
                          ? 'border-gold bg-gold text-black' 
                          : 'border-zinc-800 text-gray-400 hover:border-gold/50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <h4 className="text-white font-bold mb-4">اللون</h4>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      className="px-6 py-2 rounded-full border-2 border-gold bg-zinc-900 text-white font-bold text-sm"
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`flex-1 py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all ${
                  isAdded ? 'bg-green-600 text-white' : 'gold-gradient text-black hover:scale-[1.02]'
                }`}
              >
                {isAdded ? 'تمت الإضافة بنجاح!' : <><ShoppingBag size={24} /> أضف إلى السلة</>}
              </button>
              <div className="flex gap-4">
                <button className="flex-1 sm:w-20 h-16 rounded-2xl border-2 border-zinc-800 text-white flex items-center justify-center hover:border-red-500 hover:text-red-500 transition-all">
                  <Heart size={24} />
                </button>
                <button className="flex-1 sm:w-20 h-16 rounded-2xl border-2 border-zinc-800 text-white flex items-center justify-center hover:border-gold hover:text-gold transition-all">
                  <Share2 size={24} />
                </button>
              </div>
            </div>

            {/* Mobile Sticky Add to Cart */}
            <div className="lg:hidden fixed bottom-20 left-0 right-0 z-40 px-4 pb-4 pointer-events-none">
              <motion.div 
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="bg-zinc-900/90 backdrop-blur-xl p-4 rounded-3xl border border-gold/20 shadow-2xl pointer-events-auto flex items-center justify-between gap-4"
              >
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">السعر الإجمالي</span>
                  <span className="text-xl font-black text-gold">{product.price} ج.م</span>
                </div>
                <button 
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  className={`flex-1 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
                    isAdded ? 'bg-green-600 text-white' : 'gold-gradient text-black active:scale-95'
                  }`}
                >
                  {isAdded ? 'تم!' : <><ShoppingBag size={20} /> أضف للسلة</>}
                </button>
              </motion.div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 bg-zinc-950 rounded-3xl border border-gold/10">
              <div className="flex items-center gap-3 text-gray-400">
                <ShieldCheck className="text-gold" size={20} />
                <span className="text-xs font-bold">ضمان جودة 100%</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Truck className="text-gold" size={20} />
                <span className="text-xs font-bold">شحن سريع وآمن</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <RotateCcw className="text-gold" size={20} />
                <span className="text-xs font-bold">استرجاع خلال 14 يوم</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-12">
              <h2 className="text-3xl font-black text-white">منتجات <span className="text-gold">مشابهة</span></h2>
              <div className="flex-1 h-px bg-gold/20" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
