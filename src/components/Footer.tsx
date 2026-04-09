import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-rich-black border-t border-white/5 pt-20 pb-24 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 lg:gap-24">
        {/* Brand */}
        <div className="col-span-2 lg:col-span-1 space-y-6 lg:space-y-8">
          <Link to="/" className="flex flex-col group">
            <span className="text-2xl lg:text-4xl font-black tracking-tighter text-white font-serif group-hover:text-gold transition-all duration-700">
              EL<span className="text-gold group-hover:text-white transition-all duration-700">BRENS</span>
            </span>
            <span className="text-[10px] lg:text-xs tracking-[0.6em] text-gold font-black -mt-1 font-serif italic opacity-80">LUXURY</span>
          </Link>
          <p className="text-gray-500 text-sm lg:text-base leading-relaxed font-light max-w-md">
            البرنس ليس مجرد براند ملابس، بل هو أسلوب حياة لمن يجرؤون على التميز. نحن نصنع الفخامة لكل من يطمح للقمة.
          </p>
          <div className="flex gap-4 lg:gap-6">
            {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl glass flex items-center justify-center text-white/50 hover:bg-gold hover:text-black hover:scale-110 transition-all duration-500 shadow-xl">
                <Icon size={18} className="lg:w-5 lg:h-5" strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="col-span-1">
          <h4 className="text-gold font-black mb-6 lg:mb-10 text-sm lg:text-lg font-serif italic uppercase tracking-widest">روابط سريعة</h4>
          <ul className="space-y-3 lg:space-y-6">
            {['المتجر', 'وصلنا حديثاً', 'العروض', 'قصتنا'].map((item) => (
              <li key={item}>
                <Link to="/shop" className="text-gray-500 text-xs lg:text-base hover:text-white hover:translate-x-[-8px] inline-block transition-all duration-500 font-light">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Service */}
        <div className="col-span-1">
          <h4 className="text-gold font-black mb-6 lg:mb-10 text-sm lg:text-lg font-serif italic uppercase tracking-widest">خدمة العملاء</h4>
          <ul className="space-y-3 lg:space-y-6">
            {['تواصل معنا', 'الشحن', 'الاسترجاع', 'الأسئلة'].map((item) => (
              <li key={item}>
                <Link to="/contact" className="text-gray-500 text-xs lg:text-base hover:text-white hover:translate-x-[-8px] inline-block transition-all duration-500 font-light">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div className="col-span-2 lg:col-span-1 space-y-6 lg:space-y-8">
          <h4 className="text-gold font-black mb-6 lg:mb-10 text-sm lg:text-lg font-serif italic uppercase tracking-widest">انضم للنخبة</h4>
          <p className="text-gray-500 text-xs lg:text-base font-light">اشترك لتصلك أحدث المجموعات والعروض الحصرية.</p>
          <form className="flex flex-col gap-3 lg:gap-4">
            <input 
              type="email" 
              placeholder="بريدك الإلكتروني" 
              className="glass rounded-xl lg:rounded-2xl px-5 py-3 lg:px-6 lg:py-4 text-xs lg:text-sm focus:outline-none focus:border-gold/50 transition-all duration-500 text-white placeholder:text-gray-600"
            />
            <button className="gold-gradient text-black font-black px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl text-xs lg:text-sm hover:scale-105 transition-all duration-500 uppercase tracking-widest shadow-2xl">
              اشتراك الآن
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-[35px] pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="text-gray-600 text-xs font-light tracking-widest uppercase">© 2026 ELBRENS LUXURY. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-1000">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-5" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
        </div>
      </div>
    </footer>
  );
}
