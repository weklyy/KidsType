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
              const isTarget = targetKey ? targetKey.toUpperCase() === keyDef.key.toUpperCase() : false;
              
              // Handle special case for shift based on target key
              let isSpecialTarget = false;
              if (targetKey && targetKey === targetKey.toUpperCase() && targetKey !== targetKey.toLowerCase() && targetKey.length === 1) {
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
                    isActive && isError
                      ? { x: [-4, 4, -4, 4, 0], y: 6, scale: 0.9, backgroundColor: '#ef4444', color: '#ffffff', boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.5)' } 
                      : isActive 
                      ? { y: 6, scale: 0.9, backgroundColor: '#22c55e', color: '#ffffff', boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.5)' } 
                      : { y: 0, x: 0, scale: 1, backgroundColor: baseColor, boxShadow: '0px 2px 5px rgba(0,0,0,0.1)' }
                  }
                  transition={{ duration: 0 }}
                  className={`
                    relative flex items-center justify-center
                    ${keyDef.width || 'w-12'} h-12
                    rounded-xl border-b-[6px] border-black/20
                    shadow-sm font-black text-slate-800
                    select-none
                    ${(isTarget || isSpecialTarget) ? 'z-20' : ''}
                    ${(!isActive && (isTarget || isSpecialTarget)) ? 'animate-key-target' : ''}
                  `}
                  style={{ 
                    '--target-base-color': baseColor,
                  } as React.CSSProperties}
                >
                  <span 
                    className={`text-lg transition-transform ${isTarget || isSpecialTarget ? 'scale-125 font-black' : 'opacity-80'}`}
                    style={{ color: isTarget || isSpecialTarget ? baseColor : undefined }}
                  >
                    {keyDef.display || keyDef.key}
                  </span>
                  
                  {/* Empty comment to remove overlay */}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
