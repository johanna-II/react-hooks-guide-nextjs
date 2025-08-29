import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

interface NavigationContextType {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isMenuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  navigateToSection: (section: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: React.ReactNode;
  initialSection?: string;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ 
  children, 
  initialSection = 'hero' 
}) => {
  const [activeSection, setActiveSection] = useState(initialSection);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const navigateToSection = useCallback((section: string) => {
    setActiveSection(section);
    closeMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [closeMenu]);

  const value = useMemo(
    () => ({
      activeSection,
      setActiveSection,
      isMenuOpen,
      toggleMenu,
      closeMenu,
      navigateToSection,
    }),
    [activeSection, isMenuOpen, toggleMenu, closeMenu, navigateToSection]
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
