import React, { createContext, useContext, useState, useEffect } from 'react';

export interface RouteState {
  path: string; // e.g., '/overview', '/people', '/people/per-101', '/field/submissions/fs-8842', '/login'
  params: Record<string, string>;
  title: string;
}

interface NavigationContextType {
  currentPath: string;
  navigate: (path: string) => void;
  breadcrumbs: { label: string; path: string }[];
  isAiDrawerOpen: boolean;
  openAiDrawer: (contextPrompt?: string) => void;
  closeAiDrawer: () => void;
  toggleAiDrawer: () => void;
  isCommandPaletteOpen: boolean;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  aiInitialPrompt: string | null;
  clearAiInitialPrompt: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>('/overview');
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string | null>(null);

  // Sync with browser hash / location if available
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash) {
        setCurrentPath(hash);
      }
    };

    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    setCurrentPath(path);
    if (typeof window !== 'undefined') {
      window.location.hash = path;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openAiDrawer = (contextPrompt?: string) => {
    if (contextPrompt) {
      setAiInitialPrompt(contextPrompt);
    }
    setIsAiDrawerOpen(true);
  };

  const closeAiDrawer = () => {
    setIsAiDrawerOpen(false);
  };

  const toggleAiDrawer = () => {
    setIsAiDrawerOpen((prev) => !prev);
  };

  const openCommandPalette = () => setIsCommandPaletteOpen(true);
  const closeCommandPalette = () => setIsCommandPaletteOpen(false);
  const clearAiInitialPrompt = () => setAiInitialPrompt(null);

  // Generate breadcrumbs
  const segments = currentPath.split('/').filter(Boolean);
  const breadcrumbs: { label: string; path: string }[] = [];
  let accumulated = '';
  
  segments.forEach((seg) => {
    accumulated += `/${seg}`;
    let label = seg.charAt(0).toUpperCase() + seg.slice(1).replace('-', ' ');
    if (seg.startsWith('per-')) label = 'Person Profile';
    else if (seg.startsWith('mtg-')) label = 'Meeting Brief';
    else if (seg.startsWith('fs-')) label = 'Verification';
    else if (seg.startsWith('doc-')) label = 'Document';
    else if (seg.startsWith('iss-')) label = 'Issue Detail';

    breadcrumbs.push({
      label,
      path: accumulated,
    });
  });

  return (
    <NavigationContext.Provider
      value={{
        currentPath,
        navigate,
        breadcrumbs,
        isAiDrawerOpen,
        openAiDrawer,
        closeAiDrawer,
        toggleAiDrawer,
        isCommandPaletteOpen,
        openCommandPalette,
        closeCommandPalette,
        aiInitialPrompt,
        clearAiInitialPrompt,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used within a NavigationProvider');
  return ctx;
};
