import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, User, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalItems } = useCart();
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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        isScrolled ? 'bg-black/90 backdrop-blur-md border-b border-gold/20 py-3' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button className="lg:hidden text-white" onClick={() => setIsOpen(true)}>
          <Menu size={28} />
        </button>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'text-sm font-medium tracking-widest hover:text-gold transition-colors',
                location.pathname === link.path ? 'text-gold' : 'text-white'
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Logo */}
        <Link to="/" className="flex flex-col items-center">
          <span className="text-2xl font-black tracking-tighter text-white">
            EL<span className="text-gold">BRENS</span>
          </span>
          <span className="text-[10px] tracking-[0.3em] text-gold-light font-bold -mt-1">STORE</span>
        </Link>

        {/* Icons */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link to="/profile" className="text-white hover:text-gold transition-colors hidden lg:block">
            <User size={22} />
          </Link>
          <Link to="/wishlist" className="text-white hover:text-gold transition-colors hidden lg:block">
            <Heart size={22} />
          </Link>
          <Link to="/cart" className="text-white hover:text-gold transition-colors relative hidden sm:block">
            <ShoppingBag size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
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
                  className="flex items-center gap-4 text-lg text-white"
                >
                  <Heart size={20} /> المفضلة
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
