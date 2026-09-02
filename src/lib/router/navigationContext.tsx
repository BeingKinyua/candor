import React, { createContext, useContext, useState, useEffect } from 'react';
import { campaignStore } from '@/src/lib/services/store';

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
    let label = seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ');

    if (seg === 'overview') {
      label = 'Overview';
    } else if (seg === 'people') {
      label = 'People';
    } else if (seg === 'meetings') {
      label = 'Meetings';
    } else if (seg === 'commitments') {
      label = 'Commitments';
    } else if (seg === 'field') {
      label = 'Field Operations';
    } else if (seg === 'capture') {
      label = 'Form Capture';
    } else if (seg === 'submissions') {
      label = 'Submissions';
    } else if (seg === 'knowledge') {
      label = 'Knowledge';
    } else if (seg === 'issues') {
      label = 'Issues Desk';
    } else if (seg === 'settings') {
      label = 'Settings';
    } else if (seg === 'team') {
      label = 'Team Governance';
    } else if (seg === 'audit') {
      label = 'Security Audit';
    } else if (seg.startsWith('per-')) {
      const p = campaignStore.getPerson(seg);
      label = p ? p.fullName : 'Person Profile';
    } else if (seg.startsWith('mtg-')) {
      const m = campaignStore.getMeeting(seg);
      label = m ? m.title : 'Meeting Brief';
    } else if (seg.startsWith('fs-')) {
      label = 'Verification Review';
    } else if (seg.startsWith('doc-')) {
      const d = campaignStore.getDocument(seg);
      label = d ? d.title : 'Document';
    } else if (seg.startsWith('iss-')) {
      const i = campaignStore.getIssue(seg);
      label = i ? i.title : 'Issue Detail';
    }

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
