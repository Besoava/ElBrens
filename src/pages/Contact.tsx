import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Contact() {
  return (
    <div className="bg-black min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6">تواصل <span className="text-gold">معنا</span></h1>
          <p className="text-gray-500 text-xl">نحن هنا للإجابة على استفساراتك وخدمتك بأفضل شكل ممكن.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="bg-zinc-950 p-8 rounded-3xl border border-gold/10">
                <Mail className="text-gold mb-4" size={32} />
                <h4 className="text-white font-bold mb-2">البريد الإلكتروني</h4>
                <p className="text-gray-500 text-sm">support@elbrens.com</p>
              </div>
              <div className="bg-zinc-950 p-8 rounded-3xl border border-gold/10">
                <Phone className="text-gold mb-4" size={32} />
                <h4 className="text-white font-bold mb-2">رقم الهاتف</h4>
                <p className="text-gray-500 text-sm">+20 123 456 7890</p>
              </div>
            </div>

            <div className="bg-zinc-950 p-8 rounded-3xl border border-gold/10">
              <MapPin className="text-gold mb-4" size={32} />
              <h4 className="text-white font-bold mb-2">المقر الرئيسي</h4>
              <p className="text-gray-500 text-sm">القاهرة، مصر - حي المعادي، شارع 9</p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">تابعنا على السوشيال ميديا</h4>
              <div className="flex gap-4">
                <a href="#" className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-white hover:bg-gold hover:text-black transition-all">
                  <Instagram size={24} />
                </a>
                <a href="#" className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-white hover:bg-gold hover:text-black transition-all">
                  <Facebook size={24} />
                </a>
                <a href="#" className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-white hover:bg-gold hover:text-black transition-all">
                  <Twitter size={24} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-zinc-950 p-10 rounded-[3rem] border border-gold/20">
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-gray-400 text-sm font-bold mr-2">الاسم بالكامل</label>
                  <input 
                    type="text" 
                    className="w-full bg-zinc-900 border border-gold/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold transition-colors"
                    placeholder="أدخل اسمك"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-400 text-sm font-bold mr-2">رقم الهاتف</label>
                  <input 
                    type="tel" 
                    className="w-full bg-zinc-900 border border-gold/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold transition-colors"
                    placeholder="01xxxxxxxxx"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-gray-400 text-sm font-bold mr-2">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  className="w-full bg-zinc-900 border border-gold/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold transition-colors"
                  placeholder="example@mail.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-gray-400 text-sm font-bold mr-2">الرسالة</label>
                <textarea 
                  rows={5}
                  className="w-full bg-zinc-900 border border-gold/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold transition-colors resize-none"
                  placeholder="كيف يمكننا مساعدتك؟"
                />
              </div>
              <button className="w-full gold-gradient text-black font-black py-5 rounded-2xl text-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform">
                إرسال الرسالة <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
