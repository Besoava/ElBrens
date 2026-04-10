import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../WishlistContext';
import { useCart } from '../CartContext';
import { motion, AnimatePresence } from 'motion/react';

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-black pt-40 pb-20 px-6 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-32 h-32 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-8 text-gold/20">
            <Heart size={64} />
          </div>
          <h1 className="text-3xl font-black text-white mb-4">قائمة الأمنيات فارغة</h1>
          <p className="text-gray-500 mb-12">لم تقم بإضافة أي قطع إلى قائمتك المفضلة بعد. ابحث عن ما يميزك الآن!</p>
          <Link 
            to="/shop" 
            className="inline-block gold-gradient text-black font-black px-12 py-5 rounded-full text-lg hover:scale-105 transition-transform"
          >
            اكتشف المنتجات
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">قائمة <span className="text-gold">الأمنيات</span></h1>
            <p className="text-gray-500 font-bold">لديك {wishlist.length} قطع في قائمتك المفضلة</p>
          </div>
          <Link 
            to="/shop" 
            className="flex items-center gap-2 text-gold font-bold hover:gap-4 transition-all"
          >
            مواصلة التسوق <ArrowRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {wishlist.map((product) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden hover:border-gold/30 transition-all duration-500"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Link to={`/product/${product.id}`}>
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </Link>
                  <button 
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors border border-white/10"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {product.isLimited && (
                      <span className="text-[8px] font-black text-gold border border-gold/30 px-2 py-0.5 rounded uppercase">إصدار محدود</span>
                    )}
                  </div>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-white font-black text-lg mb-2 group-hover:text-gold transition-colors line-clamp-1">{product.name}</h3>
                  </Link>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-gold font-black text-xl">{product.price} ج.م</span>
                  </div>
                  
                  <button 
                    onClick={() => addToCart(product as any, 'M', 'أسود')}
                    className="w-full py-4 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-gold transition-colors"
                  >
                    <ShoppingBag size={18} /> إضافة للسلة
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
