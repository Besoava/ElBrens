import React, { useState, useEffect, useRef } from 'react';
import { User, Package, MapPin, LogOut, Settings, Plus, Image as ImageIcon, X, Trash2, Save, Edit2, Loader2, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Truck, Bell, ExternalLink, ChevronRight, ChevronLeft, RotateCcw } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { collection, addDoc, query, onSnapshot, deleteDoc, doc, updateDoc, serverTimestamp, getDoc, setDoc, orderBy } from 'firebase/firestore';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL', '28', '30', '32', '34', '36', '38', '40', '42', '44', '46'];
const AVAILABLE_COLORS = [
  { name: 'أسود', hex: '#000000' },
  { name: 'أبيض', hex: '#FFFFFF' },
  { name: 'أحمر', hex: '#FF0000' },
  { name: 'أزرق', hex: '#0000FF' },
  { name: 'أخضر', hex: '#008000' },
  { name: 'رمادي', hex: '#808080' },
  { name: 'كحلي', hex: '#000080' },
  { name: 'بيج', hex: '#F5F5DC' },
  { name: 'بني', hex: '#A52A2A' },
  { name: 'زيتي', hex: '#556B2F' }
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'admin'>('profile');
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [settings, setSettings] = useState({
    shippingType: 'free',
    shippingCost: 0,
    telegramBotToken: '8626077447:AAHc3yyuRk6zuBmluxiNgiSlUOQeX0gDlQg',
    telegramChatId: '5127291974'
  });
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isColorsOpen, setIsColorsOpen] = useState(false);
  const [isSizesOpen, setIsSizesOpen] = useState(false);
  const [availableSizes, setAvailableSizes] = useState(AVAILABLE_SIZES);
  const [availableColors, setAvailableColors] = useState(AVAILABLE_COLORS);
  
  // Image Preview & Adjustment State
  const [previewImage, setPreviewImage] = useState<{ url: string, index: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Delete Confirmation State
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  
  // UI States for adding custom items
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showColorInput, setShowColorInput] = useState(false);
  const [tempColor, setTempColor] = useState({ name: '', hex: '# gold' });
  const [showSizeInput, setShowSizeInput] = useState(false);
  const [tempSize, setTempSize] = useState('');
  
  const INITIAL_PRODUCT = {
    name: '',
    price: '',
    category: 'men',
    description: '',
    images: [] as string[],
    colors: [] as string[],
    sizes: [] as string[],
    isLimited: false,
    isBestSeller: false
  };

  // New Product Form State
  const [newProduct, setNewProduct] = useState(INITIAL_PRODUCT);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u && u.email?.toLowerCase() === 'besomuslim@gmail.com') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      const q = query(collection(db, 'products'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(prods);
      });

      const ordersQ = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const unsubscribeOrders = onSnapshot(ordersQ, (snapshot) => {
        const ords = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(ords);
      });

      const settingsRef = doc(db, 'settings', 'main');
      const unsubscribeSettings = onSnapshot(settingsRef, (docSnap) => {
        if (docSnap.exists()) {
          setSettings(docSnap.data() as any);
        }
      });

      return () => {
        unsubscribe();
        unsubscribeOrders();
        unsubscribeSettings();
      };
    } else if (user) {
      const userOrdersQ = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const unsubscribeUserOrders = onSnapshot(userOrdersQ, (snapshot) => {
        const ords = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter((o: any) => o.userId === user.uid);
        setUserOrders(ords);
      });
      return () => unsubscribeUserOrders();
    }
  }, [isAdmin, user]);

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await setDoc(doc(db, 'settings', 'main'), settings);
      setNotification({ type: 'success', message: 'تم حفظ الإعدادات بنجاح' });
    } catch (error) {
      console.error("Error saving settings:", error);
      setNotification({ type: 'error', message: 'حدث خطأ أثناء حفظ الإعدادات' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      setNotification({ type: 'success', message: 'تم تحديث حالة الطلب' });
    } catch (error) {
      console.error("Error updating order status:", error);
      setNotification({ type: 'error', message: 'حدث خطأ أثناء تحديث الحالة' });
    }
  };

  useEffect(() => {
    if (!isAdmin && activeTab === 'admin') {
      setActiveTab('profile');
    }
  }, [isAdmin, activeTab]);

  const toggleSize = (size: string) => {
    setNewProduct(prev => {
      const sizes = prev.sizes.includes(size) 
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes };
    });
  };

  const toggleColor = (colorName: string) => {
    setNewProduct(prev => {
      const colors = prev.colors.includes(colorName)
        ? prev.colors.filter(c => c !== colorName)
        : [...prev.colors, colorName];
      return { ...prev, colors };
    });
  };

  const addCustomSize = () => {
    if (tempSize && !availableSizes.includes(tempSize)) {
      setAvailableSizes(prev => [...prev, tempSize]);
      toggleSize(tempSize);
      setTempSize('');
      setShowSizeInput(false);
    }
  };

  const addCustomColor = () => {
    if (tempColor.name) {
      if (!availableColors.find(c => c.name === tempColor.name)) {
        setAvailableColors(prev => [...prev, { name: tempColor.name, hex: tempColor.hex }]);
        toggleColor(tempColor.name);
        setTempColor({ name: '', hex: '# gold' });
        setShowColorInput(false);
      }
    }
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

    setIsLoading(true);
    try {
      const newImages = await Promise.all(
        Array.from(files).map((file: File) => compressImage(file))
      );
      setNewProduct(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    } catch (error) {
      console.error("Error processing images:", error);
      setNotification({ type: 'error', message: 'حدث خطأ أثناء معالجة الصور' });
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCropSave = () => {
    if (!previewImage) return;
    
    const img = new Image();
    img.src = previewImage.url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Target aspect ratio 4:5
      const targetWidth = 800;
      const targetHeight = 1000;
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Calculate source rectangle based on zoom and position
      // This is a simplified version of cropping
      const scale = Math.min(img.width / targetWidth, img.height / targetHeight) / zoom;
      const sw = targetWidth * scale;
      const sh = targetHeight * scale;
      const sx = (img.width - sw) / 2 - (position.x * sw / 100);
      const sy = (img.height - sh) / 2 - (position.y * sh / 100);

      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);
      
      const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
      
      const updatedImages = [...newProduct.images];
      updatedImages[previewImage.index] = croppedImageUrl;
      setNewProduct(prev => ({ ...prev, images: updatedImages }));
      setPreviewImage(null);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
      setNotification({ type: 'success', message: 'تم تعديل الصورة بنجاح' });
    };
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const productData = {
        ...newProduct,
        price: Number(newProduct.price),
        images: newProduct.images.filter(img => img.trim() !== ''),
        colors: newProduct.colors.filter(c => c.trim() !== ''),
        sizes: newProduct.sizes.filter(s => s.trim() !== ''),
        updatedAt: serverTimestamp()
      };

      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), productData);
        setNotification({ type: 'success', message: 'تم تحديث المنتج بنجاح' });
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: serverTimestamp()
        });
        setNotification({ type: 'success', message: 'تم إضافة المنتج بنجاح' });
      }

      setIsAdding(false);
      setEditingId(null);
      setNewProduct(INITIAL_PRODUCT);
    } catch (error) {
      console.error("Error saving product:", error);
      setNotification({ type: 'error', message: 'حدث خطأ أثناء حفظ المنتج' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setNewProduct({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description,
      images: product.images || [],
      colors: product.colors || [],
      sizes: product.sizes || [],
      isLimited: product.isLimited || false,
      isBestSeller: product.isBestSeller || false
    });
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, 'products', productToDelete));
      setNotification({ type: 'success', message: 'تم حذف المنتج بنجاح' });
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      setNotification({ type: 'error', message: 'حدث خطأ أثناء حذف المنتج' });
    } finally {
      setIsLoading(false);
    }
  };

  const addField = (field: 'images' | 'colors' | 'sizes') => {
    setNewProduct(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const updateField = (field: 'images' | 'colors' | 'sizes', index: number, value: string) => {
    const updated = [...newProduct[field]];
    updated[index] = value;
    setNewProduct(prev => ({ ...prev, [field]: updated }));
  };

  const removeField = (field: 'images' | 'colors' | 'sizes', index: number) => {
    setNewProduct(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  if (!user) {
    return (
      <div className="bg-black min-h-screen pt-32 pb-20 px-6 flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-8 bg-zinc-950 border border-gold/10 p-12 rounded-[3rem]">
          <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <User size={40} className="text-gold" />
          </div>
          <h2 className="text-3xl font-black text-white">تسجيل الدخول</h2>
          <p className="text-gray-500">سجل دخولك لمتابعة طلباتك وإدارة حسابك في البرنس</p>
          <button 
            onClick={handleLogin}
            className="w-full py-4 bg-gold text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="" />
            الدخول بواسطة جوجل
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div className="w-32 h-32 rounded-full bg-gold flex items-center justify-center text-black font-black text-4xl">
            {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || 'B'}
          </div>
          <div className="text-center md:text-right">
            <h1 className="text-4xl font-black text-white mb-2">أهلاً بك، {user?.displayName || 'البرنس'}</h1>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <button 
              onClick={() => setActiveTab('profile')}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all",
                activeTab === 'profile' ? "bg-gold text-black" : "bg-zinc-900 text-white hover:bg-zinc-800"
              )}
            >
              <User size={20} /> الملف الشخصي
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all",
                activeTab === 'orders' ? "bg-gold text-black" : "bg-zinc-900 text-white hover:bg-zinc-800"
              )}
            >
              <Package size={20} /> {isAdmin ? 'إدارة الطلبات' : 'طلباتي'}
            </button>
            {isAdmin && (
              <>
                <button 
                  onClick={() => setActiveTab('admin')}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all",
                    activeTab === 'admin' ? "bg-gold text-black" : "bg-zinc-900 text-white hover:bg-zinc-800"
                  )}
                >
                  <Plus size={20} /> إدارة المنتجات
                </button>
                <button 
                  onClick={() => setActiveTab('settings' as any)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all",
                    (activeTab as string) === 'settings' ? "bg-gold text-black" : "bg-zinc-900 text-white hover:bg-zinc-800"
                  )}
                >
                  <Settings size={20} /> إعدادات المتجر
                </button>
              </>
            )}
            <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-zinc-900 text-white hover:bg-zinc-800 transition-colors">
              <MapPin size={20} /> عناويني
            </button>
            <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-zinc-900 text-white hover:bg-zinc-800 transition-colors">
              <Settings size={20} /> الإعدادات
            </button>
            <hr className="border-gold/10" />
            <button 
              onClick={() => auth.signOut()}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-red-900/20 text-red-500 hover:bg-red-900/40 transition-colors"
            >
              <LogOut size={20} /> تسجيل الخروج
            </button>
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-zinc-950 border border-gold/10 rounded-[2.5rem] p-8">
                <h3 className="text-xl font-bold text-white mb-8">معلومات الحساب</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-500 text-sm mb-2">الاسم بالكامل</label>
                    <div className="p-4 bg-zinc-900 rounded-xl text-white">{user?.displayName || 'البرنس'}</div>
                  </div>
                  <div>
                    <label className="block text-gray-500 text-sm mb-2">البريد الإلكتروني</label>
                    <div className="p-4 bg-zinc-900 rounded-xl text-white">{user?.email}</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="bg-zinc-950 border border-gold/10 rounded-[2.5rem] p-8">
                  <h3 className="text-xl font-bold text-white mb-8">{isAdmin ? 'إدارة جميع الطلبات' : 'طلباتي الأخيرة'}</h3>
                  
                  <div className="space-y-4">
                    {(isAdmin ? orders : userOrders).length === 0 ? (
                      <div className="text-center py-12">
                        <Package size={48} className="text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-500">لا يوجد طلبات حتى الآن.</p>
                      </div>
                    ) : (
                      (isAdmin ? orders : userOrders).map((order: any) => (
                        <div key={order.id} className="bg-zinc-900/50 border border-gold/5 rounded-3xl p-6 hover:border-gold/20 transition-all">
                          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <span className="text-gold font-black">طلب #{order.id.slice(-6).toUpperCase()}</span>
                                <span className={cn(
                                  "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                                  order.status === 'pending' ? "bg-yellow-500/10 text-yellow-500" :
                                  order.status === 'processing' ? "bg-blue-500/10 text-blue-500" :
                                  order.status === 'shipped' ? "bg-purple-500/10 text-purple-500" :
                                  order.status === 'delivered' ? "bg-green-500/10 text-green-500" :
                                  "bg-red-500/10 text-red-500"
                                )}>
                                  {order.status === 'pending' ? 'قيد الانتظار' :
                                   order.status === 'processing' ? 'جاري التجهيز' :
                                   order.status === 'shipped' ? 'تم الشحن' :
                                   order.status === 'delivered' ? 'تم التوصيل' : 'ملغي'}
                                </span>
                              </div>
                              <p className="text-gray-500 text-xs">
                                {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('ar-EG') : 'تاريخ غير معروف'}
                              </p>
                            </div>
                            <div className="text-left">
                              <p className="text-white font-black text-xl">{order.totalAmount} ج.م</p>
                              {isAdmin && <p className="text-gold text-xs">{order.customerInfo.firstName} {order.customerInfo.lastName}</p>}
                            </div>
                          </div>

                          <div className="space-y-3 mb-6">
                            {order.items.map((item: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-4 text-sm">
                                <img src={item.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                                <div className="flex-1">
                                  <p className="text-white font-bold">{item.name} <span className="text-gray-500 text-xs">x{item.quantity}</span></p>
                                  <p className="text-gray-500 text-xs">{item.color} / {item.size}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {isAdmin && (
                            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gold/5">
                              <select 
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                className="bg-zinc-800 border border-gold/10 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-gold"
                              >
                                <option value="pending">قيد الانتظار</option>
                                <option value="processing">جاري التجهيز</option>
                                <option value="shipped">تم الشحن</option>
                                <option value="delivered">تم التوصيل</option>
                                <option value="cancelled">ملغي</option>
                              </select>
                              <a 
                                href={`https://wa.me/${order.customerInfo.phone}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-green-600/10 text-green-500 rounded-xl text-xs font-bold hover:bg-green-600/20 transition-all"
                              >
                                <ExternalLink size={14} /> واتساب
                              </a>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {(activeTab as string) === 'settings' && isAdmin && (
              <div className="space-y-8">
                <div className="bg-zinc-950 border border-gold/10 rounded-[2.5rem] p-8">
                  <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                    <Settings className="text-gold" /> إعدادات المتجر
                  </h3>
                  
                  <form onSubmit={handleUpdateSettings} className="space-y-8">
                    <section className="space-y-6">
                      <h4 className="text-white font-bold flex items-center gap-2">
                        <Truck size={18} className="text-gold" /> إعدادات الشحن
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-400 text-sm mb-2">نوع الشحن</label>
                          <select 
                            value={settings.shippingType}
                            onChange={(e) => setSettings({...settings, shippingType: e.target.value})}
                            className="w-full bg-zinc-900 border border-gold/10 rounded-xl p-3 text-white focus:border-gold outline-none transition-colors"
                          >
                            <option value="free">شحن مجاني</option>
                            <option value="paid">شحن مدفوع</option>
                          </select>
                        </div>
                        {settings.shippingType === 'paid' && (
                          <div>
                            <label className="block text-gray-400 text-sm mb-2">تكلفة الشحن (ج.م)</label>
                            <input 
                              type="number"
                              value={settings.shippingCost}
                              onChange={(e) => setSettings({...settings, shippingCost: Number(e.target.value)})}
                              className="w-full bg-zinc-900 border border-gold/10 rounded-xl p-3 text-white focus:border-gold outline-none transition-colors"
                            />
                          </div>
                        )}
                      </div>
                    </section>

                    <section className="space-y-6">
                      <h4 className="text-white font-bold flex items-center gap-2">
                        <Bell size={18} className="text-gold" /> إشعارات الطلبات (Telegram)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-400 text-sm mb-2">Bot Token</label>
                          <input 
                            type="password"
                            value={settings.telegramBotToken}
                            onChange={(e) => setSettings({...settings, telegramBotToken: e.target.value})}
                            placeholder="Bot Token من BotFather"
                            className="w-full bg-zinc-900 border border-gold/10 rounded-xl p-3 text-white focus:border-gold outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-sm mb-2">Chat ID</label>
                          <input 
                            value={settings.telegramChatId}
                            onChange={(e) => setSettings({...settings, telegramChatId: e.target.value})}
                            placeholder="Chat ID الخاص بك"
                            className="w-full bg-zinc-900 border border-gold/10 rounded-xl p-3 text-white focus:border-gold outline-none transition-colors"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        سيتم إرسال إشعار فوري لك عبر تيليجرام عند قيام أي عميل بإتمام طلب جديد.
                      </p>
                    </section>

                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gold text-black font-black py-4 rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                      {isLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                      حفظ جميع الإعدادات
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'admin' && isAdmin && (
              <div className="space-y-8">
                <AnimatePresence>
                  {notification && (
                    <motion.div 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={cn(
                        "fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-2xl backdrop-blur-xl border",
                        notification.type === 'success' ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-red-500/10 border-red-500/20 text-red-500"
                      )}
                    >
                      {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                      <span className="font-bold">{notification.message}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="bg-zinc-950 border border-gold/10 rounded-[2.5rem] p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold text-white">إدارة المنتجات</h3>
                    <button 
                      onClick={() => {
                        setIsAdding(!isAdding);
                        if (editingId) {
                          setEditingId(null);
                          setNewProduct(INITIAL_PRODUCT);
                        }
                      }}
                      className="flex items-center gap-2 px-6 py-2 bg-gold text-black font-bold rounded-full hover:scale-105 transition-transform"
                    >
                      {isAdding ? <X size={18} /> : <Plus size={18} />}
                      {isAdding ? 'إلغاء' : 'إضافة منتج'}
                    </button>
                  </div>

                  <AnimatePresence>
                    {isAdding && (
                      <motion.form 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleAddProduct} 
                        className="space-y-6 bg-zinc-900/50 p-6 rounded-3xl border border-gold/5 mb-8 overflow-hidden"
                      >
                        <h4 className="text-gold font-bold mb-4">{editingId ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-gray-400 text-sm mb-2">اسم المنتج</label>
                            <input 
                              required
                              value={newProduct.name}
                              onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                              className="w-full bg-zinc-900 border border-gold/10 rounded-xl p-3 text-white focus:border-gold outline-none transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-400 text-sm mb-2">السعر (ج.م)</label>
                            <input 
                              required
                              type="number"
                              value={newProduct.price}
                              onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                              className="w-full bg-zinc-900 border border-gold/10 rounded-xl p-3 text-white focus:border-gold outline-none transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-gray-400 text-sm mb-2">الوصف</label>
                          <textarea 
                            required
                            value={newProduct.description}
                            onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                            className="w-full bg-zinc-900 border border-gold/10 rounded-xl p-3 text-white focus:border-gold outline-none h-32 transition-colors"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-gray-400 text-sm mb-2">التصنيف</label>
                            <select 
                              value={newProduct.category}
                              onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                              className="w-full bg-zinc-900 border border-gold/10 rounded-xl p-3 text-white focus:border-gold outline-none transition-colors"
                            >
                              <option value="men">رجالي</option>
                              <option value="women">حريمي</option>
                              <option value="new">وصل حديثاً</option>
                              <option value="sale">تخفيضات</option>
                            </select>
                          </div>
                          <div className="flex items-center gap-8 pt-8">
                            <label className="flex items-center gap-2 text-white cursor-pointer group">
                              <input 
                                type="checkbox" 
                                checked={newProduct.isLimited}
                                onChange={e => setNewProduct({...newProduct, isLimited: e.target.checked})}
                                className="accent-gold w-4 h-4"
                              />
                              <span className="group-hover:text-gold transition-colors">إصدار محدود</span>
                            </label>
                            <label className="flex items-center gap-2 text-white cursor-pointer group">
                              <input 
                                type="checkbox" 
                                checked={newProduct.isBestSeller}
                                onChange={e => setNewProduct({...newProduct, isBestSeller: e.target.checked})}
                                className="accent-gold w-4 h-4"
                              />
                              <span className="group-hover:text-gold transition-colors">الأكثر مبيعاً</span>
                            </label>
                          </div>
                        </div>

                        {/* Dynamic Fields: Images, Colors, Sizes */}
                        <div className="space-y-6">
                          <div>
                            <label className="block text-gray-400 text-sm mb-4">صور المنتج</label>
                            <input 
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileSelect}
                              multiple
                              accept="image/*"
                              className="hidden"
                            />
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <AnimatePresence>
                                {newProduct.images.map((img, i) => (
                                  <motion.div 
                                    key={i}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-gold/20 group cursor-pointer"
                                    onClick={() => setPreviewImage({ url: img, index: i })}
                                  >
                                    <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <Edit2 size={20} className="text-white" />
                                    </div>
                                    <button 
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeField('images', i);
                                      }}
                                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                    >
                                      <X size={14} />
                                    </button>
                                  </motion.div>
                                ))}
                              </AnimatePresence>
                              
                              <button 
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="aspect-[3/4] rounded-2xl border-2 border-dashed border-gold/20 flex flex-col items-center justify-center gap-2 text-gold hover:bg-gold/5 transition-colors"
                              >
                                <Plus size={24} />
                                <span className="text-xs font-bold">إضافة صورة</span>
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <button 
                                type="button"
                                onClick={() => setIsColorsOpen(!isColorsOpen)}
                                className="w-full flex items-center justify-between p-4 bg-zinc-900 border border-gold/10 rounded-2xl text-white hover:border-gold/30 transition-all"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-gold" />
                                  <span className="font-bold">الألوان المتاحة ({newProduct.colors.length})</span>
                                </div>
                                {isColorsOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                              </button>
                              
                              <AnimatePresence>
                                {isColorsOpen && (
                                  <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="p-4 bg-zinc-900/50 border border-gold/5 rounded-2xl space-y-4">
                                      <div className="flex flex-wrap gap-2">
                                        {availableColors.map(color => (
                                          <button
                                            key={color.name}
                                            type="button"
                                            onClick={() => toggleColor(color.name)}
                                            className={cn(
                                              "px-4 py-2 rounded-xl border transition-all flex items-center gap-2",
                                              newProduct.colors.includes(color.name)
                                                ? "border-gold bg-gold/10 text-gold"
                                                : "border-white/5 bg-zinc-900 text-gray-400 hover:border-white/20"
                                            )}
                                          >
                                            <div 
                                              className="w-3 h-3 rounded-full border border-white/10" 
                                              style={{ backgroundColor: color.hex }} 
                                            />
                                            {color.name}
                                          </button>
                                        ))}
                                        
                                        {!showColorInput ? (
                                          <button
                                            type="button"
                                            onClick={() => setShowColorInput(true)}
                                            className="px-4 py-2 rounded-xl border border-dashed border-gold/30 text-gold hover:bg-gold/5 transition-all flex items-center gap-2"
                                          >
                                            <Plus size={16} />
                                            لون مخصص
                                          </button>
                                        ) : (
                                          <motion.div 
                                            initial={{ width: 0, opacity: 0 }}
                                            animate={{ width: 'auto', opacity: 1 }}
                                            className="flex items-center gap-2 bg-zinc-800 p-2 rounded-xl border border-gold/30"
                                          >
                                            <input 
                                              type="color"
                                              value={tempColor.hex}
                                              onChange={e => setTempColor({...tempColor, hex: e.target.value})}
                                              className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer"
                                            />
                                            <input 
                                              placeholder="اسم اللون..."
                                              value={tempColor.name}
                                              onChange={e => setTempColor({...tempColor, name: e.target.value})}
                                              className="bg-black border border-white/10 rounded-lg px-2 py-1 text-xs text-white outline-none w-24"
                                            />
                                            <button 
                                              type="button"
                                              onClick={addCustomColor}
                                              className="p-1.5 bg-gold text-black rounded-lg"
                                            >
                                              <Save size={14} />
                                            </button>
                                            <button 
                                              type="button"
                                              onClick={() => setShowColorInput(false)}
                                              className="p-1.5 bg-zinc-700 text-white rounded-lg"
                                            >
                                              <X size={14} />
                                            </button>
                                          </motion.div>
                                        )}
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            <div className="space-y-4">
                              <button 
                                type="button"
                                onClick={() => setIsSizesOpen(!isSizesOpen)}
                                className="w-full flex items-center justify-between p-4 bg-zinc-900 border border-gold/10 rounded-2xl text-white hover:border-gold/30 transition-all"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-gold" />
                                  <span className="font-bold">المقاسات المتاحة ({newProduct.sizes.length})</span>
                                </div>
                                {isSizesOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                              </button>

                              <AnimatePresence>
                                {isSizesOpen && (
                                  <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="p-4 bg-zinc-900/50 border border-gold/5 rounded-2xl space-y-4">
                                      <div className="flex flex-wrap gap-2">
                                        {availableSizes.map(size => (
                                          <button
                                            key={size}
                                            type="button"
                                            onClick={() => toggleSize(size)}
                                            className={cn(
                                              "w-12 h-12 rounded-xl border transition-all flex items-center justify-center font-bold",
                                              newProduct.sizes.includes(size)
                                                ? "border-gold bg-gold/10 text-gold"
                                                : "border-white/5 bg-zinc-900 text-gray-400 hover:border-white/20"
                                            )}
                                          >
                                            {size}
                                          </button>
                                        ))}
                                        
                                        {!showSizeInput ? (
                                          <button
                                            type="button"
                                            onClick={() => setShowSizeInput(true)}
                                            className="w-12 h-12 rounded-xl border border-dashed border-gold/30 text-gold hover:bg-gold/5 transition-all flex items-center justify-center"
                                            title="إضافة مقاس"
                                          >
                                            <Plus size={20} />
                                          </button>
                                        ) : (
                                          <motion.div 
                                            initial={{ width: 0, opacity: 0 }}
                                            animate={{ width: 'auto', opacity: 1 }}
                                            className="flex items-center gap-2 bg-zinc-800 p-2 rounded-xl border border-gold/30"
                                          >
                                            <input 
                                              placeholder="المقاس..."
                                              value={tempSize}
                                              onChange={e => setTempSize(e.target.value)}
                                              className="bg-black border border-white/10 rounded-lg px-2 py-1 text-xs text-white outline-none w-16 text-center"
                                            />
                                            <button 
                                              type="button"
                                              onClick={addCustomSize}
                                              className="p-1.5 bg-gold text-black rounded-lg"
                                            >
                                              <Save size={14} />
                                            </button>
                                            <button 
                                              type="button"
                                              onClick={() => setShowSizeInput(false)}
                                              className="p-1.5 bg-zinc-700 text-white rounded-lg"
                                            >
                                              <X size={14} />
                                            </button>
                                          </motion.div>
                                        )}
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>

                        <button 
                          type="submit" 
                          disabled={isLoading}
                          className="w-full bg-gold text-black font-black py-4 rounded-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                        >
                          {isLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                          {editingId ? 'تحديث المنتج' : 'حفظ المنتج ونشره'}
                        </button>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-1 gap-4">
                    <AnimatePresence mode="popLayout">
                      {products.map(product => (
                        <motion.div 
                          key={product.id}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-center gap-4 p-4 bg-zinc-900/30 border border-gold/5 rounded-2xl hover:border-gold/20 transition-colors group"
                        >
                          <div className="relative w-20 h-20 rounded-xl overflow-hidden">
                            <img src={product.images?.[0]} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-bold group-hover:text-gold transition-colors">{product.name}</h4>
                            <div className="flex items-center gap-3 mt-1">
                              <p className="text-gold text-sm font-black">{product.price} ج.م</p>
                              <span className="text-[10px] px-2 py-0.5 bg-zinc-800 text-gray-400 rounded-full uppercase tracking-wider">
                                {product.category}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEdit(product)}
                              className="p-2.5 text-blue-400 hover:bg-blue-400/10 rounded-xl transition-colors"
                              title="تعديل"
                            >
                              <Edit2 size={20} />
                            </button>
                            <button 
                              onClick={() => setProductToDelete(product.id)} 
                              className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                              title="حذف"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Preview & Adjustment Modal */}
      <AnimatePresence>
        {previewImage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewImage(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl bg-zinc-950 border border-gold/20 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              {/* Preview Area */}
              <div className="flex-1 p-8 bg-zinc-900/50 flex flex-col items-center justify-center border-b md:border-b-0 md:border-l border-gold/10">
                <div className="text-center mb-6">
                  <h3 className="text-gold font-black text-xl mb-1">معاينة الكارت</h3>
                  <p className="text-gray-500 text-xs">هكذا ستظهر الصورة في المتجر (نسبة 4:5)</p>
                </div>
                
                <div className="relative aspect-[4/5] w-full max-w-[300px] rounded-3xl overflow-hidden border-2 border-gold shadow-[0_0_50px_rgba(212,175,55,0.2)]">
                  <img 
                    src={previewImage.url} 
                    alt="" 
                    className="w-full h-full object-cover transition-transform duration-300"
                    style={{
                      transform: `scale(${zoom}) translate(${position.x}%, ${position.y}%)`
                    }}
                    referrerPolicy="no-referrer"
                  />
                  {/* Overlay Guide */}
                  <div className="absolute inset-0 border-[20px] border-black/20 pointer-events-none" />
                </div>
              </div>

              {/* Controls Area */}
              <div className="w-full md:w-80 p-8 flex flex-col justify-between">
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h4 className="text-white font-bold">تعديل العرض</h4>
                    <button 
                      onClick={() => {
                        setPreviewImage(null);
                        setZoom(1);
                        setPosition({ x: 0, y: 0 });
                      }}
                      className="p-2 bg-zinc-800 text-gray-400 rounded-full hover:text-white transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Zoom Control */}
                  <div className="space-y-4">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
                      <span>تصغير</span>
                      <span>تكبير</span>
                    </div>
                    <input 
                      type="range"
                      min="1"
                      max="3"
                      step="0.01"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full accent-gold h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Position Controls */}
                  <div className="space-y-4">
                    <h5 className="text-gray-500 text-[10px] font-black uppercase tracking-widest">تحريك الصورة</h5>
                    <div className="grid grid-cols-3 gap-2 max-w-[120px] mx-auto">
                      <div />
                      <button 
                        onClick={() => setPosition(prev => ({ ...prev, y: prev.y - 5 }))}
                        className="p-2 bg-zinc-800 rounded-lg hover:bg-gold hover:text-black transition-colors flex items-center justify-center"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <div />
                      <button 
                        onClick={() => setPosition(prev => ({ ...prev, x: prev.x - 5 }))}
                        className="p-2 bg-zinc-800 rounded-lg hover:bg-gold hover:text-black transition-colors flex items-center justify-center"
                      >
                        <ChevronRight size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          setZoom(1);
                          setPosition({ x: 0, y: 0 });
                        }}
                        className="p-2 bg-gold text-black rounded-lg flex items-center justify-center"
                      >
                        <RotateCcw size={16} />
                      </button>
                      <button 
                        onClick={() => setPosition(prev => ({ ...prev, x: prev.x + 5 }))}
                        className="p-2 bg-zinc-800 rounded-lg hover:bg-gold hover:text-black transition-colors flex items-center justify-center"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <div />
                      <button 
                        onClick={() => setPosition(prev => ({ ...prev, y: prev.y + 5 }))}
                        className="p-2 bg-zinc-800 rounded-lg hover:bg-gold hover:text-black transition-colors flex items-center justify-center"
                      >
                        <ChevronDown size={16} />
                      </button>
                      <div />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleCropSave}
                  className="w-full py-4 bg-gold text-black font-black rounded-2xl hover:scale-[1.02] transition-all mt-8"
                >
                  حفظ التعديلات
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {productToDelete && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProductToDelete(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-zinc-950 border border-gold/20 rounded-[3rem] p-12 text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={40} className="text-red-500" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4">هل أنت متأكد؟</h3>
              <p className="text-gray-500 mb-12">لا يمكن التراجع عن حذف هذا المنتج بعد تأكيد العملية.</p>
              
              <div className="flex flex-col gap-4">
                <button 
                  onClick={handleDeleteProduct}
                  disabled={isLoading}
                  className="w-full py-4 bg-red-500 text-white font-black rounded-2xl hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : 'نعم، قم بالحذف'}
                </button>
                <button 
                  onClick={() => setProductToDelete(null)}
                  className="w-full py-4 bg-zinc-900 text-white font-black rounded-2xl hover:bg-zinc-800 transition-all"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
