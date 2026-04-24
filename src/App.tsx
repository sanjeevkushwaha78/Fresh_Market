import React, { useState, useEffect } from 'react';
import { Product, CartItem, Order, CATEGORIES } from './types';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { CartSidebar } from './components/CartSidebar';
import { UserProfileModule } from './components/UserProfileModule';
import { WelcomeOverlay } from './components/WelcomeOverlay';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ChevronRight, Bird, Truck, ShieldCheck, X, Linkedin } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [orderComplete, setOrderComplete] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    }
  };

  const addToCart = async (product: Product) => {
    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: 1 })
      });
      const data = await res.json();
      setCart(data.cart);
    } catch (err) {
      console.error("Failed to add to cart", err);
    }
  };

  const updateQuantity = async (productId: string, delta: number) => {
    const item = cart.find(i => i.productId === productId);
    if (!item) return;

    const newQuantity = item.quantity + delta;
    try {
      const res = await fetch('/api/cart/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: newQuantity })
      });
      const data = await res.json();
      setCart(data.cart);
    } catch (err) {
      console.error("Failed to update cart", err);
    }
  };

  const handleCheckout = async (customer: any) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer })
      });
      const data = await res.json();
      if (data.success) {
        setOrderComplete(data.order);
        setCart([]);
        setIsCartOpen(false);
      }
    } catch (err) {
      console.error("Failed to place order", err);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="h-screen bg-emerald-50 font-sans text-slate-900 flex flex-col overflow-hidden">
      <Header 
        cartCount={cartCount} 
        onOpenCart={() => setIsCartOpen(true)} 
        onSearch={setSearchQuery}
        onToggleAbout={() => setIsAboutOpen(true)}
        onToggleProfile={() => setIsProfileOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <nav className="hidden lg:flex w-64 bg-white border-r border-emerald-100 p-8 flex-col gap-2 shadow-inner overflow-y-auto">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 mt-2">Departments</h3>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-3 p-4 rounded-2xl font-black transition-all ${
                selectedCategory === cat 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 transform scale-105' 
                  : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-current opacity-40" />
              {cat}
            </button>
          ))}
          
          <div className="mt-auto p-5 bg-yellow-50 rounded-[24px] border border-yellow-200">
            <p className="text-[10px] text-yellow-800 font-black uppercase leading-tight tracking-widest">System Plan</p>
            <p className="text-[11px] text-yellow-700 mt-2 font-bold leading-relaxed">Dynamic SKU Mapping Active in Sector 4</p>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar bg-emerald-50/30">
          <div className="max-w-6xl mx-auto">
            {/* Banner Section */}
            <section className="mb-10 relative overflow-hidden rounded-[40px] bg-emerald-600 text-white p-10 md:p-14 shadow-2xl shadow-emerald-200/50">
              <div className="relative z-10 max-w-xl">
                <span className="inline-block bg-yellow-400 text-emerald-900 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-6">
                  24/7 Organic Delivery
                </span>
                <h2 className="text-3xl md:text-5xl font-black leading-[1.1] mb-8 tracking-tight">
                  Farm fresh <span className="text-yellow-300">fuel</span> <br /> for your healthy <br /> lifestyle.
                </h2>
                <div className="flex flex-wrap gap-8 items-center">
                  <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-emerald-100">
                    <Truck className="w-5 h-5 text-yellow-400" />
                    <span>Instant Drop</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-emerald-100">
                    <ShieldCheck className="w-5 h-5 text-yellow-400" />
                    <span>Vetted Quality</span>
                  </div>
                </div>
              </div>
              <div className="absolute -right-20 -top-20 w-[60%] aspect-square bg-emerald-400 rounded-full blur-[120px] opacity-20" />
              <div className="absolute right-0 bottom-0 top-0 hidden xl:flex items-center p-12 pr-20 opacity-20">
                 <Bird className="w-64 h-64 rotate-12 text-white" />
              </div>
            </section>

            {/* Mobile Categories (Internal Scroll) */}
            <div className="lg:hidden mb-8 flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-black uppercase tracking-wider transition-all border-2 ${
                    selectedCategory === cat 
                      ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg' 
                      : 'bg-white text-slate-500 border-white hover:border-emerald-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-[32px] h-[400px] animate-pulse border-2 border-emerald-50 shadow-sm" />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 lg:gap-10"
              >
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                    quantityInCart={cart.find(i => i.productId === product.id)?.quantity || 0}
                    onAddToCart={addToCart}
                    onUpdateQuantity={updateQuantity}
                  />
                ))}
              </motion.div>
            ) : (
              <div className="py-32 text-center">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Bird className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Scanner Offline</h3>
                <p className="text-slate-400 mt-2 font-bold">No organic signatures found in this sector.</p>
                <button 
                  onClick={() => {setSelectedCategory('All'); setSearchQuery('');}}
                  className="mt-6 text-emerald-600 font-black uppercase text-sm hover:underline tracking-widest"
                >
                  Reset Sensors
                </button>
              </div>
            )}
            
            <div className="h-20" /> {/* Spacer */}
          </div>
        </main>
      </div>

      {/* Footer Status Bar (Theme matching) */}
      <footer className="h-12 bg-slate-900 px-4 md:px-8 flex items-center justify-between border-t border-slate-800 z-50 shrink-0">
        <div className="flex items-center gap-4 md:gap-10 overflow-hidden">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">Server: OK</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 whitespace-nowrap">
            <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
            <span className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">State: Synced</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
            <span className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">Design: VIBRANT PALETTE</span>
          </div>
        </div>
        <p className="hidden md:block text-[10px] text-slate-500 font-mono tracking-tighter uppercase font-bold">
           Locahost:3000 // AGENT_ORCHESTRATOR_RUNNING
        </p>
      </footer>

      {/* About Section Modal */}
      <AnimatePresence>
        {isAboutOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAboutOpen(false)}
              className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[48px] p-8 md:p-16 max-w-2xl w-full shadow-2xl border-2 border-emerald-100 overflow-hidden"
            >
              <button 
                onClick={() => setIsAboutOpen(false)}
                className="absolute top-8 right-8 p-3 rounded-full hover:bg-slate-50 transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-white shadow-xl mb-8">
                  <Bird className="w-12 h-12 text-emerald-800" />
                </div>
                
                <span className="inline-block bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-[0.25em] px-5 py-2 rounded-full mb-6">
                  Intelligence Asset: Sanjeev Kushwaha
                </span>

                <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-8 uppercase tracking-tight leading-none">
                  About the <br /> <span className="text-emerald-500">FreshLoop</span> Mission
                </h2>

                <p className="text-slate-500 font-bold leading-relaxed max-w-md mb-12">
                  FreshLoop Market is a high-performance regional logistics network focused on sustainable, organic produce distribution. Our mission is to bridge the gap between local artisan farms and your central healthy lifestyle hub.
                </p>

                <div className="grid grid-cols-2 gap-4 w-full mb-12">
                  <div className="bg-slate-50 rounded-[28px] p-6 border border-slate-100 transition-transform hover:-translate-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Developed By</p>
                    <p className="text-slate-800 font-black text-lg">Sanjeev Kushwaha</p>
                  </div>
                  <div className="bg-slate-50 rounded-[28px] p-6 border border-slate-100 transition-transform hover:-translate-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Network Hub</p>
                    <p className="text-slate-800 font-black text-lg">LinkedIn Connected</p>
                  </div>
                </div>

                <a 
                  href="https://www.linkedin.com/in/sanjeev-kushwaha"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-4 bg-slate-900 text-white font-black px-10 py-5 rounded-[28px] hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200 active:scale-95 group"
                >
                  <Linkedin className="w-6 h-6 group-hover:scale-125 transition-transform" />
                  <span className="uppercase tracking-tight text-lg">Connect on LinkedIn</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sidebar Cart */}
      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        products={products}
        onUpdateQuantity={updateQuantity}
        onCheckout={handleCheckout}
      />

      {/* User Profile module */}
      <UserProfileModule 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />

      {/* Initial Welcome/Sign-up Overlay */}
      {showWelcome && (
        <WelcomeOverlay 
          onComplete={(user) => {
            setShowWelcome(false);
            console.log("Mission initialized by:", user);
          }} 
        />
      )}

      {/* Success Modal */}
      <AnimatePresence>
        {orderComplete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOrderComplete(null)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[40px] p-10 md:p-14 max-w-lg w-full text-center shadow-2xl border-2 border-emerald-100"
            >
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner overflow-hidden border-4 border-white">
                 <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-black text-slate-800 mb-2 uppercase tracking-tight">Mission Success!</h2>
              <p className="text-slate-400 mb-8 inline-flex items-center gap-2 font-bold uppercase text-xs tracking-widest">
                ID: <span className="text-emerald-600">#{orderComplete.id}</span>
              </p>
              
              <div className="bg-emerald-50 rounded-[24px] p-6 mb-10 text-left border border-emerald-100 flex flex-col gap-6">
                <div>
                  <h4 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-4 opacity-60">Delivery Coordinates</h4>
                  <p className="font-black text-slate-800 text-lg uppercase leading-tight">{orderComplete.customer.name}</p>
                  <p className="text-slate-500 text-sm mt-2 font-bold">{orderComplete.customer.address}</p>
                </div>
                
                <div className="pt-6 border-t border-emerald-100 flex flex-col items-center gap-6">
                  <div className="flex items-center gap-8">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=OrderID:${orderComplete.id}&bgcolor=f8fafc&color=059669`} 
                      alt="Order QR" 
                      className="w-16 h-16 rounded-xl border-2 border-white shadow-sm"
                    />
                    <div className="flex flex-col items-center gap-2">
                      <img 
                        src={`https://barcodeapi.org/api/code128/${orderComplete.id}?height=50&width=200`} 
                        alt="Order Barcode" 
                        className="h-10 object-contain opacity-50 contrast-125"
                      />
                      <span className="text-[8px] font-mono font-black text-emerald-600/40 uppercase tracking-[0.4em]">Receipt_Verified</span>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setOrderComplete(null)}
                className="w-full bg-slate-900 text-white font-black py-5 rounded-[24px] hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-tight shadow-xl shadow-slate-200"
              >
                Continue Mission
                <ChevronRight className="w-6 h-6" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
