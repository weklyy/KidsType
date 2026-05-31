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
  const [isError, setIsError] = useState(false);
  const [combo, setCombo] = useState(0);
  const [particles, setParticles] = useState<{id: number, text: string, x: number}[]>([]);
  
  const [showWarning, setShowWarning] = useState(false);
  const lastKeyTime = useRef<number>(0);

  const t = i18n[lang];

  const currentWord = level.content[contentIndex];
  // Guard against out of bounds if stage finished
  const targetChar = currentWord ? currentWord[charIndex] : '';
  const targetFinger = targetChar ? getFingerForKey(targetChar) : null;

  useEffect(() => {
    if (contentIndex >= level.content.length) {
      // Level complete!
      const accuracy = totalStrokes === 0 ? 100 : Math.max(0, 100 - (errors / totalStrokes) * 100);
      let stars = 1;
      if (accuracy >= 95) stars = 3;
      else if (accuracy >= 80) stars = 2;
      
      setTimeout(() => {
        onComplete(stars);
      }, 1500); // Wait a bit before completing
    }
  }, [contentIndex, level.content.length, errors, totalStrokes, onComplete]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignore if done or warning showing
    if (contentIndex >= level.content.length || showWarning) return;
    
    // Ignore modifiers entirely unless they are part of the target string?
    // We actually only want to process actual character outputs, but standard keydown gives us 'Shift'.
    // If the target requires Shift (e.g., 'A'), they just press A while holding shift.
    if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta' || e.key === 'CapsLock') {
      return; 
    }

    const now = Date.now();
    // Anti-mash protection: if inputs are impossibly fast (< 30ms)
    if (now - lastKeyTime.current < 30) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 2000);
      return;
    }
    lastKeyTime.current = now;

    const typedChar = e.key;
    setPressedKey(typedChar);
    setTotalStrokes(prev => prev + 1);

    // Case-insensitive match for stages 1-5
    const isMatch = level.stage >= 6 
      ? typedChar === targetChar 
      : typedChar.toLowerCase() === targetChar.toLowerCase();

    if (isMatch) {
      // Correct!
      setIsError(false);
      setCombo(prev => prev + 1);
      playCorrectSound();

      // Launch fun particle!
      const emojis = ['⭐', '🌟', '✨', '🎉', '🚀', '🎈', '🎊'];
      const newParticle = { 
        id: Date.now(), 
        text: emojis[Math.floor(Math.random() * emojis.length)], 
        x: (Math.random() - 0.5) * 300 
      };
      setParticles(prev => [...prev, newParticle]);
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== newParticle.id));
      }, 1000);
      
      // Advance
      if (charIndex + 1 < currentWord.length) {
        setCharIndex(prev => prev + 1);
      } else {
        // Next word
        setTimeout(() => {
          setContentIndex(prev => prev + 1);
          setCharIndex(0);
        }, 300); // small delay before next word appears
      }
    } else {
      // Incorrect!
      setIsError(true);
      setErrors(prev => prev + 1);
      setCombo(0); // reset combo
      playErrorSound();
      
      setTimeout(() => setIsError(false), 400); // reset error state
    }
    
    // Clear pressed key visually
    setTimeout(() => setPressedKey(null), 150);

  }, [contentIndex, charIndex, currentWord, targetChar, level.content.length, showWarning]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (contentIndex >= level.content.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-sky-50 h-full w-full">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white p-12 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6"
        >
          <h2 className="text-4xl font-black text-amber-500 mb-4">{t.levelComplete}</h2>
          <div className="flex gap-4 mb-4">
            {[1, 2, 3].map((star) => (
               <motion.div
                 key={star}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: star * 0.2 }}
               >
                 <Star 
                   size={64} 
                   className={
                     (totalStrokes === 0 ? 3 : (100 - (errors/totalStrokes)*100) >= (star === 3 ? 95 : star === 2 ? 80 : 0))
                     ? "fill-amber-400 text-amber-500" 
                     : "fill-slate-200 text-slate-300"
                   } 
                 />
               </motion.div>
            ))}
          </div>
          <p className="text-2xl text-slate-600 font-bold mb-8">
            {t.mistakes} {errors}
          </p>
          <button 
            onClick={onBack}
            className="px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white text-2xl font-bold rounded-2xl shadow-lg transition-transform active:scale-95"
          >
            {t.continue}
          </button>
        </motion.div>
      </div>
    );
  }

  // Calculate progress
  const progressPercent = (contentIndex / level.content.length) * 100;

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
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-around p-8 relative">
        
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

        {/* Top: Current Task */}
        <div className="h-48 flex flex-col items-center justify-center perspective-1000">
          {combo >= 5 && (
            <motion.div 
               initial={{ opacity: 0, y: 10, scale: 0.8 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               className="absolute -top-8 text-amber-500 font-black text-2xl flex items-center justify-center gap-2 bg-amber-100 px-4 py-1 rounded-full shadow-md z-20"
            >
              <Flame size={24} className="text-orange-500 animate-pulse" />
              Combo x{combo}!
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={contentIndex}
              initial={{ y: -50, opacity: 0, rotateX: 45 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              exit={{ y: 50, opacity: 0, scale: 0.8 }}
              className={`px-16 py-8 bg-white rounded-3xl shadow-xl border-b-8 border-sky-100 flex gap-2 ${isError ? 'animate-shake bg-red-50 border-red-200' : ''}`}
            >
              {currentWord?.split('').map((char, idx) => (
                <span 
                  key={idx}
                  className={`
                    text-7xl font-black font-mono
                    ${idx < charIndex ? 'text-green-400' : 'text-slate-300'}
                    ${idx === charIndex ? 'text-sky-500 scale-125 mx-2' : ''}
                    transition-all duration-200
                  `}
                >
                  {char === ' ' ? '␣' : char}
                </span>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Warning Toast */}
        <AnimatePresence>
          {showWarning && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-1/3 z-50 bg-amber-100 border-4 border-amber-300 text-amber-700 px-8 py-4 rounded-3xl font-bold text-2xl shadow-xl flex items-center gap-4"
            >
              <div className="text-4xl">🐢</div>
              {t.warning}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Middle: Keyboard */}
        <div className="w-full relative z-10 scale-90 lg:scale-100">
             <VirtualKeyboard 
               targetKey={targetChar} 
               pressedKey={pressedKey} 
               isError={isError} 
             />
        </div>

      </div>
      
      {/* Bottom: Hands */}
      <div className="h-48 shrink-0 flex items-end justify-center w-full pb-8">
          <VirtualHands targetFinger={targetFinger} />
      </div>

    </div>
  );
}
