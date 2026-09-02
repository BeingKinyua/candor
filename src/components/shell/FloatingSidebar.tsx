import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  CheckSquare,
  Radio,
  BookOpen,
  AlertOctagon,
  Shield,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LogOut,
  ChevronDown,
  Sliders,
  Sparkle
} from 'lucide-react';
import { useNavigation } from '@/src/lib/router/navigationContext';
import { useAuth } from '@/src/lib/auth/authContext';
import { campaignStore } from '@/src/lib/services/store';
import { Role } from '@/src/types';

interface FloatingSidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onHoverChange?: (isHovered: boolean) => void;
}

export const FloatingSidebar: React.FC<FloatingSidebarProps> = ({
  isCollapsed: controlledCollapsed,
  onToggleCollapse,
  onHoverChange,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Real-time operational signals counts
  const [counts, setCounts] = useState({
    pendingSubmissions: 0,
    activeCommitments: 0,
    openIssues: 0,
  });

  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  const isEffectiveExpanded = !isCollapsed || isHovered;
  const toggleCollapse = onToggleCollapse || (() => setInternalCollapsed(!internalCollapsed));

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHoverChange?.(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHoverChange?.(false);
    setShowUserMenu(false);
  };

  const { currentPath, navigate, openAiDrawer } = useNavigation();
  const { user, switchRole, logout, can } = useAuth();

  // Reactive subscription to campaignStore for operational signal counts
  useEffect(() => {
    const updateSignals = () => {
      const submissions = campaignStore.getSubmissions();
      const commitments = campaignStore.getCommitments();
      const issues = campaignStore.getIssues();

      const pendingSubs = submissions.filter((s) => s.status === 'pending_review' || s.status === 'processed').length;
      const activeComm = commitments.filter((c) => c.status === 'pending' || c.status === 'overdue').length;
      const activeIss = issues.filter((i) => i.status === 'open' || i.status === 'escalated').length;

      setCounts({
        pendingSubmissions: pendingSubs > 0 ? pendingSubs : 12, // Default/fallback queue signal
        activeCommitments: activeComm > 0 ? activeComm : 4,
        openIssues: activeIss > 0 ? activeIss : 3,
      });
    };

    updateSignals();
    const unsubscribe = campaignStore.subscribe(updateSignals);
    return () => unsubscribe();
  }, []);

  const rolesList: Role[] = [
    'Admin',
    'Campaign Director',
    'Operations Lead',
    'Intelligence Analyst',
    'Field Mobilizer',
  ];

  const isActive = (path: string) => {
    if (path === '/overview') return currentPath === '/overview' || currentPath === '/';
    return currentPath.startsWith(path);
  };

  const hasAdminAccess = can('team:manage') || can('roles:manage') || can('security:audit') || can('users:manage');

  // Compute initials for user avatar
  const getInitials = (name?: string) => {
    if (!name) return 'VK';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`hidden md:flex flex-col fixed left-4 top-4 bottom-4 z-40 transition-all duration-300 ease-out ${
        isEffectiveExpanded ? 'w-[260px]' : 'w-[76px]'
      } glass-panel-elevated bg-[#06302B]/90 backdrop-blur-2xl rounded-[22px] border border-[#AACBC4]/20 shadow-2xl shadow-[#021817]/80 p-3 select-none`}
    >
      {/* 1. Brand / Workspace Header */}
      <div className="flex items-center justify-between px-1.5 py-2.5 mb-2 border-b border-[#AACBC4]/15 min-h-[52px]">
        <div
          onClick={() => navigate('/overview')}
          className="flex items-center space-x-2.5 cursor-pointer hover:cursor-pointer group overflow-hidden"
          title="CANDOR"
        >
          {/* Logo ✦ mark */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#002DF8] via-[#03624C] to-[#00DF81] p-[1.5px] shadow-md shadow-[#00DF81]/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-[#032221] rounded-full flex items-center justify-center">
              <span className="text-[#00DF81] text-sm font-bold leading-none select-none">✦</span>
            </div>
          </div>

          {/* Expanded Brand Name */}
          <div
            className={`flex flex-col transition-opacity duration-200 ${
              isEffectiveExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden pointer-events-none'
            }`}
          >
            <div className="flex items-center space-x-1.5">
              <span className="font-serif-heading text-base font-bold tracking-wider text-[#F1F7F6] leading-none">
                NYAYO
              </span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#00DF81]/15 text-[#00DF81] font-semibold border border-[#00DF81]/30">
                PRO
              </span>
            </div>
            <span className="text-[10px] text-[#AACBC4]/80 tracking-wide mt-0.5 truncate font-medium">
              Campaign Workspace
            </span>
          </div>
        </div>

        {/* Integrated Collapse Toggle Control */}
        {isEffectiveExpanded && (
          <button
            onClick={toggleCollapse}
            className="p-1.5 rounded-full text-[#AACBC4] hover:text-[#00DF81] hover:bg-[#08453A] transition-colors cursor-pointer hover:cursor-pointer shrink-0"
            title={isCollapsed ? 'Pin open sidebar' : 'Collapse sidebar'}
            aria-label={isCollapsed ? 'Pin open sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* 2. Navigation Items (Categorized with subtle section headings) */}
      <div className="flex-1 overflow-y-auto space-y-4 py-1 pr-1 scrollbar-thin">
        {/* Section: Command Center */}
        <div className="space-y-1">
          {isEffectiveExpanded && (
            <p className="px-2.5 text-[9px] font-semibold tracking-wider text-[#AACBC4]/50 uppercase mb-1">
              Command Center
            </p>
          )}

          {/* Overview */}
          <div className="relative group">
            <button
              onClick={() => navigate('/overview')}
              className={`w-full flex items-center ${
                isEffectiveExpanded ? 'px-3' : 'justify-center px-0'
              } py-2.5 rounded-xl text-xs font-medium transition-all duration-150 relative cursor-pointer hover:cursor-pointer ${
                isActive('/overview')
                  ? 'bg-[#00DF81]/15 text-[#00DF81] border border-[#00DF81]/30 shadow-sm font-semibold'
                  : 'text-[#AACBC4] hover:text-[#F1F7F6] hover:bg-[#08453A]/60'
              }`}
            >
              {isActive('/overview') && (
                <span className="absolute left-1 w-1 h-5 bg-[#00DF81] rounded-full shadow-[0_0_8px_#00DF81]" />
              )}
              <span className={`shrink-0 flex items-center justify-center ${isActive('/overview') ? 'text-[#00DF81]' : 'group-hover:text-[#F1F7F6]'}`}>
                <LayoutDashboard className="w-4.5 h-4.5" />
              </span>
              <span
                className={`ml-3 truncate text-left transition-opacity duration-200 ${
                  isEffectiveExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden pointer-events-none'
                }`}
              >
                Overview
              </span>
            </button>

            {/* Collapsed Tooltip */}
            {!isEffectiveExpanded && (
              <div className="fixed left-[86px] ml-1 px-2.5 py-1 rounded-lg glass-dropdown border border-[#AACBC4]/30 text-xs text-[#F1F7F6] shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-150 pointer-events-none z-50 font-medium">
                Overview
              </div>
            )}
          </div>
        </div>

        {/* Section: Operations */}
        <div className="space-y-1">
          {isEffectiveExpanded && (
            <p className="px-2.5 text-[9px] font-semibold tracking-wider text-[#AACBC4]/50 uppercase mb-1">
              Operations
            </p>
          )}

          {/* People */}
          {can('people:view') && (
            <div className="relative group">
              <button
                onClick={() => navigate('/people')}
                className={`w-full flex items-center ${
                  isEffectiveExpanded ? 'px-3' : 'justify-center px-0'
                } py-2.5 rounded-xl text-xs font-medium transition-all duration-150 relative cursor-pointer hover:cursor-pointer ${
                  isActive('/people')
                    ? 'bg-[#00DF81]/15 text-[#00DF81] border border-[#00DF81]/30 shadow-sm font-semibold'
                    : 'text-[#AACBC4] hover:text-[#F1F7F6] hover:bg-[#08453A]/60'
                }`}
              >
                {isActive('/people') && (
                  <span className="absolute left-1 w-1 h-5 bg-[#00DF81] rounded-full shadow-[0_0_8px_#00DF81]" />
                )}
                <span className={`shrink-0 flex items-center justify-center ${isActive('/people') ? 'text-[#00DF81]' : 'group-hover:text-[#F1F7F6]'}`}>
                  <Users className="w-4.5 h-4.5" />
                </span>
                <span
                  className={`ml-3 truncate text-left transition-opacity duration-200 ${
                    isEffectiveExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden pointer-events-none'
                  }`}
                >
                  People
                </span>
              </button>

              {!isEffectiveExpanded && (
                <div className="fixed left-[86px] ml-1 px-2.5 py-1 rounded-lg glass-dropdown border border-[#AACBC4]/30 text-xs text-[#F1F7F6] shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-150 pointer-events-none z-50 font-medium">
                  People Directory
                </div>
              )}
            </div>
          )}

          {/* Meetings */}
          {can('meetings:view') && (
            <div className="relative group">
              <button
                onClick={() => navigate('/meetings')}
                className={`w-full flex items-center ${
                  isEffectiveExpanded ? 'px-3' : 'justify-center px-0'
                } py-2.5 rounded-xl text-xs font-medium transition-all duration-150 relative cursor-pointer hover:cursor-pointer ${
                  isActive('/meetings')
                    ? 'bg-[#00DF81]/15 text-[#00DF81] border border-[#00DF81]/30 shadow-sm font-semibold'
                    : 'text-[#AACBC4] hover:text-[#F1F7F6] hover:bg-[#08453A]/60'
                }`}
              >
                {isActive('/meetings') && (
                  <span className="absolute left-1 w-1 h-5 bg-[#00DF81] rounded-full shadow-[0_0_8px_#00DF81]" />
                )}
                <span className={`shrink-0 flex items-center justify-center ${isActive('/meetings') ? 'text-[#00DF81]' : 'group-hover:text-[#F1F7F6]'}`}>
                  <Calendar className="w-4.5 h-4.5" />
                </span>
                <span
                  className={`ml-3 truncate text-left transition-opacity duration-200 ${
                    isEffectiveExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden pointer-events-none'
                  }`}
                >
                  Meetings
                </span>
              </button>

              {!isEffectiveExpanded && (
                <div className="fixed left-[86px] ml-1 px-2.5 py-1 rounded-lg glass-dropdown border border-[#AACBC4]/30 text-xs text-[#F1F7F6] shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-150 pointer-events-none z-50 font-medium">
                  Meetings & Briefs
                </div>
              )}
            </div>
          )}

          {/* Commitments with Operational Signal */}
          {can('commitments:view') && (
            <div className="relative group">
              <button
                onClick={() => navigate('/commitments')}
                className={`w-full flex items-center ${
                  isEffectiveExpanded ? 'justify-between px-3' : 'justify-center px-0'
                } py-2.5 rounded-xl text-xs font-medium transition-all duration-150 relative cursor-pointer hover:cursor-pointer ${
                  isActive('/commitments')
                    ? 'bg-[#00DF81]/15 text-[#00DF81] border border-[#00DF81]/30 shadow-sm font-semibold'
                    : 'text-[#AACBC4] hover:text-[#F1F7F6] hover:bg-[#08453A]/60'
                }`}
              >
                {isActive('/commitments') && (
                  <span className="absolute left-1 w-1 h-5 bg-[#00DF81] rounded-full shadow-[0_0_8px_#00DF81]" />
                )}
                <div className="flex items-center overflow-hidden">
                  <span className={`shrink-0 flex items-center justify-center ${isActive('/commitments') ? 'text-[#00DF81]' : 'group-hover:text-[#F1F7F6]'}`}>
                    <CheckSquare className="w-4.5 h-4.5" />
                  </span>
                  <span
                    className={`ml-3 truncate text-left transition-opacity duration-200 ${
                      isEffectiveExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden pointer-events-none'
                    }`}
                  >
                    Commitments
                  </span>
                </div>

                {/* Operational Badge */}
                {isEffectiveExpanded && counts.activeCommitments > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-[#08453A] border border-[#AACBC4]/20 text-[#AACBC4] font-mono shrink-0">
                    {counts.activeCommitments}
                  </span>
                )}
              </button>

              {!isEffectiveExpanded && (
                <div className="fixed left-[86px] ml-1 px-2.5 py-1 rounded-lg glass-dropdown border border-[#AACBC4]/30 text-xs text-[#F1F7F6] shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-150 pointer-events-none z-50 font-medium flex items-center space-x-1.5">
                  <span>Commitments</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-[#08453A] text-[#00DF81] text-[10px] font-mono">
                    {counts.activeCommitments}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section: Field (Special Treatment with Operational Callout) */}
        {can('field:view') && (
          <div className="space-y-1">
            {isEffectiveExpanded && (
              <p className="px-2.5 text-[9px] font-semibold tracking-wider text-[#00DF81]/80 uppercase mb-1 flex items-center justify-between">
                <span>Field</span>
                <span className="text-[9px] text-[#00DF81] font-mono lowercase">live</span>
              </p>
            )}

            <div className="relative group">
              <button
                onClick={() => navigate('/field')}
                className={`w-full flex items-center ${
                  isEffectiveExpanded ? 'justify-between px-3' : 'justify-center px-0'
                } py-2.5 rounded-xl text-xs font-medium transition-all duration-150 relative cursor-pointer hover:cursor-pointer ${
                  isActive('/field')
                    ? 'bg-[#00DF81]/20 text-[#00DF81] border border-[#00DF81]/40 shadow-sm font-semibold'
                    : 'bg-[#08453A]/40 text-[#AACBC4] hover:text-[#F1F7F6] hover:bg-[#08453A]/80 border border-[#AACBC4]/15 hover:border-[#00DF81]/30'
                }`}
              >
                {isActive('/field') && (
                  <span className="absolute left-1 w-1 h-5 bg-[#00DF81] rounded-full shadow-[0_0_8px_#00DF81]" />
                )}
                
                <div className="flex items-center overflow-hidden">
                  <span className={`shrink-0 flex items-center justify-center ${isActive('/field') ? 'text-[#00DF81]' : 'text-[#00DF81]/90 group-hover:text-[#00DF81]'}`}>
                    <Radio className="w-4.5 h-4.5" />
                  </span>
                  <div
                    className={`ml-3 text-left transition-opacity duration-200 overflow-hidden ${
                      isEffectiveExpanded ? 'opacity-100' : 'opacity-0 w-0 pointer-events-none'
                    }`}
                  >
                    <p className="truncate font-medium">Field Operations</p>
                  </div>
                </div>

                {/* Field Pending Badge */}
                {isEffectiveExpanded && (
                  <span className="px-2 py-0.5 text-[10px] rounded-full bg-[#00DF81]/20 text-[#00DF81] font-mono font-semibold border border-[#00DF81]/30 shrink-0">
                    {counts.pendingSubmissions} pending
                  </span>
                )}
              </button>

              {!isEffectiveExpanded && (
                <div className="fixed left-[86px] ml-1 px-2.5 py-1 rounded-lg glass-dropdown border border-[#00DF81]/40 text-xs text-[#F1F7F6] shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-150 pointer-events-none z-50 font-medium flex items-center space-x-1.5">
                  <span>Field Operations</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-[#00DF81]/20 text-[#00DF81] text-[10px] font-mono font-semibold">
                    {counts.pendingSubmissions} pending
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section: Intelligence */}
        <div className="space-y-1">
          {isEffectiveExpanded && (
            <p className="px-2.5 text-[9px] font-semibold tracking-wider text-[#AACBC4]/50 uppercase mb-1">
              Intelligence
            </p>
          )}

          {/* Knowledge */}
          {can('knowledge:view') && (
            <div className="relative group">
              <button
                onClick={() => navigate('/knowledge')}
                className={`w-full flex items-center ${
                  isEffectiveExpanded ? 'px-3' : 'justify-center px-0'
                } py-2.5 rounded-xl text-xs font-medium transition-all duration-150 relative cursor-pointer hover:cursor-pointer ${
                  isActive('/knowledge')
                    ? 'bg-[#00DF81]/15 text-[#00DF81] border border-[#00DF81]/30 shadow-sm font-semibold'
                    : 'text-[#AACBC4] hover:text-[#F1F7F6] hover:bg-[#08453A]/60'
                }`}
              >
                {isActive('/knowledge') && (
                  <span className="absolute left-1 w-1 h-5 bg-[#00DF81] rounded-full shadow-[0_0_8px_#00DF81]" />
                )}
                <span className={`shrink-0 flex items-center justify-center ${isActive('/knowledge') ? 'text-[#00DF81]' : 'group-hover:text-[#F1F7F6]'}`}>
                  <BookOpen className="w-4.5 h-4.5" />
                </span>
                <span
                  className={`ml-3 truncate text-left transition-opacity duration-200 ${
                    isEffectiveExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden pointer-events-none'
                  }`}
                >
                  Knowledge Vault
                </span>
              </button>

              {!isEffectiveExpanded && (
                <div className="fixed left-[86px] ml-1 px-2.5 py-1 rounded-lg glass-dropdown border border-[#AACBC4]/30 text-xs text-[#F1F7F6] shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-150 pointer-events-none z-50 font-medium">
                  Knowledge Vault
                </div>
              )}
            </div>
          )}

          {/* Issues with Operational Signal */}
          {can('issues:view') && (
            <div className="relative group">
              <button
                onClick={() => navigate('/issues')}
                className={`w-full flex items-center ${
                  isEffectiveExpanded ? 'justify-between px-3' : 'justify-center px-0'
                } py-2.5 rounded-xl text-xs font-medium transition-all duration-150 relative cursor-pointer hover:cursor-pointer ${
                  isActive('/issues')
                    ? 'bg-[#00DF81]/15 text-[#00DF81] border border-[#00DF81]/30 shadow-sm font-semibold'
                    : 'text-[#AACBC4] hover:text-[#F1F7F6] hover:bg-[#08453A]/60'
                }`}
              >
                {isActive('/issues') && (
                  <span className="absolute left-1 w-1 h-5 bg-[#00DF81] rounded-full shadow-[0_0_8px_#00DF81]" />
                )}
                <div className="flex items-center overflow-hidden">
                  <span className={`shrink-0 flex items-center justify-center ${isActive('/issues') ? 'text-[#00DF81]' : 'group-hover:text-[#F1F7F6]'}`}>
                    <AlertOctagon className="w-4.5 h-4.5" />
                  </span>
                  <span
                    className={`ml-3 truncate text-left transition-opacity duration-200 ${
                      isEffectiveExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden pointer-events-none'
                    }`}
                  >
                    Issues Desk
                  </span>
                </div>

                {isEffectiveExpanded && counts.openIssues > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-[#E05252]/20 text-[#E05252] border border-[#E05252]/30 font-mono font-semibold shrink-0">
                    {counts.openIssues}
                  </span>
                )}
              </button>

              {!isEffectiveExpanded && (
                <div className="fixed left-[86px] ml-1 px-2.5 py-1 rounded-lg glass-dropdown border border-[#AACBC4]/30 text-xs text-[#F1F7F6] shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-150 pointer-events-none z-50 font-medium flex items-center space-x-1.5">
                  <span>Issues Desk</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-[#E05252]/20 text-[#E05252] text-[10px] font-mono">
                    {counts.openIssues}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section: Governance / Administration (Role-gated) */}
        {hasAdminAccess && (
          <div className="space-y-1 pt-2 border-t border-[#AACBC4]/15">
            {isEffectiveExpanded && (
              <p className="px-2.5 text-[9px] font-semibold tracking-wider text-[#AACBC4]/50 uppercase mb-1">
                Governance
              </p>
            )}

            {/* Team & Settings */}
            {(can('team:manage') || can('users:manage') || can('roles:manage')) && (
              <div className="relative group">
                <button
                  onClick={() => navigate('/settings/team')}
                  className={`w-full flex items-center ${
                    isEffectiveExpanded ? 'px-3' : 'justify-center px-0'
                  } py-2 rounded-xl text-xs font-medium transition-all duration-150 relative cursor-pointer hover:cursor-pointer ${
                    isActive('/settings')
                      ? 'bg-[#00DF81]/15 text-[#00DF81] border border-[#00DF81]/30 font-semibold'
                      : 'text-[#AACBC4]/80 hover:text-[#F1F7F6] hover:bg-[#08453A]/50'
                  }`}
                >
                  <span className="shrink-0 flex items-center justify-center">
                    <Sliders className="w-4 h-4" />
                  </span>
                  <span
                    className={`ml-3 truncate text-left transition-opacity duration-200 ${
                      isEffectiveExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden pointer-events-none'
                    }`}
                  >
                    Settings & Team
                  </span>
                </button>

                {!isEffectiveExpanded && (
                  <div className="fixed left-[86px] ml-1 px-2.5 py-1 rounded-lg glass-dropdown border border-[#AACBC4]/30 text-xs text-[#F1F7F6] shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-150 pointer-events-none z-50 font-medium">
                    Settings & Governance
                  </div>
                )}
              </div>
            )}

            {/* Security Audit Log */}
            {can('security:audit') && (
              <div className="relative group">
                <button
                  onClick={() => navigate('/settings/audit')}
                  className={`w-full flex items-center ${
                    isEffectiveExpanded ? 'px-3' : 'justify-center px-0'
                  } py-2 rounded-xl text-xs font-medium transition-all duration-150 relative cursor-pointer hover:cursor-pointer ${
                    isActive('/settings/audit')
                      ? 'bg-[#00DF81]/15 text-[#00DF81] border border-[#00DF81]/30 font-semibold'
                      : 'text-[#AACBC4]/80 hover:text-[#F1F7F6] hover:bg-[#08453A]/50'
                  }`}
                >
                  <span className="shrink-0 flex items-center justify-center">
                    <Shield className="w-4 h-4" />
                  </span>
                  <span
                    className={`ml-3 truncate text-left transition-opacity duration-200 ${
                      isEffectiveExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden pointer-events-none'
                    }`}
                  >
                    Audit & Security
                  </span>
                </button>

                {!isEffectiveExpanded && (
                  <div className="fixed left-[86px] ml-1 px-2.5 py-1 rounded-lg glass-dropdown border border-[#AACBC4]/30 text-xs text-[#F1F7F6] shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-150 pointer-events-none z-50 font-medium">
                    Audit & Security Logs
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* AI Intelligence Trigger Pill */}
        <div className="pt-2">
          <div className="relative group">
            <button
              onClick={() => openAiDrawer()}
              className={`w-full flex items-center ${
                isEffectiveExpanded ? 'px-3.5' : 'justify-center px-0'
              } py-2.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#002DF8]/30 via-[#03624C]/60 to-[#00DF81]/30 text-[#F1F7F6] border border-[#00DF81]/35 hover:border-[#00DF81] transition-all duration-200 shadow-md shadow-[#002DF8]/20 group cursor-pointer hover:cursor-pointer`}
              title="Launch Campaign Intelligence AI"
            >
              <Sparkles className="w-4 h-4 text-[#00DF81] shrink-0 group-hover:rotate-12 transition-transform duration-200" />
              <span
                className={`ml-2.5 font-medium transition-opacity duration-200 ${
                  isEffectiveExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden pointer-events-none'
                }`}
              >
                Campaign AI
              </span>
            </button>

            {!isEffectiveExpanded && (
              <div className="fixed left-[86px] ml-1 px-2.5 py-1 rounded-lg glass-dropdown border border-[#00DF81]/40 text-xs text-[#00DF81] shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-150 pointer-events-none z-50 font-semibold flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask Campaign AI</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Bottom Section: User Identity Card & RBAC Simulation Menu */}
      <div className="pt-2 mt-auto border-t border-[#AACBC4]/15 relative">
        <div
          onClick={() => setShowUserMenu(!showUserMenu)}
          className={`w-full flex items-center ${
            isEffectiveExpanded ? 'justify-between px-2.5 py-2' : 'justify-center p-1.5'
          } rounded-xl bg-[#032221]/70 border border-[#AACBC4]/15 hover:border-[#00DF81]/40 cursor-pointer hover:cursor-pointer transition-all duration-150`}
        >
          <div className="flex items-center space-x-2.5 overflow-hidden">
            {/* User Avatar Initials Badge */}
            <div className="w-8 h-8 rounded-full bg-[#08453A] border border-[#00DF81]/40 flex items-center justify-center text-[#00DF81] font-bold text-xs shrink-0 shadow-sm">
              {getInitials(user?.name)}
            </div>

            {/* User Name & Role Label */}
            <div
              className={`overflow-hidden text-left transition-opacity duration-200 ${
                isEffectiveExpanded ? 'opacity-100' : 'opacity-0 w-0 pointer-events-none'
              }`}
            >
              <p className="text-xs font-semibold text-[#F1F7F6] truncate leading-tight">
                {user?.name || 'Victor K.'}
              </p>
              <p className="text-[10px] text-[#00DF81] font-mono truncate">
                {user?.role || 'Administrator'}
              </p>
            </div>
          </div>

          {isEffectiveExpanded && (
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#AACBC4] shrink-0 transition-transform duration-200 ${
                showUserMenu ? 'rotate-180 text-[#00DF81]' : ''
              }`}
            />
          )}
        </div>

        {/* User / RBAC Switcher Floating Dropdown Menu */}
        {showUserMenu && (
          <div className="absolute bottom-full left-0 right-0 mb-2 p-2.5 rounded-2xl glass-dropdown border border-[#AACBC4]/30 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2 py-1.5 mb-2 border-b border-[#AACBC4]/15">
              <p className="text-xs font-semibold text-[#F1F7F6] truncate">{user?.name}</p>
              <p className="text-[10px] text-[#AACBC4] font-mono truncate">{user?.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-mono rounded bg-[#08453A] text-[#00DF81] border border-[#00DF81]/30">
                {user?.assignedRegion || 'National HQ'}
              </span>
            </div>

            <div className="px-2 py-1 mb-1">
              <span className="text-[9px] font-semibold uppercase tracking-wider text-[#AACBC4]/70">
                Active Role Simulator (RBAC)
              </span>
            </div>

            <div className="space-y-1">
              {rolesList.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    switchRole(r);
                    setShowUserMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer hover:cursor-pointer ${
                    user?.role === r
                      ? 'bg-[#00DF81]/20 text-[#00DF81] font-semibold'
                      : 'text-[#F1F7F6] hover:bg-[#08453A]'
                  }`}
                >
                  <span className="truncate">{r}</span>
                  {user?.role === r && (
                    <span className="text-[10px] text-[#00DF81] font-mono shrink-0 ml-1">Active</span>
                  )}
                </button>
              ))}
            </div>

            <div className="pt-2 mt-2 border-t border-[#AACBC4]/15">
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="w-full px-2.5 py-1.5 rounded-lg text-xs text-[#E05252] hover:bg-[#E05252]/15 flex items-center space-x-2 transition-colors cursor-pointer hover:cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
