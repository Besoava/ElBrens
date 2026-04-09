import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../CartContext';
import { DESIGN } from '../constants';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const displayImage = product.image || (product as any).images?.[0];
  const displaySizes = product.sizes || [];

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
      </div>

      {/* Info */}
      <div className="p-4 md:p-8">
        <div className="flex flex-wrap gap-2 mb-2">
          {product.isLimited && (
            <span className="text-[8px] md:text-[10px] font-black text-gold border border-gold/30 px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-gold" />
              إصدار محدود
            </span>
          )}
          {product.isBestSeller && (
            <span className="text-[8px] md:text-[10px] font-black text-black bg-gold px-2 py-0.5 rounded uppercase tracking-wider">
              الأكثر مبيعاً
            </span>
          )}
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-white font-black text-sm md:text-xl mb-2 group-hover:text-gold transition-colors line-clamp-1 font-serif">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <span className="text-gold-light font-black text-base md:text-2xl tracking-tighter">{product.price} <span className="text-[10px] md:text-xs font-serif italic">ج.م</span></span>
          <div className="hidden md:flex gap-1">
            {displaySizes.slice(0, 3).map(size => (
              <span key={size} className="text-[10px] md:text-[10px] text-gray-500 border border-white/5 px-1.5 py-0.5 rounded uppercase">{size}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
