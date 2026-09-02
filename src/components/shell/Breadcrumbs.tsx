import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useNavigation } from '@/src/lib/router/navigationContext';

export const Breadcrumbs: React.FC = () => {
  const { breadcrumbs, navigate, currentPath } = useNavigation();

  // Hide on standalone full-screen auth / onboarding screens if present
  if (currentPath === '/login' || currentPath === '/forgot-password') {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb navigation"
      className="mb-4 sm:mb-6 flex items-center overflow-x-auto scrollbar-none py-1 text-xs text-[#AACBC4]"
    >
      <div className="flex items-center space-x-1.5 flex-nowrap">
        {/* Workspace Root Home Crumb */}
        <button
          onClick={() => navigate('/overview')}
          className="flex items-center space-x-1 px-2 py-1 rounded-md text-[#AACBC4] hover:text-[#00DF81] hover:bg-[#08453A]/40 transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00DF81]"
          title="Return to Candor Overview"
        >
          <Home className="w-3.5 h-3.5 text-[#AACBC4]/80" />
          <span className="font-medium tracking-wide">Candor</span>
        </button>

        {/* Trail segments */}
        {breadcrumbs.map((bc, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          const isOverviewRoot = bc.path === '/overview';

          // Avoid duplicating "Candor > Overview" if already at overview, or keep clear hierarchy
          return (
            <React.Fragment key={bc.path}>
              <ChevronRight className="w-3.5 h-3.5 text-[#AACBC4]/40 shrink-0" />
              {isLast ? (
                <span
                  aria-current="page"
                  className="px-2 py-1 text-[#F1F7F6] font-semibold truncate max-w-[200px] sm:max-w-xs md:max-w-md"
                  title={bc.label}
                >
                  {bc.label}
                </span>
              ) : (
                <button
                  onClick={() => navigate(bc.path)}
                  className="px-2 py-1 rounded-md text-[#AACBC4] hover:text-[#00DF81] hover:bg-[#08453A]/40 transition-colors truncate max-w-[160px] sm:max-w-xs cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00DF81]"
                  title={bc.label}
                >
                  {bc.label}
                </button>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};
