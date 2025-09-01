'use client';

import React, { createContext, useContext } from 'react';

interface ServerTranslationContextType {
  translations: Record<string, string>;
  locale: string;
}

const ServerTranslationContext = createContext<ServerTranslationContextType | null>(null);

export function ServerTranslationProvider({ 
  children, 
  translations,
  locale 
}: { 
  children: React.ReactNode;
  translations: Record<string, string>;
  locale: string;
}) {
  return (
    <ServerTranslationContext.Provider value={{ translations, locale }}>
      {children}
    </ServerTranslationContext.Provider>
  );
}

export function useServerTranslations() {
  const context = useContext(ServerTranslationContext);
  if (!context) {
    return null;
  }
  return context;
}
