import React from 'react';
import { motion } from 'motion/react';
import { FingerId } from '../types';
import { FINGER_COLORS } from '../data/keyboard';

interface VirtualHandsProps {
  targetFinger: FingerId | null;
  pressedFinger?: FingerId | null;
  isError?: boolean;
}

export default function VirtualHands({ targetFinger, pressedFinger, isError }: VirtualHandsProps) {

  // A helper to generate a finger. 
  // We'll use simple shapes for fingers.
  const renderFinger = (id: FingerId, height: string, width: string = 'w-6', offset: string = '', rotate: string = '') => {
    const isTarget = targetFinger === id;
    const isPressed = pressedFinger === id;
    const color = FINGER_COLORS[id];
    
    return (
      <motion.div 
        className={`relative flex items-end justify-center ${width} ${height} rounded-t-full ${offset} ${rotate} transform origin-bottom border-b-2 border-black/10`}
        animate={
          isTarget 
            ? { 
                y: -30, 
                scale: 1.15,
                backgroundColor: '#ffffff', 
                boxShadow: `0 0 35px ${color}, 0 0 20px #fbbf24, inset 0 -10px 15px ${color}`
              }
            : isPressed
            ? {
                y: 10,
                scale: 0.9,
                backgroundColor: isError ? '#ef4444' : '#22c55e',
                boxShadow: 'inset 0 10px 15px rgba(0,0,0,0.4)'
              }
            : { 
                y: 0, 
                scale: 1,
                backgroundColor: color,
                boxShadow: 'none'
              }
        }
        transition={{ duration: 0.2 }}
        style={{ zIndex: isTarget ? 50 : isPressed ? 40 : 1 }}
      >
        {isTarget && (
          <motion.div 
            animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="absolute -top-14 flex flex-col items-center"
          >
             <div className="w-8 h-8 rounded-full bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.9)] border-[3px] border-white flex justify-center items-center z-50">
                 <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
             </div>
             <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-amber-400 mt-1" />
          </motion.div>
        )}
        
        {isTarget && (
          <div className="absolute inset-0 border-[3px] border-amber-400 rounded-t-full opacity-90 shadow-inner" />
        )}
      </motion.div>
    );
  };

  return (
    <div className="w-full flex justify-center items-end gap-24 h-48 mt-8">
      
      {/* Left Hand */}
      <div className="relative flex items-end gap-1">
        {renderFinger('L1', 'h-20')}             {/* Pinky */}
        {renderFinger('L2', 'h-28', 'w-6', 'mb-2')} {/* Ring */}
        {renderFinger('L3', 'h-32', 'w-6', 'mb-4')} {/* Middle */}
        {renderFinger('L4', 'h-28', 'w-6', 'mb-2')} {/* Index */}
        {renderFinger('L5', 'h-20', 'w-7', '-ml-2 mb-4', 'rotate-45')} {/* Thumb */}
        
        {/* Palm left */}
        <div className="absolute bottom-[-40px] left-[-10px] w-36 h-24 bg-orange-100 rounded-[40px] -z-10 shadow-inner"></div>
      </div>

      {/* Right Hand */}
      <div className="relative flex items-end gap-1">
        {renderFinger('R5', 'h-20', 'w-7', '-mr-2 mb-4', '-rotate-45')} {/* Thumb */}
        {renderFinger('R4', 'h-28', 'w-6', 'mb-2')} {/* Index */}
        {renderFinger('R3', 'h-32', 'w-6', 'mb-4')} {/* Middle */}
        {renderFinger('R2', 'h-28', 'w-6', 'mb-2')} {/* Ring */}
        {renderFinger('R1', 'h-20')}             {/* Pinky */}
        
        {/* Palm right */}
        <div className="absolute bottom-[-40px] right-[-10px] w-36 h-24 bg-orange-100 rounded-[40px] -z-10 shadow-inner"></div>
      </div>

    </div>
  );
}
