/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewState, Level, Language } from './types';
import MainMenu from './components/MainMenu';
import LevelMap from './components/LevelMap';
import TypingGame from './components/TypingGame';

export default function App() {
  const [view, setView] = useState<ViewState>('menu');
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [completedStages, setCompletedStages] = useState<Record<number, number>>({});
  const [lang, setLang] = useState<Language>('zh');

  // Load progress and language from local storage
  useEffect(() => {
    const savedProgress = localStorage.getItem('kidsTypeProgress');
    if (savedProgress) {
      try {
        setCompletedStages(JSON.parse(savedProgress));
      } catch (e) {
        console.error("Failed to parse progress");
      }
    }
    
    const savedLang = localStorage.getItem('kidsTypeLang') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'zh')) {
        setLang(savedLang);
    }
  }, []);

  const handleLevelComplete = (stars: number) => {
    if (selectedLevel) {
      setCompletedStages(prev => {
        const currentStars = prev[selectedLevel.id] || 0;
        const newStages = {
          ...prev,
          [selectedLevel.id]: Math.max(currentStars, stars)
        };
        localStorage.setItem('kidsTypeProgress', JSON.stringify(newStages));
        return newStages;
      });
    }
    setView('map');
  };
  
  const handleSetLang = (newLang: Language) => {
      setLang(newLang);
      localStorage.setItem('kidsTypeLang', newLang);
  };

  return (
    <div className="w-full h-screen bg-slate-50 font-sans selection:bg-sky-200">
      {view === 'menu' && (
        <MainMenu onStart={() => setView('map')} lang={lang} setLang={handleSetLang} />
      )}
      
      {view === 'map' && (
        <LevelMap 
          lang={lang}
          completedStages={completedStages}
          onBack={() => setView('menu')}
          onSelectLevel={(level) => {
             setSelectedLevel(level);
             setView('game');
          }}
        />
      )}
      
      {view === 'game' && selectedLevel && (
        <TypingGame 
          lang={lang}
          level={selectedLevel}
          onBack={() => setView('map')}
          onComplete={handleLevelComplete}
        />
      )}
    </div>
  );
}

