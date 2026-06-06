import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState('vi');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Get saved language from localStorage
    const savedLanguage = localStorage.getItem('appLanguage') || 'vi';
    setLanguageState(savedLanguage);
    i18n.changeLanguage(savedLanguage);
    setIsInitialized(true);
  }, []);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('appLanguage', lang);
    i18n.changeLanguage(lang);
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
