import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Heart, Share2, Star, ShieldCheck, Truck, RotateCcw, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import { doc, getDoc, collection, query, where, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import { useCart } from '../CartContext';
import { useWishlist } from '../WishlistContext';
import { cn } from '../lib/utils';
import ProductCard from '../components/ProductCard';
import { DESIGN } from '../constants';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState<any | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isFavorite = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        const prod = { 
          id: docSnap.id, 
          ...data, 
          image: (data as any).images?.[0] 
        };
        setProduct(prod);
        setSelectedSize((data as any).sizes?.[0] || '');
        setSelectedColor((data as any).colors?.[0] || '');
        
        // Fetch related
        const q = query(
          collection(db, 'products'), 
          where('category', '==', data.category),
          limit(5)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const related = snapshot.docs
            .map(d => ({ id: d.id, ...d.data(), image: (d.data() as any).images?.[0] }))
            .filter(p => p.id !== id)
            .slice(0, 4);
          setRelatedProducts(related);
        });
        return () => unsubscribe();
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) return <div className="h-screen bg-black flex items-center justify-center text-white">جاري التحميل...</div>;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 3000);
  };

  const handleToggleWishlist = () => {
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.images || [product.image],
      category: product.category,
      isLimited: product.isLimited,
      isBestSeller: product.isBestSeller
    });
  };

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
                {(product.images || [product.image]).map((img: string, i: number) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`min-w-[85%] lg:min-w-0 snap-center ${DESIGN.PRODUCT_DETAIL_ASPECT} rounded-2xl lg:rounded-[2rem] overflow-hidden border border-gold/20 relative mr-4 last:mr-0`}
                  >
                    <img 
                      src={img} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                ))}
              </div>

              {/* Mobile Indicators */}
              <div className="flex lg:hidden justify-center gap-2 mt-4">
                {(product.images || [product.image]).map((_: any, i: number) => (
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
              {(product.images || [product.image]).map((img: string, i: number) => (
                <button 
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-gold' : 'border-transparent opacity-50'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="flex flex-wrap gap-3 mb-6">
              {product.isLimited && (
                <div className="bg-gold/10 border border-gold/30 text-gold text-[10px] md:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                  إصدار محدود
                </div>
              )}
              {product.isBestSeller && (
                <div className="bg-gold text-black text-[10px] md:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-gold/20">
                  <Star size={14} fill="currentColor" />
                  الأكثر مبيعاً
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-gold mb-4">
              <Sparkles size={16} />
              <span className="text-sm font-bold tracking-widest uppercase">مجموعة الإبداع</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-8">
              <span className="text-4xl font-black text-gold">{product.price} ج.م</span>
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
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "px-6 py-2 rounded-full border-2 font-bold text-sm transition-all",
                        selectedColor === color
                          ? "border-gold bg-gold text-black"
                          : "border-zinc-800 text-gray-400 hover:border-gold/50"
                      )}
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
              <button 
                onClick={handleToggleWishlist}
                className={cn(
                  "w-full sm:w-20 h-20 rounded-2xl flex items-center justify-center transition-all border-2",
                  isFavorite 
                    ? "bg-gold/10 border-gold text-gold shadow-[0_0_20px_rgba(212,175,55,0.2)]" 
                    : "bg-zinc-900 border-zinc-800 text-gray-400 hover:border-gold/50"
                )}
              >
                <Heart size={28} className={cn(isFavorite && "fill-current")} />
              </button>
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-8">
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
