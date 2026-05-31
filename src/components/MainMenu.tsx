import React from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import { Language } from '../types';
import { i18n } from '../data/i18n';

interface MainMenuProps {
  onStart: () => void;
  lang: Language;
  setLang: (l: Language) => void;
}

export default function MainMenu({ onStart, lang, setLang }: MainMenuProps) {
  const t = i18n[lang];

  return (
    <div className="flex-1 w-full h-full bg-gradient-to-b from-sky-300 to-sky-100 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Language Toggle */}
      <div className="absolute top-6 right-6 z-20 flex gap-2 bg-white/30 backdrop-blur-sm p-1.5 rounded-full shadow-sm border border-white/40">
          <button 
             onClick={() => setLang('zh')}
             className={`px-4 py-2 rounded-full font-bold transition-all ${lang === 'zh' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-600 hover:bg-white/50'}`}
          >
             中文
          </button>
          <button 
             onClick={() => setLang('en')}
             className={`px-4 py-2 rounded-full font-bold transition-all ${lang === 'en' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-600 hover:bg-white/50'}`}
          >
             EN
          </button>
      </div>

      {/* Background decorations */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full opacity-60 blur-2xl"
      />
      <motion.div 
        animate={{ y: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 right-20 w-64 h-64 bg-pink-200 rounded-full opacity-40 blur-3xl"
      />

      {/* Main Content */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="flex flex-col items-center gap-12 z-10"
      >
        <div className="text-center relative">
          <motion.div
             initial={{ y: -50 }}
             animate={{ y: 0 }}
             className="text-8xl font-black text-white drop-shadow-[0_8px_8px_rgba(0,0,0,0.15)] mb-4 tracking-tight"
          >
            {t.title}
          </motion.div>
          <p className="text-3xl font-bold text-sky-700/80 drop-shadow-sm">
            {t.subtitle}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="group relative flex items-center gap-4 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-amber-900 px-12 py-6 rounded-[2.5rem] shadow-[0_10px_0_0_#d97706] transition-all hover:shadow-[0_6px_0_0_#d97706] hover:translate-y-1 active:shadow-[0_0px_0_0_#d97706] active:translate-y-[10px]"
        >
          <span className="text-4xl font-black tracking-wider">{t.play}</span>
          <Play size={40} className="fill-amber-900 group-hover:translate-x-2 transition-transform" />
          
          {/* Shine effect */}
          <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden">
             <div className="w-[200%] h-full bg-white/30 transform -skew-x-12 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000" />
          </div>
        </motion.button>
      </motion.div>

    </div>
  );
}
