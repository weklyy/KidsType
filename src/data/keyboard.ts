import { FingerId, KeyMap } from '../types';

export const FINGER_COLORS: Record<FingerId, string> = {
  L1: '#f87171', // red-400 (pinky)
  L2: '#fbbf24', // amber-400 (ring)
  L3: '#a3e635', // lime-400 (middle)
  L4: '#38bdf8', // sky-400 (index)
  L5: '#cbd5e1', // slate-300 (thumb)
  R5: '#cbd5e1', // slate-300 (thumb)
  R4: '#60a5fa', // blue-400 (index)
  R3: '#818cf8', // indigo-400 (middle)
  R2: '#c084fc', // purple-400 (ring)
  R1: '#f472b6', // pink-400 (pinky)
};

export const KEYBOARD_ROWS: KeyMap[][] = [
  // Numbers row - simplified for kids, maybe skip in basic rendering but good to have
  [
    { key: '1', finger: 'L1' },
    { key: '2', finger: 'L2' },
    { key: '3', finger: 'L3' },
    { key: '4', finger: 'L4' },
    { key: '5', finger: 'L4' },
    { key: '6', finger: 'R4' },
    { key: '7', finger: 'R4' },
    { key: '8', finger: 'R3' },
    { key: '9', finger: 'R2' },
    { key: '0', finger: 'R1' },
    { key: '-', finger: 'R1' },
    { key: '=', finger: 'R1' },
    { key: 'Backspace', width: 'w-24', finger: 'R1' }
  ],
  // Top row
  [
    { key: 'Tab', width: 'w-20', finger: 'L1' },
    { key: 'Q', finger: 'L1' },
    { key: 'W', finger: 'L2' },
    { key: 'E', finger: 'L3' },
    { key: 'R', finger: 'L4' },
    { key: 'T', finger: 'L4' },
    { key: 'Y', finger: 'R4' },
    { key: 'U', finger: 'R4' },
    { key: 'I', finger: 'R3' },
    { key: 'O', finger: 'R2' },
    { key: 'P', finger: 'R1' },
    { key: '[', finger: 'R1' },
    { key: ']', finger: 'R1' },
    { key: '\\', width: 'w-16', finger: 'R1' }
  ],
  // Home row
  [
    { key: 'Caps', width: 'w-24', finger: 'L1' },
    { key: 'A', finger: 'L1' },
    { key: 'S', finger: 'L2' },
    { key: 'D', finger: 'L3' },
    { key: 'F', finger: 'L4' },
    { key: 'G', finger: 'L4' },
    { key: 'H', finger: 'R4' },
    { key: 'J', finger: 'R4' },
    { key: 'K', finger: 'R3' },
    { key: 'L', finger: 'R2' },
    { key: ';', finger: 'R1' },
    { key: '\'', finger: 'R1' },
    { key: 'Enter', width: 'w-24', finger: 'R1' }
  ],
  // Bottom row
  [
    { key: 'ShiftLeft', display: 'Shift', width: 'w-28', finger: 'L1' },
    { key: 'Z', finger: 'L1' },
    { key: 'X', finger: 'L2' },
    { key: 'C', finger: 'L3' },
    { key: 'V', finger: 'L4' },
    { key: 'B', finger: 'L4' },
    { key: 'N', finger: 'R4' },
    { key: 'M', finger: 'R4' },
    { key: ',', finger: 'R3' },
    { key: '.', finger: 'R2' },
    { key: '/', finger: 'R1' },
    { key: 'ShiftRight', display: 'Shift', width: 'w-28', finger: 'R1' }
  ],
  // Space row
  [
    { key: ' ', display: 'Space', width: 'w-96', finger: 'L5' } // Or R5 depending on preference, we'll light up both thumbs
  ]
];

export function getFingerForKey(targetKey: string): FingerId | null {
  const upperKey = targetKey.toUpperCase();
  
  if (targetKey === ' ') return 'L5'; // Use L5 for space (thumb)
  
  for (const row of KEYBOARD_ROWS) {
    for (const keyDef of row) {
      if (keyDef.key.toUpperCase() === upperKey) {
        // Handle shift keys specifically if needed, but for simple characters this works
        return keyDef.finger;
      }
    }
  }
  
  // Characters requiring shift (e.g. !)
  const shiftMap: Record<string, string> = {
    '!': '1', '@': '2', '#': '3', '$': '4', '%': '5', '^': '6', '&': '7', '*': '8', '(': '9', ')': '0',
    '_': '-', '+': '=', '{': '[', '}': ']', '|': '\\', ':': ';', '"': '\'', '<': ',', '>': '.', '?': '/'
  };
  
  if (shiftMap[targetKey]) {
     return getFingerForKey(shiftMap[targetKey]);
  }
  
  return null;
}
