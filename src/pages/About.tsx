import { motion } from 'motion/react';
import { Target, Users, ShieldCheck, Sparkles } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-black min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <Sparkles className="w-16 h-16 text-gold mx-auto mb-6" />
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8">قصة <span className="text-gold">البرنس</span></h1>
          <p className="text-gray-400 text-xl leading-relaxed max-w-3xl mx-auto">
            بدأت رحلتنا من شغف عميق بالتميز والرغبة في كسر القواعد التقليدية للموضة. نحن هنا لنعيد تعريف الإبداع في عالم الستريت وير.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-zinc-950 p-10 rounded-[3rem] border border-gold/10"
          >
            <Target className="text-gold mb-6" size={40} />
            <h3 className="text-2xl font-black text-white mb-4">رؤيتنا</h3>
            <p className="text-gray-500 leading-relaxed">
              أن نصبح البراند الأول في الشرق الأوسط الذي يجمع بين جرأة الشارع وفخامة الملوك، مقدمين قطعاً فنية تعبر عن شخصية من يرتديها.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-zinc-950 p-10 rounded-[3rem] border border-gold/10"
          >
            <Users className="text-gold mb-6" size={40} />
            <h3 className="text-2xl font-black text-white mb-4">جمهورنا</h3>
            <p className="text-gray-500 leading-relaxed">
              نحن نصمم للقادة، للمبدعين، ولأولئك الذين لا يخشون السيطرة على مساحتهم الخاصة. البرنس هو لكل من يطمح للقمة.
            </p>
          </motion.div>
        </div>

        <div className="relative rounded-[4rem] overflow-hidden h-[500px] mb-32">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-60"
            alt="Workshop"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex items-center justify-center p-12 text-center">
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
              كل قطعة تخرج من مصنعنا <br /> هي <span className="text-gold">وعد بالفخامة</span>
            </h2>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-black text-white mb-12">قيمنا الأساسية</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="text-gold font-black text-4xl">01</div>
              <h4 className="text-white font-bold">الجودة</h4>
            </div>
            <div className="space-y-4">
              <div className="text-gold font-black text-4xl">02</div>
              <h4 className="text-white font-bold">الابتكار</h4>
            </div>
            <div className="space-y-4">
              <div className="text-gold font-black text-4xl">03</div>
              <h4 className="text-white font-bold">التميز</h4>
            </div>
            <div className="space-y-4">
              <div className="text-gold font-black text-4xl">04</div>
              <h4 className="text-white font-bold">الولاء</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
