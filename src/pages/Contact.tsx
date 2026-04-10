import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, Instagram, Facebook, MessageCircle } from 'lucide-react';

const TikTokIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function Contact() {
  const socialLinks = [
    { Icon: Facebook, href: "https://www.facebook.com/share/1E64om5dPF/" },
    { Icon: TikTokIcon, href: "https://www.tiktok.com/@elbrens_stora?_r=1&_t=ZS-95OslhVZS1i" },
    { Icon: Instagram, href: "https://www.instagram.com/elbrensstore799?igsh=MTI5aWFydm80YW00Yw==" },
    { Icon: MessageCircle, href: "https://wa.me/201044002840" },
  ];

  return (
    <div className="bg-black min-h-screen pt-24 md:pt-32 pb-20 px-6">
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
                <p className="text-gray-500 text-sm">mwmnalbrns799@gmail.com</p>
              </div>
              <div className="bg-zinc-950 p-8 rounded-3xl border border-gold/10">
                <Phone className="text-gold mb-4" size={32} />
                <h4 className="text-white font-bold mb-2">رقم الهاتف</h4>
                <p className="text-gray-500 text-sm" dir="ltr">01044002840</p>
              </div>
              <a 
                href="https://wa.me/201044002840" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-zinc-950 p-8 rounded-3xl border border-[#25D366]/30 hover:border-[#25D366] transition-colors group"
              >
                <MessageCircle className="text-[#25D366] mb-4 group-hover:scale-110 transition-transform" size={32} />
                <h4 className="text-white font-bold mb-2">واتساب</h4>
                <p className="text-gray-500 text-sm">تواصل معنا مباشرة</p>
              </a>
            </div>

            <div className="bg-zinc-950 p-8 rounded-3xl border border-gold/10">
              <MapPin className="text-gold mb-4" size={32} />
              <h4 className="text-white font-bold mb-2">المقر الرئيسي</h4>
              <p className="text-gray-500 text-sm">كفر الشيخ - دسوق - سنهور المدينة</p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">تابعنا على السوشيال ميديا</h4>
              <div className="flex gap-4">
                {socialLinks.map(({ Icon, href }, i) => (
                  <a 
                    key={i} 
                    href={href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-white hover:bg-gold hover:text-black transition-all"
                  >
                    <Icon size={24} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-zinc-950 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-gold/20">
            <form className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="text-gray-400 text-xs md:text-sm font-bold mr-2">الاسم بالكامل</label>
                  <input 
                    type="text" 
                    className="w-full bg-zinc-900 border border-gold/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-white focus:outline-none focus:border-gold transition-colors text-sm md:text-base"
                    placeholder="أدخل اسمك"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-400 text-xs md:text-sm font-bold mr-2">رقم الهاتف</label>
                  <input 
                    type="tel" 
                    className="w-full bg-zinc-900 border border-gold/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-white focus:outline-none focus:border-gold transition-colors text-sm md:text-base"
                    placeholder="01xxxxxxxxx"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-gray-400 text-xs md:text-sm font-bold mr-2">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  className="w-full bg-zinc-900 border border-gold/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-white focus:outline-none focus:border-gold transition-colors text-sm md:text-base"
                  placeholder="example@mail.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-gray-400 text-xs md:text-sm font-bold mr-2">الرسالة</label>
                <textarea 
                  rows={4}
                  className="w-full bg-zinc-900 border border-gold/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-white focus:outline-none focus:border-gold transition-colors resize-none text-sm md:text-base"
                  placeholder="كيف يمكننا مساعدتك؟"
                />
              </div>
              <button className="w-full gold-gradient text-black font-black py-4 md:py-5 rounded-xl md:rounded-2xl text-lg md:text-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform active:scale-95">
                إرسال الرسالة <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
