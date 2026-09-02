import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Menu,
  X,
} from 'lucide-react';
import { useNavigation } from '@/src/lib/router/navigationContext';
import { useAuth } from '@/src/lib/auth/authContext';
import { campaignStore } from '@/src/lib/services/store';

interface NavbarProps {
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const { navigate, openAiDrawer, openCommandPalette } = useNavigation();
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const notifications = campaignStore.getNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSearchClick = onOpenSearch || openCommandPalette;

  return (
    <>
      <header className="sticky top-2 sm:top-4 z-30 mb-4 md:mb-6 px-3 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto transition-all duration-300">
        <div className="glass-panel-elevated rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between border border-[#AACBC4]/25 shadow-lg gap-2 sm:gap-4">
          {/* Workspace Identity & Mobile Menu Toggle */}
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-full text-[#AACBC4] hover:text-[#F1F7F6] hover:bg-[#08453A] cursor-pointer hover:cursor-pointer transition-colors shrink-0"
              aria-label="Open mobile navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#00DF81] animate-pulse shrink-0" />
              <span className="text-xs font-mono font-medium tracking-wider text-[#AACBC4] uppercase hidden sm:inline">
                Candor Command Console
              </span>
              <span className="text-xs font-semibold text-[#F1F7F6] sm:hidden truncate">
                Candor
              </span>
            </div>
          </div>

          {/* Search, Notifications & AI Quick Bar */}
          <div className="flex items-center space-x-3">
            {/* Global Search Trigger */}
            <button
              onClick={handleSearchClick}
              className="flex items-center space-x-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#032221]/80 border border-[#AACBC4]/20 hover:border-[#00DF81]/50 text-xs text-[#AACBC4] hover:text-[#F1F7F6] transition-all shadow-inner group shrink-0 cursor-pointer hover:cursor-pointer"
            >
              <Search className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#AACBC4] group-hover:text-[#00DF81] transition-colors" />
              <span className="hidden md:inline text-xs">Search people, meetings, records...</span>
              <span className="hidden sm:inline md:hidden text-xs">Search</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-[#08453A] text-[#00DF81] rounded-full border border-[#00DF81]/30">
                ⌘K
              </kbd>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full text-[#AACBC4] hover:text-[#F1F7F6] hover:bg-[#08453A] transition-colors relative cursor-pointer hover:cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00DF81] ring-2 ring-[#032221] animate-pulse" />
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-dropdown border border-[#AACBC4]/30 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#AACBC4]/15">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-serif-heading text-sm font-semibold text-[#F1F7F6]">
                        Command Alerts
                      </h4>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-[#00DF81]/20 text-[#00DF81] font-semibold">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        campaignStore.clearAllNotifications();
                        setShowNotifications(false);
                      }}
                      className="text-[11px] text-[#AACBC4] hover:text-[#00DF81] transition-colors cursor-pointer hover:cursor-pointer"
                    >
                      Mark all read
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          campaignStore.markNotificationRead(n.id);
                          if (n.linkUrl) navigate(n.linkUrl);
                          setShowNotifications(false);
                        }}
                        className={`p-3 rounded-xl transition-all cursor-pointer hover:cursor-pointer border ${
                          n.read
                            ? 'bg-[#06302B]/40 border-transparent text-[#AACBC4]'
                            : 'bg-[#08453A]/90 border-[#00DF81]/30 text-[#F1F7F6] shadow-sm'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-1.5">
                            {n.type === 'urgent' && <AlertTriangle className="w-3.5 h-3.5 text-[#E05252]" />}
                            {n.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-[#E5A93C]" />}
                            {n.type === 'info' && <CheckCircle className="w-3.5 h-3.5 text-[#00DF81]" />}
                            <p className="text-xs font-semibold text-[#F1F7F6]">{n.title}</p>
                          </div>
                          <span className="text-[10px] text-[#707D7D]">{n.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-[#AACBC4] mt-1 leading-relaxed">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick AI Trigger Icon */}
            <button
              onClick={() => openAiDrawer()}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#00DF81]/15 border border-[#00DF81]/40 text-[#00DF81] text-xs font-semibold hover:bg-[#00DF81]/25 hover:border-[#00DF81] transition-all shadow-sm group cursor-pointer hover:cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>

            {/* Active Role Pill */}
            <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#06302B] border border-[#AACBC4]/20 text-[11px] text-[#AACBC4]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00DF81]" />
              <span className="font-mono text-[#F1F7F6]">{user?.role}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer (Floating full-height slide-over) */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 md:hidden bg-[#032221]/90 backdrop-blur-xl p-5 flex flex-col justify-between animate-in fade-in slide-in-from-left duration-300">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#AACBC4]/15">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#002DF8] via-[#03624C] to-[#00DF81] p-[1.5px] flex items-center justify-center">
                  <div className="w-full h-full bg-[#032221] rounded-full flex items-center justify-center">
                    <span className="text-[#00DF81] text-xs font-bold select-none">✦</span>
                  </div>
                </div>
                <div>
                  <span className="font-serif-heading text-lg font-bold text-[#F1F7F6] tracking-wide block">
                    NYAYO
                  </span>
                  <span className="text-[10px] text-[#AACBC4]/80 font-medium block">
                    Campaign Workspace
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 rounded-full text-[#AACBC4] hover:text-[#F1F7F6] hover:bg-[#08453A] cursor-pointer hover:cursor-pointer transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation categorized list */}
            <div className="py-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-220px)]">
              <p className="px-3 text-[10px] font-semibold tracking-wider text-[#AACBC4]/50 uppercase mb-1">
                Command Center
              </p>
              <button
                onClick={() => {
                  navigate('/overview');
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-[#F1F7F6] hover:bg-[#08453A] border border-transparent hover:border-[#00DF81]/30 transition-colors cursor-pointer hover:cursor-pointer flex items-center justify-between"
              >
                <span>◉ Overview</span>
              </button>

              <p className="px-3 pt-3 text-[10px] font-semibold tracking-wider text-[#AACBC4]/50 uppercase mb-1">
                Operations
              </p>
              <button
                onClick={() => {
                  navigate('/people');
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-[#F1F7F6] hover:bg-[#08453A] border border-transparent hover:border-[#00DF81]/30 transition-colors cursor-pointer hover:cursor-pointer"
              >
                ♙ People Directory
              </button>
              <button
                onClick={() => {
                  navigate('/meetings');
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-[#F1F7F6] hover:bg-[#08453A] border border-transparent hover:border-[#00DF81]/30 transition-colors cursor-pointer hover:cursor-pointer"
              >
                ◷ Meetings & Strategy
              </button>
              <button
                onClick={() => {
                  navigate('/commitments');
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-[#F1F7F6] hover:bg-[#08453A] border border-transparent hover:border-[#00DF81]/30 transition-colors cursor-pointer hover:cursor-pointer flex items-center justify-between"
              >
                <span>✓ Commitments Tracker</span>
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-[#08453A] text-[#00DF81] font-mono">4</span>
              </button>

              <p className="px-3 pt-3 text-[10px] font-semibold tracking-wider text-[#00DF81]/80 uppercase mb-1">
                Field Operations
              </p>
              <button
                onClick={() => {
                  navigate('/field');
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#08453A]/50 text-[#00DF81] border border-[#00DF81]/30 hover:bg-[#08453A] transition-colors cursor-pointer hover:cursor-pointer flex items-center justify-between"
              >
                <span>◎ Field Operations</span>
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-[#00DF81]/20 text-[#00DF81] font-mono">12 pending</span>
              </button>

              <p className="px-3 pt-3 text-[10px] font-semibold tracking-wider text-[#AACBC4]/50 uppercase mb-1">
                Intelligence
              </p>
              <button
                onClick={() => {
                  navigate('/knowledge');
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-[#F1F7F6] hover:bg-[#08453A] border border-transparent hover:border-[#00DF81]/30 transition-colors cursor-pointer hover:cursor-pointer"
              >
                ◫ Knowledge Vault
              </button>
              <button
                onClick={() => {
                  navigate('/issues');
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-[#F1F7F6] hover:bg-[#08453A] border border-transparent hover:border-[#00DF81]/30 transition-colors cursor-pointer hover:cursor-pointer flex items-center justify-between"
              >
                <span>⚠ Issues Desk</span>
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-[#E05252]/20 text-[#E05252] font-mono">3</span>
              </button>

              <p className="px-3 pt-3 text-[10px] font-semibold tracking-wider text-[#AACBC4]/50 uppercase mb-1">
                Administration
              </p>
              <button
                onClick={() => {
                  navigate('/settings/team');
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-[#AACBC4] hover:text-[#F1F7F6] hover:bg-[#08453A] transition-colors cursor-pointer hover:cursor-pointer"
              >
                ⚙ Settings & Team Governance
              </button>
            </div>
          </div>

          {/* User Card */}
          <div className="p-3.5 rounded-2xl bg-[#06302B] border border-[#AACBC4]/20 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-[#08453A] border border-[#00DF81]/40 flex items-center justify-center text-[#00DF81] font-bold text-xs">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="text-xs font-semibold text-[#F1F7F6]">{user?.name}</p>
                <p className="text-[10px] text-[#00DF81] font-mono">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={() => {
                navigate('/login');
                setShowMobileMenu(false);
              }}
              className="text-xs text-[#E05252] font-semibold cursor-pointer hover:cursor-pointer px-3 py-1.5 rounded-full hover:bg-[#E05252]/10"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </>
  );
};
