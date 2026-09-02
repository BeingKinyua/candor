import React, { useState, useEffect } from 'react';
import {
  Search,
  Users,
  Calendar,
  CheckSquare,
  BookOpen,
  AlertOctagon,
  Sparkles,
  ArrowRight,
  Radio
} from 'lucide-react';
import { useNavigation } from '@/src/lib/router/navigationContext';
import { campaignStore } from '@/src/lib/services/store';

export const GlobalSearch: React.FC = () => {
  const { isCommandPaletteOpen, closeCommandPalette, navigate, openAiDrawer } = useNavigation();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isCommandPaletteOpen) closeCommandPalette();
        else {
          setQuery('');
          // open command palette
          const event = new CustomEvent('open-command-palette');
          window.dispatchEvent(event);
        }
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        closeCommandPalette();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, closeCommandPalette]);

  if (!isCommandPaletteOpen) return null;

  const people = campaignStore.getPeople();
  const meetings = campaignStore.getMeetings();
  const commitments = campaignStore.getCommitments();
  const documents = campaignStore.getDocuments();
  const issues = campaignStore.getIssues();

  const q = query.toLowerCase().trim();

  // Search results
  const matchedPeople = people
    .filter((p) => !q || p.fullName.toLowerCase().includes(q) || p.county.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)))
    .slice(0, 3)
    .map((p) => ({
      id: p.id,
      title: p.fullName,
      subtitle: `${p.category} • ${p.ward}, ${p.county}`,
      type: 'Person' as const,
      icon: <Users className="w-4 h-4 text-[#00DF81]" />,
      action: () => {
        navigate(`/people/${p.id}`);
        closeCommandPalette();
      },
    }));

  const matchedMeetings = meetings
    .filter((m) => !q || m.title.toLowerCase().includes(m.title) && (m.title.toLowerCase().includes(q) || m.location.toLowerCase().includes(q)))
    .slice(0, 2)
    .map((m) => ({
      id: m.id,
      title: m.title,
      subtitle: `${m.date} at ${m.time} • ${m.location}`,
      type: 'Meeting' as const,
      icon: <Calendar className="w-4 h-4 text-[#2FA98C]" />,
      action: () => {
        navigate(`/meetings/${m.id}`);
        closeCommandPalette();
      },
    }));

  const matchedCommitments = commitments
    .filter((c) => !q || c.title.toLowerCase().includes(q) || c.ownerName.toLowerCase().includes(q))
    .slice(0, 2)
    .map((c) => ({
      id: c.id,
      title: c.title,
      subtitle: `Due ${c.dueDate} • Assigned to ${c.ownerName} [${c.status.toUpperCase()}]`,
      type: 'Commitment' as const,
      icon: <CheckSquare className="w-4 h-4 text-[#E5A93C]" />,
      action: () => {
        navigate('/commitments');
        closeCommandPalette();
      },
    }));

  const matchedDocuments = documents
    .filter((d) => !q || d.title.toLowerCase().includes(q) || d.tags.some(t => t.toLowerCase().includes(q)))
    .slice(0, 2)
    .map((d) => ({
      id: d.id,
      title: d.title,
      subtitle: `${d.category} • ${d.classification} Memo`,
      type: 'Knowledge' as const,
      icon: <BookOpen className="w-4 h-4 text-[#AACBC4]" />,
      action: () => {
        navigate(`/knowledge/${d.id}`);
        closeCommandPalette();
      },
    }));

  const allResults = [...matchedPeople, ...matchedMeetings, ...matchedCommitments, ...matchedDocuments];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div
        className="fixed inset-0 bg-[#032221]/80 backdrop-blur-md transition-opacity"
        onClick={closeCommandPalette}
      />
      <div className="relative w-full max-w-2xl rounded-2xl glass-panel-elevated shadow-2xl border border-[#AACBC4]/30 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#AACBC4]/15 bg-[#06302B]/60">
          <Search className="w-5 h-5 text-[#00DF81] mr-3" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search all records or ask Campaign AI..."
            className="w-full bg-transparent text-[#F1F7F6] placeholder-[#707D7D] text-sm focus:outline-none"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono bg-[#08453A] text-[#AACBC4] rounded border border-[#AACBC4]/20">
            ESC
          </kbd>
        </div>

        {/* AI Query Option */}
        {query.trim() && (
          <div className="p-3 bg-[#002DF8]/15 border-b border-[#00DF81]/20 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-[#AACBC4]">
              <Sparkles className="w-4 h-4 text-[#00DF81]" />
              <span>Ask AI about: &ldquo;<strong className="text-[#F1F7F6]">{query}</strong>&rdquo;</span>
            </div>
            <button
              onClick={() => {
                closeCommandPalette();
                openAiDrawer(query);
              }}
              className="px-3.5 py-1 text-xs font-semibold rounded-full bg-[#00DF81] text-[#032221] hover:bg-[#2CC295] flex items-center space-x-1 cursor-pointer hover:cursor-pointer"
            >
              <span>Ask AI</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Search Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {allResults.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#AACBC4]">
              No direct records found matching &ldquo;{query}&rdquo;.
            </div>
          ) : (
            allResults.map((item, idx) => (
              <div
                key={item.id}
                onClick={item.action}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                  idx === selectedIndex
                    ? 'bg-[#08453A] border border-[#00DF81]/30 text-[#F1F7F6]'
                    : 'text-[#AACBC4] hover:bg-[#06302B]/60'
                }`}
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="p-2 rounded-lg bg-[#032221] border border-[#AACBC4]/15">
                    {item.icon}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium text-[#F1F7F6] truncate">{item.title}</p>
                    <p className="text-xs text-[#AACBC4] truncate">{item.subtitle}</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-[#032221]/60 text-[#AACBC4] border border-[#AACBC4]/15">
                  {item.type}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Quick Nav Shortcuts */}
        <div className="px-4 py-2.5 bg-[#032221]/90 border-t border-[#AACBC4]/15 flex items-center justify-between text-[11px] text-[#AACBC4]">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <Radio className="w-3.5 h-3.5 text-[#00DF81]" />
              <button onClick={() => { navigate('/field/capture'); closeCommandPalette(); }} className="hover:underline">
                Digital Form Capture
              </button>
            </span>
            <span className="flex items-center space-x-1">
              <AlertOctagon className="w-3.5 h-3.5 text-[#E05252]" />
              <button onClick={() => { navigate('/issues'); closeCommandPalette(); }} className="hover:underline">
                Issues Center
              </button>
            </span>
          </div>
          <span>Press Enter to select</span>
        </div>
      </div>
    </div>
  );
};

export const MobileBottomNav: React.FC = () => {
  const { currentPath, navigate, openAiDrawer } = useNavigation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#032221]/95 backdrop-blur-lg border-t border-[#AACBC4]/25 px-4 py-2 flex items-center justify-around shadow-2xl">
      <button
        onClick={() => navigate('/overview')}
        className={`flex flex-col items-center space-y-1 p-1.5 ${
          currentPath === '/overview' ? 'text-[#00DF81]' : 'text-[#AACBC4]'
        }`}
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px]">Home</span>
      </button>

      <button
        onClick={() => navigate('/people')}
        className={`flex flex-col items-center space-y-1 p-1.5 ${
          currentPath.startsWith('/people') ? 'text-[#00DF81]' : 'text-[#AACBC4]'
        }`}
      >
        <Users className="w-5 h-5" />
        <span className="text-[10px]">People</span>
      </button>

      {/* Primary Floating Action: Instant Field Capture */}
      <button
        onClick={() => navigate('/field/capture')}
        className="flex flex-col items-center justify-center -mt-6 w-14 h-14 rounded-full bg-gradient-to-tr from-[#002DF8] via-[#03624C] to-[#00DF81] p-0.5 shadow-lg shadow-[#00DF81]/30 active:scale-95 transition-transform"
      >
        <div className="w-full h-full bg-[#032221] rounded-full flex items-center justify-center text-[#00DF81]">
          <Radio className="w-6 h-6 animate-pulse" />
        </div>
      </button>

      <button
        onClick={() => navigate('/field/submissions')}
        className={`flex flex-col items-center space-y-1 p-1.5 ${
          currentPath.startsWith('/field/submissions') ? 'text-[#00DF81]' : 'text-[#AACBC4]'
        }`}
      >
        <CheckSquare className="w-5 h-5" />
        <span className="text-[10px]">Queue</span>
      </button>

      <button
        onClick={() => openAiDrawer()}
        className="flex flex-col items-center space-y-1 p-1.5 text-[#00DF81]"
      >
        <Sparkles className="w-5 h-5" />
        <span className="text-[10px]">AI Ops</span>
      </button>
    </div>
  );
};
