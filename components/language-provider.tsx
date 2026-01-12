"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '@/lib/translations';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['it']) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('it');
  const [mounted, setMounted] = useState(false);

  // Load language from localStorage if available (client-side only)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const savedLang = localStorage.getItem('wellbe-language') as Language;
    if (savedLang && (savedLang === 'it' || savedLang === 'en')) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('wellbe-language', lang);
  };

  const t = (key: keyof typeof translations['it']) => {
    return translations[language][key] || key;
  };
  
  // Prevent hydration mismatch by rendering children only after mount, 
  // or accept that server renders default 'it' and client might switch.
  // For a simple app, we can just render. If we want to avoid flash of wrong language:
  if (!mounted) {
    // Optionally return null or a loader, or just render default language.
    // Returning children ensures SEO content is present (in default language 'it').
    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );    
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
