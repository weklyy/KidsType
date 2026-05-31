import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { KEYBOARD_ROWS, FINGER_COLORS } from '../data/keyboard';

interface VirtualKeyboardProps {
  targetKey: string;
  pressedKey: string | null;
  isError: boolean;
}

export default function VirtualKeyboard({ targetKey, pressedKey, isError }: VirtualKeyboardProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => {
    // Show visual feedback for physical key presses
    if (pressedKey) {
      setActiveKey(pressedKey.toUpperCase());
      const timer = setTimeout(() => {
         setActiveKey(null);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [pressedKey]);

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-100 p-4 rounded-3xl shadow-inner border-4 border-slate-200">
      <div className="flex flex-col gap-2">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className={`flex justify-center gap-2`}>
            {row.map((keyDef) => {
              const isTarget = targetKey.toUpperCase() === keyDef.key.toUpperCase();
              
              // Handle special case for shift based on target key
              let isSpecialTarget = false;
              if (targetKey === targetKey.toUpperCase() && targetKey !== targetKey.toLowerCase() && targetKey.length === 1) {
                  if (keyDef.key === 'ShiftLeft' || keyDef.key === 'ShiftRight') {
                      isSpecialTarget = true;
                  }
              }

              const isActive = activeKey === keyDef.key.toUpperCase() || 
                               (activeKey === 'SHIFT' && (keyDef.key === 'ShiftLeft' || keyDef.key === 'ShiftRight')) ||
                               (activeKey === ' ' && keyDef.key === ' ');

              // Base color by finger
              const baseColor = FINGER_COLORS[keyDef.finger] || '#fff';
              
              return (
                <motion.div
                  key={keyDef.key}
                  animate={
                    isTarget || isSpecialTarget
                      ? { y: [0, -6, 0], scale: [1, 1.15, 1], backgroundColor: '#ffffff' }
                      : isActive && isError
                      ? { x: [-4, 4, -4, 4, 0], y: 6, scale: 0.9, backgroundColor: '#ef4444', color: '#ffffff', boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.5)' } // shake red on error
                      : isActive 
                      ? { y: 6, scale: 0.9, backgroundColor: '#22c55e', color: '#ffffff', boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.5)' } // green pulse on typed
                      : { y: 0, scale: 1, backgroundColor: baseColor }
                  }
                  transition={
                    isTarget || isSpecialTarget
                      ? { repeat: Infinity, duration: 1, ease: "easeInOut" }
                      : { duration: 0.1 }
                  }
                  className={`
                    relative flex items-center justify-center
                    ${keyDef.width || 'w-12'} h-12
                    rounded-xl border-b-4 border-black/20
                    shadow-sm font-bold text-slate-800
                    select-none
                    ${(isTarget || isSpecialTarget) ? 'ring-4 ring-amber-400 ring-opacity-100 z-20 shadow-[0_0_20px_rgba(251,191,36,0.8)]' : ''}
                  `}
                  style={{ backgroundColor: isTarget || isSpecialTarget ? '#ffffff' : baseColor }}
                >
                  <span className={`text-lg opacity-80 ${isTarget || isSpecialTarget ? 'text-amber-600 scale-125' : ''}`}>
                    {keyDef.display || keyDef.key}
                  </span>
                  
                  {/* Highlight overlay for target key */}
                  {(isTarget || isSpecialTarget) && (
                    <motion.div 
                      className="absolute inset-0 border-4 border-amber-400/50 rounded-xl"
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
