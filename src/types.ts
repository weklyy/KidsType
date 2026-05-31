export type Language = 'en' | 'zh';

export type FingerId = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'R1' | 'R2' | 'R3' | 'R4' | 'R5';

export interface KeyMap {
  key: string;
  display?: string;
  finger: FingerId;
  width?: string;
}

export interface LevelContent {
  text: string;
  pinyin?: string;
}

export interface Level {
  id: number;
  title: { en: string; zh: string };
  description: { en: string; zh: string };
  content: (string | LevelContent | any)[]; // words or characters to type
  stage: number;
  mode?: 'standard' | 'poem';
}

export type ViewState = 'menu' | 'map' | 'game' | 'practice';
