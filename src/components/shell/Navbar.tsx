import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Menu,
  X,
  ChevronDown,
  Settings,
  Users,
  Shield,
  Key,
  Lock,
  Activity,
  LogOut,
  Sliders,
  Check,
} from 'lucide-react';
import { useNavigation } from '@/src/lib/router/navigationContext';
import { useAuth } from '@/src/lib/auth/authContext';
import { campaignStore } from '@/src/lib/services/store';

interface NavbarProps {
  onOpenSearch?: () => void;
  isSidebarCollapsed?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, isSidebarCollapsed = false }) => {
  const { navigate, openAiDrawer, openCommandPalette } = useNavigation();
  const { user, can, logout, switchRole } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const notificationsDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const notifications = campaignStore.getNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSearchClick = onOpenSearch || openCommandPalette;

  // Compute initials for user avatar badge
  const getInitials = (name?: string) => {
    if (!name) return 'VK';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const formatRoleName = (role?: string) => {
    if (!role) return 'Administrator';
    return role.replace(/_/g, ' ');
  };

  const rolesList = [
    { id: 'administrator', label: 'Administrator', desc: 'Full command & system governance' },
    { id: 'operations_manager', label: 'Operations Manager', desc: 'Planning, review & coordination' },
    { id: 'field_officer', label: 'Field Officer', desc: 'Mobile capture & local intelligence' },
    { id: 'reviewer', label: 'Reviewer', desc: 'Quality audit & approvals' },
    { id: 'viewer', label: 'Observer / Viewer', desc: 'Read-only operational visibility' },
  ];

  // Close dropdowns on outside click or escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (userDropdownRef.current && !userDropdownRef.current.contains(target)) {
        setShowUserDropdown(false);
      }
      if (notificationsDropdownRef.current && !notificationsDropdownRef.current.contains(target)) {
        setShowNotifications(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowUserDropdown(false);
        setShowNotifications(false);
      }
    };

    if (showUserDropdown || showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showUserDropdown, showNotifications]);

  return (
    <>
      <header
        className={`fixed top-0 right-0 left-0 z-30 transition-all duration-300 ease-out ${
          isSidebarCollapsed ? 'md:left-[100px]' : 'md:left-[288px]'
        }`}
      >
        {/* Soft top gradient scrim so scrolled page content transitions smoothly */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#032221]/95 via-[#032221]/80 to-transparent h-20 -z-10" />

        <div className="px-3 sm:px-6 lg:px-8 pt-2.5 sm:pt-3 pb-2 max-w-7xl w-full mx-auto">
          <div className="glass-panel-elevated rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between border border-[#AACBC4]/25 shadow-xl shadow-[#021817]/60 gap-2 sm:gap-4">
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
                <span className="text-xs font-semibold text-[#F1F7F6] sm:hidden truncate">
                  Candor
                </span>
              </div>
            </div>

            {/* Search, Notifications, AI & User Profile Bar */}
            <div className="flex items-center space-x-2 sm:space-x-3">
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
              <div className="relative" ref={notificationsDropdownRef}>
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowUserDropdown(false);
                  }}
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
                className="flex items-center space-x-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#00DF81]/15 border border-[#00DF81]/40 text-[#00DF81] text-xs font-semibold hover:bg-[#00DF81]/25 hover:border-[#00DF81] transition-all shadow-sm group cursor-pointer hover:cursor-pointer shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                <span className="hidden sm:inline">Ask AI</span>
              </button>

              {/* User Profile & Settings Dropdown Menu */}
              <div className="relative" ref={userDropdownRef}>
                <button
                  id="user-profile-menu-button"
                  onClick={() => {
                    setShowUserDropdown(!showUserDropdown);
                    setShowNotifications(false);
                  }}
                  aria-expanded={showUserDropdown}
                  aria-haspopup="true"
                  className={`flex items-center space-x-2 pl-1.5 pr-2.5 sm:pr-3 py-1 rounded-full border transition-all cursor-pointer hover:cursor-pointer select-none group shrink-0 ${
                    showUserDropdown
                      ? 'bg-[#08453A] border-[#00DF81] shadow-md shadow-[#00DF81]/15 text-[#F1F7F6]'
                      : 'bg-[#06302B]/90 border-[#AACBC4]/25 hover:border-[#00DF81]/50 hover:bg-[#08453A]/80 text-[#AACBC4] hover:text-[#F1F7F6]'
                  }`}
                  title="User Profile & System Settings"
                >
                  {/* User Avatar Circle with Initials & Active Status Indicator */}
                  <div className="relative shrink-0">
                    <div className="w-7 h-7 rounded-full bg-[#08453A] border border-[#00DF81]/50 group-hover:border-[#00DF81] flex items-center justify-center text-[#00DF81] font-bold text-xs shadow-inner transition-colors">
                      {getInitials(user?.name)}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#00DF81] ring-2 ring-[#032221]" />
                  </div>

                  {/* Name & Role Text (hidden on small phones to save space, visible sm+) */}
                  <div className="hidden sm:flex flex-col text-left leading-tight">
                    <span className="text-xs font-semibold text-[#F1F7F6] truncate max-w-[100px] md:max-w-[120px]">
                      {user?.name || 'Officer'}
                    </span>
                    <span className="text-[10px] text-[#00DF81] font-mono capitalize truncate max-w-[100px] md:max-w-[120px]">
                      {formatRoleName(user?.role)}
                    </span>
                  </div>

                  <ChevronDown
                    className={`w-3.5 h-3.5 text-[#AACBC4] group-hover:text-[#F1F7F6] transition-transform duration-200 ${
                      showUserDropdown ? 'rotate-180 text-[#00DF81]' : ''
                    }`}
                  />
                </button>

                {/* User Profile & Settings Dropdown Panel */}
                {showUserDropdown && (
                  <div
                    id="user-profile-menu-dropdown"
                    className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-dropdown border border-[#AACBC4]/30 shadow-2xl p-3.5 sm:p-4 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto"
                  >
                    {/* 1. Profile Identity Header Card */}
                    <div className="flex items-center space-x-3 pb-3 mb-3 border-b border-[#AACBC4]/15">
                      <div className="relative shrink-0">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#08453A] to-[#032221] border border-[#00DF81]/40 flex items-center justify-center text-[#00DF81] font-bold text-sm shadow-md">
                          {getInitials(user?.name)}
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#00DF81] ring-2 ring-[#032221]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-1.5">
                          <h4 className="text-xs sm:text-sm font-semibold text-[#F1F7F6] truncate">
                            {user?.name || 'Authorized Officer'}
                          </h4>
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-[#AACBC4] font-mono truncate">
                          {user?.email || 'officer@candor.ops'}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-[#00DF81]/15 text-[#00DF81] border border-[#00DF81]/30 text-[10px] font-mono font-medium">
                            <ShieldCheck className="w-3 h-3" />
                            <span className="capitalize">{formatRoleName(user?.role)}</span>
                          </span>
                          <span className="inline-block px-2 py-0.5 rounded-full bg-[#06302B] text-[#AACBC4] text-[10px] font-mono border border-[#AACBC4]/20 truncate max-w-[140px]">
                            {user?.assignedRegion || 'National HQ'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 2. Primary Settings & Governance Navigation */}
                    <div className="space-y-0.5 mb-3">
                      <p className="px-2 text-[10px] font-semibold tracking-wider text-[#AACBC4]/60 uppercase mb-1">
                        Settings & Governance
                      </p>

                      <button
                        id="user-menu-settings-hub"
                        onClick={() => {
                          navigate('/settings');
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium text-[#F1F7F6] hover:bg-[#08453A] border border-transparent hover:border-[#00DF81]/30 transition-colors flex items-center justify-between cursor-pointer hover:cursor-pointer group"
                      >
                        <div className="flex items-center space-x-2.5">
                          <Settings className="w-4 h-4 text-[#00DF81] group-hover:rotate-45 transition-transform" />
                          <span>Settings Hub</span>
                        </div>
                        <span className="text-[10px] text-[#AACBC4] group-hover:text-[#00DF81]">Overview</span>
                      </button>

                      {can('team.read') && (
                        <button
                          id="user-menu-team-settings"
                          onClick={() => {
                            navigate('/settings/team');
                            setShowUserDropdown(false);
                          }}
                          className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium text-[#F1F7F6] hover:bg-[#08453A] border border-transparent hover:border-[#00DF81]/30 transition-colors flex items-center justify-between cursor-pointer hover:cursor-pointer group"
                        >
                          <div className="flex items-center space-x-2.5">
                            <Users className="w-4 h-4 text-[#AACBC4] group-hover:text-[#00DF81] transition-colors" />
                            <span>Team & Staff Seats</span>
                          </div>
                          <span className="text-[10px] text-[#AACBC4] group-hover:text-[#00DF81]">Manage</span>
                        </button>
                      )}

                      {can('team.read') && (
                        <button
                          id="user-menu-roles-settings"
                          onClick={() => {
                            navigate('/settings/roles');
                            setShowUserDropdown(false);
                          }}
                          className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium text-[#F1F7F6] hover:bg-[#08453A] border border-transparent hover:border-[#00DF81]/30 transition-colors flex items-center justify-between cursor-pointer hover:cursor-pointer group"
                        >
                          <div className="flex items-center space-x-2.5">
                            <Key className="w-4 h-4 text-[#AACBC4] group-hover:text-[#00DF81] transition-colors" />
                            <span>Role Permissions Matrix</span>
                          </div>
                          <span className="text-[10px] text-[#AACBC4] group-hover:text-[#00DF81]">RBAC</span>
                        </button>
                      )}

                      {(can('team.manage') || can('audit.read')) && (
                        <button
                          id="user-menu-security-settings"
                          onClick={() => {
                            navigate('/settings/security');
                            setShowUserDropdown(false);
                          }}
                          className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium text-[#F1F7F6] hover:bg-[#08453A] border border-transparent hover:border-[#00DF81]/30 transition-colors flex items-center justify-between cursor-pointer hover:cursor-pointer group"
                        >
                          <div className="flex items-center space-x-2.5">
                            <Lock className="w-4 h-4 text-[#AACBC4] group-hover:text-[#00DF81] transition-colors" />
                            <span>Security & Authentication</span>
                          </div>
                          <span className="text-[10px] text-[#AACBC4] group-hover:text-[#00DF81]">Policies</span>
                        </button>
                      )}

                      {can('audit.read') && (
                        <button
                          id="user-menu-audit-settings"
                          onClick={() => {
                            navigate('/settings/audit');
                            setShowUserDropdown(false);
                          }}
                          className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium text-[#F1F7F6] hover:bg-[#08453A] border border-transparent hover:border-[#00DF81]/30 transition-colors flex items-center justify-between cursor-pointer hover:cursor-pointer group"
                        >
                          <div className="flex items-center space-x-2.5">
                            <Activity className="w-4 h-4 text-[#AACBC4] group-hover:text-[#00DF81] transition-colors" />
                            <span>Cryptographic Audit Log</span>
                          </div>
                          <span className="text-[10px] text-[#AACBC4] group-hover:text-[#00DF81]">Stream</span>
                        </button>
                      )}
                    </div>

                    {/* 3. Role Simulator (Quick RBAC Switcher) */}
                    <div className="pt-2.5 mb-2.5 border-t border-[#AACBC4]/15">
                      <div className="flex items-center justify-between px-2 mb-1.5">
                        <span className="text-[10px] font-semibold tracking-wider text-[#AACBC4]/60 uppercase">
                          Active Role Simulator
                        </span>
                        <span className="text-[9px] font-mono text-[#00DF81] bg-[#00DF81]/10 px-1.5 py-0.5 rounded border border-[#00DF81]/20">
                          RBAC
                        </span>
                      </div>

                      <div className="space-y-1">
                        {rolesList.map((r) => {
                          const isSelected =
                            user?.role?.toLowerCase().includes(r.id.split('_')[0]) ||
                            user?.role?.toLowerCase() === r.label.toLowerCase() ||
                            (user as any)?.roleId === r.id;
                          return (
                            <button
                              key={r.id}
                              id={`role-switch-${r.id}`}
                              onClick={() => {
                                switchRole(r.id);
                                setShowUserDropdown(false);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all flex items-center justify-between cursor-pointer hover:cursor-pointer ${
                                isSelected
                                  ? 'bg-[#00DF81]/20 text-[#00DF81] font-semibold border border-[#00DF81]/40'
                                  : 'text-[#AACBC4] hover:text-[#F1F7F6] hover:bg-[#08453A]'
                              }`}
                            >
                              <div className="truncate pr-2">
                                <span className="block truncate font-medium text-xs text-[#F1F7F6]">
                                  {r.label}
                                </span>
                                <span className="block text-[10px] text-[#AACBC4]/70 truncate">
                                  {r.desc}
                                </span>
                              </div>
                              {isSelected ? (
                                <span className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-[#00DF81] text-[#032221] font-bold shrink-0">
                                  ACTIVE
                                </span>
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 4. Session Status & Sign Out */}
                    <div className="pt-2.5 border-t border-[#AACBC4]/15 flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-1.5 text-[10px] text-[#AACBC4]">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#00DF81]" />
                        <span>Session Encrypted</span>
                      </div>
                      <button
                        id="user-menu-sign-out"
                        onClick={() => {
                          logout();
                          navigate('/login');
                          setShowUserDropdown(false);
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#E05252] hover:bg-[#E05252]/15 border border-transparent hover:border-[#E05252]/30 flex items-center space-x-1.5 transition-colors cursor-pointer hover:cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
                    CANDOR
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

              {(can('people.read') || can('meetings.read') || can('commitments.read')) && (
                <p className="px-3 pt-3 text-[10px] font-semibold tracking-wider text-[#AACBC4]/50 uppercase mb-1">
                  Operations
                </p>
              )}
              {can('people.read') && (
                <button
                  onClick={() => {
                    navigate('/people');
                    setShowMobileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-[#F1F7F6] hover:bg-[#08453A] border border-transparent hover:border-[#00DF81]/30 transition-colors cursor-pointer hover:cursor-pointer"
                >
                  ♙ People Directory
                </button>
              )}
              {can('meetings.read') && (
                <button
                  onClick={() => {
                    navigate('/meetings');
                    setShowMobileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-[#F1F7F6] hover:bg-[#08453A] border border-transparent hover:border-[#00DF81]/30 transition-colors cursor-pointer hover:cursor-pointer"
                >
                  ◷ Meetings & Strategy
                </button>
              )}
              {can('commitments.read') && (
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
              )}

              {(can('field.capture') || can('field.submissions.read')) && (
                <>
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
                    <span className="px-2 py-0.5 text-[10px] rounded-full bg-[#00DF81]/20 text-[#00DF81] font-mono">live</span>
                  </button>
                </>
              )}

              {can('knowledge.read') && (
                <>
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
                </>
              )}

              {can('issues.read') && (
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
              )}

              {(can('team.read') || can('team.manage') || can('audit.read')) && (
                <>
                  <p className="px-3 pt-3 text-[10px] font-semibold tracking-wider text-[#AACBC4]/50 uppercase mb-1">
                    Administration
                  </p>
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setShowMobileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-[#AACBC4] hover:text-[#F1F7F6] hover:bg-[#08453A] transition-colors cursor-pointer hover:cursor-pointer"
                  >
                    ⚙ Settings & Governance
                  </button>
                </>
              )}
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
                logout();
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
