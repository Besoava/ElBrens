import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Crown, Sparkles, Zap } from 'lucide-react';
import { PRODUCTS } from '../types';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const featuredProducts = PRODUCTS.slice(0, 4);

  return (
    <div className="bg-black">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-32 lg:py-0">
        {/* Background Video/Image Placeholder */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-40 grayscale"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-6xl sm:text-8xl lg:text-9xl font-black text-white mb-6 tracking-tighter"
          >
            سيطر على <span className="text-gold-gradient">ستايلك</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-12 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            عالم من الإبداع ينتظرك. اكتشف تصاميم حصرية تتخطى حدود الموضة التقليدية.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            <Link 
              to="/shop" 
              className="w-full sm:w-auto gold-gradient text-black font-black px-12 py-5 rounded-full text-lg hover:scale-105 transition-transform flex items-center justify-center gap-3"
            >
              تسوق الآن <ArrowLeft size={20} />
            </Link>
            <Link 
              to="/about" 
              className="w-full sm:w-auto bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold px-12 py-5 rounded-full text-lg hover:bg-white/20 transition-all flex items-center justify-center"
            >
              قصة البراند
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 text-gold/50 hidden md:flex"
        >
          <div className="w-6 h-10 border-2 border-gold/30 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-gold rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-y border-gold/10 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
          <motion.div 
            whileHover={{ y: -5 }}
            className="flex items-center gap-6 group p-4 rounded-2xl transition-colors hover:bg-white/5"
          >
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all duration-500 shrink-0">
              <Sparkles size={32} />
            </div>
            <div>
              <h3 className="text-white font-bold text-xl mb-1">خامات ملكية</h3>
              <p className="text-gray-500 text-sm">أفضل أنواع القطن المصري الفاخر</p>
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ y: -5 }}
            className="flex items-center gap-6 group p-4 rounded-2xl transition-colors hover:bg-white/5"
          >
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all duration-500 shrink-0">
              <Zap size={32} />
            </div>
            <div>
              <h3 className="text-white font-bold text-xl mb-1">توصيل سريع</h3>
              <p className="text-gray-500 text-sm">شحن خلال 48 ساعة لجميع المحافظات</p>
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ y: -5 }}
            className="flex items-center gap-6 group p-4 rounded-2xl transition-colors hover:bg-white/5"
          >
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all duration-500 shrink-0">
              <Sparkles size={32} />
            </div>
            <div>
              <h3 className="text-white font-bold text-xl mb-1">إصدارات خاصة</h3>
              <p className="text-gray-500 text-sm">قطع فريدة لن تجدها في أي مكان آخر</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="text-gold font-bold tracking-[0.3em] uppercase text-sm mb-4 block">المجموعة المختارة</span>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">الأكثر <span className="text-gold">مبيعاً</span></h2>
            </div>
            <Link to="/shop" className="text-gold font-bold flex items-center gap-2 hover:gap-4 transition-all">
              عرض الكل <ArrowLeft size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Banner */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link to="/shop?cat=men" className="relative h-[500px] rounded-3xl overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1000&auto=format&fit=crop" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt="Men Collection"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-10 right-10">
              <h3 className="text-4xl font-black text-white mb-2">رجالي</h3>
              <span className="text-gold font-bold flex items-center gap-2">تسوق الآن <ArrowLeft size={16} /></span>
            </div>
          </Link>
          <Link to="/shop?cat=women" className="relative h-[500px] rounded-3xl overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt="Women Collection"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-10 right-10">
              <h3 className="text-4xl font-black text-white mb-2">حريمي</h3>
              <span className="text-gold font-bold flex items-center gap-2">تسوق الآن <ArrowLeft size={16} /></span>
            </div>
          </Link>
        </div>
      </section>

      {/* Limited Edition CTA */}
      <section className="py-32 px-6 bg-zinc-950 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-gold whitespace-nowrap">
            ELBRENS STORE
          </div>
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="inline-block bg-gold/10 text-gold border border-gold/30 px-6 py-2 rounded-full font-bold text-sm mb-8">
            إصدار محدود جداً
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
            كن جزءاً من <span className="text-gold">النخبة</span>. <br /> تميز بإبداع لا ينتهي.
          </h2>
          <p className="text-gray-400 text-xl mb-12 max-w-2xl mx-auto">
            مجموعتنا الجديدة "السيطرة" متوفرة الآن بكميات محدودة جداً. احصل على قطعتك قبل نفاذ الكمية.
          </p>
          <Link to="/shop" className="inline-block bg-white text-black font-black px-16 py-6 rounded-full text-xl hover:bg-gold transition-colors">
            اكتشف المجموعة
          </Link>
        </div>
      </section>
    </div>
  );
}
