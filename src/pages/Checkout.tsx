import React, { useState } from 'react';
import { useCart } from '../CartContext';
import { ShieldCheck, CreditCard, Truck, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Checkout() {
  const { totalPrice, clearCart } = useCart();
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    clearCart();
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black pt-40 pb-20 px-6 flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full text-center bg-zinc-950 p-12 rounded-[3rem] border border-gold/30"
        >
          <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-8 text-white">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-black text-white mb-4">تم الطلب بنجاح!</h1>
          <p className="text-gray-500 mb-12">شكراً لثقتك في البرنس. سيتم التواصل معك قريباً لتأكيد تفاصيل الشحن.</p>
          <Link 
            to="/" 
            className="inline-block gold-gradient text-black font-black px-12 py-5 rounded-full text-lg hover:scale-105 transition-transform"
          >
            العودة للرئيسية
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-12">إتمام <span className="text-gold">الطلب</span></h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-gold text-black flex items-center justify-center text-sm">1</span>
                معلومات الشحن
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input required placeholder="الاسم الأول" className="bg-zinc-900 border border-gold/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold" />
                <input required placeholder="اسم العائلة" className="bg-zinc-900 border border-gold/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold" />
                <input required placeholder="رقم الهاتف" className="bg-zinc-900 border border-gold/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold sm:col-span-2" />
                <input required placeholder="العنوان بالتفصيل" className="bg-zinc-900 border border-gold/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold sm:col-span-2" />
                <select className="bg-zinc-900 border border-gold/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold">
                  <option>القاهرة</option>
                  <option>الجيزة</option>
                  <option>الإسكندرية</option>
                  <option>المنصورة</option>
                </select>
                <input placeholder="الرمز البريدي (اختياري)" className="bg-zinc-900 border border-gold/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold" />
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-gold text-black flex items-center justify-center text-sm">2</span>
                طريقة الدفع
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-4 transition-all ${paymentMethod === 'cod' ? 'border-gold bg-gold/5' : 'border-zinc-800'}`}
                >
                  <Truck size={32} className={paymentMethod === 'cod' ? 'text-gold' : 'text-gray-500'} />
                  <span className={paymentMethod === 'cod' ? 'text-white font-bold' : 'text-gray-500'}>الدفع عند الاستلام</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-4 transition-all ${paymentMethod === 'card' ? 'border-gold bg-gold/5' : 'border-zinc-800'}`}
                >
                  <CreditCard size={32} className={paymentMethod === 'card' ? 'text-gold' : 'text-gray-500'} />
                  <span className={paymentMethod === 'card' ? 'text-white font-bold' : 'text-gray-500'}>بطاقة ائتمان</span>
                </button>
              </div>
            </section>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-950 border border-gold/20 rounded-[2.5rem] p-8 sticky top-32">
              <h3 className="text-2xl font-black text-white mb-8">ملخص الطلب</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-400">
                  <span>المجموع</span>
                  <span>{totalPrice} ج.م</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>الشحن</span>
                  <span className="text-green-500 font-bold">مجاني</span>
                </div>
                <hr className="border-gold/10 my-4" />
                <div className="flex justify-between text-white text-2xl font-black">
                  <span>الإجمالي</span>
                  <span className="text-gold">{totalPrice} ج.م</span>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full gold-gradient text-black font-black py-5 rounded-2xl text-xl hover:scale-[1.02] transition-transform mb-6"
              >
                تأكيد الطلب
              </button>

              <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
                <ShieldCheck size={14} className="text-gold" />
                دفع آمن ومحمي 100%
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
