import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../CartContext';
import { ShieldCheck, CreditCard, Truck, CheckCircle2, Loader2, Upload, AlertCircle, X, Camera, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { cn } from '../lib/utils';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
};

export default function Checkout() {
  const { cart, totalPrice, clearCart, shippingCost, setShippingCost } = useCart();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmingDeposit, setIsConfirmingDeposit] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositScreenshot, setDepositScreenshot] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isCopied, setIsCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleCopyNumber = () => {
    navigator.clipboard.writeText('01044002840');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const base64ToBlob = (base64: string) => {
    const byteString = atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const compressed = await compressImage(files[0]);
      setDepositScreenshot(compressed);
    } catch (error) {
      console.error("Error processing image:", error);
      setNotification({ type: 'error', message: 'حدث خطأ أثناء معالجة الصورة' });
    }
  };

  const sendTelegramNotification = async (orderId: string, orderData: any) => {
    if (!settings?.telegramBotToken || !settings?.telegramChatId) return;

    const message = `
🆕 طلب جديد (بانتظار تأكيد العربون)!
📦 رقم الطلب: #${orderId.slice(-6).toUpperCase()}
👤 العميل: ${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}
📞 الهاتف: ${orderData.customerInfo.phone}
📍 العنوان: ${orderData.customerInfo.governorate} - ${orderData.customerInfo.address}
💰 الإجمالي: ${orderData.totalAmount} ج.م
💳 طريقة الدفع: ${orderData.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 'دفع أونلاين'}
⚠️ العربون: تم دفع 100 ج.م (بانتظار مراجعة الصورة)

المنتجات:
${orderData.items.map((item: any) => `- ${item.name} (${item.size}/${item.color}) x${item.quantity}`).join('\n')}
    `;

    try {
      if (orderData.depositScreenshot) {
        const formData = new FormData();
        formData.append('chat_id', settings.telegramChatId);
        formData.append('caption', message);
        formData.append('photo', base64ToBlob(orderData.depositScreenshot), 'deposit.jpg');

        await fetch(`https://api.telegram.org/bot${settings.telegramBotToken}/sendPhoto`, {
          method: 'POST',
          body: formData,
        });
      } else {
        await fetch(`https://api.telegram.org/bot${settings.telegramBotToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: settings.telegramChatId,
            text: message,
          }),
        });
      }
    } catch (error) {
      console.error("Telegram notification error:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDepositModal(true);
  };

  const handleConfirmOrder = async () => {
    if (!depositScreenshot) {
      setNotification({ type: 'error', message: 'يرجى رفع صورة التحويل أولاً' });
      return;
    }

    setIsConfirmingDeposit(true);
    try {
      const orderData = {
        userId: auth.currentUser?.uid || 'guest',
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
        depositAmount: 100,
        depositScreenshot,
        status: 'pending_deposit',
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      await sendTelegramNotification(docRef.id, orderData);
      
      setIsSuccess(true);
      clearCart();
      setShowDepositModal(false);
    } catch (error) {
      if (error instanceof Error && error.message.includes('permission')) {
        handleFirestoreError(error, OperationType.CREATE, 'orders');
      }
      console.error("Error saving order:", error);
      setNotification({ type: 'error', message: 'حدث خطأ أثناء إتمام الطلب. يرجى المحاولة مرة أخرى.' });
    } finally {
      setIsConfirmingDeposit(false);
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
    <div className="bg-black min-h-screen pt-24 md:pt-32 pb-20 px-6">
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

        {!auth.currentUser && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-6 bg-gold/10 border border-gold/20 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold">هل لديك حساب؟</h4>
                <p className="text-gray-500 text-sm">سجل دخولك لمتابعة حالة طلبك وحفظ بياناتك للطلبات القادمة.</p>
              </div>
            </div>
            <Link 
              to="/profile" 
              className="px-8 py-3 bg-gold text-black font-black rounded-xl hover:scale-105 transition-transform whitespace-nowrap"
            >
              تسجيل الدخول
            </Link>
          </motion.div>
        )}

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
                  <span className={paymentMethod === 'card' ? 'text-white font-bold' : 'text-gray-500'}>دفع أونلاين</span>
                </button>
              </div>
            </section>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-950 border border-gold/20 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 sticky lg:top-32">
              <h3 className="text-xl md:text-2xl font-black text-white mb-6 md:mb-8">ملخص الطلب</h3>
              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
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
                <div className="pt-4 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-500">مطلوب الآن (عربون)</span>
                    <span className="text-gold">100 ج.م</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-500">الباقي عند الاستلام</span>
                    <span className="text-white">{totalPrice + shippingCost - 100} ج.م</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gold/5 border border-gold/10 rounded-2xl mb-6">
                <div className="flex items-center gap-2 text-gold font-bold text-xs mb-1">
                  <AlertCircle size={14} />
                  مطلوب عربون 100 ج.م
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  لتأكيد طلبك، يجب دفع عربون 100 ج.م قبل الشحن. سيتم خصم هذا المبلغ من إجمالي الطلب عند الاستلام.
                </p>
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

      {/* Deposit Modal */}
      <AnimatePresence>
        {showDepositModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDepositModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-zinc-950 border border-gold/30 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 overflow-y-auto max-h-[90vh] scrollbar-hide"
            >
              <button 
                onClick={() => setShowDepositModal(false)}
                className="absolute top-6 left-6 text-gray-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CreditCard size={40} className="text-gold" />
                </div>
                <h2 className="text-3xl font-black text-white mb-4">تأكيد العربون</h2>
                <p className="text-gray-500 mb-2">لتأكيد طلبك، يرجى تحويل <span className="text-gold font-bold">100 ج.م</span> كعربون جدية تعاقد.</p>
                <p className="text-[10px] text-gold font-black uppercase tracking-widest">سيتم دفع المبلغ المتبقي ({totalPrice + shippingCost - 100} ج.م) عند الاستلام</p>
              </div>

              <div className="space-y-8">
                <div className="bg-white/5 border border-white/5 rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest">فودافون كاش</span>
                    <div className="flex items-center gap-3">
                      <span className="text-gold font-black text-lg">01044002840</span>
                      <button 
                        onClick={handleCopyNumber}
                        className="p-2 bg-gold/10 rounded-xl text-gold hover:bg-gold hover:text-black transition-all"
                        title="نسخ الرقم"
                      >
                        {isCopied ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-gold text-black flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">1</div>
                      <p className="text-sm text-gray-400">قم بتحويل مبلغ 100 ج.م للرقم الموضح أعلاه.</p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-gold text-black flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">2</div>
                      <p className="text-sm text-gray-400">قم بأخذ لقطة شاشة (Screenshot) لعملية التحويل الناجحة.</p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-gold text-black flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">3</div>
                      <p className="text-sm text-gray-400">ارفع الصورة هنا واضغط على تأكيد الدفع.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  {depositScreenshot ? (
                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-gold/30">
                      <img src={depositScreenshot} className="w-full h-full object-cover" alt="Deposit proof" />
                      <button 
                        onClick={() => setDepositScreenshot(null)}
                        className="absolute top-2 right-2 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full aspect-video border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-gold/30 hover:bg-gold/5 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-gold transition-colors">
                        <Camera size={24} />
                      </div>
                      <span className="text-sm font-bold text-gray-500 group-hover:text-white transition-colors">ارفع صورة التحويل</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  <button 
                    onClick={handleConfirmOrder}
                    disabled={isConfirmingDeposit || !depositScreenshot}
                    className="w-full gold-gradient text-black font-black py-5 rounded-2xl text-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-gold/20 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isConfirmingDeposit ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={20} />}
                    تأكيد الدفع وإتمام الطلب
                  </button>
                  <p className="text-[10px] text-center text-gray-600 font-bold uppercase tracking-widest">
                    لن يتم شحن أي طلب بدون دفع العربون
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
