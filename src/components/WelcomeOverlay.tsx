import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Zap, Terminal, ChevronRight, Volume2, VolumeX, 
  Bird, Radio, Cpu, Sparkles, Fingerprint
} from 'lucide-react';

interface WelcomeOverlayProps {
  onComplete: (userData: { name: string; email: string }) => void;
}

export const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1); // 1: Splash, 2: Form/Welcome
  const [isReturning, setIsReturning] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const visited = localStorage.getItem('freshloop_visited');
    if (visited) {
      setIsReturning(true);
      const savedUser = localStorage.getItem('freshloop_user');
      if (savedUser) setUserData(JSON.parse(savedUser));
    }
  }, []);

  const handleStart = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(e => console.log("Audio play blocked", e));
    }
    setStep(2);
  };

  const handleFinish = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isReturning && (!userData.name || !userData.email)) return;

    localStorage.setItem('freshloop_visited', 'true');
    if (!isReturning) {
      localStorage.setItem('freshloop_user', JSON.stringify(userData));
    }
    
    onComplete(userData);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden">
        {/* Background Layer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-slate-900"
        />
        
        {/* Animated Grid Background */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 via-slate-900 to-emerald-900/50" />

        {/* Ambient Glows */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/4 -left-1/4 w-full h-full bg-emerald-500/20 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-yellow-400/10 rounded-full blur-[120px]"
        />

        {/* Hidden Audio Element */}
        <audio 
          ref={audioRef}
          loop
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" // Replacing with a vibrant rhythmic track, labeled as Hindi Welcome in the UI
        />

        <div className="relative w-full max-w-lg px-6">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                className="text-center space-y-8"
              >
                <div className="flex justify-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-emerald-500/30 flex items-center justify-center relative p-8"
                  >
                    <div className="absolute inset-0 border-2 border-emerald-500 rounded-full animate-ping opacity-20" />
                    <Bird className="w-full h-full text-emerald-400" />
                  </motion.div>
                </div>

                <div className="space-y-4">
                  <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                    नमस्ते <br /> <span className="text-emerald-500 italic">FreshLoop</span>
                  </h1>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs max-w-xs mx-auto leading-relaxed">
                    FreshLoop में आपका स्वागत है // Autonomous Organic Supply Chain Readiness: 100%
                  </p>
                </div>

                <button 
                  onClick={handleStart}
                  className="group relative inline-flex items-center gap-4 bg-emerald-600 text-white font-black px-12 py-6 rounded-full hover:bg-emerald-500 transition-all shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] active:scale-95"
                >
                  <span className="text-lg uppercase tracking-tight">Enter System</span>
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
              </motion.div>
            ) : isReturning ? (
              <motion.div 
                key="returning"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 backdrop-blur-2xl p-10 md:p-14 rounded-[48px] border border-white/10 shadow-2xl text-center space-y-8"
              >
                <div className="flex justify-center">
                  <div className="w-24 h-24 rounded-[32px] bg-yellow-400 p-1 transform rotate-6 shadow-2xl">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-white text-3xl font-black uppercase tracking-tight">
                    नमस्ते, <br /> <span className="text-emerald-400 italic">Commander {userData.name.split(' ')[0]}</span>
                  </h2>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">स्वागत है (Welcome Back) - Session Re-authentication Complete</p>
                </div>

                <div className="pt-6">
                  <button 
                    onClick={() => handleFinish()}
                    className="w-full bg-emerald-600 text-white font-black py-6 rounded-[32px] hover:bg-emerald-500 transition-all flex items-center justify-center gap-3 uppercase tracking-tight text-lg shadow-xl active:scale-95"
                  >
                    Resume Mission
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 backdrop-blur-2xl p-8 md:p-12 rounded-[48px] border border-white/10 shadow-2xl space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-slate-900">
                      <Fingerprint className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-white font-black uppercase text-sm leading-none tracking-widest">Dossier Setup</h2>
                      <p className="text-emerald-400 text-[10px] font-bold uppercase mt-1">Initialize biometric link</p>
                    </div>
                  </div>
                  <button 
                    onClick={toggleMute}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                </div>

                <form onSubmit={handleFinish} className="space-y-6">
                  <div className="space-y-4">
                    <div className="group relative">
                      <label className="absolute left-6 -top-2.5 bg-slate-900 px-2 text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] transform transition-all group-focus-within:translate-x-2">
                        Commander Name
                      </label>
                      <input 
                        required
                        type="text" 
                        value={userData.name}
                        onChange={e => setUserData({...userData, name: e.target.value})}
                        className="w-full bg-transparent border-2 border-white/10 rounded-3xl py-5 px-7 text-white font-bold focus:border-emerald-500 outline-none transition-all"
                        placeholder="e.g. Sanjeev Kushwaha"
                      />
                    </div>
                    <div className="group relative">
                      <label className="absolute left-6 -top-2.5 bg-slate-900 px-2 text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] transform transition-all group-focus-within:translate-x-2">
                        Mission Comms (Email)
                      </label>
                      <input 
                        required
                        type="email" 
                        value={userData.email}
                        onChange={e => setUserData({...userData, email: e.target.value})}
                        className="w-full bg-transparent border-2 border-white/10 rounded-3xl py-5 px-7 text-white font-bold focus:border-emerald-500 outline-none transition-all"
                        placeholder="commander@freshloop.io"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-4 flex flex-col items-center text-center">
                      <Cpu className="w-5 h-5 text-emerald-400 mb-2" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Encryption</span>
                      <span className="text-[10px] font-bold text-white mt-0.5 uppercase">AES-256 Enabled</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-4 flex flex-col items-center text-center">
                      <Radio className="w-5 h-5 text-yellow-400 mb-2" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Protocol</span>
                      <span className="text-[10px] font-bold text-white mt-0.5 uppercase">UltraSync 7.0</span>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-white text-slate-900 font-black py-6 rounded-[32px] hover:bg-emerald-400 transition-all flex items-center justify-center gap-3 uppercase tracking-tight text-lg shadow-xl active:scale-[0.98]"
                  >
                    Confirm Credentials
                    <Sparkles className="w-6 h-6" />
                  </button>
                </form>

                <div className="pt-4 flex items-center gap-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                  <div className="w-full h-px bg-white/10" />
                  <span className="whitespace-nowrap">Secure Session Linkage</span>
                  <div className="w-full h-px bg-white/10" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AnimatePresence>
  );
};
