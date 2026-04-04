import { useCart } from '../CartContext';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-black pt-40 pb-20 px-6 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="w-32 h-32 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-8 text-gold/20">
            <ShoppingBag size={64} />
          </div>
          <h1 className="text-3xl font-black text-white mb-4">سلتك فارغة حالياً</h1>
          <p className="text-gray-500 mb-12">يبدو أنك لم تضف أي قطع ملكية إلى سلتك بعد. ابدأ التسوق الآن!</p>
          <Link 
            to="/shop" 
            className="inline-block gold-gradient text-black font-black px-12 py-5 rounded-full text-lg hover:scale-105 transition-transform"
          >
            تصفح المتجر
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-12">سلة <span className="text-gold">المشتريات</span></h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <motion.div
                layout
                key={`${item.id}-${item.selectedSize}`}
                className="bg-zinc-950 border border-gold/10 rounded-3xl p-6 flex flex-col sm:flex-row gap-6 hover:border-gold/30 transition-all"
              >
                <div className="w-full sm:w-32 aspect-[3/4] rounded-2xl overflow-hidden border border-gold/10">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-bold text-xl mb-1">{item.name}</h3>
                      <p className="text-gold text-sm font-bold">المقاس: {item.selectedSize}</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id, item.selectedSize)}
                      className="text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="flex justify-between items-end mt-6">
                    <div className="flex items-center gap-4 bg-zinc-900 rounded-xl p-1 border border-gold/10">
                      <button 
                        onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center text-white hover:text-gold transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-white font-bold w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center text-white hover:text-gold transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <span className="text-2xl font-black text-white">{item.price * item.quantity} ج.م</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-zinc-950 border border-gold/20 rounded-[2.5rem] p-8 sticky top-32">
              <h3 className="text-2xl font-black text-white mb-8">ملخص الطلب</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-400">
                  <span>عدد القطع</span>
                  <span>{totalItems}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>المجموع الفرعي</span>
                  <span>{totalPrice} ج.م</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>تكلفة الشحن</span>
                  <span className="text-green-500 font-bold">مجاني</span>
                </div>
                <hr className="border-gold/10 my-4" />
                <div className="flex justify-between text-white text-2xl font-black">
                  <span>الإجمالي</span>
                  <span className="text-gold">{totalPrice} ج.م</span>
                </div>
              </div>

              <Link 
                to="/checkout" 
                className="w-full gold-gradient text-black font-black py-5 rounded-2xl text-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform mb-6"
              >
                إتمام الشراء <ArrowRight size={24} />
              </Link>

              <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
                <ShieldCheck size={14} className="text-gold" />
                دفع آمن ومحمي 100%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
