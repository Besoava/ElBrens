import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingBag, Heart } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-zinc-950 border border-gold/10 rounded-2xl overflow-hidden hover:border-gold/40 transition-all duration-500"
    >
      {/* Badges */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {product.isLimited && (
          <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            كمية محدودة
          </span>
        )}
        {product.isBestSeller && (
          <span className="bg-gold text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            الأكثر مبيعاً
          </span>
        )}
      </div>

      {/* Image Container */}
      <Link to={`/product/${product.id}`} className="block aspect-[3/4] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <button 
            onClick={(e) => {
              e.preventDefault();
              addToCart(product, product.sizes[0]);
            }}
            className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:bg-gold transition-colors"
          >
            <ShoppingBag size={20} />
          </button>
          <button className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
            <Heart size={20} />
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-6">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-white font-bold text-lg mb-2 group-hover:text-gold transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <span className="text-gold font-black text-xl">{product.price} ج.م</span>
          <span className="text-gray-500 text-xs">{product.sizes.length} مقاسات</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
