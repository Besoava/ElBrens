import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, ShoppingCart, User, Heart } from 'lucide-react';
import { useCart } from '../CartContext';
import { cn } from '../lib/utils';

export default function BottomNav() {
  const location = useLocation();
  const { totalItems } = useCart();

  const navItems = [
    { name: 'الرئيسية', icon: Home, path: '/' },
    { name: 'المتجر', icon: ShoppingBag, path: '/shop' },
    { name: 'السلة', icon: ShoppingCart, path: '/cart', badge: totalItems },
    { name: 'المفضلة', icon: Heart, path: '/wishlist' },
    { name: 'حسابي', icon: User, path: '/profile' },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-lg border-t border-gold/20 pb-safe pt-2 px-4 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 p-2 transition-all duration-300 relative",
                isActive ? "text-gold scale-110" : "text-gray-500 hover:text-white"
              )}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gold text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold tracking-wider">{item.name}</span>
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 bg-gold rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
