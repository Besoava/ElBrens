import { User, Package, MapPin, LogOut, Settings } from 'lucide-react';

export default function Profile() {
  return (
    <div className="bg-black min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div className="w-32 h-32 rounded-full bg-gold flex items-center justify-center text-black font-black text-4xl">
            BM
          </div>
          <div className="text-center md:text-right">
            <h1 className="text-4xl font-black text-white mb-2">أهلاً بك، البرنس</h1>
            <p className="text-gray-500">besomuslim@gmail.com</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-4">
            <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gold text-black font-bold">
              <User size={20} /> الملف الشخصي
            </button>
            <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-zinc-900 text-white hover:bg-zinc-800 transition-colors">
              <Package size={20} /> طلباتي
            </button>
            <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-zinc-900 text-white hover:bg-zinc-800 transition-colors">
              <MapPin size={20} /> عناويني
            </button>
            <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-zinc-900 text-white hover:bg-zinc-800 transition-colors">
              <Settings size={20} /> الإعدادات
            </button>
            <hr className="border-gold/10" />
            <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-red-900/20 text-red-500 hover:bg-red-900/40 transition-colors">
              <LogOut size={20} /> تسجيل الخروج
            </button>
          </div>

          <div className="md:col-span-2">
            <div className="bg-zinc-950 border border-gold/10 rounded-[2.5rem] p-8">
              <h3 className="text-xl font-bold text-white mb-8">أحدث الطلبات</h3>
              <div className="text-center py-12">
                <Package size={48} className="text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500">لا يوجد طلبات سابقة حتى الآن.</p>
                <button className="mt-6 text-gold font-bold underline">ابدأ التسوق الآن</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
