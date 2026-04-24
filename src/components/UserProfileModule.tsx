import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, User, MapPin, Package, CreditCard, Bell, Shield, 
  Settings, LogOut, Star, Award, Zap, ChevronRight,
  TrendingUp, Clock, Heart, Terminal
} from 'lucide-react';

interface UserProfileModuleProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModule: React.FC<UserProfileModuleProps> = ({ isOpen, onClose }) => {
  // Try to get real user data from local storage
  const savedUser = typeof window !== 'undefined' ? localStorage.getItem('freshloop_user') : null;
  const user = savedUser ? JSON.parse(savedUser) : { name: "Sanjeev Kushwaha", email: "kushwahasanjeev595@gmail.com" };

  // Mock data for a "detailed" user profile
  const userData = {
    name: user.name,
    email: user.email,
    role: "Senior Mission Commander",
    level: 42,
    xp: 7850,
    nextLevelXp: 10000,
    phone: "+91 98893 58598",
    upiId: "9889358598@axl",
    joinedDate: "April 2024",
    missionsCompleted: 156,
    activeSubscription: "Ultra-Premium Organic",
    addresses: [
      { id: 1, label: "Command Center (Home)", address: "Sector 4, Green Garden Residency, Plot 42", type: "Home" },
      { id: 2, label: "Logistics Hub (Office)", address: "Intelligence Tower, Alpha Block, Floor 12", type: "Work" }
    ],
    stats: [
      { label: "Daily Streaks", value: "14 Days", icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
      { label: "Organic Savings", value: "$420.50", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
      { label: "Missions Active", value: "3 Ready", icon: Package, color: "text-blue-500", bg: "bg-blue-50" }
    ],
    achievements: [
      { name: "First Harvest", icon: Award, color: "text-yellow-400" },
      { name: "Bulk Voyager", icon: Star, color: "text-purple-400" },
      { name: "Mission Maverick", icon: Shield, color: "text-blue-400" }
    ]
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-end">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative bg-white h-full w-full max-w-xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Profile Header */}
            <div className="relative p-8 pb-12 bg-slate-900 text-white overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 p-8">
                <button 
                  onClick={onClose}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-lg border border-white/10"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 mt-4">
                <div className="relative">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-[40px] bg-yellow-400 border-4 border-slate-900 overflow-hidden shadow-2xl transform rotate-3">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-2xl shadow-xl border-4 border-slate-900">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>

                <div className="text-center md:text-left">
                  <span className="inline-block bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-3 border border-emerald-500/30">
                    {userData.role}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-none mb-2">
                    {userData.name}
                  </h2>
                  <div className="flex items-center justify-center md:justify-start gap-4 text-slate-400 text-sm font-bold">
                    <div className="flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 text-yellow-400" />
                      <span>UID: #{userData.name.substring(0, 3).toUpperCase()}-420</span>
                    </div>
                    <div className="w-1.5 h-1.5 bg-slate-600 rounded-full" />
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <span>Active: {userData.joinedDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-10 px-2">
                <div className="flex justify-between items-end mb-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Global Mission XP</span>
                    <span className="text-lg font-black text-white">Level {userData.level}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">{userData.xp} / {userData.nextLevelXp} XP</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700 p-0.5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(userData.xp / userData.nextLevelXp) * 100}%` }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-yellow-400 rounded-full"
                  />
                </div>
              </div>
              
              <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-emerald-600/10 rounded-full blur-[80px]" />
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-10 no-scrollbar">
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                {userData.stats.map((stat, i) => (
                  <div key={i} className={`${stat.bg} ${stat.color} p-4 rounded-[28px] border border-current opacity-80 flex flex-col items-center justify-center text-center transition-transform hover:scale-105 cursor-default`}>
                    <stat.icon className="w-6 h-6 mb-2" />
                    <span className="text-[9px] font-black uppercase tracking-widest block mb-0.5 opacity-60 leading-none">{stat.label}</span>
                    <span className="text-sm font-black tracking-tight">{stat.value}</span>
                  </div>
                ))}
              </div>

              {/* Core Information Section */}
              <section className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">Core Dossier</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-5 rounded-[32px] border border-slate-100 group transition-colors hover:border-emerald-200">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-400 group-hover:text-emerald-500 transition-colors">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Authenticated ID</p>
                        <p className="text-slate-800 font-bold text-sm truncate max-w-[200px]">{userData.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-[32px] border border-slate-100 group transition-colors hover:border-emerald-200">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-400 group-hover:text-emerald-500 transition-colors">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Encrypted VPA</p>
                        <p className="text-slate-800 font-bold text-sm">{userData.upiId}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Saved Coordinates (Addresses) */}
              <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Saved Coordinates</h3>
                  <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Add New</button>
                </div>
                <div className="space-y-3">
                  {userData.addresses.map(addr => (
                    <div key={addr.id} className="bg-white p-5 rounded-[32px] border border-slate-100 flex items-start gap-4 transition-all hover:shadow-xl hover:shadow-emerald-100/20 hover:-translate-y-1">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-black text-slate-800 uppercase tracking-tight text-sm">{addr.label}</h4>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2 py-0.5 bg-slate-50 rounded-full">{addr.type}</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-bold">{addr.address}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Achievements & Rank */}
              <section className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">Mission Credentials</h3>
                <div className="flex flex-wrap gap-3">
                  {userData.achievements.map((ach, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white pl-2 pr-5 py-2 rounded-full border border-slate-100 shadow-sm transition-transform hover:scale-105 cursor-help">
                      <div className={`w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center ${ach.color}`}>
                        <ach.icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{ach.name}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-3 bg-emerald-50 pl-2 pr-5 py-2 rounded-full border border-emerald-100 shadow-sm animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-emerald-600">
                      <Award className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">+5 Unlocked</span>
                  </div>
                </div>
              </section>

              {/* Action Menu List */}
              <div className="space-y-2 pt-4">
                <button className="w-full flex items-center justify-between p-5 bg-slate-50 rounded-[28px] border border-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all group">
                  <div className="flex items-center gap-4">
                    <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="font-black uppercase tracking-widest text-xs">Saved Signatures</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
                <button className="w-full flex items-center justify-between p-5 bg-slate-50 rounded-[28px] border border-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all group">
                  <div className="flex items-center gap-4">
                    <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="font-black uppercase tracking-widest text-xs">Alert Protocols</span>
                  </div>
                  <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">3</span>
                </button>
                <button className="w-full flex items-center justify-between p-5 bg-slate-50 rounded-[28px] border border-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all group">
                  <div className="flex items-center gap-4">
                    <Settings className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="font-black uppercase tracking-widest text-xs">System Settings</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
              </div>
            </div>

            {/* Footer Logout */}
            <div className="p-8 bg-slate-50 border-t border-slate-200 mt-auto">
              <button 
                onClick={() => {
                  localStorage.removeItem('freshloop_visited');
                  localStorage.removeItem('freshloop_user');
                  window.location.reload();
                }}
                className="w-full flex items-center justify-center gap-3 bg-white p-5 rounded-[28px] border-2 border-slate-200 text-slate-400 font-black uppercase tracking-widest text-xs hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all shadow-sm"
              >
                <LogOut className="w-5 h-5" />
                <span>Shutdown Session</span>
              </button>
              <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-6 leading-none">
                Authenticated via Quantum SSL-4 // Terminal 7
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Lucide icon alias fix
const CheckCircle2 = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
