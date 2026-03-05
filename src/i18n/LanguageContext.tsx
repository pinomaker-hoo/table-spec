import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import translations, { type Language, type Translations } from './translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

function getInitialLang(): Language {
  const stored = localStorage.getItem('lang');
  if (stored === 'ko' || stored === 'en') return stored;

  const browserLang = navigator.language;
  if (browserLang.startsWith('ko')) return 'ko';
  return 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(getInitialLang);

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem('lang', l);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
