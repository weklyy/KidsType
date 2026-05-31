import React, { useState } from 'react';
import { ArrowLeft, Edit3, BookOpen, Dices } from 'lucide-react';
import { Language, Level } from '../types';
import { i18n } from '../data/i18n';
import { pinyin, customPinyin } from 'pinyin-pro';
import { motion } from 'motion/react';
import { BUILT_IN_ARTICLES } from '../data/articles';

// Custom pronunciations for specific ancient Chinese poem contexts
customPinyin({
   '朝辞': 'zhao ci',
   '重山': 'chong shan',
   '万重': 'wan chong',
   '一日还': 'yi ri huan',
   '还': 'huan'
});

interface PracticeMenuProps {
  lang: Language;
  onBack: () => void;
  onSelectArticle: (level: Level) => void;
}

export default function PracticeMenu({ lang, onBack, onSelectArticle }: PracticeMenuProps) {
  const t = i18n[lang];
  
  const createLevel = (title: string, rawText: string, mode: 'poem' | 'standard' = 'poem') => {
    // Basic tokenizer: separate by Chinese chars and English words
    const tokens: any[] = [];
    
    // Split text into characters/words, including newlines
    const chunks = rawText.split(/([a-zA-Z]+|\s+|[^\u4e00-\u9fa5a-zA-Z\s]+|[\u4e00-\u9fa5])/g).filter(Boolean);
    const fullPinyinArray = pinyin(rawText, { toneType: 'none', type: 'array', v: true });
    let globalIndex = 0;
    
    for (const chunk of chunks) {
      if (chunk === '\n') {
        tokens.push({ type: 'newline' });
        globalIndex += 1;
        continue;
      }
      if (!chunk.trim() && chunk !== ' ') {
        globalIndex += chunk.length;
        continue; 
      }
      
      // Is Chinese char?
      if (/^[\u4e00-\u9fa5]+$/.test(chunk)) {
        for (const char of chunk) {
          tokens.push({ text: char, pinyin: fullPinyinArray[globalIndex] });
          globalIndex += 1;
        }
      } else if (/^[a-zA-Z]+$/.test(chunk)) {
        tokens.push({ text: chunk });
        globalIndex += chunk.length;
      } else if (chunk.trim()) {
        tokens.push({ text: chunk });
        globalIndex += chunk.length;
      } else if (chunk === ' ') {
        globalIndex += 1;
      }
    }

    const level: Level = {
      id: Date.now(), 
      stage: 101, 
      title: { en: title, zh: title },
      description: { en: 'Free Practice Practice', zh: '自由练习模式' },
      content: tokens.filter(t => t !== ' '),
      mode
    };

    onSelectArticle(level);
  };

  const handleRandom = () => {
    const randomArticle = BUILT_IN_ARTICLES[Math.floor(Math.random() * BUILT_IN_ARTICLES.length)];
    createLevel(randomArticle.title, randomArticle.text);
  };

  const getCardDesign = (title: string, index: number) => {
    // Map specific poems to specific imagery
    let design = { bg: 'from-sky-200 to-indigo-300', emoji: '🏞️' };
    if (title.includes('静夜思')) design = { bg: 'from-indigo-300 to-purple-400', emoji: '🌙' };
    else if (title.includes('春晓')) design = { bg: 'from-green-200 to-emerald-300', emoji: '🐦' };
    else if (title.includes('登鹳雀楼')) design = { bg: 'from-orange-200 to-amber-400', emoji: '🏯' };
    else if (title.includes('瀑布')) design = { bg: 'from-cyan-200 to-blue-400', emoji: '🌊' };
    else if (title.includes('村居')) design = { bg: 'from-lime-200 to-green-400', emoji: '🪁' };
    else if (title.includes('绝句')) design = { bg: 'from-yellow-200 to-green-300', emoji: '🦆' };
    else if (title.includes('帝城')) design = { bg: 'from-sky-300 to-blue-500', emoji: '⛵' };
    else if (title.includes('咏柳')) design = { bg: 'from-emerald-200 to-teal-400', emoji: '🌿' };
    
    // Fallbacks if not matched
    const fallbacks = [
      { bg: 'from-rose-200 to-pink-300', emoji: '🌸' },
      { bg: 'from-violet-200 to-purple-300', emoji: '✨' },
      { bg: 'from-amber-200 to-orange-300', emoji: '🌅' }
    ];
    
    if (design.emoji === '🏞️') design = fallbacks[index % fallbacks.length];
    
    return design;
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-6 bg-white shadow-sm z-10 w-full shrink-0">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
        >
          <ArrowLeft size={24} /> 
          {t.home}
        </button>
        <h1 className="text-3xl font-black text-sky-600 flex items-center gap-3">
           <BookOpen className="text-sky-400" />
           {t.freePracticeMode}
        </h1>
        <div className="w-24"></div> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto w-full p-6 md:p-8 xl:p-12 pb-32">
         <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-8">
            
            {/* Built-in list (Poems) */}
            <div className="flex-1 flex flex-col gap-6">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
                 <div className="flex items-center gap-3">
                   <div className="p-2.5 bg-amber-100 rounded-xl">
                     <BookOpen size={24} className="text-amber-600" />
                   </div>
                   <h2 className="text-2xl font-black text-slate-800 tracking-wide">
                     {t.selectPoem}
                   </h2>
                 </div>
                 
                 <button 
                   onClick={handleRandom}
                   className="flex items-center justify-center gap-2 px-5 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold rounded-xl transition-all shadow-sm active:scale-95"
                 >
                   <Dices size={20} />
                   {lang === 'zh' ? '随机挑选' : 'Random'}
                 </button>
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-5 auto-rows-fr">
                  {BUILT_IN_ARTICLES.map((article, idx) => {
                    let mainTitle = article.title;
                    let author = '';
                    const match = article.title.match(/(.*?)\s*\((.*?)\)/);
                    if (match) {
                      mainTitle = match[1];
                      author = match[2];
                    }
                    
                    const design = getCardDesign(article.title, idx);
                    
                    return (
                      <motion.button
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        key={idx}
                        onClick={() => createLevel(article.title, article.text)}
                        className={`relative p-5 md:p-6 rounded-3xl shadow-[0_4px_15px_-4px_rgba(0,0,0,0.1)] border-2 border-white/40 flex flex-col items-center justify-center text-center transition-all group overflow-hidden bg-gradient-to-br ${design.bg}`}
                      >
                         <div className="absolute -right-4 -bottom-4 text-[6rem] opacity-20 group-hover:scale-110 group-hover:opacity-30 transition-all duration-500 rotate-12 pointer-events-none">
                            {design.emoji}
                         </div>
                         <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                         
                         <span className="relative z-10 text-xl md:text-2xl font-black text-slate-800 tracking-wide drop-shadow-sm group-hover:-translate-y-1 transition-transform">
                           {mainTitle}
                         </span>
                         {author && (
                           <span className="relative z-10 mt-2 px-3 py-1 bg-white/40 backdrop-blur-sm rounded-full text-sm font-bold text-slate-700 shadow-sm">
                             {author}
                           </span>
                         )}
                      </motion.button>
                    );
                  })}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
