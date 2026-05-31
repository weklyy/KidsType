import React from 'react';
import { motion } from 'motion/react';
import { Level, Language } from '../types';
import { LEVELS } from '../data/levels';
import { ArrowLeft, Lock, Star } from 'lucide-react';
import { i18n } from '../data/i18n';

interface LevelMapProps {
  onSelectLevel: (level: Level) => void;
  onBack: () => void;
  completedStages: Record<number, number>; // level.id -> stars
  lang: Language;
}

export default function LevelMap({ onSelectLevel, onBack, completedStages, lang }: LevelMapProps) {
  const t = i18n[lang];

  return (
    <div className="flex-1 w-full h-full bg-[#f0f9ff] flex flex-col relative overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between p-8 z-10 bg-white/50 backdrop-blur-md border-b-4 border-sky-100/50">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 bg-white text-slate-600 font-bold rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <ArrowLeft size={24} /> 
          {t.home}
        </button>
        <h1 className="text-4xl font-black text-sky-500 tracking-tight">{t.adventureMap}</h1>
        <div className="w-32" /> {/* Spacer for balance */}
      </div>

      {/* Map Content */}
      <div className="flex-1 overflow-y-auto p-12 custom-scrollbar relative">
        <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-32">
          
          {LEVELS.map((level, idx) => {
            const isUnlocked = idx === 0 || completedStages[LEVELS[idx - 1].id] !== undefined;
            const stars = completedStages[level.id] || 0;
            
            return (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, type: "spring" }}
                className={`
                  relative flex items-center gap-8 p-8 rounded-[3rem] border-b-8 shadow-sm transition-transform
                  ${isUnlocked 
                    ? 'bg-white border-sky-200 cursor-pointer hover:-translate-y-2 hover:shadow-xl' 
                    : 'bg-slate-50 border-slate-200 opacity-60'
                  }
                  ${idx % 2 === 1 ? 'flex-row-reverse text-right' : ''}
                `}
                onClick={() => isUnlocked && onSelectLevel(level)}
              >
                {/* Level Icon / Number */}
                <div className={`
                  w-24 h-24 shrink-0 rounded-full flex items-center justify-center text-4xl font-black border-4
                  ${isUnlocked ? 'bg-sky-100 text-sky-500 border-sky-200' : 'bg-slate-200 text-slate-400 border-slate-300'}
                `}>
                  {isUnlocked ? level.stage : <Lock />}
                </div>

                {/* Level Info */}
                <div className="flex-1">
                  <h2 className="text-3xl font-black text-slate-700 mb-2">{level.title[lang]}</h2>
                  <p className="text-xl text-slate-500 font-medium">{level.description[lang]}</p>
                </div>

                {/* Stars Indicator */}
                {isUnlocked && (
                  <div className={`flex gap-1 ${idx % 2 === 1 ? 'justify-end' : 'justify-start'}`}>
                    {[1, 2, 3].map((star) => (
                      <Star 
                        key={star} 
                        size={32} 
                        className={star <= stars ? "fill-amber-400 text-amber-500" : "fill-slate-100 text-slate-200"} 
                      />
                    ))}
                  </div>
                )}
                
              </motion.div>
            );
          })}
          
        </div>
      </div>
      
    </div>
  );
}
