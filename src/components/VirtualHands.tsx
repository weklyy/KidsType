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
                y: [0, -6, 0], 
                scale: [1, 1.05, 1],
                backgroundColor: [color, '#ffffff', color], 
                boxShadow: [`0 0 15px ${color}`, `0 0 30px ${color}`, `0 0 15px ${color}`]
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
        transition={
          isTarget 
            ? { repeat: Infinity, duration: 1, ease: "easeInOut" }
            : { duration: 0.2 }
        }
        style={{ zIndex: isTarget ? 50 : isPressed ? 40 : 1 }}
      >
        {isTarget && (
          <motion.div 
            animate={{ opacity: [0.3, 1, 0.3], boxShadow: [`0 0 10px ${color}4d`, `0 0 25px ${color}cc`, `0 0 10px ${color}4d`] }}
            transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
            className="absolute inset-x-0 bottom-0 top-0 border-[6px] rounded-t-full"
            style={{ borderColor: color, backgroundColor: `${color}33` }}
          />
        )}
      </motion.div>
    );
  };

  return (
    <div className="w-full flex justify-center items-end gap-16 md:gap-24 h-40 mt-4">
      
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
