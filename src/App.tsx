import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './CartContext';
import { WishlistProvider } from './WishlistContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen bg-black flex flex-col">
            <Navbar />
            <BottomNav />
            <WhatsAppButton />
            <main className="flex-grow">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </AnimatePresence>
            </main>
            <FooterWrapper />
          </div>
        </Router>
      </WishlistProvider>
    </CartProvider>
  );
}

function FooterWrapper() {
  const location = useLocation();
  const isProductDetail = location.pathname.startsWith('/product/');
  const isCheckout = location.pathname === '/checkout';
  
  if (isProductDetail || isCheckout) return null;
  return <Footer />;
}
