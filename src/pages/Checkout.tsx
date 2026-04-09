import React, { useState, useEffect } from 'react';
import { useCart } from '../CartContext';
import { ShieldCheck, CreditCard, Truck, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';

export default function Checkout() {
  const { cart, totalPrice, clearCart, shippingCost, setShippingCost } = useCart();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [settings, setSettings] = useState<any>({
    telegramBotToken: '8626077447:AAHc3yyuRk6zuBmluxiNgiSlUOQeX0gDlQg',
    telegramChatId: '5127291974',
    shippingType: 'free',
    shippingCost: 0
  });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    governorate: '',
    zipCode: ''
  });

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(db, 'settings', 'main');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSettings(data);
        if (data.shippingType === 'paid') {
          setShippingCost(data.shippingCost);
        } else {
          setShippingCost(0);
        }
      }
    };
    fetchSettings();
  }, [setShippingCost]);

  const sendTelegramNotification = async (orderId: string, orderData: any) => {
    if (!settings?.telegramBotToken || !settings?.telegramChatId) return;

    const message = `
🆕 طلب جديد!
📦 رقم الطلب: #${orderId.slice(-6).toUpperCase()}
👤 العميل: ${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}
📞 الهاتف: ${orderData.customerInfo.phone}
📍 العنوان: ${orderData.customerInfo.governorate} - ${orderData.customerInfo.address}
💰 الإجمالي: ${orderData.totalAmount} ج.م
💳 طريقة الدفع: ${orderData.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 'بطاقة ائتمان'}

المنتجات:
${orderData.items.map((item: any) => `- ${item.name} (${item.size}/${item.color}) x${item.quantity}`).join('\n')}
    `;

    try {
      await fetch(`https://api.telegram.org/bot${settings.telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: settings.telegramChatId,
          text: message,
        }),
      });
    } catch (error) {
      console.error("Telegram notification error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      setNotification({ type: 'error', message: 'يرجى تسجيل الدخول أولاً لإتمام الطلب' });
      return;
    }

    setIsLoading(true);
    try {
      const orderData = {
        userId: auth.currentUser.uid,
        customerInfo: formData,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          color: item.selectedColor || 'N/A',
          size: item.selectedSize,
          image: item.images[0]
        })),
        totalAmount: totalPrice + shippingCost,
        shippingCost,
        paymentMethod,
        status: 'pending',
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      await sendTelegramNotification(docRef.id, orderData);
      
      setIsSuccess(true);
      clearCart();
    } catch (error) {
      console.error("Error saving order:", error);
      setNotification({ type: 'error', message: 'حدث خطأ أثناء إتمام الطلب. يرجى المحاولة مرة أخرى.' });
    } finally {
      setIsLoading(false);
    }
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
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-2xl backdrop-blur-xl border ${
              notification.type === 'success' ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-red-500/10 border-red-500/20 text-red-500"
            }`}
          >
            <CheckCircle2 size={20} />
            <span className="font-bold">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

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
                <input 
                  required 
                  placeholder="الاسم الأول" 
                  value={formData.firstName}
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
                  className="bg-zinc-900 border border-gold/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold" 
                />
                <input 
                  required 
                  placeholder="اسم العائلة" 
                  value={formData.lastName}
                  onChange={e => setFormData({...formData, lastName: e.target.value})}
                  className="bg-zinc-900 border border-gold/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold" 
                />
                <input 
                  required 
                  placeholder="رقم الهاتف" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="bg-zinc-900 border border-gold/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold sm:col-span-2" 
                />
                <input 
                  required 
                  placeholder="العنوان بالتفصيل" 
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="bg-zinc-900 border border-gold/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold sm:col-span-2" 
                />
                <select 
                  required
                  value={formData.governorate}
                  onChange={e => setFormData({...formData, governorate: e.target.value})}
                  className="bg-zinc-900 border border-gold/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold"
                >
                  <option value="">اختر المحافظة</option>
                  <option>القاهرة</option>
                  <option>الجيزة</option>
                  <option>الإسكندرية</option>
                  <option>الدقهلية</option>
                  <option>الشرقية</option>
                  <option>المنوفية</option>
                  <option>القليوبية</option>
                  <option>الغربية</option>
                  <option>البحيرة</option>
                  <option>دمياط</option>
                  <option>بورسعيد</option>
                  <option>الإسماعيلية</option>
                  <option>السويس</option>
                  <option>كفر الشيخ</option>
                  <option>الفيوم</option>
                  <option>بني سويف</option>
                  <option>المنيا</option>
                  <option>أسيوط</option>
                  <option>سوهاج</option>
                  <option>قنا</option>
                  <option>الأقصر</option>
                  <option>أسوان</option>
                  <option>البحر الأحمر</option>
                  <option>الوادي الجديد</option>
                  <option>مطروح</option>
                  <option>شمال سيناء</option>
                  <option>جنوب سيناء</option>
                </select>
                <input 
                  placeholder="الرمز البريدي (اختياري)" 
                  value={formData.zipCode}
                  onChange={e => setFormData({...formData, zipCode: e.target.value})}
                  className="bg-zinc-900 border border-gold/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold" 
                />
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
                  {shippingCost === 0 ? (
                    <span className="text-green-500 font-bold">مجاني</span>
                  ) : (
                    <span>{shippingCost} ج.م</span>
                  )}
                </div>
                <hr className="border-gold/10 my-4" />
                <div className="flex justify-between text-white text-2xl font-black">
                  <span>الإجمالي</span>
                  <span className="text-gold">{totalPrice + shippingCost} ج.م</span>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading || cart.length === 0}
                className="w-full gold-gradient text-black font-black py-5 rounded-2xl text-xl hover:scale-[1.02] transition-transform mb-6 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : 'تأكيد الطلب'}
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
