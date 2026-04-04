import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Wishlist() {
  return (
    <div className="min-h-screen bg-black pt-40 pb-20 px-6 flex items-center justify-center">
      <div className="max-w-md w-full text-center">
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
      </div>
    </div>
  );
}
