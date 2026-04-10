import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, User, Menu, X, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../CartContext';
import { useWishlist } from '../WishlistContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'المتجر', path: '/shop' },
    { name: 'من نحن', path: '/about' },
    { name: 'تواصل معنا', path: '/contact' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-700 px-6 py-4',
        isScrolled 
          ? 'glass py-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' 
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Mobile Menu Button */}
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="lg:hidden text-white p-3 glass rounded-2xl" 
          onClick={() => setIsOpen(true)}
        >
          <Menu size={24} />
        </motion.button>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-12">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'text-[10px] font-black tracking-[0.4em] uppercase hover:text-gold transition-all duration-500 relative group font-serif italic',
                location.pathname === link.path ? 'text-gold' : 'text-white/50'
              )}
            >
              {link.name}
              <span className={cn(
                "absolute -bottom-2 right-0 h-[1px] bg-gold transition-all duration-700",
                location.pathname === link.path ? "w-full" : "w-0 group-hover:w-full"
              )} />
            </Link>
          ))}
        </div>

        {/* Logo */}
        <Link to="/" className="flex flex-col items-center group relative">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center"
          >
            <span className="text-xl md:text-4xl font-black tracking-tighter text-white group-hover:text-gold transition-all duration-700 font-serif">
              EL<span className="text-gold group-hover:text-white transition-all duration-700">BRENS</span>
            </span>
            <span className="text-[8px] md:text-[10px] tracking-[0.6em] text-gold font-black -mt-1 opacity-80 italic font-serif">LUXURY</span>
          </motion.div>
        </Link>

        {/* Icons */}
        <div className="flex items-center gap-4 sm:gap-8">
          <Link to="/profile" className="text-white/70 hover:text-gold transition-all duration-500 hidden lg:block">
            <User size={22} strokeWidth={1.5} />
          </Link>
          <Link to="/wishlist" className="text-white/70 hover:text-gold transition-all duration-500 hidden lg:block relative group">
            <Heart size={22} strokeWidth={1.5} />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-black text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative group">
            <div className="p-3 glass rounded-full group-hover:bg-gold group-hover:text-black transition-all duration-700">
              <ShoppingBag size={22} strokeWidth={1.5} />
            </div>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xl">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-black border-l border-gold/30 z-[70] p-8"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="text-xl font-black text-white">
                  EL<span className="text-gold">BRENS</span>
                </span>
                <button onClick={() => setIsOpen(false)} className="text-white">
                  <X size={28} />
                </button>
              </div>
              <div className="flex flex-col gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="text-xl font-bold text-white hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                <hr className="border-gold/20" />
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 text-lg text-white"
                >
                  <User size={20} /> حسابي
                </Link>
                <Link
                  to="/wishlist"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between text-lg text-white group"
                >
                  <div className="flex items-center gap-4">
                    <Heart size={20} className="text-gold" /> المفضلة
                  </div>
                  {wishlist.length > 0 && (
                    <span className="bg-gold text-black text-[10px] font-black px-2 py-0.5 rounded-full">
                      {wishlist.length}
                    </span>
                  )}
                </Link>
                <a
                  href="https://wa.me/201044002840"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-lg text-[#25D366]"
                >
                  <MessageCircle size={20} /> تواصل واتساب
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
