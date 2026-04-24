import React, { useState } from 'react';
import { X, ShoppingBag, ArrowRight, Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem, Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  products: Product[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onCheckout: (customer: any) => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  products,
  onUpdateQuantity,
  onCheckout
}) => {
  const [step, setStep] = useState<'basket' | 'checkout'>('basket');
  const [customer, setCustomer] = useState({ name: '', address: '', email: '', upiId: '9889358598@axl' });

  const cartItems = items.map(item => ({
    ...item,
    product: products.find(p => p.id === item.productId)!
  })).filter(item => !!item.product);

  const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    
    // Simulating a verification delay for the "Scanner" feel
    setTimeout(() => {
      onCheckout(customer);
      setStep('basket');
      setIsVerifying(false);
      onClose();
    }, 2000);
  };

  const upiLink = `upi://pay?pa=${customer.upiId}&pn=FreshMarket&am=${total.toFixed(2)}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}&bgcolor=f8fafc&color=059669`;
  const barcodeUrl = `https://barcodeapi.org/api/code128/${encodeURIComponent('TXN-' + Math.random().toString(36).substring(2, 8).toUpperCase())}?height=60&width=200`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-[340px] md:max-w-md bg-white z-[70] shadow-2xl flex flex-col border-l border-emerald-100"
          >
            <div className="p-6 border-b border-slate-50 bg-white flex items-center justify-between">
              <div className="flex flex-col">
                <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                   {step === 'basket' ? 'My Basket' : 'Checkout & Scan'}
                </h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter">
                  {step === 'basket' ? 'Estimated Delivery: IN 30 MINS' : 'Mission Finalization Phase'}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-stone-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-5xl">
                    🛒
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-lg uppercase">Basket Empty</h3>
                    <p className="text-slate-400 text-sm mt-1">Agent 4 reports: No items detected.</p>
                  </div>
                </div>
              ) : step === 'basket' ? (
                <div className="flex flex-col gap-4">
                  {cartItems.map((item) => (
                    <motion.div 
                      key={item.productId}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white p-3 rounded-[24px] border border-emerald-50 flex gap-4 shadow-sm group hover:border-emerald-200 transition-colors"
                    >
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden shrink-0">
                        <img 
                          src={item.product.image} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-slate-800 text-sm leading-tight line-clamp-1">{item.product.name}</h4>
                          <button onClick={() => onUpdateQuantity(item.productId, -item.quantity)}>
                             <X className="w-3.5 h-3.5 text-stone-300 hover:text-rose-500" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-400 font-medium mb-1">{item.quantity} {item.product.unit} × ${item.product.price.toFixed(2)}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 bg-emerald-50 rounded-xl p-0.5 border border-emerald-100">
                            <button 
                              onClick={() => onUpdateQuantity(item.productId, -1)}
                              className="w-6 h-6 flex items-center justify-center bg-white rounded-lg text-emerald-600 hover:text-rose-400 transition-colors text-xs font-black"
                            >
                              {item.quantity === 1 ? <Trash2 className="w-3 h-3" /> : '-'}
                            </button>
                            <span className="text-[10px] font-black w-4 text-center text-emerald-700">{item.quantity}</span>
                            <button 
                              onClick={() => onUpdateQuantity(item.productId, 1)}
                              className="w-6 h-6 flex items-center justify-center bg-white rounded-lg text-emerald-600 transition-colors text-xs font-black"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-emerald-600 font-black text-sm">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="bg-white p-6 rounded-[32px] border-2 border-emerald-100 shadow-sm">
                    <h3 className="font-black text-slate-800 mb-6 uppercase tracking-tight">Delivery Info</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-black text-emerald-600 uppercase mb-1 tracking-widest pl-1">Full Name</label>
                        <input 
                          required
                          type="text" 
                          value={customer.name}
                          onChange={e => setCustomer({...customer, name: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-5 text-sm focus:ring-2 focus:ring-yellow-400 outline-none transition-shadow"
                          placeholder="Agent Green"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-emerald-600 uppercase mb-1 tracking-widest pl-1">Email Address</label>
                        <input 
                          required
                          type="email" 
                          value={customer.email}
                          onChange={e => setCustomer({...customer, email: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-5 text-sm focus:ring-2 focus:ring-yellow-400 outline-none transition-shadow"
                          placeholder="agent@freshloop.io"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-emerald-600 uppercase mb-1 tracking-widest pl-1">Address</label>
                        <textarea 
                          required
                          rows={3}
                          value={customer.address}
                          onChange={e => setCustomer({...customer, address: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-5 text-sm focus:ring-2 focus:ring-yellow-400 outline-none resize-none transition-shadow"
                          placeholder="Delivery node coordinates..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-6 py-4 bg-emerald-50/50 rounded-[40px] border border-emerald-100/50 p-8">
                    <div className="relative group">
                      <div className="absolute -inset-4 bg-emerald-200 rounded-[40px] blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
                      <div className="relative bg-white p-5 rounded-[32px] border-4 border-white shadow-xl overflow-hidden min-h-[160px] flex items-center justify-center">
                        {/* Scanner Corners */}
                        <div className="absolute top-4 left-4 w-4 h-4 border-t-4 border-l-4 border-emerald-500 rounded-tl-lg" />
                        <div className="absolute top-4 right-4 w-4 h-4 border-t-4 border-r-4 border-emerald-500 rounded-tr-lg" />
                        <div className="absolute bottom-4 left-4 w-4 h-4 border-b-4 border-l-4 border-emerald-500 rounded-bl-lg" />
                        <div className="absolute bottom-4 right-4 w-4 h-4 border-b-4 border-r-4 border-emerald-500 rounded-br-lg" />
                        
                        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/50 blur-sm animate-[scan_2s_ease-in-out_infinite]" />
                        <div className="absolute top-0 left-0 w-full h-0.5 bg-emerald-400 animate-[scan_2s_ease-in-out_infinite] z-10" />
                        
                        <div className="flex flex-col items-center gap-6">
                          <img 
                            src={qrCodeUrl} 
                            alt="UPI Payment QR" 
                            className="w-40 h-40 md:w-48 md:h-48 transition-all duration-500"
                          />
                          <div className="w-full h-px bg-slate-100" />
                          <div className="flex flex-col items-center gap-2">
                            <img 
                              src={barcodeUrl} 
                              alt="Transaction Barcode"
                              className="w-48 h-12 object-contain"
                            />
                            <span className="text-[8px] font-mono font-black text-slate-300 tracking-[0.3em]">MISSION_AUTHENTICATION_KEY</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight">Active Payment Scan</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 tracking-widest">Scan with any UPI App</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 bg-slate-50 border-t border-slate-100">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Total amount</span>
                  <span className="text-3xl font-black text-slate-800">${total.toFixed(2)}</span>
                </div>
                {step === 'basket' ? (
                  <button 
                    onClick={() => setStep('checkout')}
                    className="w-full bg-emerald-600 text-white font-black py-4 rounded-[20px] shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={handleSubmitOrder}
                      disabled={!customer.name || !customer.address || !customer.email || isVerifying}
                      className="w-full bg-slate-900 text-white font-black py-4 rounded-[24px] shadow-lg hover:bg-slate-800 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3 uppercase tracking-tight"
                    >
                      {isVerifying ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          Complete & Pay
                          <ShoppingBag className="w-5 h-5" />
                        </>
                      )}
                    </button>
                    <button 
                      onClick={() => setStep('basket')}
                      className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors"
                    >
                      Modify Basket
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
