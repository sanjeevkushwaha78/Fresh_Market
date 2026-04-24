import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { Product } from '../types';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  quantityInCart, 
  onAddToCart, 
  onUpdateQuantity 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-[32px] p-6 border-2 border-emerald-100 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all relative overflow-hidden group"
    >
      <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest">
        {product.category}
      </div>
      
      <div className="w-32 h-32 bg-stone-50 rounded-full flex items-center justify-center mb-6 overflow-hidden border-4 border-stone-50 transition-transform group-hover:scale-105 duration-500">
        <img 
          src={product.image} 
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex flex-col gap-1 w-full">
        <h4 className="font-black text-lg text-slate-800 leading-tight">{product.name}</h4>
        <p className="text-slate-400 text-sm line-clamp-1">
          Sold per {product.unit}
        </p>
        
        <div className="mt-4 flex items-center justify-between w-full pt-4 border-t border-slate-50">
          <div className="flex flex-col items-start leading-none">
             <span className="text-2xl font-black text-emerald-600">${product.price.toFixed(2)}</span>
             <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">Free Delivery</span>
          </div>
          
          {quantityInCart === 0 ? (
            <button
              onClick={() => onAddToCart(product)}
              className="w-12 h-12 bg-emerald-500 rounded-2xl text-white font-black text-2xl flex items-center justify-center hover:bg-emerald-600 active:scale-95 transition-all shadow-md shadow-emerald-200"
            >
              +
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-emerald-50 rounded-2xl p-1 border border-emerald-100">
              <button 
                onClick={() => onUpdateQuantity(product.id, -1)}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-xl text-emerald-600 hover:text-rose-500 shadow-sm transition-all font-black"
              >
                {quantityInCart === 1 ? <Trash2 className="w-3.5 h-3.5" /> : '-'}
              </button>
              <span className="font-black text-emerald-700 text-sm px-1">{quantityInCart}</span>
              <button 
                onClick={() => onUpdateQuantity(product.id, 1)}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-xl text-emerald-600 shadow-sm transition-all font-black"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
