import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gold/20 pt-20 pb-24 lg:pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="space-y-6">
          <Link to="/" className="flex flex-col">
            <span className="text-3xl font-black tracking-tighter text-white">
              EL<span className="text-gold">BRENS</span>
            </span>
            <span className="text-xs tracking-[0.4em] text-gold-light font-bold -mt-1">STORE</span>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed">
            البرنس ليس مجرد براند ملابس، بل هو أسلوب حياة لمن يجرؤون على التميز. نحن نصنع الفخامة لكل من يطمح للقمة.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-white hover:bg-gold hover:text-black transition-all">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-white hover:bg-gold hover:text-black transition-all">
              <Facebook size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-white hover:bg-gold hover:text-black transition-all">
              <Twitter size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-gold font-bold mb-6 text-lg">روابط سريعة</h4>
          <ul className="space-y-4">
            <li><Link to="/shop" className="text-gray-400 hover:text-white transition-colors">المتجر</Link></li>
            <li><Link to="/shop?cat=new" className="text-gray-400 hover:text-white transition-colors">وصلنا حديثاً</Link></li>
            <li><Link to="/shop?cat=sale" className="text-gray-400 hover:text-white transition-colors">العروض</Link></li>
            <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">قصتنا</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="text-gold font-bold mb-6 text-lg">خدمة العملاء</h4>
          <ul className="space-y-4">
            <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">تواصل معنا</Link></li>
            <li><Link to="/shipping" className="text-gray-400 hover:text-white transition-colors">الشحن والتوصيل</Link></li>
            <li><Link to="/returns" className="text-gray-400 hover:text-white transition-colors">سياسة الاسترجاع</Link></li>
            <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors">الأسئلة الشائعة</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-gold font-bold mb-6 text-lg">انضم للنخبة</h4>
          <p className="text-gray-400 text-sm mb-6">اشترك لتصلك أحدث المجموعات والعروض الحصرية قبل الجميع.</p>
          <form className="flex gap-2">
            <input 
              type="email" 
              placeholder="بريدك الإلكتروني" 
              className="bg-zinc-900 border border-gold/20 rounded-lg px-4 py-2 text-sm flex-1 focus:outline-none focus:border-gold transition-colors"
            />
            <button className="bg-gold text-black font-bold px-4 py-2 rounded-lg text-sm hover:bg-gold-dark transition-colors">
              اشتراك
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gold/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-500 text-xs">© 2026 متجر البرنس. جميع الحقوق محفوظة.</p>
        <div className="flex gap-4">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" />
        </div>
      </div>
    </footer>
  );
}
