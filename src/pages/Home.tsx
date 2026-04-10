import { motion, useScroll, useSpring } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Crown, Sparkles, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import ProductCard from '../components/ProductCard';
import { cn } from '../lib/utils';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const heroY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30
  });

  useEffect(() => {
    const q = query(collection(db, 'products'), limit(4));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(), 
        image: (doc.data() as any).images?.[0] 
      }));
      setFeaturedProducts(prods);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-black">
      <motion.div className="scroll-progress" style={{ scaleX }} />
      
      {/* Hero Section */}
      <section className="relative h-[100dvh] flex items-center justify-center overflow-hidden bg-rich-black">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            style={{ y: useSpring(scrollYProgress, { stiffness: 100, damping: 30 }) }}
            className="w-full h-full"
          >
            <img 
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop" 
              className="w-full h-full object-cover opacity-60 grayscale-[0.2] scale-110"
              alt="High Fashion Background"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-rich-black/95 via-transparent to-rich-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,5,0.9)_100%)]" />
          
          {/* Animated Light Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[150px] animate-pulse delay-700" />
        </div>

        {/* Content Layer */}
        <div className="relative z-10 w-[369px] md:w-full max-w-7xl mx-auto pl-[24px] pr-6 flex flex-col items-center text-center pt-[20px] md:pt-[57px] mt-[-38px] md:mt-0 h-[464.344px] md:h-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8 md:mb-12"
          >
            <span className="glass-gold px-6 py-2 rounded-full text-gold text-[10px] md:text-sm font-black tracking-[0.5em] uppercase font-serif italic shadow-2xl">
              موضة ستور • 2026
            </span>
          </motion.div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="text-[15vw] md:text-[8vw] font-black text-white leading-none tracking-tighter uppercase mb-8 md:mb-16 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            >
              EL<span className="text-gold">BRENS</span>
            </motion.h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-lg md:text-4xl font-serif italic text-white/80 tracking-wide mb-12 md:mb-24 max-w-3xl px-4 leading-relaxed"
          >
            الفخامة في كل تفصيلة، <br className="md:hidden" /> التميز في كل قطعة
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-4 md:gap-8 w-full sm:w-auto px-6 sm:px-0"
          >
            <Link 
              to="/shop" 
              className="w-full sm:w-auto px-12 py-5 md:px-16 md:py-6 bg-gold text-black font-black text-lg md:text-xl rounded-2xl md:rounded-full hover:bg-white transition-all shadow-[0_20px_50px_rgba(212,175,55,0.3)] uppercase tracking-widest text-center"
            >
              تسوق الآن
            </Link>
            <Link 
              to="/about" 
              className="w-full sm:w-auto px-12 py-5 md:px-16 md:py-6 glass text-white font-bold text-lg md:text-xl rounded-2xl md:rounded-full hover:bg-white/10 transition-all uppercase tracking-widest text-center border border-white/10"
            >
              قصتنا
            </Link>
          </motion.div>
        </div>

        {/* Scroll Hint */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6"
        >
          <div className="w-[1px] h-12 md:h-24 bg-gradient-to-b from-gold via-gold/50 to-transparent animate-pulse" />
          <span className="text-[10px] text-gold font-black tracking-[0.8em] uppercase vertical-text opacity-70 mb-[28px] md:mb-[-8px]">اسحب للأسفل</span>
        </motion.div>
      </section>

      {/* Featured Products */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 md:py-40 px-6 bg-rich-black relative"
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 md:mb-32">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-gold font-black tracking-[0.5em] uppercase text-xs md:text-sm mb-4 block font-serif italic"
            >
              المجموعة المختارة
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white font-black text-4xl md:text-7xl tracking-tighter font-serif italic"
            >
              وصلنا حديثاً
            </motion.h2>
          </div>

          {/* Structured Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16 md:mt-32 text-center">
            <Link to="/shop" className="inline-flex items-center gap-4 text-gold font-black text-lg md:text-2xl hover:text-white transition-colors group">
              مشاهدة جميع المنتجات <ArrowLeft className="group-hover:-translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Categories Banner */}
      <section className="py-12 md:py-80 px-4 md:px-6 bg-rich-black">
        <div className="max-w-[1800px] mx-auto">
          <div className="grid grid-cols-2 gap-4 md:gap-48">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative group h-[400px] md:h-[800px] rounded-[2rem] md:rounded-[60px] overflow-hidden shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1000&auto=format&fit=crop" 
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                alt="Men Collection"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rich-black via-rich-black/10 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-32">
                <span className="text-gold font-black tracking-[0.4em] md:tracking-[1em] uppercase text-[8px] md:text-base mb-2 md:mb-12 font-serif italic">رجالي</span>
                <h3 className="text-xl md:text-[11rem] font-black text-white mb-4 md:mb-16 tracking-tighter leading-[0.75] font-serif">قوة <br /> الحضور</h3>
                <Link to="/shop?cat=men" className="w-fit px-6 py-3 md:px-16 md:py-8 glass-gold text-white font-black rounded-xl md:rounded-3xl hover:bg-gold hover:text-black transition-all duration-700 uppercase tracking-widest text-[8px] md:text-base shadow-2xl">
                  اكتشف المجموعة
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative group h-[400px] md:h-[800px] rounded-[2rem] md:rounded-[60px] overflow-hidden md:mt-40 shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop" 
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                alt="Women Collection"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rich-black via-rich-black/10 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-32">
                <span className="text-gold font-black tracking-[0.4em] md:tracking-[1em] uppercase text-[8px] md:text-base mb-2 md:mb-12 font-serif italic">حريمي</span>
                <h3 className="text-xl md:text-[11rem] font-black text-white mb-4 md:mb-16 tracking-tighter leading-[0.75] font-serif">أناقة <br /> لا تنتهي</h3>
                <Link to="/shop?cat=women" className="w-fit px-6 py-3 md:px-16 md:py-8 glass-gold text-white font-black rounded-xl md:rounded-3xl hover:bg-gold hover:text-black transition-all duration-700 uppercase tracking-widest text-[8px] md:text-base shadow-2xl">
                  اكتشف المجموعة
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Features */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-12 md:py-80 px-6 border-t border-white/5 bg-rich-black relative"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03)_0%,transparent_70%)]" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-3 md:grid-cols-3 gap-4 md:gap-32 relative z-10">
          <div className="flex flex-col items-center text-center group gap-3 md:gap-0">
            <div className="w-10 h-10 md:w-32 md:h-32 rounded-xl md:rounded-[3rem] bg-white/5 border border-white/5 flex items-center justify-center text-gold md:mb-16 group-hover:scale-110 transition-all duration-700 group-hover:bg-gold group-hover:text-black shadow-[0_20px_50px_rgba(0,0,0,0.3)] group-hover:shadow-gold/20 shrink-0">
              <Sparkles size={16} className="md:w-14 md:h-14" />
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-white font-black text-[8px] md:text-5xl mb-1 md:mb-10 uppercase tracking-[0.1em] md:tracking-[0.3em] font-serif italic">خامات ملكية</h3>
              <p className="hidden md:block text-gray-500 text-xs md:text-xl leading-relaxed max-w-[400px] font-light">نستخدم أجود أنواع القطن المصري طويل التيلة لضمان راحة تدوم طويلاً وفخامة لا تضاهى.</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center group gap-3 md:gap-0">
            <div className="w-10 h-10 md:w-32 md:h-32 rounded-xl md:rounded-[3rem] bg-white/5 border border-white/5 flex items-center justify-center text-gold md:mb-16 group-hover:scale-110 transition-all duration-700 group-hover:bg-gold group-hover:text-black shadow-[0_20px_50px_rgba(0,0,0,0.3)] group-hover:shadow-gold/20 shrink-0">
              <Zap size={16} className="md:w-14 md:h-14" />
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-white font-black text-[8px] md:text-5xl mb-1 md:mb-10 uppercase tracking-[0.1em] md:tracking-[0.3em] font-serif italic">توصيل سريع</h3>
              <p className="hidden md:block text-gray-500 text-xs md:text-xl leading-relaxed max-w-[400px] font-light">شحن سريع وموثوق لجميع محافظات مصر خلال 48 ساعة عمل مع تغليف فاخر يليق بك.</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center group gap-3 md:gap-0">
            <div className="w-10 h-10 md:w-32 md:h-32 rounded-xl md:rounded-[3rem] bg-white/5 border border-white/5 flex items-center justify-center text-gold md:mb-16 group-hover:scale-110 transition-all duration-700 group-hover:bg-gold group-hover:text-black shadow-[0_20px_50px_rgba(0,0,0,0.3)] group-hover:shadow-gold/20 shrink-0">
              <Crown size={16} className="md:w-14 md:h-14" />
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-white font-black text-[8px] md:text-5xl mb-1 md:mb-10 uppercase tracking-[0.1em] md:tracking-[0.3em] font-serif italic">إصدارات خاصة</h3>
              <p className="hidden md:block text-gray-500 text-xs md:text-xl leading-relaxed max-w-[400px] font-light">قطع حصرية مصممة بعناية لتمنحك التميز الذي تستحقه، إصدارات محدودة لا تتكرر.</p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
