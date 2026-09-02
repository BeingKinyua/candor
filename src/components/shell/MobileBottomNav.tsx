import React from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  CheckSquare,
  Radio,
  Sparkles,
  AlertOctagon,
} from 'lucide-react';
import { useNavigation } from '@/src/lib/router/navigationContext';
import { useAuth } from '@/src/lib/auth/authContext';

export const MobileBottomNav: React.FC = () => {
  const { currentPath, navigate, openAiDrawer } = useNavigation();
  const { can } = useAuth();

  const navItems = [
    { label: 'Overview', path: '/overview', icon: LayoutDashboard },
    { label: 'People', path: '/people', icon: Users, perm: 'people:view' },
    { label: 'Meetings', path: '/meetings', icon: Calendar, perm: 'meetings:view' },
    { label: 'Field', path: '/field', icon: Radio, perm: 'field:view' },
    { label: 'Pledges', path: '/commitments', icon: CheckSquare, perm: 'commitments:view' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#032221]/95 backdrop-blur-xl border-t border-[#AACBC4]/20 px-2 py-1.5 flex items-center justify-around shadow-2xl">
      {navItems.map((item) => {
        if (item.perm && !can(item.perm as any)) return null;
        const Icon = item.icon;
        const isActive = currentPath === item.path || (item.path !== '/overview' && currentPath.startsWith(item.path));

        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
              isActive
                ? 'text-[#00DF81] bg-[#00DF81]/15 font-semibold'
                : 'text-[#AACBC4] hover:text-[#F1F7F6]'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}

      <button
        onClick={() => openAiDrawer()}
        className="flex flex-col items-center justify-center p-1.5 rounded-xl text-[#00DF81] bg-gradient-to-tr from-[#002DF8]/20 to-[#00DF81]/20 border border-[#00DF81]/40"
      >
        <Sparkles className="w-5 h-5 text-[#00DF81]" />
        <span className="text-[10px] font-semibold mt-0.5">AI Ops</span>
      </button>
    </div>
  );
};
