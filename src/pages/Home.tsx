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
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 20, ease: "linear" }}
            className="w-full h-full"
          >
            <img 
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop" 
              className="w-full h-full object-cover opacity-50 grayscale-[0.2]"
              alt="High Fashion Background"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-rich-black/90 via-transparent to-rich-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,5,0.8)_100%)]" />
        </div>

        {/* Content Layer */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center -mt-10 md:-mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="mb-6 md:mb-12"
          >
            <span className="glass-gold px-6 py-2 md:px-8 md:py-3 rounded-full text-gold text-[8px] md:text-xs font-black tracking-[0.4em] md:tracking-[0.6em] uppercase font-serif italic">
              مجموعة النخبة • 2026
            </span>
          </motion.div>

          <div className="relative mb-8 md:mb-20">
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-[12vw] md:text-[16vw] font-black text-white leading-[0.7] tracking-tighter uppercase"
            >
              EL<span className="text-gold-gradient">BRENS</span>
            </motion.h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 1, duration: 1.5 }}
              className="h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mt-6 md:mt-12 mx-auto opacity-50"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="mt-6 md:mt-16 text-lg md:text-6xl font-serif italic text-gold-light tracking-[0.1em] md:tracking-[0.2em] font-light"
            >
              سيطر على ستايلك
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 1 }}
            className="flex flex-col sm:flex-row items-center gap-4 md:gap-8 mt-8 md:mt-20"
          >
            <Link 
              to="/shop" 
              className="group relative px-10 py-4 md:px-16 md:py-6 bg-white text-black font-black text-base md:text-xl rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
            >
              <span className="relative z-10 flex items-center gap-3 md:gap-4">
                اكتشف المجموعة <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform md:w-6 md:h-6" />
              </span>
              <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Link>
            
            <Link 
              to="/about" 
              className="px-10 py-4 md:px-16 md:py-6 glass text-white font-bold text-base md:text-xl rounded-full hover:bg-white/10 transition-all border border-white/10"
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
          <span className="text-[10px] text-gold font-black tracking-[0.8em] uppercase vertical-text opacity-70">اسحب للأسفل</span>
        </motion.div>
      </section>

      {/* Featured Products */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 md:py-60 px-6 bg-rich-black relative overflow-hidden"
      >
        {/* Decorative Background Text */}
        <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none opacity-[0.05] select-none">
          <div className="text-[25vw] md:text-[35vw] font-black whitespace-nowrap animate-marquee font-serif italic text-gold/20">
            ELBRENS LUXURY • ELBRENS LUXURY • 
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-40 gap-8 md:gap-16">
            <div className="max-w-3xl w-full flex flex-col items-start text-right">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 md:gap-6 mb-4 md:mb-8"
              >
                <div className="h-[1px] w-12 md:w-20 bg-gold" />
                <span className="text-gold font-black tracking-[0.4em] md:tracking-[0.6em] uppercase text-[10px] md:text-sm font-serif italic">الأكثر مبيعاً</span>
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-[10rem] font-black text-white tracking-tighter leading-[0.8] font-serif"
              >
                قطع <span className="text-gold-gradient italic">خالدة</span> <br />
                تحدد هويتك
              </motion.h2>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="w-full md:w-auto"
            >
              <Link to="/shop" className="group flex items-center justify-start gap-4 md:gap-8 text-white font-bold text-lg md:text-2xl">
                <span className="border-b border-white/10 group-hover:border-gold transition-all duration-700 pb-2 md:pb-3">تصفح المتجر بالكامل</span>
                <div className="w-12 h-12 md:w-20 md:h-20 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-gold group-hover:border-gold transition-all duration-700 group-hover:scale-110 shadow-2xl">
                  <ArrowLeft size={20} className="group-hover:text-black transition-colors md:w-8 md:h-8" />
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Asymmetric Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-16">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className={cn(
                  "relative",
                  index % 2 === 1 ? "md:mt-32" : ""
                )}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Categories Banner */}
      <section className="py-12 md:py-60 px-4 md:px-6 bg-rich-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 gap-4 md:gap-32">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative group h-[300px] md:h-[900px] rounded-3xl md:rounded-[60px] overflow-hidden shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1000&auto=format&fit=crop" 
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                alt="Men Collection"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rich-black via-rich-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-24">
                <span className="text-gold font-black tracking-[0.4em] md:tracking-[0.8em] uppercase text-[8px] md:text-sm mb-2 md:mb-8 font-serif italic">رجالي</span>
                <h3 className="text-xl md:text-9xl font-black text-white mb-4 md:mb-12 tracking-tighter leading-[0.8] font-serif">قوة <br /> الحضور</h3>
                <Link to="/shop?cat=men" className="w-fit px-6 py-3 md:px-12 md:py-6 glass-gold text-white font-black rounded-xl md:rounded-3xl hover:bg-gold hover:text-black transition-all duration-700 uppercase tracking-widest text-[8px] md:text-sm shadow-2xl">
                  اكتشف
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative group h-[300px] md:h-[900px] rounded-3xl md:rounded-[60px] overflow-hidden md:mt-48 shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop" 
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                alt="Women Collection"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rich-black via-rich-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-24">
                <span className="text-gold font-black tracking-[0.4em] md:tracking-[0.8em] uppercase text-[8px] md:text-sm mb-2 md:mb-8 font-serif italic">حريمي</span>
                <h3 className="text-xl md:text-9xl font-black text-white mb-4 md:mb-12 tracking-tighter leading-[0.8] font-serif">أناقة <br /> لا تنتهي</h3>
                <Link to="/shop?cat=women" className="w-fit px-6 py-3 md:px-12 md:py-6 glass-gold text-white font-black rounded-xl md:rounded-3xl hover:bg-gold hover:text-black transition-all duration-700 uppercase tracking-widest text-[8px] md:text-sm shadow-2xl">
                  اكتشف
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
        className="py-12 md:py-48 px-6 border-t border-white/5 bg-rich-black"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-4 md:gap-32">
          <div className="flex flex-col items-center text-center group">
            <div className="w-12 h-12 md:w-24 md:h-24 rounded-2xl md:rounded-[2rem] bg-white/5 border border-white/5 flex items-center justify-center text-gold mb-4 md:mb-10 group-hover:scale-110 transition-all duration-700 group-hover:bg-gold group-hover:text-black shadow-2xl">
              <Sparkles size={20} className="md:w-10 md:h-10" />
            </div>
            <h3 className="text-white font-black text-[10px] md:text-3xl mb-2 md:mb-6 uppercase tracking-[0.1em] md:tracking-[0.2em] font-serif italic">خامات ملكية</h3>
            <p className="text-gray-500 text-[8px] md:text-base leading-relaxed max-w-[300px] font-light hidden sm:block">نستخدم أجود أنواع القطن المصري طويل التيلة لضمان راحة تدوم طويلاً وفخامة لا تضاهى في كل قطعة.</p>
          </div>
          <div className="flex flex-col items-center text-center group">
            <div className="w-12 h-12 md:w-24 md:h-24 rounded-2xl md:rounded-[2rem] bg-white/5 border border-white/5 flex items-center justify-center text-gold mb-4 md:mb-10 group-hover:scale-110 transition-all duration-700 group-hover:bg-gold group-hover:text-black shadow-2xl">
              <Zap size={20} className="md:w-10 md:h-10" />
            </div>
            <h3 className="text-white font-black text-[10px] md:text-3xl mb-2 md:mb-6 uppercase tracking-[0.1em] md:tracking-[0.2em] font-serif italic">توصيل سريع</h3>
            <p className="text-gray-500 text-[8px] md:text-base leading-relaxed max-w-[300px] font-light hidden sm:block">شحن سريع وموثوق لجميع محافظات مصر خلال 48 ساعة عمل مع تغليف فاخر يليق بك وبتجربتك معنا.</p>
          </div>
          <div className="flex flex-col items-center text-center group">
            <div className="w-12 h-12 md:w-24 md:h-24 rounded-2xl md:rounded-[2rem] bg-white/5 border border-white/5 flex items-center justify-center text-gold mb-4 md:mb-10 group-hover:scale-110 transition-all duration-700 group-hover:bg-gold group-hover:text-black shadow-2xl">
              <Crown size={20} className="md:w-10 md:h-10" />
            </div>
            <h3 className="text-white font-black text-[10px] md:text-3xl mb-2 md:mb-6 uppercase tracking-[0.1em] md:tracking-[0.2em] font-serif italic">إصدارات خاصة</h3>
            <p className="text-gray-500 text-[8px] md:text-base leading-relaxed max-w-[300px] font-light hidden sm:block">قطع حصرية مصممة بعناية لتمنحك التميز الذي تستحقه في كل مناسبة، إصدارات محدودة لا تتكرر أبداً.</p>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
