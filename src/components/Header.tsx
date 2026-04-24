import React from 'react';
import { ShoppingCart, Search, Menu, Info, Linkedin, Bird } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onSearch: (query: string) => void;
  onToggleAbout: () => void;
  onToggleProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  cartCount, 
  onOpenCart, 
  onSearch, 
  onToggleAbout,
  onToggleProfile
}) => {
  return (
    <header className="sticky top-0 z-50 bg-emerald-600 px-4 py-4 md:px-8 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Menu className="md:hidden w-6 h-6 text-emerald-100" />
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white shadow-inner">
            <Bird className="w-6 h-6 text-emerald-800" />
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-1 uppercase">
             FreshLoop <span className="text-yellow-300">Market</span>
          </h1>
        </div>

        <div className="hidden md:flex flex-1 max-w-md relative mx-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-100" />
          <input
            type="text"
            placeholder="Search organic produce..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-emerald-700/50 border border-emerald-400/30 rounded-full py-2.5 pl-11 pr-4 text-white placeholder-emerald-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm transition-all shadow-inner"
          />
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <button 
            onClick={onToggleAbout}
            className="flex flex-col items-center justify-center p-2 rounded-xl text-emerald-100 hover:bg-emerald-500 transition-colors"
          >
            <Info className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] font-black uppercase tracking-widest leading-none">About</span>
          </button>

          <a 
            href="https://www.linkedin.com/in/sanjeev-kushwaha"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-2 rounded-xl text-emerald-100 hover:bg-emerald-500 transition-colors"
          >
            <Linkedin className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] font-black uppercase tracking-widest leading-none">Connect</span>
          </a>

          <button 
            onClick={onToggleProfile}
            className="flex flex-col items-center justify-center p-2 rounded-xl text-emerald-100 hover:bg-emerald-500 transition-colors"
          >
            <div className="w-6 h-6 rounded-lg bg-yellow-400 p-0.5 mb-0.5 flex items-center justify-center border border-white/20 shadow-sm transition-transform group-hover:rotate-12">
               <span className="text-[10px]">👤</span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest leading-none">Profile</span>
          </button>

          <div className="hidden lg:block text-right">
            <p className="text-emerald-100 text-[10px] uppercase font-bold leading-none tracking-widest">System Status</p>
            <p className="text-yellow-300 text-xs font-bold uppercase tracking-tighter">API Connected</p>
          </div>

          <button 
            onClick={onOpenCart}
            className="relative w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md hover:scale-105 transition-transform group"
          >
            <ShoppingCart className="w-6 h-6 text-emerald-600 transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Search Bar */}
      <div className="mt-4 md:hidden relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-100" />
        <input
          type="text"
          placeholder="Search organic produce..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full bg-emerald-700/50 border border-emerald-400/30 rounded-full py-2.5 pl-11 pr-4 text-white placeholder-emerald-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
        />
      </div>
    </header>
  );
};
