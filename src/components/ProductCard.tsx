import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../CartContext';
import { useWishlist } from '../WishlistContext';
import { DESIGN } from '../constants';
import { cn } from '../lib/utils';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const displayImage = product.image || (product as any).images?.[0];
  const displaySizes = product.sizes || [];
  const isFavorite = isInWishlist(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden hover:border-gold/30 transition-all duration-700 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
    >
      {/* Image Container */}
      <div className={`relative ${DESIGN.PRODUCT_CARD_ASPECT} overflow-hidden group-hover:shadow-2xl transition-all duration-500`}>
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={displayImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-4 backdrop-blur-[2px]">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                const displayColors = product.colors || [];
                addToCart(product, displaySizes[0] || 'M', displayColors[0] || 'أسود');
              }}
              className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:bg-gold transition-colors shadow-xl"
            >
              <ShoppingBag size={24} />
            </motion.button>
          </div>
        </Link>
        
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist({
              id: product.id,
              name: product.name,
              price: product.price,
              images: (product as any).images || [product.image],
              category: product.category,
              isLimited: product.isLimited,
              isBestSeller: product.isBestSeller
            });
          }}
          className={cn(
            "absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10 backdrop-blur-md border",
            isFavorite 
              ? "bg-gold text-black border-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]" 
              : "bg-black/20 text-white border-white/10 hover:bg-white/10"
          )}
        >
          <Heart size={20} className={cn(isFavorite && "fill-current")} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4 md:p-8">
        <div className="flex flex-wrap gap-2 mb-2">
          {product.isLimited && (
            <span className="text-[7px] md:text-[10px] font-black text-gold border border-gold/30 px-2 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1 bg-gold/5">
              <div className="w-1 h-1 rounded-full bg-gold animate-pulse" />
              إصدار محدود
            </span>
          )}
          {product.isBestSeller && (
            <span className="text-[7px] md:text-[10px] font-black text-black bg-gold px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">
              الأكثر مبيعاً
            </span>
          )}
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-white font-black text-xs md:text-xl mb-1 md:mb-2 group-hover:text-gold transition-colors line-clamp-1 font-serif tracking-tight">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-2 md:mt-3">
          <span className="text-gold-light font-black text-sm md:text-2xl tracking-tighter">
            {product.price} <span className="text-[8px] md:text-xs font-serif italic opacity-60">ج.م</span>
          </span>
          <div className="hidden md:flex gap-1.5">
            {displaySizes.slice(0, 3).map(size => (
              <span key={size} className="text-[9px] text-gray-400 border border-white/10 px-1.5 py-0.5 rounded uppercase font-bold">{size}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
