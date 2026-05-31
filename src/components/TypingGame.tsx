import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Level, Language } from '../types';
import { getFingerForKey } from '../data/keyboard';
import VirtualKeyboard from './VirtualKeyboard';
import VirtualHands from './VirtualHands';
import { playCorrectSound, playErrorSound } from '../utils/audio';
import { Star, XCircle, ArrowLeft, Flame } from 'lucide-react';
import { i18n } from '../data/i18n';

interface TypingGameProps {
  level: Level;
  onComplete: (stars: number) => void;
  onBack: () => void;
  lang: Language;
}

export default function TypingGame({ level, onComplete, onBack, lang }: TypingGameProps) {
  const [contentIndex, setContentIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [totalStrokes, setTotalStrokes] = useState(0);
  
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [lastFreeKey, setLastFreeKey] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [combo, setCombo] = useState(0);
  const [showCombo, setShowCombo] = useState(false);
  const [particles, setParticles] = useState<{id: number, text: string, x: number}[]>([]);
  
  const [inputText, setInputText] = useState('');
  const validatedTextRef = useRef('');
  const inputRef = useRef<HTMLInputElement>(null);
  const isComposingRef = useRef(false);

  const [startTime] = useState(Date.now());
  const [mistakeKeys, setMistakeKeys] = useState<Record<string, number>>({});

  const t = i18n[lang];

  useEffect(() => {
     if (contentIndex < level.content.length) {
        const item = level.content[contentIndex];
        if (item && typeof item === 'object' && item.type === 'newline') {
           setContentIndex(prev => prev + 1);
           setCharIndex(0);
           setInputText('');
           validatedTextRef.current = '';
        }
     }
  }, [contentIndex, level.content]);

  const currentItem = level.content[contentIndex];
  const isPracticeMode = level.mode === 'poem' || level.mode === 'free';
  const isChineseLevel = typeof currentItem === 'object' && currentItem !== null && currentItem.type !== 'newline';
  const currentWord = isChineseLevel ? ((currentItem as any).pinyin || (currentItem as any).text || '') : (currentItem as string) || '';
  const currentChineseText = isChineseLevel ? (currentItem as any).text : '';

  useEffect(() => {
    if (level.mode === 'free' && pressedKey) {
       setLastFreeKey(pressedKey.toLowerCase());
       const timer = setTimeout(() => {
           setLastFreeKey(prev => prev === pressedKey.toLowerCase() ? null : prev);
       }, 1000);
       return () => clearTimeout(timer);
    }
  }, [pressedKey, level.mode]);

  const targetChar = level.mode === 'free' ? (lastFreeKey || '') : (currentWord ? currentWord[charIndex]?.toLowerCase() : '');
  const targetFinger = targetChar ? getFingerForKey(targetChar) : null;
  const pressedFinger = pressedKey ? getFingerForKey(pressedKey) : null;

  // Handle Combo display timeout
  useEffect(() => {
    if (combo >= 5) {
      setShowCombo(true);
      const timer = setTimeout(() => setShowCombo(false), 800);
      return () => clearTimeout(timer);
    } else {
      setShowCombo(false);
    }
  }, [combo]);

  // Level complete check
  /* Auto transition removed - user must click continue */

  // Keep focus on hidden input
  useEffect(() => {
    const handleFocus = () => inputRef.current?.focus();
    document.addEventListener('click', handleFocus);
    handleFocus();
    return () => document.removeEventListener('click', handleFocus);
  }, [contentIndex]);

  const spawnParticle = () => {
      const emojis = ['⭐', '🌟', '✨', '🎉', '🚀', '🎈', '🎊'];
      const newParticle = { 
        id: Date.now() + Math.random(), 
        text: emojis[Math.floor(Math.random() * emojis.length)], 
        x: (Math.random() - 0.5) * 300 
      };
      setParticles(prev => [...prev, newParticle]);
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== newParticle.id));
      }, 1000);
  };

  const validateInput = useCallback((val: string) => {
     if (val === validatedTextRef.current) return;
     if (level.mode !== 'free' && contentIndex >= level.content.length) return;

     if (val.length < validatedTextRef.current.length) {
         // Backspace allowed
         validatedTextRef.current = val;
         setInputText(val);
         setCharIndex(val.length);
         return;
     }

     const isCaseSensitive = level.stage === 6 || level.stage === 7;
     
     if (level.mode === 'free') {
         const addedLen = val.length - validatedTextRef.current.length;
         validatedTextRef.current = val;
         setInputText(val); 
         // Don't modify charIndex/contentIndex, we just let inputText grow or stay
         // Actually, if we let it grow indefinitely it might lag. We can reset it.
         setInputText('');
         validatedTextRef.current = '';
         
         if (addedLen > 0) {
             setTotalStrokes(prev => prev + addedLen);
             setCombo(prev => prev + addedLen);
             playCorrectSound();
             spawnParticle();
         }
         return;
     }

     const targetPrefix = isCaseSensitive 
       ? currentWord.substring(0, val.length)
       : currentWord.substring(0, val.length).toLowerCase();
       
     const typedPrefix = isCaseSensitive
       ? val
       : val.toLowerCase();

     if (targetPrefix === typedPrefix) {
         // Correct!
         const addedLen = val.length - validatedTextRef.current.length;
         validatedTextRef.current = val;
         setInputText(val); 
         setCharIndex(val.length);
         setIsError(false);
         
         if (addedLen > 0) {
             setTotalStrokes(prev => prev + addedLen);
             setCombo(prev => prev + addedLen);
             playCorrectSound();
             spawnParticle();
         }

         if (val.length === currentWord.length) {
             setContentIndex(prev => prev + 1);
             setCharIndex(0);
             setInputText('');
             validatedTextRef.current = '';
         }
     } else {
         // Incorrect! Revert to validated
         setInputText(validatedTextRef.current);
         setIsError(true);
         setErrors(prev => prev + 1);
         setCombo(0);
         setTotalStrokes(prev => prev + 1);
         
         if (currentWord[val.length - 1]) {
             const expectedChar = isCaseSensitive ? currentWord[val.length - 1] : currentWord[val.length - 1].toLowerCase();
             setMistakeKeys(prev => ({ ...prev, [expectedChar]: (prev[expectedChar] || 0) + 1 }));
         }

         playErrorSound();
         setTimeout(() => setIsError(false), 400);
     }
  }, [currentWord, level.stage, contentIndex, level.content.length, level.mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputText(val);
    if (isComposingRef.current) return;
    validateInput(val);
  };

  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    isComposingRef.current = false;
    validateInput(e.currentTarget.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Process' || e.key === 'Unidentified') {
       if (e.code && e.code.startsWith('Key')) {
           setPressedKey(e.code.replace('Key', ''));
       }
    } else {
       setPressedKey(e.key);
    }
  };

  const handleKeyUp = () => {
      setPressedKey(null);
  };

  if (level.mode !== 'free' && contentIndex >= level.content.length) {
    const timeSpentMinutes = (Date.now() - startTime) / 60000;
    const wpm = timeSpentMinutes > 0 ? Math.round((totalStrokes / 5) / timeSpentMinutes) : 0;
    const cpm = timeSpentMinutes > 0 ? Math.round(totalStrokes / timeSpentMinutes) : 0;
    const accuracyVal = totalStrokes === 0 ? 100 : Math.max(0, Math.round(100 - (errors / totalStrokes) * 100));
    
    const sortedMistakes = Object.entries(mistakeKeys).sort((a,b) => b[1]-a[1]).slice(0, 3);

    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-sky-50 h-full w-full">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white p-12 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 max-w-3xl w-full mx-4"
        >
          <h2 className="text-5xl font-black text-amber-500 mb-2">{t.levelComplete}</h2>
          
          <div className="flex gap-4 mb-4">
            {[1, 2, 3].map((star) => (
               <motion.div
                 key={star}
                 initial={{ opacity: 0, scale: 0 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: star * 0.2, type: 'spring' }}
               >
                 <Star 
                   size={80} 
                   className={
                     (accuracyVal >= (star === 3 ? 95 : star === 2 ? 80 : 0))
                     ? "fill-amber-400 text-amber-500 drop-shadow-md" 
                     : "fill-slate-200 text-slate-300"
                   } 
                 />
               </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full mb-4">
            <div className="flex flex-col items-center gap-2 p-4 bg-sky-50 rounded-2xl">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-sm">CPM</span>
                <span className="text-4xl font-black text-sky-500">{cpm}</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-2xl">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-sm">{t.accuracy}</span>
                <span className="text-4xl font-black text-green-500">{accuracyVal}%</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-red-50 rounded-2xl">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-sm">{t.mistakes}</span>
                <span className="text-4xl font-black text-red-500">{errors}</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-2xl">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-sm">WPM</span>
                <span className="text-4xl font-black text-purple-500">{wpm}</span>
            </div>
          </div>

          {sortedMistakes.length > 0 && (
            <div className="w-full bg-orange-50 p-6 rounded-2xl flex flex-col items-center mb-4">
               <span className="text-orange-500 font-bold mb-3">{lang === 'zh' ? '易错按键分析' : 'Tricky Keys'}</span>
               <div className="flex gap-4">
                  {sortedMistakes.map(([key, count]) => (
                    <div key={key} className="flex flex-col items-center">
                        <kbd className="px-4 py-2 bg-white rounded-xl shadow-sm text-2xl font-mono text-slate-700 font-black border-2 border-orange-200">
                          {key === ' ' ? 'Space' : key}
                        </kbd>
                        <span className="text-sm text-orange-400 font-bold mt-2 font-mono">{count}x</span>
                    </div>
                  ))}
               </div>
            </div>
          )}

          <button 
            onClick={() => {
              const stars = accuracyVal >= 95 ? 3 : accuracyVal >= 80 ? 2 : 1;
              onComplete(stars);
            }}
            className="mt-4 px-12 py-5 bg-sky-500 hover:bg-sky-400 text-white text-2xl font-bold rounded-2xl shadow-lg transition-transform active:scale-95 w-full md:w-auto"
          >
            {t.continue}
          </button>
        </motion.div>
      </div>
    );
  }

  // Calculate progress
  const progressPercent = (contentIndex / level.content.length) * 100;

  // Process Practice Mode Lines
  const practiceLines: any[][] = [[]];
  if (isPracticeMode) {
      level.content.forEach((item, index) => {
         if (item && typeof item === 'object' && item.type === 'newline') {
            practiceLines.push([]);
         } else {
            const currentLine = practiceLines[practiceLines.length - 1];
            if (currentLine.length >= 12) {
               practiceLines.push([]);
               practiceLines[practiceLines.length - 1].push(typeof item === 'object' ? { ...item, globalIndex: index } : { text: item, pinyin: item, globalIndex: index });
            } else {
               currentLine.push(typeof item === 'object' ? { ...item, globalIndex: index } : { text: item, pinyin: item, globalIndex: index });
            }
         }
      });
  }
  const nonEmptyPracticeLines = practiceLines.filter(line => line.length > 0);
  
  let currentLineIdx = 0;
  if (isPracticeMode) {
      nonEmptyPracticeLines.forEach((line, i) => {
          if (line.some(item => item.globalIndex === contentIndex)) {
              currentLineIdx = i;
          }
      });
  }
  
  // Show exactly 2 lines (current and next)
  const startLine = currentLineIdx;
  const visibleLines = nonEmptyPracticeLines.slice(startLine, startLine + 2);

  return (
    <div className="flex flex-col h-full w-full bg-sky-50 overflow-hidden relative">
      
      {/* Header / Nav */}
      <div className="flex justify-between items-center p-6 pb-0">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 bg-white text-slate-600 font-bold rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <ArrowLeft size={24} /> 
          {t.backToMap}
        </button>
        
        <div className="flex-1 max-w-xl mx-8 bg-white h-6 rounded-full overflow-hidden shadow-inner border-2 border-slate-100">
          <motion.div 
            className="h-full bg-green-400"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        <div className="flex gap-4 items-center bg-white px-6 py-3 rounded-2xl shadow-sm font-bold text-slate-600 text-xl">
          <div className="flex items-center gap-2">
            <XCircle className="text-red-400" /> 
            {errors}
          </div>
          <div className="w-px h-6 bg-slate-200" />
          <div className="flex items-center gap-2 text-green-500">
            {totalStrokes === 0 ? 100 : Math.max(0, Math.round(100 - (errors / totalStrokes) * 100))}%
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 min-h-0 flex flex-col items-center pt-8 pb-2 px-4 md:px-8 relative justify-start w-full mt-4">
        
        {/* Combo Indicator (Absolute positioned between header and text container) */}
        <div className="absolute top-0 left-0 right-0 h-16 flex justify-center items-start pointer-events-none z-50">
           <AnimatePresence>
             {showCombo && (
               <motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="text-amber-500 font-black text-xl md:text-2xl flex items-center justify-center gap-2 bg-amber-100/90 backdrop-blur-sm px-6 py-2 rounded-full shadow-md border-2 border-amber-200"
               >
                 <Flame size={24} className="text-orange-500 animate-pulse" />
                 Combo x{combo}!
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none flex justify-center items-center z-50">
          <AnimatePresence>
            {particles.map(p => (
               <motion.div
                 key={p.id}
                 initial={{ opacity: 1, scale: 0.5, y: -50, x: p.x }}
                 animate={{ opacity: 0, scale: 2.5, y: -250, x: p.x + (Math.random() - 0.5) * 100 }}
                 exit={{ opacity: 0 }}
                 transition={{ duration: 1, ease: 'easeOut' }}
                 className="absolute text-6xl drop-shadow-lg"
               >
                 {p.text}
               </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Top: Current Task space */}
        <div className="w-full flex flex-col items-center justify-center perspective-1000 mb-2 z-20 flex-1 min-h-0 relative">

          <input
             ref={inputRef}
             value={inputText}
             onChange={handleChange}
             onCompositionStart={handleCompositionStart}
             onCompositionEnd={handleCompositionEnd}
             onKeyDown={handleKeyDown}
             onKeyUp={handleKeyUp}
             className="absolute inset-0 w-full h-full opacity-0 z-50 cursor-default"
             style={{ caretColor: 'transparent' }}
             autoFocus
             autoComplete="off"
             spellCheck="false"
             autoCorrect="off"
          />

          {level.mode === 'free' ? null : !isPracticeMode ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={contentIndex}
              initial={{ y: -50, opacity: 0, rotateX: 45 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              exit={{ y: 50, opacity: 0, scale: 0.8 }}
              className={`relative px-4 py-4 md:px-8 md:py-6 bg-white/95 rounded-[2rem] shadow-xl border-b-[6px] border-sky-100 flex flex-col justify-center items-center gap-2 max-w-[95vw] xl:max-w-4xl ${isError ? 'animate-shake bg-red-50 border-red-200' : ''}`}
            >
              <div className="flex flex-wrap justify-center items-center gap-x-1 gap-y-2 md:gap-y-4 md:gap-x-2">
                {currentWord?.split('').map((char, idx) => (
                  <span 
                    key={idx}
                    className={`
                      text-5xl md:text-6xl lg:text-7xl xl:text-[6rem] font-black font-mono
                      ${idx < charIndex ? 'text-green-400' : 'text-slate-300'}
                      ${idx === charIndex ? 'text-sky-500 scale-[1.1] md:scale-110 mx-1 md:mx-2 drop-shadow-md z-10' : ''}
                      transition-all duration-200
                    `}
                  >
                    {char === ' ' ? '␣' : char}
                  </span>
                ))}
              </div>

              {isChineseLevel && (
                <div className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-500 tracking-widest drop-shadow-sm mt-4 mb-1">
                  {currentChineseText}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          ) : (
            <div className={`w-full max-w-5xl mx-auto rounded-[2rem] bg-white/90 backdrop-blur-sm shadow-xl border-b-[6px] border-sky-100 flex flex-col items-center justify-start py-5 px-4 md:px-6 gap-4 md:gap-6 ${isError ? 'animate-shake bg-red-50 border-red-200' : ''} max-h-[25vh] md:max-h-[30vh] overflow-y-auto custom-scrollbar relative z-10 w-full`}>
               {visibleLines.map((line, lIdx) => (
                 <div key={startLine + lIdx} className="flex flex-wrap items-end gap-2 justify-center w-full leading-relaxed">
                    {line.map((item: any) => {
                       const isActive = item.globalIndex === contentIndex;
                       const isPast = item.globalIndex < contentIndex;
                       const pinyinStr = (item.pinyin || item.text) as string;

                       return (
                          <div key={item.globalIndex} className="flex flex-col items-center justify-center gap-1 min-w-[1.5rem] md:min-w-[2rem]">
                             {isActive ? (
                                <div className="flex font-mono text-base md:text-lg font-black tracking-widest bg-sky-100 px-1 rounded -mx-1">
                                    {pinyinStr.split('').map((c, i) => (
                                       <span key={i} className={i < charIndex ? "text-green-500" : i === charIndex ? "text-sky-600 scale-[1.2] drop-shadow-sm border-b-[3px] border-sky-500 z-10 mx-[1px]" : "text-slate-400"}>{c}</span>
                                    ))}
                                </div>
                             ) : (
                                <span className={`text-xs md:text-base font-mono font-bold tracking-wider ${isPast ? 'text-slate-400/80' : 'text-slate-500'}`}>
                                    {pinyinStr}
                                </span>
                             )}

                             {(level.mode === 'poem' || level.mode === 'free') && (
                                <span className={`text-lg md:text-xl lg:text-2xl font-black mt-1 ${isPast ? 'text-slate-400' : isActive ? 'text-sky-600 drop-shadow-md scale-[1.1]' : 'text-slate-800'}`}>
                                   {item.text}
                                </span>
                             )}
                          </div>
                       );
                    })}
                 </div>
               ))}
            </div>
          )}
        </div>

        {/* Combined Keyboard and Hands Section */}
        <div className="w-full flex flex-col items-center justify-end shrink-0 relative mt-2 md:mt-4 pb-2 z-10 w-full">
          
          <div className="w-full max-w-5xl mx-auto relative z-10 scale-[0.8] sm:scale-90 lg:scale-[0.95] xl:scale-100 origin-bottom">
               <VirtualKeyboard 
                 targetKey={targetChar} 
                 pressedKey={pressedKey} 
                 isError={isError} 
               />
          </div>

          <div className="flex items-start justify-center w-full pointer-events-none z-20 scale-[0.8] sm:scale-90 lg:scale-[0.95] xl:scale-100 origin-top mt-1">
              <VirtualHands 
                targetFinger={targetFinger} 
                pressedFinger={pressedFinger}
                isError={isError}
              />
          </div>
          
        </div>
      </div>
    </div>
  );
}
